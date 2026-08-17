# Landing page tile backgrounds

One image per panel on the index page. All three are **placeholders** — replace
each with your own photo, keep the filename, and the page picks it up.

| File | Panel |
|---|---|
| `tile-developer.jpg` | Developer |
| `tile-entrepreneur.jpg` | Entrepreneur |
| `tile-model.jpg` | Model |

**Shoot or crop these tall.** Each panel is roughly a third of the screen wide
and full height, so a portrait crop around 1000 × 1700 works best. A landscape
photo will centre-crop and you will lose the sides.

Each panel lays a scrim over its photo so the type stays readable — dark on the
Developer tile, light on the other two. That means:

- **Developer** works with a darker image. A bright one will fight the scrim.
- **Entrepreneur and Model** want lighter images. A dark photo there will show
  through the pale scrim and the dark type will stop reading.

If you use a photo whose brightness runs the other way, adjust the scrim for
that panel in `src/app/pages/home/home.scss` — look for
`.panel[data-panel='…'] .panel__wash`.

Paths live in `src/app/data/panels.ts` if you want different filenames.
