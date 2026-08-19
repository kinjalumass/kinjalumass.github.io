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

interface Column {
  /** head position, in rows */
  y: number;
  speed: number;
  /** rows of glyphs already burned in below the head */
  trail: number;
  /** frames until this column re-rolls its glyph */
  churn: number;
  glyph: string;
}

/**
 * Matrix-style glyph rain.
 *
 * Used twice on the developer page: as the code wall behind the portrait
 * cutout, and as the hero backdrop where `interactive` is on — there, columns
 * near the pointer surge, brighten, and churn characters faster, so the whole
 * wall reacts to the cursor.
 *
 * Runs outside Angular's zone, throttles itself, pauses when scrolled out of
 * view, and does not start under prefers-reduced-motion.
 */
@Component({
  selector: 'app-matrix-rain',
  template: '<canvas #canvas></canvas>',
  styles: `
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    canvas { display: block; width: 100%; height: 100%; }
  `,
})
export class MatrixRain implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  /** Glyph size in px. Smaller reads as denser code. */
  readonly fontSize = input(14);
  /** 0–1. Share of columns that are raining at any moment. */
  readonly density = input(0.85);
  /** Trail persistence. Lower leaves longer tails. */
  readonly fade = input(0.09);
  /** Base fall speed in rows per frame. */
  readonly speed = input(0.5);
  /** Backdrop the trails fade into, as `r, g, b`. */
  readonly backdrop = input('4, 8, 6');
  /** Overall opacity of the layer. */
  readonly intensity = input(1);
  /** When true, the pointer disturbs the wall. */
  readonly interactive = input(false);

  private raf = 0;
  private cols: Column[] = [];
  private count = 0;
  private cell = 14;
  private w = 0;
  private h = 0;
  private rows = 0;
  private last = 0;
  private visible = true;

  private px = -9999;
  private py = -9999;
  private bound = false;

  private observer?: IntersectionObserver;
  private onResize?: () => void;

  private readonly glyphs =
    'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜ0123456789<>[]{}/\\|=+*#$%&'.split('');

  constructor() {
    afterNextRender(() => this.start());
  }

  ngOnDestroy(): void {
    // The animation only ever starts in a browser (afterNextRender), but
    // ngOnDestroy also runs during prerendering, where rAF does not exist.
    if (this.raf) cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.bound) window.removeEventListener('pointermove', this.onPointerMove);
  }

  private rollGlyph(): string {
    return this.glyphs[(Math.random() * this.glyphs.length) | 0];
  }

  private start(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layout = () => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = rect.width;
      this.h = rect.height;
      canvas.width = Math.max(1, Math.floor(this.w * dpr));
      canvas.height = Math.max(1, Math.floor(this.h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      this.cell = this.fontSize();
      this.count = Math.ceil(this.w / this.cell);
      this.rows = Math.ceil(this.h / this.cell);

      this.cols = Array.from({ length: this.count }, () => ({
        y: Math.random() * -this.rows,
        speed: this.speed() * (0.6 + Math.random() * 0.9),
        trail: 6 + Math.floor(Math.random() * 18),
        churn: (Math.random() * 8) | 0,
        glyph: this.rollGlyph(),
      }));

      ctx.fillStyle = `rgb(${this.backdrop()})`;
      ctx.fillRect(0, 0, this.w, this.h);
    };

    layout();
    this.onResize = layout;
    window.addEventListener('resize', layout, { passive: true });

    this.observer = new IntersectionObserver(
      ([entry]) => (this.visible = entry.isIntersecting),
      { threshold: 0 },
    );
    this.observer.observe(this.host.nativeElement);

    this.zone.runOutsideAngular(() => {
      if (this.interactive()) {
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
        this.bound = true;
      }
      this.raf = requestAnimationFrame((t) => this.frame(t, ctx));
    });
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      this.px = -9999;
      this.py = -9999;
      return;
    }
    this.px = event.clientX - rect.left;
    this.py = event.clientY - rect.top;
  };

  private frame(t: number, ctx: CanvasRenderingContext2D): void {
    this.raf = requestAnimationFrame((n) => this.frame(n, ctx));
    if (!this.visible || t - this.last < 40) return;
    this.last = t;

    const k = this.intensity();

    // Dim what's already there — this is what makes the tails.
    ctx.fillStyle = `rgba(${this.backdrop()}, ${this.fade()})`;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.font = `${this.cell - 2}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';

    const live = this.interactive() && this.px > -9000;
    const reach = 190;

    for (let i = 0; i < this.count; i++) {
      const col = this.cols[i];
      const x = i * this.cell;

      // how strongly the pointer is disturbing this column
      let heat = 0;
      if (live) {
        const dx = x - this.px;
        const dy = col.y * this.cell - this.py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < reach) heat = (1 - d / reach) ** 1.6;
      }

      col.churn -= 1;
      if (col.churn <= 0 || heat > 0.35) {
        col.glyph = this.rollGlyph();
        col.churn = heat > 0.35 ? 1 : 2 + ((Math.random() * 7) | 0);
      }

      const y = col.y * this.cell;

      if (y > -this.cell && y < this.h) {
        // head — near-white, hotter still under the cursor
        const headAlpha = Math.min(1, (0.85 + heat * 0.15) * k);
        ctx.fillStyle = heat > 0.2
          ? `rgba(232, 255, 240, ${headAlpha})`
          : `rgba(198, 255, 220, ${headAlpha})`;
        ctx.fillText(col.glyph, x, y);

        // one glyph behind the head, dimmer
        ctx.fillStyle = `rgba(96, 226, 160, ${(0.42 + heat * 0.5) * k})`;
        ctx.fillText(this.rollGlyph(), x, y - this.cell);
      }

      col.y += col.speed * (1 + heat * 2.6);

      if (y > this.h + col.trail * this.cell) {
        col.y = -Math.random() * 12;
        col.speed = this.speed() * (0.6 + Math.random() * 0.9);
        col.trail = 6 + Math.floor(Math.random() * 18);
        // some columns rest, so the wall isn't uniformly full
        if (Math.random() > this.density()) col.y = -this.rows * Math.random() * 2;
      }
    }

    // soft glow around the pointer so the disturbance reads
    if (live) {
      const g = ctx.createRadialGradient(this.px, this.py, 0, this.px, this.py, reach);
      g.addColorStop(0, `rgba(124, 255, 178, ${0.1 * k})`);
      g.addColorStop(1, 'rgba(124, 255, 178, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(this.px - reach, this.py - reach, reach * 2, reach * 2);
    }
  }
}
