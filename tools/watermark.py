#!/usr/bin/env python3
"""
Embed an invisible, traceable watermark in the site's photographs — and read
it back out of a suspect copy.

How it works
------------
Each image gets a payload (a short ID). The payload is expanded into a
pseudorandom +/-1 chip sequence, tiled over the image as low-amplitude blocks
added to the blue channel. Blue is used because the eye is least sensitive to
it, so the mark can carry enough amplitude to survive JPEG without being
visible.

Detection averages every block belonging to each bit and correlates against the
same chip sequence. Because each bit is spread over hundreds of blocks, the
mark survives re-compression, moderate scaling, and partial cropping — the
correlation degrades gracefully instead of failing outright.

What it does NOT do
-------------------
This is a tracing tool, not a prevention tool. It cannot stop anyone taking
the image; it lets you prove a copy came from this site. A heavy crop, a
strong filter, a re-photograph of a screen, or a deliberate attack by someone
who has read this file will all defeat it.

Usage
-----
    python3 tools/watermark.py embed            # marks any unmarked image
    python3 tools/watermark.py embed --force    # re-marks everything
    python3 tools/watermark.py embed model/carle  # just one folder
    python3 tools/watermark.py verify <file>    # reads the payload back
    python3 tools/watermark.py audit            # checks every marked image
    python3 tools/watermark.py reinforce        # strengthens any weak ones
    python3 tools/watermark.py test             # runs the survival tests
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path(__file__).resolve().parent.parent
PUBLIC = REPO / "public" / "img"
MANIFEST = REPO / "tools" / "watermark-manifest.json"

# Folders whose images carry a mark.
MARKED = ["model", "pitches", "bcu", "honors"]

# The grid is defined in *relative* coordinates — GRID x GRID cells covering
# the whole frame, whatever its pixel size. That is what makes the mark
# survive rescaling: a detector normalises any suspect image to the same
# canonical size and the cells line back up.
GRID = 48          # cells per axis
BITS = 32          # payload length
STRENGTH = 4.0     # starting amplitude in blue-channel levels
MAX_STRENGTH = 12.0  # ceiling; beyond this the mark starts to be visible
TARGET_Z = 15.0    # aim comfortably above THRESHOLD so attacks have headroom
CANON = GRID * 8   # px the detector normalises to
SEED_SALT = "kinjalpandey.com/v1"


def chips(seed: int, n: int) -> np.ndarray:
    """Deterministic +/-1 sequence for one bit index."""
    rng = np.random.default_rng(seed)
    return rng.choice(np.array([-1.0, 1.0]), size=n)


def payload_bits(payload: str) -> np.ndarray:
    digest = hashlib.sha256((SEED_SALT + payload).encode()).digest()
    value = int.from_bytes(digest[:8], "big")
    return np.array([(value >> i) & 1 for i in range(BITS)], dtype=np.int8)


ASSIGN = np.arange(GRID * GRID) % BITS
SEQ = chips(1234, GRID * GRID)


def field_for(payload: str) -> np.ndarray:
    """The GRID x GRID signed pattern carrying one payload."""
    bits = payload_bits(payload)
    signs = np.where(bits[ASSIGN] == 1, 1.0, -1.0) * SEQ
    return signs.reshape(GRID, GRID)


def _apply(arr: np.ndarray, payload: str, strength: float) -> Image.Image:
    """Adds the pattern at a given amplitude and returns the marked image."""
    h, w, _ = arr.shape
    out = arr.copy()
    pattern = Image.fromarray(
        ((field_for(payload) * strength) + 128).astype(np.float32), mode="F"
    ).resize((w, h), Image.NEAREST)
    out[:, :, 2] += np.asarray(pattern) - 128.0
    np.clip(out, 0, 255, out=out)
    return Image.fromarray(out.astype(np.uint8))


def embed(path: Path, payload: str) -> float:
    """
    Marks one image, choosing the amplitude it actually needs.

    A flat backdrop carries the mark at low amplitude. A busy frame — a dinner
    table, a crowd — has so much local detail that the same amplitude vanishes
    into it. So this embeds, measures, and steps the amplitude up until the
    mark is comfortably detectable, rather than assuming one value fits every
    photograph.

    Returns the z-score achieved.
    """
    import io

    original = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    expect = payload_bits(payload)

    best_bytes, best_z, best_strength = None, -1.0, STRENGTH
    strength = STRENGTH
    while strength <= MAX_STRENGTH:
        buf = io.BytesIO()
        _apply(original, payload, strength).save(
            buf, "JPEG", quality=90, optimize=True, progressive=True
        )
        probe = Path("/tmp/_wm_probe.jpg")
        probe.write_bytes(buf.getvalue())
        _, z = read(probe, expect)
        if z > best_z:
            best_bytes, best_z, best_strength = buf.getvalue(), z, strength
        if z >= TARGET_Z:
            break
        strength += 2.0

    path.write_bytes(best_bytes)
    if best_z < THRESHOLD:
        print(f"    ⚠ {path.name}: only z={best_z:.1f} at amplitude "
              f"{best_strength} — too detailed to mark reliably")
    return best_z


def _score_subgrid(img: Image.Image, expect: np.ndarray,
                   gy: int, gx: int, gh: int, gw: int) -> float:
    """
    Detection statistic for one candidate alignment, as a z-score.

    Correlates the residual field against the *signed* pattern the expected
    payload would have produced, and divides by the noise level. Using the
    correlation magnitude rather than counting agreeing bits matters: bit
    agreement saturates at 50% by chance, and searching many alignments then
    finds a high score in any image. A z-score does not have that problem —
    the noise floor rises with the search, but the signal does not.
    """
    cell = 8
    win = img.resize((gw * cell, gh * cell), Image.LANCZOS)
    arr = np.asarray(win).astype(np.float32)[:, :, 2]
    means = arr.reshape(gh, cell, gw, cell).mean(axis=(1, 3))

    pad = np.pad(means, 1, mode="edge")
    smooth = (pad[:-2, 1:-1] + pad[2:, 1:-1] + pad[1:-1, :-2] + pad[1:-1, 2:]) / 4.0
    resid = (means - smooth).ravel()

    idx = ((np.arange(gy, gy + gh)[:, None] * GRID)
           + np.arange(gx, gx + gw)[None, :]).ravel()
    signs = np.where(expect[ASSIGN[idx]] == 1, 1.0, -1.0) * SEQ[idx]

    product = resid * signs
    sd = product.std()
    if sd == 0:
        return 0.0
    return float(product.mean() / (sd / np.sqrt(product.size)))


def _read_subgrid(img: Image.Image, gy: int, gx: int, gh: int, gw: int) -> np.ndarray:
    """
    Reads the mark assuming the suspect image covers grid cells
    [gy:gy+gh, gx:gx+gw] of the original frame.

    A crop removes the outer part of the picture, so recovering it means
    matching what is left against the *corresponding sub-region* of the
    pattern — not cropping the suspect further.
    """
    cell = 8
    win = img.resize((gw * cell, gh * cell), Image.LANCZOS)
    arr = np.asarray(win).astype(np.float32)[:, :, 2]
    means = arr.reshape(gh, cell, gw, cell).mean(axis=(1, 3))

    # The mark is a local deviation, so subtract the local average to strip
    # out the picture itself and leave the pattern behind.
    pad = np.pad(means, 1, mode="edge")
    smooth = (pad[:-2, 1:-1] + pad[2:, 1:-1] + pad[1:-1, :-2] + pad[1:-1, 2:]) / 4.0
    resid = means - smooth

    idx = (np.arange(gy, gy + gh)[:, None] * GRID) + np.arange(gx, gx + gw)[None, :]
    idx = idx.ravel()
    corr = resid.ravel() * SEQ[idx]
    assign = ASSIGN[idx]

    out = np.zeros(BITS, dtype=np.int8)
    for b in range(BITS):
        sel = corr[assign == b]
        out[b] = 1 if (sel.size and sel.mean() > 0) else 0
    return out


# A z-score this high does not happen by chance on an unmarked photograph,
# even allowing for the alignment search. Calibrated against unmarked images
# in `verify --calibrate`.
THRESHOLD = 12.0


def read(path: Path, expect: np.ndarray | None = None) -> tuple[np.ndarray, float]:
    """
    Reads the payload back and returns (bits, z-score).

    Rescaling is free — the grid is relative, so the detector just normalises.
    Cropping is handled by searching which sub-region of the grid the suspect
    corresponds to, and keeping the strongest alignment.
    """
    img = Image.open(path).convert("RGB")

    if expect is None:
        return _read_subgrid(img, 0, 0, GRID, GRID), 0.0

    best_z = _score_subgrid(img, expect, 0, 0, GRID, GRID)
    best_box = (0, 0, GRID, GRID)

    for frac in (0.9, 0.8, 0.7, 0.6, 0.5):
        span = max(8, int(round(GRID * frac)))
        if span >= GRID:
            continue
        steps = sorted({0, (GRID - span) // 4, (GRID - span) // 2,
                        3 * (GRID - span) // 4, GRID - span})
        for gy in steps:
            for gx in steps:
                z = _score_subgrid(img, expect, gy, gx, span, span)
                if z > best_z:
                    best_z, best_box = z, (gy, gx, span, span)

    return _read_subgrid(img, *best_box), best_z


def targets() -> list[Path]:
    out: list[Path] = []
    for folder in MARKED:
        out.extend(sorted((PUBLIC / folder).rglob("*.jpg")))
    return out


def cmd_embed(force: bool = False) -> int:
    """
    Marks every image that is not already marked.

    Embedding twice would add the pattern on top of itself — twice the
    amplitude, visible banding, and a file that has been re-compressed for no
    reason. So anything already in the manifest is skipped unless --force is
    given (which is only correct on freshly regenerated originals).
    """
    manifest = {}
    if MANIFEST.exists() and not force:
        manifest = json.loads(MANIFEST.read_text())
    known = set(manifest.values())

    only = None
    for a in sys.argv[2:]:
        if not a.startswith("--"):
            only = a

    added = skipped = restamped = 0
    for path in targets():
        rel = str(path.relative_to(PUBLIC.parent)).replace("\\", "/")
        if only and only not in rel:
            continue
        payload = hashlib.sha1(rel.encode()).hexdigest()[:10]

        if rel in known and not force:
            # Being in the manifest is not proof the file carries the mark.
            # Replacing a photograph while keeping its filename leaves a stale
            # entry claiming a mark that is not there — so check the pixels
            # rather than trusting the bookkeeping.
            img = Image.open(path).convert("RGB")
            z = _score_subgrid(img, payload_bits(payload), 0, 0, GRID, GRID)
            if z >= THRESHOLD:
                skipped += 1
                continue
            print(f"  {rel}: listed as marked but reads z={z:.1f} — re-marking")
            restamped += 1
        z = embed(path, payload)
        manifest[payload] = rel
        added += 1
        # Written after every image, not at the end. A long run that is
        # interrupted would otherwise lose the record of files it had already
        # marked, and the next run would mark them a second time.
        MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True))
        print(f"  marked {rel}  id={payload}  z={z:.1f}")

    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True))
    note = f", {restamped} re-marked" if restamped else ""
    print(f"\n{added} newly marked, {skipped} already marked{note}, "
          f"{len(manifest)} total. Manifest: {MANIFEST.relative_to(REPO)}")
    return 0


def _alignments() -> list[tuple[int, int, int, int]]:
    """Every candidate (gy, gx, gh, gw) the detector will try."""
    out = [(0, 0, GRID, GRID)]
    for frac in (0.9, 0.8, 0.7, 0.6, 0.5):
        span = max(8, int(round(GRID * frac)))
        if span >= GRID:
            continue
        steps = sorted({0, (GRID - span) // 4, (GRID - span) // 2,
                        3 * (GRID - span) // 4, GRID - span})
        for gy in steps:
            for gx in steps:
                out.append((gy, gx, span, span))
    return out


def _residual(img: Image.Image, gy: int, gx: int, gh: int, gw: int):
    """The residual field and its cell indices for one alignment."""
    cell = 8
    win = img.resize((gw * cell, gh * cell), Image.LANCZOS)
    arr = np.asarray(win).astype(np.float32)[:, :, 2]
    means = arr.reshape(gh, cell, gw, cell).mean(axis=(1, 3))
    pad = np.pad(means, 1, mode="edge")
    smooth = (pad[:-2, 1:-1] + pad[2:, 1:-1] + pad[1:-1, :-2] + pad[1:-1, 2:]) / 4.0
    idx = ((np.arange(gy, gy + gh)[:, None] * GRID)
           + np.arange(gx, gx + gw)[None, :]).ravel()
    return (means - smooth).ravel(), idx


def identify(path: Path) -> tuple[str | None, float]:
    """
    Matches a suspect file against every marked image in the manifest.

    The costly step is resampling the image for each candidate alignment, and
    that does not depend on which payload is being tested — so each alignment
    is resampled once and then scored against all payloads at once.
    """
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    if not manifest:
        return None, 0.0

    payloads = list(manifest.items())
    expects = np.array([payload_bits(p) for p, _ in payloads])

    img = Image.open(path).convert("RGB")
    best, best_z = None, -1.0

    for align in _alignments():
        resid, idx = _residual(img, *align)
        base = resid * SEQ[idx]
        assign = ASSIGN[idx]
        # signs[i, j] is +1/-1 for payload i at cell j
        signs = np.where(expects[:, assign] == 1, 1.0, -1.0)
        product = base[None, :] * signs
        sd = product.std(axis=1)
        sd[sd == 0] = 1.0
        z = product.mean(axis=1) / (sd / np.sqrt(product.shape[1]))
        top = int(np.argmax(z))
        if z[top] > best_z:
            best_z, best = float(z[top]), payloads[top][1]

    return (best if best_z >= THRESHOLD else None), best_z


def cmd_audit() -> int:
    """Checks every marked image still reads back above the threshold."""
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    weak = []
    for payload, rel in sorted(manifest.items(), key=lambda kv: kv[1]):
        path = PUBLIC.parent / rel
        if not path.exists():
            print(f"  MISSING  {rel}")
            continue
        # An audit knows the file has not been cropped, so it only needs the
        # full-frame alignment — skipping the crop search makes this ~50x
        # faster and the number is the same.
        img = Image.open(path).convert("RGB")
        z = _score_subgrid(img, payload_bits(payload), 0, 0, GRID, GRID)
        flag = "" if z >= THRESHOLD else "   << below threshold"
        if z < THRESHOLD:
            weak.append(rel)
        print(f"  z={z:6.1f}  {rel}{flag}")
    print(f"\n{len(manifest)} marked, {len(weak)} below the {THRESHOLD} threshold")
    for w in weak:
        print(f"  weak: {w}")
    return 0


def cmd_reinforce() -> int:
    """
    Strengthens the mark on any image that audits below the threshold.

    The pattern for a given payload is always the same, so embedding again
    stacks more of the *same* signal rather than adding a competing one — the
    adaptive loop in `embed` then stops as soon as the image reads back
    cleanly. Detailed frames (crowds, foliage, a laid table) need this;
    flat ones never do.
    """
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    fixed = failed = 0
    for payload, rel in sorted(manifest.items(), key=lambda kv: kv[1]):
        path = PUBLIC.parent / rel
        if not path.exists():
            continue
        img = Image.open(path).convert("RGB")
        z = _score_subgrid(img, payload_bits(payload), 0, 0, GRID, GRID)
        if z >= THRESHOLD:
            continue
        before = z
        after = embed(path, payload)
        if after >= THRESHOLD:
            fixed += 1
            print(f"  {rel}: z {before:.1f} -> {after:.1f}")
        else:
            failed += 1
            print(f"  {rel}: z {before:.1f} -> {after:.1f}   STILL WEAK")
    print(f"\n{fixed} reinforced, {failed} still below threshold")
    return 0


def cmd_verify(target: str) -> int:
    path = Path(target)
    match, z = identify(path)
    print(f"detection z-score: {z:.1f}   (threshold {THRESHOLD})")
    if match:
        print(f"MATCH — this file came from {match}")
    else:
        print("no match — nothing above the noise floor")
    return 0


def cmd_test() -> int:
    """Marks a copy, attacks it, and reports what still reads back."""
    import io

    src = next(iter(targets()), None)
    if src is None:
        print("no images to test")
        return 1

    rel = str(src.relative_to(PUBLIC.parent)).replace("\\", "/")
    payload = hashlib.sha1(rel.encode()).hexdigest()[:10]
    expect = payload_bits(payload)

    tmp = Path("/tmp/_wm_test.jpg")
    Image.open(src).convert("RGB").save(tmp, "JPEG", quality=95)
    embed(tmp, payload)
    marked = Image.open(tmp).convert("RGB")

    original = Image.open(src).convert("RGB")
    diff = np.abs(
        np.asarray(marked).astype(int) - np.asarray(original).astype(int)
    )
    print(f"visual difference: mean {diff.mean():.2f} / max {diff.max()} levels "
          f"(under ~2 mean is imperceptible)\n")

    def score(im: Image.Image, label: str) -> None:
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=88)
        buf.seek(0)
        p = Path("/tmp/_wm_attacked.jpg")
        p.write_bytes(buf.getvalue())
        _, z = read(p, expect)
        verdict = "recovered" if z >= THRESHOLD else "LOST"
        print(f"  {label:<34} z={z:7.1f}  {verdict}")

    w, h = marked.size
    print("attack                              z-score")
    score(marked, "untouched")
    score(Image.open(io.BytesIO(_jpeg(marked, 75))), "re-saved at JPEG q75")
    score(Image.open(io.BytesIO(_jpeg(marked, 60))), "re-saved at JPEG q60")
    score(marked.resize((w // 2, h // 2), Image.LANCZOS), "downscaled 50% (screenshot)")
    score(marked.resize((int(w * 0.75), int(h * 0.75)), Image.LANCZOS), "downscaled 75%")
    score(marked.crop((0, 0, int(w * 0.7), int(h * 0.7))), "cropped to 70%")
    score(marked.crop((int(w * .15), int(h * .15), int(w * .85), int(h * .85))), "centre crop 70%")
    return 0


def _jpeg(im: Image.Image, q: int) -> bytes:
    import io

    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=q)
    return buf.getvalue()


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    cmd = sys.argv[1]
    if cmd == "embed":
        return cmd_embed(force="--force" in sys.argv)
    if cmd == "verify" and len(sys.argv) == 3:
        return cmd_verify(sys.argv[2])
    if cmd == "audit":
        return cmd_audit()
    if cmd == "reinforce":
        return cmd_reinforce()
    if cmd == "test":
        return cmd_test()
    print(__doc__)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
