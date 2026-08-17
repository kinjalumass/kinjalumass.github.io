import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';

/**
 * Canvas glyph rain. Sits behind content as an atmospheric layer.
 *
 * Runs entirely outside Angular's zone, throttles itself to ~24fps, pauses
 * when scrolled out of view, and does not start at all under
 * prefers-reduced-motion.
 */
@Component({
  selector: 'app-code-rain',
  template: '<canvas #canvas></canvas>',
  styles: `
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class CodeRain implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  /** 0–1. Higher spawns denser columns. */
  readonly density = input(0.55);
  /** Base opacity of the whole layer. */
  readonly intensity = input(0.5);

  private raf = 0;
  private drops: number[] = [];
  private speeds: number[] = [];
  private columns = 0;
  private cell = 16;
  private last = 0;
  private visible = true;
  private observer?: IntersectionObserver;
  private resize?: () => void;

  private readonly glyphs =
    '01<>{}[]/\\|=+-*#$%&@?!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

  constructor() {
    afterNextRender(() => this.start());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
    if (this.resize) window.removeEventListener('resize', this.resize);
  }

  private start(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layout = () => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      this.cell = rect.width < 700 ? 13 : 16;
      this.columns = Math.ceil(rect.width / this.cell);
      this.drops = Array.from({ length: this.columns }, () =>
        Math.random() < this.density() ? Math.random() * -60 : Number.NaN,
      );
      this.speeds = Array.from({ length: this.columns }, () => 0.4 + Math.random() * 0.8);
    };

    layout();
    this.resize = () => layout();
    window.addEventListener('resize', this.resize, { passive: true });

    this.observer = new IntersectionObserver(
      ([entry]) => (this.visible = entry.isIntersecting),
      { threshold: 0 },
    );
    this.observer.observe(this.host.nativeElement);

    this.zone.runOutsideAngular(() => {
      const frame = (time: number) => {
        this.raf = requestAnimationFrame(frame);
        if (!this.visible || time - this.last < 42) return;
        this.last = time;

        const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
        const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

        // Trail rather than clear, so glyphs fade instead of blinking out.
        ctx.fillStyle = 'rgba(6, 8, 9, 0.16)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = `${this.cell - 3}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.textBaseline = 'top';

        for (let i = 0; i < this.columns; i++) {
          const y = this.drops[i];
          if (Number.isNaN(y)) {
            if (Math.random() < 0.002) this.drops[i] = -2;
            continue;
          }

          const glyph = this.glyphs[(Math.random() * this.glyphs.length) | 0];
          const py = y * this.cell;

          ctx.fillStyle = `rgba(190, 255, 220, ${0.85 * this.intensity()})`;
          ctx.fillText(glyph, i * this.cell, py);
          ctx.fillStyle = `rgba(90, 220, 150, ${0.28 * this.intensity()})`;
          ctx.fillText(glyph, i * this.cell, py - this.cell);

          this.drops[i] += this.speeds[i];
          if (py > h && Math.random() > 0.975) {
            this.drops[i] = Math.random() < this.density() ? -2 : Number.NaN;
          }
        }
      };
      this.raf = requestAnimationFrame(frame);
    });
  }
}
