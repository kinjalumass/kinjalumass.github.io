# Security & privacy

What this site does, what it cannot do, and the three things that still need
doing by hand.

---

## What is actually enforced

This is a static site on GitHub Pages. There is no server, so **no response
headers can be set**. Everything enforceable has to come from the document
itself, and that is what `src/index.html` does.

| Control | Where | Notes |
|---|---|---|
| Content-Security-Policy | `<meta http-equiv>` in `index.html` | No inline scripts, no plugins, connections limited to `api.github.com` and the assistant Worker |
| `frame-ancestors 'none'` | inside the CSP | Blocks clickjacking. Supersedes `X-Frame-Options`, which cannot be set as a meta tag at all |
| `upgrade-insecure-requests` | inside the CSP | Any stray `http://` reference is fetched over TLS instead |
| `base-uri 'self'` / `form-action 'none'` | inside the CSP | Stops base-tag hijacking and form exfiltration |
| Referrer policy | `<meta name="referrer">` | `strict-origin-when-cross-origin` — the full path is never leaked to third parties |
| HTTPS + HSTS | GitHub Pages setting | **See below — this one needs a click** |

`style-src` allows `'unsafe-inline'`. That is not laziness: Angular injects
component styles as inline `<style>` blocks, so removing it breaks the site.
Scripts are *not* allowed inline, which is the half that matters for XSS.

---

## Three things to do by hand

### 1. Turn on "Enforce HTTPS"

Repository → **Settings → Pages → Enforce HTTPS**.

This is the certificate question. GitHub issues and renews a Let's Encrypt
certificate for the custom domain automatically and at no cost — there is
nothing to buy and nothing to install. But the checkbox only becomes available
**after DNS has propagated**, and until it is ticked the site also answers on
plain `http://`. Ticking it adds the `Strict-Transport-Security` header, which
is the one meaningful header a meta tag cannot provide.

### 2. Point the DNS at GitHub

`public/CNAME` already contains the domain. At the registrar, add:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
AAAA  @    2606:50c0:8000::153
AAAA  @    2606:50c0:8001::153
AAAA  @    2606:50c0:8002::153
AAAA  @    2606:50c0:8003::153
CNAME www  kinjalumass.github.io.
```

### 3. Verify the domain in Google Search Console

Then submit `https://kinjalpandey.com/sitemap.xml`. Indexing a new domain
otherwise takes weeks; submitting the sitemap takes it down to days.

---

## Images

**No website can prevent an image being copied.** The browser has to receive
the file to draw it, so it is always in the cache and always one screenshot
away. Anything claiming otherwise is wrong.

Two things are in place instead:

**Deterrents** (`src/app/core/image-guard.ts`) — the context menu and
drag-to-desktop are blocked on images only. Right-click still works everywhere
else, because breaking it site-wide annoys the recruiters and casting
directors this site exists for.

**An invisible watermark** (`tools/watermark.py`) — every photograph carries a
traceable mark. Measured survival, from `python3 tools/watermark.py test`:

| Attack | Detection z-score | Result |
|---|---|---|
| Untouched | 19.3 | recovered |
| Re-saved at JPEG q75 | 17.9 | recovered |
| Re-saved at JPEG q60 | 17.9 | recovered |
| Downscaled 50% (screenshot) | 16.8 | recovered |
| Downscaled 75% | 18.0 | recovered |
| Centre crop to 70% | 12.3 | recovered |
| Corner crop to 70% | 8.2 | **lost** |

Unmarked photographs score 3.2 at most, against a threshold of 12 — so a match
is evidence, not a coincidence. A heavy corner crop defeats it, and so would a
deliberate attack by anyone who has read that file.

**Amplitude is chosen per image.** A flat backdrop carries the mark at low
amplitude; a busy frame — a laid table, a crowd, foliage — buries it. A fixed
amplitude left 21 of 62 photographs below the threshold, so `embed` now
measures each image and steps the amplitude up until it reads back cleanly.
All 62 currently audit above threshold, at a mean pixel change of under 4
levels.

Two commands worth running after adding photographs:

```
python3 tools/watermark.py audit       # z-score for every marked image
python3 tools/watermark.py reinforce   # strengthen any that fall short
```

To identify a suspect copy:

```
python3 tools/watermark.py verify path/to/suspect.jpg
```

---

## Privacy

**Every photograph is tone-corrected before publication.** `tools/enhance.py`
does white balance, levels, shadow/highlight, local contrast, vibrance,
denoise and sharpening — each measured against the image rather than applied
flat. `tools/rebuild-photos.py` maps every published file back to its
original and is the only correct way to re-run it: correction changes pixels,
which destroys the watermark, so the order must always be

    original -> enhance -> resize -> watermark -> face-focus

Correcting a published file in place would leave a photograph that is no
longer traceable.

**EXIF is stripped from every photograph.** The camera originals carried GPS
coordinates; publishing them would have put shoot locations on the open web.
Both `tools/import-photos.py` and the watermark step re-encode without
metadata.

`public/docs/` is disallowed in `robots.txt` — transcripts and certificates
should not appear in search results. Note what that is and isn't: it is a
request that major crawlers honour, **not access control**. Anyone with the URL
can still open the file. If a document genuinely must stay private, do not
publish it.

Certificate **thumbnails** live in `public/img/certs/` and are indexable; the
**documents** live in `public/docs/certificates/` and are not. That split is
deliberate — a preview showing the award is good for search, the full document
with its certificate number is not.

**No placeholder documents ship any more.** The 18 stub files that used to
stand in for certificates, transcripts and gallery photos have been deleted,
along with every link that pointed at them — a link opening a page that reads
"PLACEHOLDER" is worse than no link.

If you later obtain any of these, add the file and restore its reference:

```
transcripts        UMass, Virginia Tech  (redact the student ID first)
VT certificates    diploma, Dean's List, Research Excellence, Career Bridge
scholarships       Buzz's Bunch, Student Affairs, Pell Initiative
ambassadorships    Microsoft Learn, IBM Z, Google DSC
other              CodSoft internship, CCI research
event photos       hackathon, presenting, research, workshop
```

---

## GitHub Pages specifics

Two files exist purely to stop Pages misbehaving, and both are easy to lose:

- **`public/.nojekyll`** — without it, Pages runs the output through Jekyll,
  which silently drops any file or folder whose name begins with an underscore.
  Angular does not currently emit any, but a future build could.
- **`public/404.html`** — Pages serves this for any unmatched path. Every real
  route is prerendered to its own directory, so this only catches genuine
  typos, and it links back into the site rather than dead-ending.

Publish **`dist/portfolio/browser/`** — note the extra `browser/` segment,
which prerendering introduced. A workflow pointing at `dist/portfolio` will
deploy an empty site.

---

## Dependencies

`npm audit` reports **0 vulnerabilities**, production and dev. Worth re-running
before each deploy — it takes seconds.

The site loads exactly one third-party resource: Google Fonts, which is
pinned in the CSP to `fonts.googleapis.com` and `fonts.gstatic.com`. No
analytics, no trackers, no ad scripts.
