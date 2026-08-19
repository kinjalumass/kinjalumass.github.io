# Where every picture lives

All images are under **`public/img/`**. Whatever you drop in at a given path
appears on the site — no code change needed, as long as you keep the filename.

---

## The one rule that matters

**Every photograph carries an invisible watermark.** Editing a published file
in place destroys it, and the file is then no longer traceable. So if you edit
a photo, either:

- **re-run the marker afterwards** — `python3 tools/watermark.py embed`, which
  now checks the actual pixels and re-marks anything that lost its mark; or
- **tell me and I'll rebuild it properly**, which also re-runs the tone
  correction and the face-focus map.

Nothing breaks if you forget. The picture still displays. It just stops being
provable as yours.

---

## Modelling — `public/img/model/`

The gallery is index-driven: `carle-01.jpg` is frame 1, and so on. Frame counts
live in `src/app/data/model.ts` — change a count there if you add or remove
files.

| Folder | Files | Shows as |
|---|---|---|
| `model/carle/` | `carle-01` … `carle-11` | Shoot 01 — Fashion Meets Illustration |
| `model/pagoda/` | `pagoda-01` … `pagoda-06` | Shoot 02 — New England Peace Pagoda |
| `model/beauty/` | `beauty-01` … `beauty-06` | Shoot 03 — Beauty |
| `model/snow/` | `snow-01` … `snow-04` | Shoot 04 — Snow |
| `model/black-dress/` | `black-dress-01` … `-03` | Shoot 05 — Little Black Dress |
| `model/cheer/` | `cheer-01` … `cheer-05` | Shoot 06 — Hokies Cheer |
| `model/digitals/` | `digital-01` … `digital-06` | The Digitals sheet beside your stats |

**The opening portrait** at the top of the model page is `model/carle/carle-01.jpg`.
To lead with something else, change `IDENTITY.hero` in `src/app/data/model.ts`.

**Digital labels** are fixed in order — 01 full length, 02 three-quarter,
03 waist up, 04 headshot, 05 profile, 06 three-quarter face. Swap the files and
the labels stay, so keep them in that order or edit `DIGITALS` in `model.ts`.

---

## Ventures — `public/img/ventures/`

One illustration per venture, shown **once** on its page.

```
measmi.jpg   karnah.jpg   calendai.jpg
nutri.jpg    witness.jpg  trendify.jpg
```

These began as three crops each — a hero plus two accents — cut from one
source image per venture. That put the same picture on screen three times in a
single viewport, which reads as padding rather than design. One image, used
once, is the rule now.

Each file also appears as the thumbnail on its card on the entrepreneur index.
That is a different page and a navigational one, so it is not the repetition
this rule is about — but if you would rather the cards were typographic, say
so and the thumbnails come out.

To replace one: drop a new file in at the same name. Nothing else changes.
Landscape, roughly 16:10, at least 1600px wide suits every placement.

---

## Awards and events

| Path | Where it shows |
|---|---|
| `pitches/award-karnah-upitch.jpg` | Karnah award card, entrepreneur page |
| `pitches/award-calendai-apex.jpg` | CalendAI award card |
| `pitches/award-trendify-berthiaume.jpg` | Trendify AI award card |
| `pitches/pitch-umass-stage.jpg` | Kinnovation page hero |
| `pitches/pitch-umass-podium.jpg` | Kinnovation page, closing frame |
| `pitches/pitch-recognition.jpg` | Kinnovation page, beside the thesis |
| `honors/scholarship-backdrop.jpg` | Honors page, and its social preview |
| `honors/scholarship-dinner.jpg` | Honors page |
| `bcu/cohort-stairs.jpg` | Wide band on the BCU project page |
| `bcu/team-standing.jpg` | Beside the attribution note |

**⚠️ `award-karnah-upitch.jpg` is cropped, deliberately, twice.** The full frame
shows the **first-place $1,000 cheque awarded to Pitchify** — a different team —
and a centred crop put *their* founder in the middle of your award card. It is
now cropped above the cheque and to the left half so you are the subject. If you
replace this file, check both. The crop is in `tools/rebuild-photos.py` under
`CROPPED`.

---

## Landing page and developer section

| Path | Where it shows |
|---|---|
| `tiles/tile-developer.jpg` | Developer tile, home page |
| `tiles/tile-entrepreneur.jpg` | Entrepreneur tile |
| `tiles/tile-model.jpg` | Model tile |
| `hero-cutout.webp` | Developer hero — **background already removed, has transparency** |
| `hero-original.jpg` | The untouched source of that cutout |
| `hero-a.jpg` | Spare portrait |
| `work-01.jpg`, `work-02.jpg` | Illustrations in the developer section |
| `logos/umass.png`, `logos/virginia-tech.png` | Education page |

If you redo `hero-cutout.webp`, keep it a **PNG or WebP with alpha** — a JPEG
will show a solid box behind you instead of the matrix rain.

---

## Certificates — `public/img/certs/` and `public/docs/certificates/`

Each certificate is two files that must share a basename:

- `public/docs/certificates/<name>.pdf` — the document that opens when clicked
- `public/img/certs/<name>.jpg` — the preview tile

Replace both, or the tile will show the old certificate. The list is in
`CERTIFICATIONS` in `src/app/data/profile.ts`.

---

## If you edit photos yourself

Sizes: **1800px on the long edge, JPEG quality ~86.** Bigger just slows the
site down; the gallery never displays more than that.

Then either run the two commands, or hand them back to me:

```
python3 tools/watermark.py embed     # restore the marks you overwrote
python3 tools/face-focus.py          # redo the face-crop map
```

The second one matters for modelling photos specifically. Gallery tiles crop to
a fixed shape, and without that map they crop to the centre of the frame —
which on a full-length shot is the midsection, not the face.
