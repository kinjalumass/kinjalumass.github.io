# Going live

Two websites are built from this one repository.

| Site | Domain | Registrar | Built by | Served from |
|---|---|---|---|---|
| The portfolio | `kinjalpandey.com` | Namecheap | `npm run build` | this repo |
| Kinnovation | `kinnovationgroup.com` | GoDaddy | `npm run build:kinnovation` | a second repo |

They need two repositories because **GitHub Pages allows exactly one custom
domain per repository.** There is no setting that lifts this; the second site
must live somewhere else. The content still comes from here, so you only ever
edit one codebase.

Total time: about 40 minutes of work, then up to 24 hours of waiting for DNS.

---

## 0. Check the build on your own machine first

```powershell
cd C:\Users\Rishav\Documents\GitHub\kinjalumass.github.io
npm install
npm run build
```

You should see `Prerendered 17 static routes.` and a new `dist\portfolio\browser`
folder. That folder *is* the website — 17 real HTML pages, one per URL, plus
`CNAME`, `404.html`, `.nojekyll`, `robots.txt` and `sitemap.xml`.

Then the second site:

```powershell
npm run build:all
```

Each build now ends with two checks. The portfolio finishes with:

```
  CSP hashes   17 pages updated
  Checked 19 HTML files in dist/portfolio/browser
  No CSP violations. Every inline script is hash-allowed; nothing is silently blocked.
```

and Kinnovation with:

```
  CNAME        kinnovationgroup.com
  sitemap.xml  7 URLs
  pruned       docs, model, certs, logos, tiles, resume
  size         5.3 MB
  CSP hashes   7 pages updated
  No CSP violations. Every inline script is hash-allowed; nothing is silently blocked.
```

That CSP check is not decoration. The policy lives in a `<meta>` tag, so
nothing at build time knows about it and a violation never fails the build. It
fails in the browser instead, silently, and the page just looks broken. That is
exactly what happened once already: Angular deferred the global stylesheet with
an inline `onload` handler, the CSP blocked it, the stylesheet never applied,
and every page rendered with component styles only. `tools/check-dist.mjs` now
fails the build rather than letting that reach a domain.

If you do not see those four lines, the second site is **not** finished, and
its `dist/kinnovation/browser/CNAME` still says `kinjalpandey.com`. Check it
before deploying:

```powershell
Get-Content dist\kinnovation\browser\CNAME
```

If both succeed, everything below is configuration. If either fails, stop and
fix it here — you cannot debug it faster on GitHub.

To look at the built site before publishing:

```powershell
npx http-server dist\portfolio\browser -p 4300 -a 127.0.0.1
```

and open `http://127.0.0.1:4300`.

**Use that address, not the LAN one.** Without `-a 127.0.0.1`, http-server also
prints something like `http://10.0.0.28:4300`, and the site renders wrongly
there. The CSP ends with `upgrade-insecure-requests`, which tells the browser
to fetch every asset over HTTPS. Browsers exempt `localhost` and `127.0.0.1`
because those origins are already treated as trustworthy, but they enforce it
on any other host over plain HTTP, so assets get requested over `https://` from
a server with no TLS and fail.

That is the policy working correctly, not a fault. In production everything is
already HTTPS, so the directive costs nothing there. Previewing over a LAN IP
or through an editor's built-in preview pane is not a meaningful test of this
site; use a real browser on 127.0.0.1.

---

## 1. Push, and switch how Pages builds

The repository already exists and `origin` already points at
`https://github.com/kinjalumass/kinjalumass.github.io.git`, so there is nothing
to create. The name is right too: a repo called `<username>.github.io` is your
*user site* and is served from the root of the domain, which is what every
absolute path on this site assumes.

### 1a. Push

```powershell
cd C:\Users\Rishav\Documents\GitHub\kinjalumass.github.io
git add .
git commit -m "Rebuild: venture copy, single-image rule, dual-site deploy"
git push
```

Confirm the repo is **public** first (Settings → General → bottom of the page).
Pages needs that on a free account.

### 1b. Change the Pages source

This is the step that actually matters. Earlier commits in this repo have
messages like *"Build to docs/"* and *"Deploy portfolio build"*, which means
Pages is currently set to **Deploy from a branch**, serving pre-built files
that were committed by hand. That is no longer how this works: a workflow now
compiles the site on GitHub every time you push, and there is no `docs/` folder
in the repo any more.

Repo → **Settings** → **Pages** → **Build and deployment** → **Source**:
change it to **GitHub Actions**.

If you leave it on "Deploy from a branch" it will look for files that are not
there and serve a 404 for the whole site.

### 1c. Watch it build

**Actions** tab → "Deploy kinjalpandey.com" should be running. Two to three
minutes. When it goes green the site is live at `https://kinjalumass.github.io`.
Check it there before touching any DNS, because if something is wrong you want
to find out now rather than while you are also debugging nameservers.

Every push to `main` redeploys from here on.

---

## 2. Point kinjalpandey.com at it (Namecheap)

Namecheap → **Domain List** → **Manage** next to kinjalpandey.com →
**Advanced DNS**.

Delete the parking records Namecheap adds by default: any `CNAME Record` for
`www` pointing at `parkingpage.namecheap.com`, and any `URL Redirect Record`.
Leave your email records (MX, and TXT records mentioning `spf` or `dkim`)
alone — deleting those stops your mail.

Then **Add New Record** eight times:

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| AAAA Record | `@` | `2606:50c0:8000::153` | Automatic |
| AAAA Record | `@` | `2606:50c0:8001::153` | Automatic |
| AAAA Record | `@` | `2606:50c0:8002::153` | Automatic |
| AAAA Record | `@` | `2606:50c0:8003::153` | Automatic |

and one more:

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME Record | `www` | `kinjalumass.github.io.` | Automatic |

The trailing dot on the CNAME value matters. Without it some DNS panels append
your own domain and you end up pointing at
`kinjalumass.github.io.kinjalpandey.com`.

Four A records rather than one is deliberate — they are four separate GitHub
edge servers, and listing all four means the site stays up when one is down.

### 2a. Tell GitHub the domain

Repo → **Settings** → **Pages** → **Custom domain** → type
`kinjalpandey.com` → **Save**.

GitHub runs a DNS check. It may fail for the first hour or so while the records
propagate; that is normal, not a mistake on your part. Re-check with:

```powershell
nslookup kinjalpandey.com
```

When it returns the four `185.199.*` addresses, GitHub will accept it.

### 2b. HTTPS

Once the domain verifies, a checkbox appears: **Enforce HTTPS**. It stays greyed
out for up to 24 hours while Let's Encrypt issues the certificate. **Tick it as
soon as it becomes available.** Until you do, the site serves over plain HTTP
and browsers show "Not secure" — and several of the site's protections
(HSTS, the strict referrer policy) only apply over HTTPS.

`www.kinjalpandey.com` will redirect to `kinjalpandey.com` automatically. That
is the direction the site is built for: every canonical URL, the sitemap and the
structured data all use the bare domain, so search engines see one address
instead of two.

---

## 3. The Kinnovation site (kinnovationgroup.com)

### 3a. Create the second repository

New repository on GitHub: **`kinnovationgroup`**, public, empty.

Nothing gets edited there. It is a delivery target — the built HTML is pushed
into its `gh-pages` branch by the workflow in this repo.

### 3b. Give this repo permission to push to it

The workflow needs a key. In PowerShell:

```powershell
ssh-keygen -t ed25519 -C "kinnovation-deploy" -f $env:USERPROFILE\.ssh\kinnovation_deploy -N '""'
```

That writes two files. Now:

**The public half** → `kinnovation_deploy.pub`

```powershell
Get-Content $env:USERPROFILE\.ssh\kinnovation_deploy.pub | clip
```

Go to the **kinnovationgroup** repo → **Settings** → **Deploy keys** → **Add
deploy key**. Title `Deploy from portfolio`, paste, and **tick "Allow write
access"**. Save.

**The private half** → `kinnovation_deploy` (no extension)

```powershell
Get-Content $env:USERPROFILE\.ssh\kinnovation_deploy | clip
```

Go to **this** repo (`kinjalumass.github.io`) → **Settings** → **Secrets and
variables** → **Actions** → **New repository secret**. Name it exactly
`KINNOVATION_DEPLOY_KEY`, paste, save.

The name must match `.github/workflows/deploy-kinnovation.yml` character for
character. Paste the whole thing including the `-----BEGIN` and `-----END`
lines.

### 3c. Run it

Push any commit, or go to **Actions** → **Deploy kinnovationgroup.com** →
**Run workflow**. When it finishes, the `kinnovationgroup` repo has a
`gh-pages` branch with the built site in it.

Then in the **kinnovationgroup** repo → **Settings** → **Pages** → Source:
**Deploy from a branch** → Branch: **gh-pages** / **(root)** → Save.

Branch deployment is right here — the branch already contains built HTML, not
source.

### 3d. GoDaddy DNS

GoDaddy → **My Products** → kinnovationgroup.com → **DNS** → **Manage Zones**.

Delete GoDaddy's parked records: the `A` record for `@` pointing at a
`Parked` IP, and the `CNAME` for `www` pointing at
`kinnovationgroup.com` or a GoDaddy host. Leave MX and any TXT records.

Add the same nine records as in step 2, with one difference — the `www` CNAME
still points at `kinjalumass.github.io.`, because that is the *account* host,
not the repo. GitHub works out which repo from the `Host` header.

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `kinjalumass.github.io.` |

GoDaddy's editor sometimes refuses to save four A records with the same name.
If it does, save them one at a time; if it still refuses, three is enough to
work.

Then **Settings** → **Pages** in the kinnovationgroup repo: custom domain
`kinnovationgroup.com`, save, and tick **Enforce HTTPS** when it lights up.

---

## 4. What the two sites share, and why it doesn't hurt you

The six venture pages exist on both domains:

```
kinjalpandey.com/entrepreneur/calendai
kinnovationgroup.com/calendai
```

Left alone, search engines would treat those as duplicates and split the
ranking between them. So every entrepreneur page on the portfolio carries a
canonical tag pointing at the Kinnovation copy:

```html
<link rel="canonical" href="https://kinnovationgroup.com/calendai">
```

That tells Google: *rank the Kinnovation URL; credit both.* The portfolio's
authority flows into the venture site rather than competing with it, which is
what you want — someone searching "Kinnovation" should land on
kinnovationgroup.com, and someone searching your name should land on
kinjalpandey.com.

The Kinnovation site's structured data names you as founder and links back to
`kinjalpandey.com/#kinjal`, and the portfolio's `sameAs` list includes
kinnovationgroup.com. Google reads those two as one entity, so a search for
your name can surface both.

---

## 5. After it's live

**Google Search Console** — search.google.com/search-console. Add both domains
as *Domain* properties (verified by a TXT record at your registrar, which
covers every subdomain at once). Then **Sitemaps** → submit:

```
https://kinjalpandey.com/sitemap.xml
https://kinnovationgroup.com/sitemap.xml
```

Then **URL Inspection** on `https://kinjalpandey.com/` → **Request indexing**.
Without this, first indexing can take weeks; with it, usually days.

**Bing Webmaster Tools** — bing.com/webmasters lets you import straight from
Search Console. Worth the two minutes; it also feeds DuckDuckGo.

**Ranking for your name** is mostly about corroboration, not about the site.
The single highest-value action is putting `kinjalpandey.com` in the website
field of your LinkedIn, GitHub, Instagram and any modelling profiles. Those are
the `sameAs` links the site already claims; when the claim is reciprocated,
Google treats the set as one verified person.

---

## Turning on the contact form

The form on the contact page works today: it composes the message and hands it
to the visitor's email app. To make it send in place without leaving the site,
connect EmailJS. Free for 200 emails a month, about ten minutes.

1. Sign up at <https://www.emailjs.com> and add an Email Service. Gmail works;
   connect `kinjalpandey18@gmail.com`. Copy the **Service ID**.
2. Create an Email Template. Use exactly these variables, because they are what
   the form sends: `{{from_name}}`, `{{from_email}}`, `{{subject}}`,
   `{{message}}`. Set the template's **Reply To** to `{{from_email}}` so
   replying reaches the sender. Copy the **Template ID**.
3. Account then General: copy the **Public Key**.
4. Account then Security: turn **off** "Allow EmailJS API for non-browser
   applications", and add `kinjalpandey.com` to the allowed origins. That is
   what stops anyone reusing these IDs from another site.
5. Paste all three into `src/app/data/emailjs.config.ts`, then commit and push.

The public key is meant to be public, so committing it is fine. The domain
restriction in step 4 is what actually protects it, and `api.emailjs.com` is
already allowlisted in the site's CSP.


## Making changes from here

```powershell
git add .
git commit -m "what changed"
git push
```

Both workflows run on every push to `main`, so both sites update. Two to four
minutes.

**Photographs.** Never edit a published file in `public/img` directly — it
carries an invisible watermark that any tonal change destroys. The pipeline is
`original → enhance → resize → watermark`, and `tools/rebuild-photos.py` knows
which original becomes which published path. See `PHOTOS.md`.

**Résumés.** `public/resume/*.pdf` are still 2.5 KB placeholders. Overwrite
them with the real PDFs under the same three filenames and push; nothing else
needs to change.

---

## When something is wrong

**404 on every page, or raw markdown showing** — Pages source is set to "Deploy
from a branch" on the main repo. It must be "GitHub Actions".

**"Domain does not resolve to the GitHub Pages server"** — DNS hasn't
propagated. Check with `nslookup kinjalpandey.com`; wait and press the re-check
button. This can take a few hours and is not something you can hurry.

**Enforce HTTPS stays greyed out** — the certificate is still being issued.
If it is still grey after 24 hours, remove the custom domain, save, re-add it,
save. That restarts the request.

**Site loads but images 404** — the repo is not named `kinjalumass.github.io`,
so the site is being served from a subfolder. Rename the repo.

**Workflow fails on `npm ci`** — `package-lock.json` is out of step with
`package.json`. Run `npm install` locally, commit the updated lock file.

**Kinnovation workflow fails with a permission error** — the deploy key is
missing, was pasted incompletely, or was added without "Allow write access".
Regenerate and redo step 3b.

**A change doesn't show up** — check the **Actions** tab first; a red run means
it never deployed. If the run is green, it's your browser cache: Ctrl+F5.
