import { Injectable } from '@angular/core';
import { ASSISTANT } from '../../data/assistant.config';
import { Chunk, selectContext } from '../../data/corpus';
import { retrieve } from '../../data/knowledge';

export interface Reply {
  /** 'live' came from the model, 'local' from the built-in retrieval. */
  mode: 'live' | 'local';
  sources: string[];
}

/**
 * Talks to the assistant Worker, and falls back to the offline knowledge base
 * whenever that isn't possible — no endpoint configured, network down, daily
 * allocation spent, or a slow response.
 */
@Injectable({ providedIn: 'root' })
export class AssistantService {
  get isLive(): boolean {
    return !!ASSISTANT.endpoint;
  }

  /**
   * Streams an answer. `onToken` fires as text arrives; the promise resolves
   * once the reply is complete.
   */
  async ask(question: string, onToken: (text: string) => void): Promise<Reply> {
    const context = selectContext(question, ASSISTANT.passages);

    if (this.isLive) {
      try {
        return await this.askModel(question, context, onToken);
      } catch {
        // fall through to local
      }
    }
    return this.askLocal(question, onToken);
  }

  /* ---------------------------------------------------------------
     Live model
     --------------------------------------------------------------- */

  private async askModel(
    question: string,
    context: Chunk[],
    onToken: (text: string) => void,
  ): Promise<Reply> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ASSISTANT.timeoutMs);

    try {
      const response = await fetch(ASSISTANT.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          passages: context.map((c) => `${c.title}\n${c.text}`),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let produced = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Server-sent events: one `data: {...}` per line.
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const payload = trimmed.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            const text: string = parsed.response ?? parsed.delta?.content ?? '';
            if (text) {
              produced = true;
              onToken(text);
            }
          } catch {
            // partial JSON across chunk boundaries — wait for the rest
          }
        }
      }

      if (!produced) throw new Error('Empty response');

      return { mode: 'live', sources: context.map((c) => c.title) };
    } finally {
      clearTimeout(timer);
    }
  }

  /* ---------------------------------------------------------------
     Offline fallback
     --------------------------------------------------------------- */

  private async askLocal(question: string, onToken: (text: string) => void): Promise<Reply> {
    const match = retrieve(question);
    const lines = match
      ? match.entry.answer
      : [
          "That one isn't in my notes.",
          'Try asking about her research, education, current work, projects, technical stack, awards, or how to get in touch — or type `help` for the full list.',
        ];

    // Typed out so the offline path feels like the live one.
    for (let i = 0; i < lines.length; i++) {
      if (i) onToken('\n\n');
      const words = lines[i].split(' ');
      for (let w = 0; w < words.length; w++) {
        onToken(w ? ` ${words[w]}` : words[w]);
        await new Promise((r) => setTimeout(r, 14));
      }
    }

    return { mode: 'local', sources: match ? [match.entry.question] : [] };
  }
}
