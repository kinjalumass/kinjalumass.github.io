/**
 * The paper. It lives on the projects page rather than in honors — it is work,
 * not an award, and a recruiter looking for research output looks under
 * projects.
 */

export interface Publication {
  title: string;
  subtitle: string;
  venue: string;
  arxivId: string;
  url: string;
  pdf: string;
  year: string;
  /** Author order as printed on the paper */
  authors: string[];
  /** The name to emphasise in that list */
  self: string;
  abstract: string;
  contributions: string[];
  topics: string[];
}

export const PUBLICATION: Publication = {
  title: 'Chain-of-Sanitized-Thoughts',
  subtitle: 'Plugging PII leakage in the chain-of-thought of large reasoning models',
  venue: 'arXiv preprint',
  arxivId: '2601.05076',
  url: 'https://arxiv.org/abs/2601.05076',
  pdf: 'https://arxiv.org/pdf/2601.05076',
  year: '2026',
  authors: [
    'Arghyadeep Das',
    'Sai Sreenivas Chintha',
    'Rishiraj Girmal',
    'Kinjal Pandey',
    'Sharvi Endait',
  ],
  self: 'Kinjal Pandey',
  abstract:
    'A reasoning model can answer carefully and still give the private data away in its working. The chain-of-thought is treated as scratch space, so it leaks the personal information the final answer was written to protect. This work sanitizes the reasoning trace itself, without breaking the reasoning that depends on it.',
  contributions: [
    'Contributed to PII-CoT-Bench, the benchmark used to measure how much personal information a reasoning trace exposes.',
    'The same question approached from the defense side that MediaTagger approaches from the attack side: what a model reveals about data it was never meant to repeat.',
  ],
  topics: ['Privacy', 'LLM reasoning', 'PII', 'Benchmarking'],
};
