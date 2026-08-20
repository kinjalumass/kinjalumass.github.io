/**
 * Shared chunk shape.
 *
 * Split out of `corpus.ts` so `kb.ts` can be typed without importing the
 * corpus itself, which imports `kb.ts` back and would make a cycle.
 */
export interface Chunk {
  id: string;
  /** Shown as a source chip under the answer */
  title: string;
  /** Extra terms that should pull this chunk in */
  tags: string[];
  text: string;
}
