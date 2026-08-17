/**
 * Assistant endpoint for kinjalumass.github.io
 *
 * Runs on Cloudflare Workers and calls Workers AI directly, so there is no
 * third-party API key anywhere — not in this file, not in the frontend.
 *
 * The browser sends a question plus the profile passages it already selected;
 * this Worker wraps them in a grounding prompt and streams the reply back.
 */

const MODEL = '@cf/meta/llama-3.1-8b-instruct';

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

const SYSTEM = `You are the assistant on Kinjal Pandey's personal website. You answer questions about Kinjal for visitors — recruiters, collaborators, and people who found her work.

Rules, in order of importance:
1. Answer ONLY from the PROFILE passages provided in the user message. They are the complete truth available to you.
2. If the passages do not contain the answer, say so plainly and suggest what you can cover instead. Never guess, never fill gaps with plausible detail. Never invent an employer, a date, a grade, a technology, or a credential.
3. Do not speculate about anything personal that is not in the passages — age, relationships, salary, immigration status, health.
4. Refer to her as Kinjal or "she". Never speak as Kinjal in the first person.
5. Be concise: two or three short paragraphs at most, no headings, no bullet lists unless the question genuinely asks for a list.
6. Write in plain, warm, professional prose. No emoji. Do not open with "Based on the provided passages" — just answer.
7. If asked to compare her to someone, or to write something on her behalf, decline briefly and offer the facts instead.`;

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
    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405, origin);
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

    try {
      const stream = await env.AI.run(MODEL, {
        messages,
        stream: true,
        max_tokens: 420,
        temperature: 0.3,
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          ...cors(origin),
        },
      });
    } catch (err) {
      // Most likely the daily free allocation is spent. The site falls back
      // to its own local answers when it sees this.
      return json({ error: 'Model unavailable', detail: String(err) }, 503, origin);
    }
  },
};
