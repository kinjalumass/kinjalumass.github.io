# Assistant endpoint

The site is static and lives on GitHub Pages, which cannot keep a secret — any
API key placed in the frontend is readable by anyone. So the assistant's model
call happens here instead, in a tiny Cloudflare Worker.

It uses **Workers AI**, which means the Worker calls the model directly on
Cloudflare's own infrastructure. There is no third-party API key involved at
all — not in this folder, not in the site.

**Cost: free.** The Workers Free plan includes 10,000 Neurons per day, resetting
at 00:00 UTC, and no credit card is required. A card is only needed if you ever
want to exceed that. For a portfolio assistant, 10,000/day is far more than you
will use.

## Deploy it — about ten minutes, once

1. **Make a Cloudflare account** at <https://dash.cloudflare.com/sign-up>. Free
   plan, no card.

2. **Install Wrangler and log in.** From this folder:

   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Deploy.**

   ```bash
   cd worker
   wrangler deploy
   ```

   Wrangler prints a URL like
   `https://kinjal-assistant.<your-subdomain>.workers.dev`.

4. **Point the site at it.** Open `src/app/data/assistant.config.ts` and paste
   that URL into `endpoint`. Commit and push — GitHub Actions redeploys the
   site, and the assistant switches from offline mode to the live model on its
   own.

## Things worth knowing

**Nothing breaks if this is never deployed.** With `endpoint` left empty, the
site falls back to the local keyword assistant that shipped before. Same if the
Worker is down, or the daily allocation runs out — the visitor gets an answer
either way, just a simpler one.

**The origin allowlist** is in `src/index.js` under `ALLOWED`. It already covers
`https://kinjalumass.github.io` and localhost for development. Add any custom
domain there if you move off the github.io address.

**Rate limiting** is 12 questions per minute per IP, set in `wrangler.toml`.
That stops one visitor — or a script — from spending the daily allocation in a
burst. If the binding is unavailable on your account the Worker simply skips it
and keeps working.

**The model** is `@cf/meta/llama-3.1-8b-instruct`, set at the top of
`src/index.js`. Cloudflare's model catalogue changes; if you want a different
one, that constant is the only thing to edit.

## How grounding works

The browser holds a corpus built from the same data that renders the site
(`src/app/data/corpus.ts`). When a question is asked, the page scores that
corpus, picks the handful of most relevant passages, and sends them along with
the question. The Worker's system prompt instructs the model to answer *only*
from those passages and to say so when they don't cover the question.

This is why the assistant is not "trained" on anything. Nothing needs
retraining — edit `profile.ts`, `developer.ts` or `ventures.ts` and the
assistant's knowledge changes on the next deploy.

It also means the model cannot invent an employer or a date, because the only
facts in front of it are the ones the site already publishes.
