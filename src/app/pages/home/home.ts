import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PANELS, Panel } from '../../data/panels';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class Home implements OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly router = inject(Router);

  protected readonly panels: Panel[] = PANELS;

  /** Panel currently under the pointer / keyboard focus. -1 = none. */
  protected readonly hovered = signal(-1);

  /** Flips true one frame after mount so the intro animation can run. */
  protected readonly ready = signal(false);

  private raf = 0;
  private cursor?: HTMLElement;
  private readonly target = { x: -100, y: -100 };
  private readonly current = { x: -100, y: -100 };
  private trackingBound = false;

  constructor() {
    afterNextRender(() => {
      requestAnimationFrame(() => this.ready.set(true));
      this.startCursor();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    if (this.trackingBound) {
      window.removeEventListener('pointermove', this.onWindowMove);
    }
  }

  /* ---------------------------------------------------------------
     Panel interaction
     --------------------------------------------------------------- */

  protected onEnter(index: number): void {
    this.hovered.set(index);
  }

  protected onLeave(index: number): void {
    if (this.hovered() === index) this.hovered.set(-1);
  }

  /**
   * Writes the pointer position into the panel as CSS custom properties so the
   * spotlight and parallax layers can react without triggering change detection.
   */
  protected onPanelMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
    el.style.setProperty('--px', `${((x - 0.5) * 2).toFixed(3)}`);
    el.style.setProperty('--py', `${((y - 0.5) * 2).toFixed(3)}`);
  }

  /* ---------------------------------------------------------------
     Keyboard: arrows to move, Enter to open
     --------------------------------------------------------------- */

  protected onKeydown(event: KeyboardEvent): void {
    const last = this.panels.length - 1;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.hovered.update((i) => (i >= last ? 0 : i + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.hovered.update((i) => (i <= 0 ? last : i - 1));
    } else if (event.key === 'Enter' && this.hovered() > -1) {
      const target = document.activeElement;
      if (target instanceof HTMLAnchorElement || target instanceof HTMLButtonElement) return;
      event.preventDefault();
      void this.router.navigate([this.panels[this.hovered()].id]);
    }
  }

  /* ---------------------------------------------------------------
     Trailing cursor ring (pointer-fine devices only)
     --------------------------------------------------------------- */

  private startCursor(): void {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    this.cursor =
      (this.host.nativeElement as HTMLElement).querySelector<HTMLElement>('.cursor') ?? undefined;
    if (!this.cursor) return;

    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onWindowMove, { passive: true });
      this.trackingBound = true;
      const tick = () => {
        this.current.x += (this.target.x - this.current.x) * 0.16;
        this.current.y += (this.target.y - this.current.y) * 0.16;
        this.cursor!.style.transform =
          `translate3d(${this.current.x.toFixed(2)}px, ${this.current.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
  }

  private readonly onWindowMove = (event: PointerEvent): void => {
    this.target.x = event.clientX;
    this.target.y = event.clientY;
    this.cursor?.classList.add('is-live');
  };

  /* ---------------------------------------------------------------
     Template helper
     --------------------------------------------------------------- */

  protected panelState(index: number): string {
    if (this.hovered() === index) return 'active';
    if (this.hovered() > -1) return 'recessed';
    return 'idle';
  }
}
