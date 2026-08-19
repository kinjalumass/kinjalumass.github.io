#!/usr/bin/env python3
"""
Rebuild every photograph on the site from its original, with correction applied.

Why rebuild rather than edit in place
-------------------------------------
The published images carry an invisible watermark (tools/watermark.py). Any
tonal or colour change damages it — so correcting a published file would leave
a photograph that is no longer traceable. The only correct order is:

    original  ->  enhance  ->  resize  ->  watermark

which means going back to the source files every time. This script does that,
and is the single place that knows which original becomes which published
path.

After running it:

    python3 tools/face-focus.py     # focal points shift when tones change
    python3 tools/watermark.py embed

Usage
-----
    python3 tools/rebuild-photos.py <group> [<group> ...]
    python3 tools/rebuild-photos.py --list
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from enhance import process_file  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
PUBLIC = REPO / "public" / "img"
ORIG = Path("/tmp/orig")
DRIVE = ORIG / "drive" / "website portfolio pics"

# Each group maps published files to their originals, with the profile that
# suits what the picture is for. See PROFILES in enhance.py.
GROUPS: dict[str, tuple[str, list[tuple[str, Path]]]] = {}


def _sorted(src_dir: Path) -> list[Path]:
    """
    Case-insensitive by filename — matching tools/import-photos.py.

    This matters more than it looks. A plain sort puts `Pic4.JPG` before
    `ic1.JPG`, so the frames come back in a different order than they were
    first published in. Every per-frame decision downstream — the focal-point
    overrides, the hero, anything referred to by index — silently points at a
    different photograph.
    """
    return sorted(
        (p for p in src_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}),
        key=lambda p: p.name.lower(),
    )


def _seq(dest_dir: str, prefix: str, src_dir: Path, profile: str, limit: int | None = None):
    files = _sorted(src_dir)
    if limit:
        files = files[:limit]
    return profile, [
        (f"{dest_dir}/{prefix}-{i:02d}.jpg", f) for i, f in enumerate(files, 1)
    ]


# The Carle set is ordered by hand, not alphabetically: the runway walks and
# the upside-down frame lead, because the mosaic gives the first two positions
# the largest tiles.
CARLE_ORDER = [
    "Eric Carle Museum Event/ec7.png",   # 01  red carpet walk, caterpillar
    "Eric Carle Museum Event/ec5.png",   # 02  upside down on orange
    "Eric Carle Museum Event/ec8.png",   # 03  group walk
    "Eric Carle Museum Event/ec1.png",   # 04  seated, teal armchair
    "Eric Carle Museum Event/ec3.png",   # 05  walk, bookshop
    "Eric Carle Museum Event/ec2.png",   # 06  yellow artwork, full length
    "Eric Carle Museum Event/ec4.png",   # 07  group
    "Eric Carle Museum Event/ec9.png",   # 08  walk, frog artwork
    "Eric Carle Museum Event/ec6.png",   # 09  mural, two-person
    "Museum supplemental/pic2.JPG",      # 10  dark couch
    "Museum supplemental/pic1.JPG",      # 11  gift shop
]

# The opening portrait, and the Face frame it comes from. It is published on
# its own path rather than as part of a shoot, so moving it does not shift
# every index in that shoot.
HERO_SRC = "Face/WhatsApp Image 2026-08-18 at 7.59.13 PM (1).jpeg"


def build_groups() -> None:
    # --- modelling shoots -------------------------------------------------
    GROUPS["carle"] = (
        "portrait",
        [(f"model/carle/carle-{i:02d}.jpg", DRIVE / rel)
         for i, rel in enumerate(CARLE_ORDER, 1)],
    )

    # The hero is handled by run("hero"), not here — it needs the canvas
    # extended before correction. See HERO_PAD.
    GROUPS["hero"] = ("portrait", [])
    GROUPS["pagoda"] = _seq("model/pagoda", "pagoda", DRIVE / "New England Peace Pagoda", "portrait")
    GROUPS["snow"] = _seq("model/snow", "snow", DRIVE / "Snow", "portrait")
    GROUPS["cheer"] = _seq("model/cheer", "cheer", DRIVE / "Cheer", "portrait")
    # The hero frame is excluded so the same photograph does not appear twice.
    face = [f for f in _sorted(DRIVE / "Face") if f.name != Path(HERO_SRC).name]
    GROUPS["beauty"] = (
        "portrait",
        [(f"model/beauty/beauty-{i:02d}.jpg", f) for i, f in enumerate(face, 1)],
    )

    # Little Black Dress dropped its fourth frame.
    lbd = _sorted(DRIVE / "Little black dress")[:3]
    GROUPS["black-dress"] = (
        "portrait",
        [(f"model/black-dress/black-dress-{i:02d}.jpg", f) for i, f in enumerate(lbd, 1)],
    )

    # --- digitals ---------------------------------------------------------
    # Hand-picked to cover the standard angles an agency asks for, rather than
    # six versions of one pose. The order drives the labels in model.ts, so
    # these two lists must stay in step:
    #
    #   01 Full length · 02 Full length, angled · 03 Waist up
    #   04 Waist up    · 05 Profile            · 06 Three-quarter
    picis = DRIVE / "Picis"
    GROUPS["digitals"] = (
        "neutral",
        [
            ("model/digitals/digital-01.jpg", picis / "pp (14).png"),
            ("model/digitals/digital-02.jpg", picis / "pp (13).png"),
            ("model/digitals/digital-03.jpg", picis / "pp (3).png"),
            ("model/digitals/digital-04.jpg", picis / "pp (1).png"),
            ("model/digitals/digital-05.jpg", picis / "pp (11).png"),
            ("model/digitals/digital-06.jpg", picis / "pp (4).png"),
        ],
    )

    # --- events: phone snaps in difficult light, these need the most -------
    bcu = ORIG / "bcu"
    GROUPS["bcu"] = (
        "event",
        [
            ("bcu/cohort-stairs.jpg", bcu / "IMG_5988.jpg"),
            ("bcu/team-standing.jpg", bcu / "IMG_3839.jpg"),
        ],
    )

    pit = ORIG / "pitching"
    GROUPS["pitches"] = (
        "event",
        [
            ("pitches/pitch-umass-stage.jpg", pit / "WhatsApp Image 2026-08-19 at 12.40.33 AM.jpeg"),
            ("pitches/pitch-umass-podium.jpg", pit / "WhatsApp Image 2026-08-19 at 12.41.41 AM.jpeg"),
            ("pitches/pitch-recognition.jpg", pit / "WhatsApp Image 2026-08-19 at 12.47.56 AM.jpeg"),
            ("pitches/award-trendify-berthiaume.jpg", pit / "WhatsApp Image 2026-08-19 at 12.48.33 AM.jpeg"),
            ("pitches/award-calendai-apex.jpg", pit / "WhatsApp Image 2026-08-19 at 12.50.54 AM.jpeg"),
        ],
    )

    GROUPS["honors"] = (
        "event",
        [
            ("honors/scholarship-backdrop.jpg", ORIG / "honors-backdrop.jpg"),
            ("honors/scholarship-dinner.jpg", ORIG / "honors-dinner.jpg"),
        ],
    )


# The UPitch frame needs two crops, not one.
#
#   Vertically: above the cheque, which reads PITCHIFY $1,000 — the first-place
#   prize, a different team's. See pitches.ts.
#   Horizontally: to the left half. Kinjal is second from left, so a centred
#   crop made the Pitchify founder the subject of her own award card.
# Finishing grades, applied after correction, to reconcile one shoot with the
# rest of the page. Measured rather than guessed: skin in the Little Black
# Dress set sat at LAB a 15.5 / b 19.5 against a page average of 12.0 / 18.4,
# which read as redder and more saturated than everything around it.
GRADES = {
    "black-dress": dict(saturation=0.86, a_shift=-3.0),
}


CROPPED = {
    "pitches/award-karnah-upitch.jpg": (
        ORIG / "karnah-upitch.jpg",
        (0.02, 0.00, 0.55, 0.53),   # left, top, right, bottom as fractions
        "event",
    )
}


# The hero frame has no headroom: the subject's hair touches the top edge of
# the original. The page presents it in an arched "window", which curves over
# that top edge and clips the head. No crop can fix this — there is nothing
# above her to keep — so the canvas is extended upward and the replicated band
# is smeared vertically, which is invisible against an out-of-focus
# background.
HERO_PAD = 0.10


def _extend_top(arr, frac: float):
    import cv2
    import numpy as np

    pad = int(arr.shape[0] * frac)
    out = cv2.copyMakeBorder(arr, pad, 0, 0, 0, cv2.BORDER_REPLICATE)
    band = out[: pad + 40]
    k = max(9, (pad // 2) | 1)
    band = cv2.GaussianBlur(band, (1, k), 0)
    blend = np.linspace(1, 0, pad + 40)[:, None, None]
    out[: pad + 40] = (band * blend + out[: pad + 40] * (1 - blend)).astype(np.uint8)
    return out


def run(group: str) -> int:
    if group == "hero":
        import numpy as np
        from PIL import Image, ImageOps
        from enhance import enhance

        with Image.open(DRIVE / HERO_SRC) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((1800, 1800), Image.LANCZOS)
            arr = np.asarray(im)
        arr = _extend_top(arr, HERO_PAD)
        out, _ = enhance(arr.astype(np.float32), "portrait")
        dest = PUBLIC / "model/hero.jpg"
        dest.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(out).save(dest, "JPEG", quality=88, optimize=True, progressive=True)
        print(f"  model/hero.jpg  (top extended {HERO_PAD:.0%}, then corrected)")
        return 1

    if group == "karnah":
        from PIL import Image, ImageOps
        import numpy as np
        from enhance import enhance

        dest_rel = "pitches/award-karnah-upitch.jpg"
        src, box, profile = CROPPED[dest_rel]
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = im.size
            l, t, r, b = box
            im = im.crop((int(w * l), int(h * t), int(w * r), int(h * b)))
            im.thumbnail((1800, 1800), Image.LANCZOS)
            rgb = np.asarray(im).astype(np.float32)
        out, _ = enhance(rgb, profile)
        dest = PUBLIC / dest_rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(out).save(dest, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"  {dest_rel}  (cropped + enhanced)")
        return 1

    profile, pairs = GROUPS[group]
    grading = GRADES.get(group)
    for dest_rel, src in pairs:
        if not src.exists():
            print(f"  MISSING SOURCE {src}")
            continue
        process_file(src, PUBLIC / dest_rel, profile, grading=grading)
        print(f"  {dest_rel}{'  (graded)' if grading else ''}")
    return len(pairs)


def main() -> int:
    build_groups()
    args = sys.argv[1:]
    if not args or args[0] == "--list":
        for g, (prof, pairs) in GROUPS.items():
            print(f"  {g:14s} {prof:9s} {len(pairs)} images")
        print(f"  {'karnah':14s} {'event':9s} 1 images (cropped)")
        return 0

    total = 0
    for g in args:
        print(f"[{g}]")
        total += run(g)
    print(f"\n{total} images rebuilt")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
