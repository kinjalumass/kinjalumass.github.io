#!/usr/bin/env python3
"""
Find the face in every modelling photo and write `src/app/data/focus.ts`.

Why this exists
---------------
The gallery tiles crop with `object-fit: cover`. By default that crops to the
centre of the image — and the centre of a full-length fashion frame is the
torso, not the face. Every tile ends up previewing a midsection.

This detects the subject's face and emits an `object-position` for each image,
so the crop keeps the head. The face lands at the same fraction down the tile
as it sits in the source, which puts it comfortably in the upper third.

Usage
-----
    pip install opencv-python
    python3 tools/face-focus.py

Re-run after adding or replacing photos. Check the result before shipping:
the detector is a Haar cascade and will occasionally lock onto the wrong
person in a group frame or onto a patterned garment. Corrections go in
OVERRIDE below and survive regeneration.
"""

from __future__ import annotations

import json
from pathlib import Path

import cv2

REPO = Path(__file__).resolve().parent.parent
PHOTOS = REPO / "public" / "img" / "model"
OUT = REPO / "src" / "app" / "data" / "focus.ts"

# Detection runs on a downscaled copy — faces are still 60-150px there, and it
# is roughly twenty times faster than working at full size.
DETECT_EDGE = 700

# A standing frame with no detected face: crop to the top third.
DEFAULT = (0.50, 0.28)

# Verified by eye against the rendered crops. The cascade picked another model
# in the group frames and fired on garment texture in the two Barbie shots.
OVERRIDE: dict[str, tuple[float, float]] = {
    "carle/carle-10.jpg": (0.42, 0.26),    # dark couch frame; cascade fires on the wall
    "pagoda/pagoda-01.jpg": (0.47, 0.58),  # wide architectural frame, she is low
    "cheer/cheer-01.jpg": (0.45, 0.30),    # mid-kick, keep the head in
}

# Order the output the way the page orders the shoots.
SHOOT_ORDER = [
    "carle", "pagoda", "beauty", "snow", "black-dress", "cheer", "digitals",
]


def cascades() -> list:
    base = cv2.data.haarcascades
    return [
        cv2.CascadeClassifier(base + "haarcascade_frontalface_default.xml"),
        cv2.CascadeClassifier(base + "haarcascade_frontalface_alt2.xml"),
        cv2.CascadeClassifier(base + "haarcascade_profileface.xml"),
    ]


def find_face(path: Path, detectors: list) -> tuple[float, float] | None:
    """Returns the largest face centre as (x, y) fractions, or None."""
    img = cv2.imread(str(path))
    if img is None:
        return None

    height, width = img.shape[:2]
    scale = DETECT_EDGE / max(height, width)
    small = cv2.resize(img, (int(width * scale), int(height * scale)))
    gray = cv2.equalizeHist(cv2.cvtColor(small, cv2.COLOR_BGR2GRAY))
    h, w = gray.shape

    found = []
    for det in detectors:
        for box in det.detectMultiScale(gray, 1.08, 5, minSize=(24, 24)):
            found.append(tuple(int(v) for v in box))

    # The profile cascade only matches one direction, so try the mirror too.
    flipped = cv2.flip(gray, 1)
    for (x, y, fw, fh) in detectors[-1].detectMultiScale(flipped, 1.08, 5, minSize=(24, 24)):
        found.append((int(w - x - fw), int(y), int(fw), int(fh)))

    if not found:
        return None

    x, y, fw, fh = max(found, key=lambda f: f[2] * f[3])
    return (x + fw / 2) / w, (y + fh / 2) / h


def main() -> int:
    detectors = cascades()
    focus: dict[str, tuple[float, float]] = {}
    detected = overridden = defaulted = 0

    for path in sorted(PHOTOS.rglob("*.jpg")):
        # Relative to the model folder, so a file sitting directly in it (the
        # hero portrait) yields "hero.jpg" rather than "model/hero.jpg" — which
        # would have been emitted as img/model/model/hero.jpg and silently
        # dropped from the output.
        key = str(path.relative_to(PHOTOS)).replace("\\", "/")
        if key in OVERRIDE:
            focus[key] = OVERRIDE[key]
            overridden += 1
            continue

        hit = find_face(path, detectors)
        if hit:
            focus[key] = hit
            detected += 1
        else:
            focus[key] = DEFAULT
            defaulted += 1
        print(f"  {key:32s} {'face' if hit else 'default'}")

    rows: list[str] = []

    loose = sorted(k for k in focus if "/" not in k)
    if loose:
        rows.append("\n  // top level")
        for key in loose:
            x, y = focus[key]
            rows.append(f"  'img/model/{key}': '{round(x * 100)}% {round(y * 100)}%',")

    for slug in SHOOT_ORDER:
        keys = sorted(k for k in focus if k.startswith(slug + "/"))
        if not keys:
            continue
        rows.append(f"\n  // {slug}")
        for key in keys:
            x, y = focus[key]
            rows.append(f"  'img/model/{key}': '{round(x * 100)}% {round(y * 100)}%',")

    covered = len(loose) + sum(
        1 for slug in SHOOT_ORDER for k in focus if k.startswith(slug + "/")
    )
    if covered != len(focus):
        missing = [k for k in focus
                   if "/" in k and k.split("/")[0] not in SHOOT_ORDER]
        print(f"  ⚠ {len(missing)} frames not covered by SHOOT_ORDER: {missing}")

    OUT.write_text(
        '/**\n'
        ' * Where the face is in each frame — GENERATED, do not hand-edit.\n'
        ' *\n'
        ' * The gallery tiles crop with `object-fit: cover`. Left to itself that crops to\n'
        ' * the middle of the image, which on a full-length fashion frame is the torso.\n'
        ' * These values move the crop to the subject’s face instead, as an\n'
        ' * `object-position` pair.\n'
        ' *\n'
        ' * Regenerate after adding photos:\n'
        ' *     python3 tools/face-focus.py\n'
        ' *\n'
        ' * The detector is a Haar cascade, so it is not infallible — a handful of these\n'
        ' * were corrected by eye where it locked onto another model in a group frame.\n'
        ' * Those corrections live in `tools/face-focus.py` under OVERRIDE.\n'
        ' */\n\n'
        'export const FOCUS: Record<string, string> = {'
        + "\n".join(rows)
        + '\n};\n\n'
        '/** Falls back to a top-weighted crop, which is right for a standing frame. */\n'
        'export function focusOf(src: string): string {\n'
        "  return FOCUS[src] ?? '50% 28%';\n"
        '}\n'
    )

    print(f"\n{len(focus)} frames -> {OUT.relative_to(REPO)}")
    print(f"  {detected} detected, {overridden} hand-corrected, {defaulted} defaulted")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
