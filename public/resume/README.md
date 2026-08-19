# Resume PDFs

All three files here are currently **the same PDF** (the CI/COMP resume,
Aug 2026). They are real and correct to hand out, but they are not yet tailored
per track. Replace any of them with a tailored version, keeping the exact same
filename, and the site picks it up with no code changes.

Note that `src/app/data/resume.ts` describes them as research-weighted,
build-weighted and analysis-weighted. That is what they will be, not what they
are today. Either swap in the tailored files or soften those three `note`
strings.

| File | Tab on the site |
|---|---|
| `kinjal-pandey-ai-ml.pdf` | AI / ML |
| `kinjal-pandey-software-engineering.pdf` | Software Engineering |
| `kinjal-pandey-data-science.pdf` | Data Science / Analytics |

Notes:

- Keep each PDF under ~2 MB so the inline preview loads quickly.
- Filenames are lowercase with hyphens. Case matters on GitHub Pages — a file
  saved as `Kinjal-Pandey-AI-ML.pdf` will 404 even though it looks right locally.
- The name a visitor gets when they hit Download is set separately in
  `src/app/data/resume.ts` (the `download` field), so the file on disk can stay
  lowercase while the downloaded copy is nicely capitalised.
- To add a fourth version, drop the PDF here and add an entry to
  `src/app/data/resume.ts`.
