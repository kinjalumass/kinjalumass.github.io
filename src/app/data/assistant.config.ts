/**
 * Where the assistant sends questions.
 *
 * Leave `endpoint` empty and the site uses its built-in offline assistant —
 * keyword retrieval over the same profile, no network involved. Everything
 * keeps working, answers are just simpler.
 *
 * To switch on the live model, deploy the Worker in `/worker` (see its README,
 * roughly ten minutes and free), then paste the URL Wrangler prints here.
 *
 * Example:
 *   endpoint: 'https://kinjal-assistant.kinjal.workers.dev',
 */
export const ASSISTANT = {
  endpoint: 'https://kinjal-assistant.kinjalpandey.workers.dev',

  /** How many profile passages to send as grounding context. */
  passages: 6,

  /** Give up on the endpoint after this long and answer locally instead. */
  timeoutMs: 20000,
};
