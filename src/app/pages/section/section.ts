import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PANELS, Panel } from '../../data/panels';

@Component({
  selector: 'app-section',
  imports: [RouterLink],
  templateUrl: './section.html',
  styleUrl: './section.scss',
})
export class Section {
  private readonly router = inject(Router);

  /** Bound from the `:id` route param via withComponentInputBinding(). */
  readonly id = input.required<string>();

  protected readonly panel = computed<Panel | undefined>(() =>
    PANELS.find((p) => p.id === this.id()),
  );

  /** The other two sections, for the footer pager. */
  protected readonly siblings = computed<Panel[]>(() =>
    PANELS.filter((p) => p.id !== this.id()),
  );

  protected readonly ready = signal(false);

  constructor() {
    // Unknown slug: fall back to the landing page.
    effect(() => {
      if (!this.panel()) void this.router.navigate(['/'], { replaceUrl: true });
    });

    // Re-trigger the entrance animation whenever the section changes.
    effect(() => {
      this.id();
      this.ready.set(false);
      requestAnimationFrame(() => requestAnimationFrame(() => this.ready.set(true)));
    });
  }
}
