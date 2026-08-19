#!/usr/bin/env python3
"""
Photographic correction for the site's images.

The aim is a photograph that looks like it was shot well, not one that looks
processed. Every correction below is *measured* — the code works out how far
the image is from a sensible target and applies that much, capped. An image
that is already well exposed and neutrally lit comes out very close to how it
went in.

What it does
------------
1. White balance    — estimates the illuminant from bright near-neutral pixels
                      and removes the cast. Indoor group shots under tungsten
                      or fluorescent are the main beneficiaries.
2. Levels           — sets black and white points from robust percentiles, so
                      a flat, hazy frame regains its full range.
3. Shadow/highlight — lifts blocked shadows and pulls back clipped highlights,
                      which is what a backlit or on-camera-flash frame needs.
4. Local contrast   — CLAHE on the L channel only, gently. This is what makes
                      a dull frame read as crisp without touching colour.
5. Vibrance         — saturation weighted *inversely* to existing saturation,
                      so muted colours come up and skin does not go orange.
6. Denoise          — only when the frame is measurably noisy.
7. Sharpen          — unsharp mask scaled to the image size, applied last.

What it will not do
-------------------
It cannot rescue a frame that is out of focus, motion-blurred, or clipped to
pure white. It does not retouch skin, reshape anything, or replace a
background. Those need a human and a real editor.

Usage
-----
    python3 tools/enhance.py <src> <dest>          # one file
    python3 tools/enhance.py --dir <src> <dest>    # a folder, recursively
    python3 tools/enhance.py --report <src>        # measure only, change nothing
"""

from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps

# --- targets ---------------------------------------------------------------
# Deliberately conservative. These are the values a well-exposed frame sits at.
TARGET_BLACK = 2.0      # percentile mapped to near-black
TARGET_WHITE = 99.6     # percentile mapped to near-white
MAX_WB_GAIN = 1.14      # cap on any single channel gain
MAX_STRETCH = 0.85      # only ever close this much of the levels gap
CLAHE_CLIP = 1.9
NOISE_THRESHOLD = 3.2   # sigma above which denoising is worth it


def _to_lab(rgb: np.ndarray):
    return cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB)


def white_balance(rgb: np.ndarray, max_strength: float = 1.0) -> tuple[np.ndarray, float]:
    """
    Grey-world restricted to bright, low-saturation pixels.

    Averaging the whole frame (plain grey-world) fails badly when the subject
    dominates — a person in a red dress drags the estimate. Sampling only the
    brightest near-neutral pixels approximates a white card in the scene.

    ⚠️  Correction is deliberately partial, and only kicks in above a real
    cast. Full correction wrecks scenes that contain a large neutral area
    which is *meant* to be slightly cool — snow being the obvious one. The
    first version of this turned a snow field yellow.
    """
    small = cv2.resize(rgb, (256, 256)).astype(np.float32)
    mx = small.max(axis=2)
    mn = small.min(axis=2)
    sat = (mx - mn) / (mx + 1e-6)
    lum = small.mean(axis=2)

    mask = (sat < 0.22) & (lum > np.percentile(lum, 70))
    if mask.sum() < 200:
        mask = lum > np.percentile(lum, 85)
    if mask.sum() < 50:
        return rgb, 0.0

    means = small[mask].mean(axis=0)
    grey = means.mean()
    gains = np.clip(grey / (means + 1e-6), 1 / MAX_WB_GAIN, MAX_WB_GAIN)

    cast = float(np.abs(gains - 1).max())

    # Ramp in only above a genuine cast, and never fully correct.
    strength = float(np.clip((cast - 0.035) / 0.10, 0, 1)) * max_strength
    if strength <= 0:
        return rgb, 0.0
    gains = 1 + (gains - 1) * strength

    out = np.clip(rgb.astype(np.float32) * gains, 0, 255)
    return out, float(np.abs(gains - 1).max())


def levels(rgb: np.ndarray, strength: float = 1.0) -> tuple[np.ndarray, float]:
    """Robust black/white point, applied partially so nothing clips."""
    lum = rgb.mean(axis=2)
    lo = np.percentile(lum, TARGET_BLACK)
    hi = np.percentile(lum, TARGET_WHITE)
    if hi - lo < 1:
        return rgb, 0.0

    # Aim for 4..250 rather than 0..255 — leaving headroom keeps skin and
    # highlight detail instead of crushing them.
    want_lo, want_hi = 4.0, 250.0
    new_lo = lo + (want_lo - lo) * MAX_STRETCH
    new_hi = hi + (want_hi - hi) * MAX_STRETCH

    scale = (new_hi - new_lo) / (hi - lo)
    scale = float(np.clip(scale, 0.85, 1.6))

    # Scale the correction back for profiles that want to stay close to the
    # original — digitals in particular, where neutral is the whole point.
    scale = 1 + (scale - 1) * strength
    new_lo = lo + (new_lo - lo) * strength

    out = (rgb.astype(np.float32) - lo) * scale + new_lo
    return np.clip(out, 0, 255), abs(scale - 1)


def shadow_highlight(rgb: np.ndarray, shadow: float, highlight: float) -> np.ndarray:
    """Lift shadows and recover highlights on luminance only."""
    if shadow <= 0 and highlight <= 0:
        return rgb
    lab = _to_lab(rgb).astype(np.float32)
    L = lab[:, :, 0] / 255.0

    if shadow > 0:
        # strongest at L=0, nothing at L=0.6
        w = np.clip(1 - L / 0.6, 0, 1) ** 1.5
        L = L + shadow * w * (1 - L) * 0.55
    if highlight > 0:
        w = np.clip((L - 0.55) / 0.45, 0, 1) ** 1.5
        L = L - highlight * w * L * 0.35

    lab[:, :, 0] = np.clip(L * 255, 0, 255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)


def local_contrast(rgb: np.ndarray, strength: float) -> np.ndarray:
    """CLAHE on L, blended by strength so it never looks crunchy."""
    if strength <= 0:
        return rgb
    lab = _to_lab(rgb)
    clahe = cv2.createCLAHE(clipLimit=CLAHE_CLIP, tileGridSize=(8, 8))
    boosted = lab.copy()
    boosted[:, :, 0] = clahe.apply(lab[:, :, 0])
    out = cv2.cvtColor(boosted, cv2.COLOR_LAB2RGB).astype(np.float32)
    base = rgb.astype(np.float32)
    return base + (out - base) * strength


def vibrance(rgb: np.ndarray, amount: float) -> np.ndarray:
    """
    Raise saturation most where there is least of it.

    A flat saturation boost is what makes amateur edits look garish, because
    skin is already saturated and goes orange first. Weighting by (1 - s)
    leaves skin alone and brings up muted backgrounds and clothing.
    """
    if amount <= 0:
        return rgb
    hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    s = hsv[:, :, 1] / 255.0
    hsv[:, :, 1] = np.clip((s + amount * (1 - s) * s ** 0.35) * 255, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)


def estimate_noise(rgb: np.ndarray) -> float:
    g = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    return float(cv2.Laplacian(g, cv2.CV_64F).std() / 8.0)


def sharpen(rgb: np.ndarray, amount: float) -> np.ndarray:
    if amount <= 0:
        return rgb
    radius = max(1.0, min(rgb.shape[:2]) / 900.0)
    blur = cv2.GaussianBlur(rgb, (0, 0), radius)
    return np.clip(rgb + (rgb - blur) * amount, 0, 255)


def analyse(rgb: np.ndarray) -> dict:
    lum = rgb.mean(axis=2)
    lab = _to_lab(rgb)
    a = lab[:, :, 1].astype(np.float32) - 128
    b = lab[:, :, 2].astype(np.float32) - 128
    hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV)
    return {
        "mean": float(lum.mean()),
        "p2": float(np.percentile(lum, 2)),
        "p98": float(np.percentile(lum, 98)),
        "contrast": float(np.percentile(lum, 98) - np.percentile(lum, 2)),
        "cast": float(np.hypot(a.mean(), b.mean())),
        "sat": float(hsv[:, :, 1].mean()),
        "noise": estimate_noise(rgb),
        "shadow_clip": float((lum < 12).mean()),
        "highlight_clip": float((lum > 246).mean()),
    }


# How hard to push, by what the picture is for.
#
#   event    — phone snaps in bad indoor light. These need real help.
#   portrait — editorial and beauty frames. The lighting is usually a choice,
#              so correct faults without flattening the mood.
#   neutral  — digitals. Being plain and uncorrected IS the point; an agency
#              wants to see the actual skin and the actual proportions, so
#              this barely touches them.
PROFILES = {
    "event":    dict(wb=1.00, levels=1.00, shadow=1.00, contrast=1.00, vibrance=1.00, sharpen=0.45),
    "portrait": dict(wb=0.55, levels=0.75, shadow=0.55, contrast=0.75, vibrance=0.60, sharpen=0.35),
    "neutral":  dict(wb=0.25, levels=0.35, shadow=0.30, contrast=0.40, vibrance=0.15, sharpen=0.30),
}


def enhance(rgb: np.ndarray, profile: str = "portrait") -> tuple[np.ndarray, dict]:
    """Returns the corrected image and a note of what was applied."""
    prof = dict(PROFILES[profile])
    before = analyse(rgb)
    applied = {"profile": profile}

    # --- high-key guard ---------------------------------------------------
    # A shot on a white backdrop is *meant* to be mostly white. Auto-levels
    # reads all that white as a blown highlight and pulls it down to grey,
    # which is exactly what happened to the white-cyclorama frames the first
    # time this ran. When most of the frame is near-white, back everything off
    # and leave the highlights alone.
    highkey = float((rgb.mean(axis=2) > 235).mean())
    if highkey > 0.25:
        damp = float(np.clip(1 - (highkey - 0.25) / 0.45, 0.15, 1.0))
        for k in ("levels", "contrast", "shadow"):
            prof[k] *= damp
        applied["highkey"] = round(highkey, 2)
        applied["damped_to"] = round(damp, 2)

    out, cast = white_balance(rgb, prof["wb"])
    applied["white_balance"] = round(cast, 3)

    out, stretch = levels(out, prof["levels"])
    applied["levels"] = round(stretch, 3)

    # Shadow lift scales with how much of the frame is sitting in the dark.
    dark = float((out.mean(axis=2) < 60).mean())
    shadow = float(np.clip((dark - 0.18) * 1.1, 0, 0.38)) * prof["shadow"]
    # Highlight recovery only when highlights are genuinely near clipping.
    hot = float((out.mean(axis=2) > 235).mean())
    highlight = 0.0 if highkey > 0.25 else float(np.clip((hot - 0.02) * 3.0, 0, 0.4))
    out = shadow_highlight(out, shadow, highlight)
    applied["shadow"] = round(shadow, 3)
    applied["highlight"] = round(highlight, 3)

    # Local contrast in proportion to how flat the frame is.
    flat = float(np.clip((150 - before["contrast"]) / 150, 0, 1))
    lc = float(np.clip(0.18 + flat * 0.42, 0, 0.6)) * prof["contrast"]
    out = local_contrast(out, lc)
    applied["local_contrast"] = round(lc, 3)

    # Vibrance in proportion to how muted it is.
    vib = float(np.clip((105 - before["sat"]) / 105 * 0.28, 0, 0.24)) * prof["vibrance"]
    out = vibrance(out, vib)
    applied["vibrance"] = round(vib, 3)

    if before["noise"] > NOISE_THRESHOLD:
        strength = float(np.clip((before["noise"] - NOISE_THRESHOLD) * 2.0, 3, 10))
        out = cv2.fastNlMeansDenoisingColored(
            out.astype(np.uint8), None, strength, strength, 7, 21
        ).astype(np.float32)
        applied["denoise"] = round(strength, 1)

    out = sharpen(out, prof["sharpen"])
    applied["sharpen"] = prof["sharpen"]

    after = analyse(out)
    return np.clip(out, 0, 255).astype(np.uint8), {
        "before": before, "after": after, "applied": applied
    }


def grade(rgb: np.ndarray, saturation: float = 1.0,
          a_shift: float = 0.0, b_shift: float = 0.0) -> np.ndarray:
    """
    A finishing pass, applied after correction, to match one shoot to the rest.

    `saturation` scales colour; `a_shift` / `b_shift` nudge the LAB axes
    (a = green→red, b = blue→yellow). Used where a set was lit differently
    enough that it reads as a different skin tone from the rest of the page.
    """
    out = rgb.astype(np.float32)
    if saturation != 1.0:
        hsv = cv2.cvtColor(out.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation, 0, 255)
        out = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)
    if a_shift or b_shift:
        lab = _to_lab(out).astype(np.float32)
        lab[:, :, 1] = np.clip(lab[:, :, 1] + a_shift, 0, 255)
        lab[:, :, 2] = np.clip(lab[:, :, 2] + b_shift, 0, 255)
        out = cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)
    return np.clip(out, 0, 255)


def process_file(src: Path, dest: Path, profile: str = "portrait",
                 max_edge: int = 1800, quality: int = 86,
                 grading: dict | None = None) -> dict:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((max_edge, max_edge), Image.LANCZOS)
        rgb = np.asarray(im).astype(np.float32)

    out, report = enhance(rgb, profile)
    if grading:
        out = grade(out.astype(np.float32), **grading).astype(np.uint8)
        report["applied"]["grade"] = grading

    dest.parent.mkdir(parents=True, exist_ok=True)
    # fromarray carries no metadata, so this also strips EXIF
    Image.fromarray(out).save(
        dest, "JPEG", quality=quality, optimize=True, progressive=True
    )
    return report


def main() -> int:
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 1

    if args[0] == "--report":
        for f in sorted(Path(args[1]).rglob("*.jpg")):
            with Image.open(f) as im:
                rgb = np.asarray(ImageOps.exif_transpose(im).convert("RGB")).astype(np.float32)
            a = analyse(rgb)
            print(f"  {f.name:34s} mean {a['mean']:5.1f}  contrast {a['contrast']:5.1f}  "
                  f"cast {a['cast']:4.1f}  sat {a['sat']:5.1f}  noise {a['noise']:4.1f}")
        return 0

    if args[0] == "--dir":
        src, dest = Path(args[1]), Path(args[2])
        profile = args[3] if len(args) > 3 else "portrait"
        n = 0
        for f in sorted(src.rglob("*.jpg")):
            rel = f.relative_to(src)
            process_file(f, dest / rel, profile)
            n += 1
            print(f"  {rel}")
        print(f"{n} images")
        return 0

    process_file(Path(args[0]), Path(args[1]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
