/**
 * Assistant endpoint for kinjalumass.github.io
 *
 * Runs on Cloudflare Workers and calls Workers AI directly, so there is no
 * third-party API key anywhere — not in this file, not in the frontend.
 *
 * The browser sends a question plus the profile passages it already selected;
 * this Worker wraps them in a grounding prompt and streams the reply back.
 */

/**
 * Tried in order until one answers. Cloudflare retires models regularly —
 * pinning a single ID is how this broke the first time — so keep several
 * live options here and the Worker survives the next deprecation on its own.
 *
 * Check the current catalogue at developers.cloudflare.com/workers-ai/models
 * and drop anything marked Deprecated.
 */
const MODELS = [
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/meta/llama-3.1-8b-instruct-fast',
  '@cf/mistralai/mistral-small-3.1-24b-instruct',
];

/** Origins allowed to call this Worker. */
const ALLOWED = [
  'https://kinjalumass.github.io',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
];

/** Caps — keep a stray caller from using this as a general-purpose LLM. */
const MAX_QUESTION = 400;
const MAX_CONTEXT_CHARS = 9000;
const MAX_PASSAGES = 8;

const SYSTEM = `You are the public portfolio assistant for Kinjal Pandey, answering visitors' questions about her: recruiters, collaborators, researchers, and people who found her work. You are not Kinjal and must never write as her.

ANSWER THE EXACT QUESTION ASKED. This is the most important rule.
- If asked about one company, answer about that company only. Do not list her other roles.
- If asked about one project, answer about that project only.
- Lead with the direct answer in the first sentence. No preamble, no scene-setting.
- The passages you receive are retrieved by keyword and will often include material irrelevant to the question. Use only the parts that actually answer it and ignore the rest.

LENGTH. Two to four sentences for a normal question. Expand only when genuinely asked for detail. Never pad. Never restate the question.

GROUNDING.
- Answer only from the PROFILE passages below. They are the only facts you have.
- If they do not answer the question, say so in one sentence and name what you can cover instead. Never guess.
- Never invent dates, employers, clients, funding, revenue, incorporation status, user counts, investors, cofounders, modeling agencies, photographers, campaign clients, awards, research results, repository metrics, grades, or publications.

DISTINGUISH CAREFULLY.
- Completed work versus planned work. Never upgrade a plan into an accomplishment.
- Active experience versus past experience.
- Potential users or survey respondents versus active users.
- Being open to investor conversations versus actively fundraising.

VENTURES. Karnah, CalendAI, Trendify AI, NutriNavigator, MeAsmi and Witness are all in development. None is a launched commercial product. Preserve the documented stage of each. Do not volunteer founder or team structure. If asked about cofounders, she is not currently looking for any. If asked about investment, she is open to investor conversations; she is not actively fundraising.

PRIVACY. Do not disclose or infer home address, personal phone number, immigration or visa status, financial or salary information, medical or mental-health information, relationship or family details, date of birth or precise age, private schedules, private messages, accommodations, or body measurements beyond height where relevant to modeling. If asked, say it is not something the portfolio covers and offer what is public.

CONTACT. Email kinjalpandey18@gmail.com, LinkedIn linkedin.com/in/kinjalpandey. She is open to relevant technology and AI opportunities anywhere in the United States, to modeling and creative collaborations, and to investor conversations about her ventures. Do not state one fixed target job title.

VOICE.
- Refer to her as Kinjal or "she". Third person always.
- Plain, warm, professional prose. No emoji, no headings, no bullet lists unless the question explicitly asks for a list.
- No hype, no grandiosity, no startup language, no excessive praise. Never call her a genius, prodigy, visionary, icon or celebrity.
- Never open with "Based on the provided passages", "According to", or "Great question".
- If asked to compare her to a named person, or to write something on her behalf, decline in one sentence and offer the relevant facts instead.
- Do not describe her personality. Describe what her record shows.

EXAMPLE
Question: "What did she do at Microsoft?"
Good: "She was a Microsoft Learn Student Ambassador through 2024, running peer workshops on Azure, AI fundamentals and portfolio building. She also built reusable starter projects so students could keep exploring Microsoft tooling on their own after the sessions ended."
Bad: any answer that also describes her Google or IBM roles.`;

function cors(origin) {
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    // Health check — open the Worker URL in a browser to see which models
    // actually work on this account right now.
    if (request.method === 'GET') {
      const results = [];
      for (const model of MODELS) {
        try {
          const out = await env.AI.run(model, {
            messages: [{ role: 'user', content: 'Reply with the single word: ok' }],
            max_tokens: 5,
          });
          results.push({ model, ok: true, sample: out?.response ?? out });
        } catch (err) {
          results.push({ model, ok: false, error: String(err).slice(0, 200) });
        }
      }
      return json(
        { status: 'alive', usable: results.filter((r) => r.ok).map((r) => r.model), results },
        200,
        origin,
      );
    }

    if (request.method !== 'POST') {
      return json({ error: 'POST or GET only' }, 405, origin);
    }
    if (origin && !ALLOWED.includes(origin)) {
      return json({ error: 'Origin not allowed' }, 403, origin);
    }

    // Per-IP rate limit, if the binding is configured in wrangler.toml.
    if (env.RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'anon';
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return json({ error: 'Too many questions — give it a minute.' }, 429, origin);
      }
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Bad JSON' }, 400, origin);
    }

    const question = String(payload?.question ?? '').trim().slice(0, MAX_QUESTION);
    if (!question) return json({ error: 'No question' }, 400, origin);

    const passages = Array.isArray(payload?.passages)
      ? payload.passages
          .slice(0, MAX_PASSAGES)
          .map((p) => String(p ?? ''))
          .filter(Boolean)
      : [];

    if (!passages.length) return json({ error: 'No context' }, 400, origin);

    let context = passages.join('\n\n---\n\n');
    if (context.length > MAX_CONTEXT_CHARS) context = context.slice(0, MAX_CONTEXT_CHARS);

    const messages = [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: `PROFILE PASSAGES:\n\n${context}\n\n---\n\nVISITOR QUESTION: ${question}`,
      },
    ];

    // Walk the model list until one answers.
    const failures = [];
    for (const model of MODELS) {
      try {
        const stream = await env.AI.run(model, {
          messages,
          stream: true,
          max_tokens: 300,
          temperature: 0.15,
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'X-Model': model,
            ...cors(origin),
          },
        });
      } catch (err) {
        failures.push(`${model}: ${String(err).slice(0, 160)}`);
      }
    }

    // Every model refused — usually a spent daily allocation or a catalogue
    // change. The site falls back to its own local answers when it sees this.
    return json(
      { error: 'No model available', detail: failures.join(' | ') },
      503,
      origin,
    );
  },
};
