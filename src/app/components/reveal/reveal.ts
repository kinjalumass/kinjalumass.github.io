import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Adds `.is-in` the first time the element scrolls into view, which triggers
 * the `.reveal` transition defined in styles/venture.scss.
 *
 * Usage: <div class="reveal" appReveal [revealDelay]="120">
 */
@Directive({
  selector: '[appReveal]',
})
export class Reveal implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Stagger in milliseconds */
  readonly revealDelay = input(0);

  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('is-in');
        return;
      }

      if (this.revealDelay()) {
        el.style.transitionDelay = `${this.revealDelay()}ms`;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            el.classList.add('is-in');
            this.observer?.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );

      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
