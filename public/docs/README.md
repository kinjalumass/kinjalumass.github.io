# Documents

Transcripts and certificates. Every file here is a **placeholder** — replace it
with the real document, keep the filename, and the site picks it up with no
code change.

## Read this before uploading a transcript

GitHub Pages has no access control. `robots.txt` asks search engines not to
index this folder, and the site never renders a direct link to a transcript —
but **anyone who has or guesses the URL can open the file.** There is no way to
password-protect it on free static hosting.

So: **redact before uploading.** Black out the student ID, date of birth,
address, and anything else you would not put on a public page. A redacted
transcript still shows coursework and grades, which is what a recruiter wants.

If that is not acceptable for a document, do not put it here. Send it directly
instead, and let the Contact page carry the request.

## Transcripts — `docs/transcripts/`

| File | Where it appears |
|---|---|
| `umass-transcript.pdf` | Education → UMass Amherst → View transcript |
| `vt-transcript.pdf` | Education → Virginia Tech → View transcript |

These open in the in-page viewer with no open-in-new-tab or download button,
because they are marked `shareable: false` in `src/app/data/profile.ts`.

## Certificates — `docs/certificates/`

| File | Where it appears |
|---|---|
| `vt-diploma.pdf` | Education → Virginia Tech |
| `vt-deans-list.pdf` | Education → Virginia Tech · Honors |
| `research-excellence.pdf` | Education → Virginia Tech · Honors |
| `vt-career-bridge.pdf` | Education → Virginia Tech |
| `microsoft-learn-ambassador.pdf` | Experience → Microsoft · Projects |
| `ibm-z-ambassador.pdf` | Experience → IBM · Projects |
| `google-dsc-lead.pdf` | Experience → Google DSC · Projects |
| `codsoft-internship.pdf` | Experience → CodSoft |
| `cci-research.pdf` | Experience → CCI · Projects |
| `buzz-bunch-scholarship.pdf` | Honors |
| `student-affairs-scholarship.pdf` | Honors |
| `pell-initiative-grant.pdf` | Honors |

Certificates **do** get an open-in-new-tab link, since they contain nothing
sensitive. If a certificate does show something you would rather keep off the
open web, set `shareable: false` on it in `src/app/data/profile.ts`.

Images work here too — use `photo('filename', 'Title')` instead of
`cert(...)` and put the JPG in `public/img/gallery/`.

## Adding a document to something new

In `src/app/data/profile.ts`, add an `assets` array to any role, project, or
honor:

```ts
assets: [
  cert('my-certificate', 'Certificate title', 'Optional caption'),
  photo('my-photo', 'Photo title'),
],
```

`cert()` resolves to `docs/certificates/<name>.pdf` and `photo()` to
`img/gallery/<name>.jpg`.
