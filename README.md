# kinjalumass.github.io

Personal site for **Kinjal Pandey** — Developer · Entrepreneur · Model.

Angular 22 (standalone components, signals), SCSS, no external UI libraries.
Deployed free to GitHub Pages via GitHub Actions.

## Run it locally

```bash
npm install
npm start
```

Then open <http://localhost:4200>. The dev server hot-reloads on save.

## Build

```bash
npm run build          # production build → dist/portfolio/browser
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app
and publishes it to GitHub Pages.

**One-time setup:** in the repo on GitHub go to
**Settings → Pages → Build and deployment → Source** and choose
**GitHub Actions**. Nothing needs to be committed to a `gh-pages` branch.

The workflow also copies `index.html` to `404.html` so client-side routes
deep-link correctly, and drops a `.nojekyll` file so Pages serves the
`_`-prefixed asset folders untouched.

## Where things live

```
src/
  index.html                    fonts, meta tags, title
  styles.scss                   global design tokens (colours, type, motion)
  app/
    app.ts / app.html           shell, just hosts the router outlet
    app.config.ts               router setup (input binding, scroll reset)
    app.routes.ts               / , /developer , /entrepreneur , /model
    data/panels.ts              ← all copy lives here, for every page
    pages/home/                 the three-panel landing page
      home.ts                   hover state, pointer tracking, keyboard
      home.html                 markup
      home.scss                 layout + all the motion
    pages/section/              serves /entrepreneur and /model
      section.ts                reads its id from the route's data
    pages/developer/            the developer section
      dev-shell.*               nav, overlays, footer — wraps every dev page
      developer.*               /developer landing
      education/                /developer/education
      experience/               /developer/experience
      projects/                 /developer/projects
      honors/                   /developer/honors
      resume/                   /developer/resume
      contact/                  /developer/contact
    components/
      code-rain/                canvas glyph rain
      console-bot/              the terminal assistant
    data/
      panels.ts                 landing page copy
      developer.ts              /developer landing copy
      profile.ts                education, experience, projects, honors, contact
      resume.ts                 the three resume variants
      knowledge.ts              assistant knowledge base
  styles/terminal.scss          shared `.dev-*` chrome for the subpages
```

### Editing the copy

`src/app/data/panels.ts` is the single source of truth for all three sections:
headline, kicker, blurb, focus list, links, and accent colour. It feeds both the
landing page and the section pages — change it there and both follow.

## Behaviour

**Entrepreneur — Kinnovation (`/entrepreneur`)**

A rebuild of the previous Next.js `kinnovation-dev` site in Angular, with a new
identity: **light paper base**, saturated accents, Space Grotesk, and a
deliberately loose layout — tilted images, hard offset shadows, rotated sticker
badges, oversized ghost numerals, staggered rather than aligned grids, and
full-bleed colour blocks. Nothing like the developer section, and nothing that
sits on a rigid 12-column grid.

| Route | Venture |
|---|---|
| `/entrepreneur` | Studio overview — thesis and the venture index |
| `/entrepreneur/measmi` | Symptom-first treatment discovery |
| `/entrepreneur/karnah` | Verified giving with traceability |
| `/entrepreneur/calendai` | Canvas-integrated planning engine |
| `/entrepreneur/nutri-navigator` | Real-time personalised nutrition |
| `/entrepreneur/witness-platform` | Privacy-first event documentation |
| `/entrepreneur/trendify` | Trend-matching against your own gallery |

Every venture page has a **different layout** — split hero, full-bleed hero,
centred hero with collage, day-in-the-life clock, restrained editorial — and its
own three-stop palette set as `--v1/--v2/--v3` on the page root. The shared
`.ent-*` classes in `src/styles/venture.scss` read those variables, so the same
components recolour per venture without duplicated CSS.

All copy lives in `src/app/data/ventures.ts`.

**Model (`/model`)**

Milk base with saturated colour washes drifting behind it, Bodoni Moda display,
mono spec type. One long scroll.

- **Overture** — the name at full width with the surname in a rose-to-iris
  gradient, and a single arched portrait punched straight through the middle of
  it.
- **Spec** — stats and digitals side by side on one dark block, so the numbers
  and the faces read together the way a comp card does.
- **The Book** — six shoots, each with its own accent colour, alternating which
  side the credits sit on. Frames lay out on a six-step mosaic rhythm (wide,
  tall, square, wide, tall, tall). Six show by default; **"Show all N frames"**
  expands the rest, so a shoot can hold as many images as you have.
- **Booking** — the email address *is* the artwork: set at display size on a
  gradient block, italicising and tilting on hover, click to copy. Scattered
  rotated chits carry location and travel.
- Any image opens in a light lightbox; arrow keys page through every photo on
  the page, `Esc` closes.

⚠️ **The measurements in `src/app/data/model.ts` are placeholders**, as are three
of the four shoots. See `public/img/model/README.md`.

**Landing page (`/`)**

- Three full-height panels split across the viewport. No footer, no chrome.
- Each tile carries its section's own theme: Developer gets the terminal grid and
  scanlines, Entrepreneur gets warm paper with a vibrant wash, Model gets the
  lightest treatment of all with an italic Bodoni wordmark.
- Hovering a panel expands it and recedes the other two (desaturated, narrowed);
  the headline scales with the panel so it never clips.
- A pointer-tracked spotlight and a parallax wash layer follow the cursor
  inside the active panel.
- Clicking a panel navigates to its own page.
- `←` / `→` move between panels, `Enter` opens the highlighted one.

**Section pages (`/developer`, `/entrepreneur`, `/model`)**

- One `Section` component serves all three; the route supplies the id and the
  content comes from `data/panels.ts`.
- Oversized serif hero on the left, lead paragraph and detail on the right,
  the section's accent colour carried through.
- A pager at the bottom links straight across to the other two sections.

**Developer page (`/developer`)**

A separate terminal/cyber treatment, deliberately unlike the landing page.

- Hero: a portrait tile where moving the cursor opens a circular window through
  `hero-a.jpg` onto `hero-b.jpg`, with a chromatic fringe and a scan ring at the
  edge. Name sits dead centre with an occasional glitch split; the role beneath
  it cycles through AI Researcher → Tech Leader → Software Engineer →
  Innovation Advocate with a character-scramble transition.
- Canvas glyph rain behind the hero, throttled to ~24fps, paused when
  off-screen, and skipped entirely under reduced motion.
- Summary, stats, and work cards that tilt toward the cursor with a specular
  highlight that tracks it.
- A console assistant that answers questions about her.

**Developer subpages**

All six share `DevShell`, which supplies the fixed nav, the scanline and vignette
overlays, and the footer, plus a set of global `.dev-*` classes from
`src/styles/terminal.scss` so the pages stay visually identical.

| Route | What it does |
|---|---|
| `/developer/education` | Degrees with institution logos, linked coursework, transcripts, certificates |
| `/developer/experience` | All 12 roles on a spine timeline, filterable, with attached documents |
| `/developer/projects` | Seven projects, cursor-tracked highlight, with attached documents |
| `/developer/honors` | Honors grid with certificates, competitive selections |
| `/developer/resume` | Three switchable resume PDFs with inline preview |
| `/developer/contact` | Channel list with copy buttons, availability panel |

### Coursework links

Courses live in `src/app/data/profile.ts`, grouped by subject area under each
degree, and every one links out to a catalog page.

Virginia Tech publishes per-subject catalog pages, so `cs('CS 3114', …)` links
to the CS listing, `math(…)` to the MATH listing, and so on — the helpers at the
top of the file build the URL. UMass has no stable public per-course page
(SPIRE requires a login), so graduate courses all point at the CICS course
listing, which carries the current descriptions.

To add a course, add a line to the relevant group using the matching helper.

### Documents and photos

Any degree, role, project, or honor can carry attached certificates and photos.
The plumbing is one system used everywhere:

- `data/assets.ts` — the `Asset` model plus `cert()` and `photo()` helpers.
- `components/asset-viewer/asset.service.ts` — holds what's open.
- `asset-strip` — the row of clickable tiles under an entry.
- `asset-lightbox` — the full-screen viewer, mounted once in `DevShell` so it
  never inherits a transformed ancestor.

Images open as images, PDFs open in an embedded viewer. Arrow keys page through
a set, `Esc` closes, clicking the backdrop closes.

Files live in `public/docs/` and `public/img/gallery/` — see
`public/docs/README.md` for the filename map and how to attach a document to a
new entry.

**Transcripts are a special case.** They're marked `shareable: false`, so the
viewer shows them with no open-in-new-tab or download link, and `robots.txt`
disallows `/docs/`. That keeps them out of search results and off the page as a
crawlable link — but GitHub Pages has no access control, so anyone with the URL
can still fetch the file. Redact before uploading.

### Resume variants

Three PDFs live in `public/resume/`, one per track — **AI / ML**,
**Software Engineering**, and **Data Science / Analytics**. See
`public/resume/README.md` for the filenames; replace a placeholder with your own
PDF, keep the name, and the site picks it up with no code change.

`src/app/data/resume.ts` maps each tab to its file and sets the filename the
visitor receives on download. Selecting a tab previews that PDF inline in a
terminal-framed viewer, with **Open** and **Download** beside it.

Each version is deep-linkable — `/developer/resume?v=software` opens straight to
the Software Engineering PDF, which is useful when sending a specific one to a
recruiter. Below 760px the inline preview is swapped for open/download buttons,
since embedded PDF viewers are unreliable on mobile.

### The console assistant

A real language model, grounded in the profile, running for free — with an
offline fallback so it never simply breaks.

**How it works.** `src/app/data/corpus.ts` assembles ~37 passages from the same
data that renders the site — every degree, role, project, venture, the
publication, honors, skills, contact. When a visitor asks something, the page
scores that corpus, picks the six most relevant passages, and sends them with
the question to a small Cloudflare Worker. The Worker calls **Workers AI**, so
there is no third-party API key anywhere, and streams the answer back token by
token. Under the reply, chips show which passages it read from.

The system prompt confines it to those passages: it cannot invent an employer,
a date, or a credential, and it says plainly when something is outside what it
knows. Nothing is fine-tuned — edit `profile.ts`, `developer.ts` or
`ventures.ts` and the assistant's knowledge changes on the next deploy.

**Cost.** Cloudflare's free plan includes 10,000 Neurons per day with no credit
card. The Worker rate-limits to 12 questions per minute per IP so one visitor
cannot spend the day's allocation.

**Setup.** See `worker/README.md` — about ten minutes, once. Until then
`ASSISTANT.endpoint` in `src/app/data/assistant.config.ts` stays empty and the
site runs the original keyword assistant in `knowledge.ts`. That fallback also
catches a Worker outage or a spent allocation, so a visitor always gets an
answer. The badge in the terminal header reads `model` or `offline` accordingly.

`help` lists the offline topics; `clear` wipes the log.

Under 860px the panels stack vertically and section pages collapse to one
column. Everything respects `prefers-reduced-motion`.

## Notes

- Font inlining is disabled in the production build (`angular.json` →
  `optimization.fonts: false`) so builds do not depend on reaching
  `fonts.googleapis.com`. Fonts load from the `<link>` in `index.html`.
- Placeholder links in `data/panels.ts` are `#` — swap in the real GitHub,
  LinkedIn, and Instagram URLs.
