#!/usr/bin/env python3
"""
Import the modelling photos from the Drive folder into the site.

The originals are camera JPEGs — several are 8-13 MB, which is far too heavy
for a static site. This resizes them to a sensible web size, strips EXIF
(camera JPEGs carry GPS and serial numbers), and writes them under the names
`src/app/data/model.ts` already expects.

Usage
-----
    python3 tools/import-photos.py <source-folder>

where <source-folder> is the downloaded "website portfolio pics" directory,
with its subfolders intact. Files are matched by folder name, so as long as
the folders keep their Drive names this needs no arguments beyond the path.

Re-running is safe: each destination folder is cleared and rewritten.
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

# Long edge in pixels. 1800 covers a full-bleed frame on a 2x display without
# shipping 12 MB per photograph.
MAX_EDGE = 1800
QUALITY = 84

REPO = Path(__file__).resolve().parent.parent
DEST_ROOT = REPO / "public" / "img" / "model"

# Drive folder name -> slug used in model.ts. Folders sharing a slug are
# merged, in the order listed here.
MAPPING: list[tuple[str, str]] = [
    ("Eric Carle Museum Event", "carle"),
    ("Museum supplemental", "carle"),
    ("New England Peace Pagoda", "pagoda"),
    ("Snow", "snow"),
    ("Pageant dress", "pageant"),
    ("Little black dress", "black-dress"),
    ("Barbie", "barbie"),
    ("4th", "fourth"),
    ("Cheer", "cheer"),
    # The Drive "digitals" folder is empty, so the headshots stand in.
    ("Face", "digitals"),
]

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".JPG", ".JPEG", ".PNG"}


def images_in(folder: Path) -> list[Path]:
    if not folder.is_dir():
        return []
    return sorted(
        (p for p in folder.iterdir() if p.suffix in EXTS),
        key=lambda p: p.name.lower(),
    )


def convert(src: Path, dest: Path) -> None:
    with Image.open(src) as im:
        # Honour the camera's rotation flag, then drop the metadata entirely.
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGB")
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)

        clean = Image.new("RGB", im.size)
        clean.putdata(list(im.getdata()))
        clean.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    source = Path(sys.argv[1]).expanduser().resolve()
    if not source.is_dir():
        print(f"Not a folder: {source}")
        return 1

    # Group the source folders by destination slug so merges keep their order.
    grouped: dict[str, list[Path]] = {}
    for folder_name, slug in MAPPING:
        grouped.setdefault(slug, []).extend(images_in(source / folder_name))

    total = 0
    for slug, files in grouped.items():
        if not files:
            print(f"  {slug:<10} no source images found — skipped")
            continue

        dest_dir = DEST_ROOT / slug
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        dest_dir.mkdir(parents=True)

        prefix = "digital" if slug == "digitals" else slug
        for i, src in enumerate(files, start=1):
            dest = dest_dir / f"{prefix}-{i:02d}.jpg"
            convert(src, dest)
            total += 1

        before = sum(f.stat().st_size for f in files) / 1e6
        after = sum(f.stat().st_size for f in dest_dir.iterdir()) / 1e6
        print(f"  {slug:<10} {len(files):>2} frames   {before:6.1f} MB -> {after:5.1f} MB")

    print(f"\n{total} images written to {DEST_ROOT}")
    print("Frame counts in src/app/data/model.ts must match the numbers above.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
