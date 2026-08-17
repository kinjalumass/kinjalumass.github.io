# Images

The four files in this folder are **placeholders**. Replace each one with your
own photo, keeping the exact same filename, and the site picks it up with no
code changes. JPG, and keep them under ~400 KB each so the page stays fast.

| File | Where it appears | Notes |
|---|---|---|
| `hero-cutout.webp` | The developer hero portrait | **Background removed.** The code wall renders behind it |
| `hero-original.jpg` | Not used on the site | The untouched source photo, kept so the cutout can be redone |
| `hero-cutout.png` | Not used on the site | Same cutout as PNG, if you need a format that isn't WebP |
| `work-01.jpg` | Left image in the summary grid | Landscape, 4:3 |
| `work-02.jpg` | Right image in the summary grid | Landscape, 4:3 |

## Replacing the hero portrait

The hero effect depends on `hero-cutout.webp` having a **transparent
background** — that is what lets the matrix rain fall behind Kinjal instead of
across her. A normal photo with its background intact will cover the whole
frame and the effect disappears.

So if you swap this photo, cut the subject out first. Any of these work:

- Photoshop → Select Subject → Remove Background → export PNG or WebP
- macOS Preview → Instant Alpha, or right-click an image → Remove Background
- remove.bg, Canva, or Photoroom — all free for a single image

Then export **WebP or PNG with alpha**, name it `hero-cutout.webp`, and drop it
here. Shoot against a plain, evenly lit wall that contrasts with the clothing —
it makes the cutout far cleaner, especially around hair.

`hero-a.jpg` and `hero-b.jpg` are leftovers from the earlier two-photo hover
effect and are no longer referenced.

If you'd rather use different filenames or add more images, edit
`src/app/data/developer.ts`, which is where all the paths live.

## `logos/` — institution marks

`umass.svg` and `virginia-tech.svg` are **monogram placeholders** drawn in the
site's own style. Both universities publish official logo downloads on their
brand pages — grab the SVG or a transparent PNG and replace these files.

If you save a PNG instead of an SVG, update the `logo` path for that degree in
`src/app/data/profile.ts`.

## `gallery/` — photos for experience, projects, and honors

Placeholders for the photos attached to entries across the developer pages:
`workshop.jpg`, `hackathon.jpg`, `research.jpg`, `presenting.jpg`. Landscape
crops work best. Add more by dropping a JPG here and referencing it with
`photo('filename', 'Title')` in `src/app/data/profile.ts`.
