# Resume PDFs

The three files here are **placeholders**. Replace each with your real resume,
keeping the exact same filename, and the site picks it up with no code changes.

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
