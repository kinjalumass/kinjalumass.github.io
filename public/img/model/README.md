# Model portfolio images

Every file here is a **placeholder** — a labelled frame, not a photo. Replace
each with your own image, keep the exact filename, and the page picks it up with
no code change.

## Hero

| File | Crop |
|---|---|
| `hero-01.jpg` | Portrait 4:5 — the single frame punched through the name |
| `hero-02.jpg` | Portrait 5:7 — currently unused, kept as a spare |

## Digitals — `digital-*.jpg`

Portrait 3:4, **unretouched, natural light, minimal makeup, hair down, fitted
plain clothing.** Agencies care more about these being honest than flattering.

| File | Shot |
|---|---|
| `digital-headshot.jpg` | Headshot, neutral expression |
| `digital-smile.jpg` | Headshot, natural smile |
| `digital-front.jpg` | Full length, front, arms at sides |
| `digital-profile.jpg` | Full length, side, 90° |
| `digital-three-quarter.jpg` | Angled, hands visible |
| `digital-back.jpg` | Full length, rear |

## Shoots

Six shoots, eight frames each, named `<slug>-01.jpg` through `<slug>-08.jpg`:

`carle` · `runway` · `lookbook` · `studio` · `campaign` · `beauty`

**Six frames show by default and the rest sit behind "Show all N frames."**
The mosaic repeats a six-step rhythm — wide, tall, square, wide, tall, tall — so
mixed crops look intentional. Shoot a variety and it will lay out well.

### Adding more frames to a shoot

The page reads however many images the array holds, so a shoot can have 8 or 40.
In `src/app/data/model.ts`, either bump the count:

```ts
images: frames('carle', 24),   // expects carle-01 … carle-24
```

or list paths explicitly if your filenames differ. Everything after the first
six is revealed by the button, and the lightbox pages through all of them.

### Adding a whole new shoot

Add an entry to `SHOOTS` with its own `slug`, `accent` (an `r, g, b` triplet
that colours that section), and images. Drop the files in here to match.

## Two things to fix in `src/app/data/model.ts`

1. **The measurements are invented.** Height, bust, waist, hips, dress, and shoe
   in `STATS` are placeholder numbers so the layout could be built. Replace all
   of them.
2. **Five of the six shoots are placeholders.** Only the Eric Carle Museum entry
   is real. Replace the titles, venues, years, and notes on the others.
