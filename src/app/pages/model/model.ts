import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { focusOf } from '../../data/focus';
import { BOOKING, DIGITALS, IDENTITY, SHOOTS, STATS } from '../../data/model';

interface Frame {
  src: string;
  caption: string;
}

/** How many frames of each shoot show before "show all". */
const VISIBLE = 4;

@Component({
  selector: 'app-model',
  imports: [RouterLink],
  templateUrl: './model.html',
  styleUrl: './model.scss',
  host: {
    '(document:keydown)': 'onKey($event)',
  },
})
export class Model implements OnDestroy {
  /** Injected so it also works while the page is prerendered in Node. */
  private readonly doc = inject(DOCUMENT);

  protected readonly id = IDENTITY;
  protected readonly stats = STATS;

  /** Keeps a cover-cropped tile centred on the face rather than the torso. */
  protected readonly focusOf = focusOf;
  protected readonly digitals = DIGITALS;
  protected readonly shoots = SHOOTS;
  protected readonly booking = BOOKING;
  protected readonly visible = VISIBLE;

  /* --- expanding galleries ------------------------------------------------ */

  private readonly opened = signal<ReadonlySet<string>>(new Set());

  protected isOpen(slug: string): boolean {
    return this.opened().has(slug);
  }

  protected toggle(slug: string): void {
    this.opened.update((set) => {
      const next = new Set(set);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  /** The frames to render for a shoot right now. */
  protected shown(slug: string, images: string[]): string[] {
    return this.isOpen(slug) ? images : images.slice(0, VISIBLE);
  }

  protected hidden(slug: string, images: string[]): number {
    return Math.max(0, images.length - VISIBLE);
  }

  /* --- lightbox ----------------------------------------------------------- */

  private readonly frames: Frame[] = [
    ...IDENTITY.hero.map((src) => ({ src, caption: 'Kinjal Pandey' })),
    ...DIGITALS.map((d) => ({ src: d.src, caption: `Digitals — ${d.label}` })),
    ...SHOOTS.flatMap((s) =>
      s.images.map((src, i) => ({ src, caption: `${s.title} — ${i + 1} of ${s.images.length}` })),
    ),
  ];

  protected readonly at = signal<number | null>(null);
  protected readonly lightboxOpen = computed(() => this.at() !== null);
  protected readonly frame = computed<Frame | null>(() => {
    const i = this.at();
    return i === null ? null : this.frames[i];
  });

  protected open(src: string): void {
    const i = this.frames.findIndex((f) => f.src === src);
    if (i === -1) return;
    this.at.set(i);
    this.doc.body.style.overflow = 'hidden';
  }

  protected close(): void {
    this.at.set(null);
    this.doc.body.style.overflow = '';
  }

  protected step(delta: number): void {
    this.at.update((i) => (i === null ? i : (i + delta + this.frames.length) % this.frames.length));
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  protected onKey(event: KeyboardEvent): void {
    if (!this.lightboxOpen()) return;
    if (event.key === 'Escape') { event.preventDefault(); this.close(); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); this.step(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); this.step(-1); }
  }

  /* --- booking ------------------------------------------------------------ */

  protected readonly copied = signal(false);
  private timer = 0;

  protected async copyEmail(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(this.booking.email);
      this.copied.set(true);
      clearTimeout(this.timer);
      this.timer = window.setTimeout(() => this.copied.set(false), 2000);
    } catch {
      window.location.href = `mailto:${this.booking.email}`;
    }
  }

  ngOnDestroy(): void {
    this.doc.body.style.overflow = '';
    clearTimeout(this.timer);
  }
}
