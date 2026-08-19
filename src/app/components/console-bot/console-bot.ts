import { Component, ElementRef, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ENTRIES, SUGGESTIONS } from '../../data/knowledge';
import { AssistantService } from './assistant.service';

interface Message {
  id: number;
  role: 'user' | 'bot' | 'system';
  text: string;
  /** Which profile sections the answer drew on */
  sources?: string[];
  /** Was this answered by the model or the offline fallback */
  mode?: 'live' | 'local';
  /** Set when the model was configured but unreachable */
  degraded?: string;
  streaming?: boolean;
}

@Component({
  selector: 'app-console-bot',
  imports: [FormsModule],
  templateUrl: './console-bot.html',
  styleUrl: './console-bot.scss',
})
export class ConsoleBot implements OnDestroy {
  private readonly logRef = viewChild<ElementRef<HTMLElement>>('log');
  private readonly assistant = inject(AssistantService);

  protected readonly messages = signal<Message[]>([]);
  protected readonly thinking = signal(false);
  protected readonly draft = signal('');
  protected readonly suggestions = SUGGESTIONS;
  protected readonly live = this.assistant.isLive;

  private nextId = 0;
  private timers: number[] = [];

  constructor() {
    this.push(
      'system',
      this.live
        ? 'Ask anything about Kinjal. Answers come from a model reading her profile — it will tell you when something is outside what it knows.'
        : 'Ask anything about Kinjal. Running offline against a written profile, so answers are brief and factual.',
    );
  }

  ngOnDestroy(): void {
    this.timers.forEach((t) => clearTimeout(t));
  }

  /* ---------------------------------------------------------------
     Input
     --------------------------------------------------------------- */

  protected async submit(event?: Event): Promise<void> {
    event?.preventDefault();
    const question = this.draft().trim();
    if (!question || this.thinking()) return;

    this.draft.set('');
    this.push('user', question);

    const command = question.toLowerCase().replace(/[^a-z]/g, '');
    if (command === 'clear' || command === 'cls') {
      this.messages.set([]);
      return;
    }
    if (command === 'help' || command === 'topics') {
      this.push('bot', ['Things I can cover:', ...ENTRIES.map((e) => `  · ${e.question}`)].join('\n'));
      return;
    }

    this.thinking.set(true);

    const id = this.nextId++;
    let started = false;

    const append = (text: string) => {
      if (!started) {
        started = true;
        this.thinking.set(false);
        this.messages.update((list) => [
          ...list,
          { id, role: 'bot', text: '', streaming: true },
        ]);
      }
      this.messages.update((list) =>
        list.map((m) => (m.id === id ? { ...m, text: m.text + text } : m)),
      );
      this.scroll();
    };

    try {
      const reply = await this.assistant.ask(question, append);
      this.messages.update((list) =>
        list.map((m) =>
          m.id === id
            ? {
                ...m,
                streaming: false,
                sources: reply.sources,
                mode: reply.mode,
                degraded: reply.degraded,
              }
            : m,
        ),
      );
    } catch {
      this.push('bot', 'Something went wrong reaching the assistant. Try again in a moment.');
    } finally {
      this.thinking.set(false);
      this.scroll();
    }
  }

  protected ask(question: string): void {
    if (this.thinking()) return;
    this.draft.set(question);
    void this.submit();
  }

  /* ---------------------------------------------------------------
     Output
     --------------------------------------------------------------- */

  private push(role: Message['role'], text: string): void {
    this.messages.update((list) => [...list, { id: this.nextId++, role, text }]);
    this.scroll();
  }

  private scroll(): void {
    // Not `window.setTimeout` — this runs during prerendering too, where the
    // global exists but `window` does not.
    const id = setTimeout(() => {
      const el = this.logRef()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 30);
    this.timers.push(id as unknown as number);
  }
}
