import {
  Component,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RESUME_DOCS } from '../../../data/resume';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume implements OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  protected readonly docs = RESUME_DOCS;

  /** Deep link support: /developer/resume?v=software */
  readonly v = input<string | undefined>(undefined);

  protected readonly activeId = signal(RESUME_DOCS[0].id);
  protected readonly active = computed(
    () => this.docs.find((d) => d.id === this.activeId()) ?? this.docs[0],
  );

  /** Cache-busted so a replaced PDF shows up without a hard refresh. */
  protected readonly src = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`${this.active().file}#view=FitH`),
  );

  protected readonly loading = signal(true);
  /** Inline embedding is unreliable on narrow/mobile viewports. */
  protected readonly canEmbed = signal(true);

  private resize?: () => void;

  constructor() {
    // Adopt the query param when it names a real variant.
    effect(() => {
      const requested = this.v();
      if (requested && this.docs.some((d) => d.id === requested)) {
        this.activeId.set(requested);
      }
    });

    // Reset the loading shade whenever the document changes.
    effect(() => {
      this.activeId();
      this.loading.set(true);
    });

    afterNextRender(() => {
      const check = () => this.canEmbed.set(window.innerWidth >= 760);
      check();
      this.resize = check;
      window.addEventListener('resize', check, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (this.resize && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resize);
    }
  }

  protected select(id: string): void {
    if (id === this.activeId()) return;
    this.activeId.set(id);
    void this.router.navigate([], {
      queryParams: { v: id },
      replaceUrl: true,
    });
  }

  protected onLoaded(): void {
    this.loading.set(false);
  }
}
