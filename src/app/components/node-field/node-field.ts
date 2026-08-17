import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

interface Node {
  /** home position */
  hx: number;
  hy: number;
  /** current position */
  x: number;
  y: number;
  /** velocity */
  vx: number;
  vy: number;
  /** per-node phase so the idle drift isn't uniform */
  phase: number;
}

interface Packet {
  from: number;
  to: number;
  t: number;
  speed: number;
}

/**
 * Reactive node lattice.
 *
 * A jittered grid of nodes connected to their right/down neighbours. The
 * pointer pushes nodes outward and lights up everything inside its radius;
 * nodes spring back to their home position when it leaves. Data packets
 * travel along links near the cursor.
 *
 * Runs entirely outside Angular's zone, throttles to ~30fps, pauses when
 * scrolled out of view, and does not start under prefers-reduced-motion.
 */
@Component({
  selector: 'app-node-field',
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
export class NodeField implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private raf = 0;
  private nodes: Node[] = [];
  private links: Array<[number, number]> = [];
  private packets: Packet[] = [];
  private cols = 0;
  private rows = 0;
  private step = 74;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private last = 0;
  private time = 0;
  private visible = true;

  /** pointer, in canvas space. -1 means "not over the section". */
  private px = -1;
  private py = -1;
  private tx = -1;
  private ty = -1;
  private readonly radius = 200;

  private observer?: IntersectionObserver;
  private onResize?: () => void;
  private bound = false;

  constructor() {
    afterNextRender(() => this.start());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.observer?.disconnect();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.bound) {
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerleave', this.onPointerLeave);
    }
  }

  /* ---------------------------------------------------------------
     Setup
     --------------------------------------------------------------- */

  private start(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layout = () => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = rect.width;
      this.h = rect.height;
      canvas.width = Math.max(1, Math.floor(this.w * this.dpr));
      canvas.height = Math.max(1, Math.floor(this.h * this.dpr));
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.build();
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
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
      this.bound = true;
      this.raf = requestAnimationFrame((t) => this.frame(t, ctx));
    });
  }

  private build(): void {
    this.step = this.w < 700 ? 58 : 74;
    this.cols = Math.ceil(this.w / this.step) + 2;
    this.rows = Math.ceil(this.h / this.step) + 2;

    this.nodes = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // jitter so it reads as a lattice, not graph paper
        const jx = (Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
        const jy = (Math.sin(c * 39.3468 + r * 11.135) * 24634.6345) % 1;
        const hx = (c - 1) * this.step + jx * this.step * 0.4;
        const hy = (r - 1) * this.step + jy * this.step * 0.4;
        this.nodes.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, phase: (jx + jy) * Math.PI * 4 });
      }
    }

    this.links = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c;
        if (c < this.cols - 1) this.links.push([i, i + 1]);
        if (r < this.rows - 1) this.links.push([i, i + this.cols]);
      }
    }

    this.packets = [];
  }

  /* ---------------------------------------------------------------
     Pointer
     --------------------------------------------------------------- */

  private readonly onPointerMove = (event: PointerEvent): void => {
    const rect = this.host.nativeElement.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      this.tx = -1;
      this.ty = -1;
      return;
    }
    this.tx = event.clientX - rect.left;
    this.ty = event.clientY - rect.top;
  };

  private readonly onPointerLeave = (): void => {
    this.tx = -1;
    this.ty = -1;
  };

  /* ---------------------------------------------------------------
     Frame
     --------------------------------------------------------------- */

  private frame(t: number, ctx: CanvasRenderingContext2D): void {
    this.raf = requestAnimationFrame((n) => this.frame(n, ctx));
    if (!this.visible || t - this.last < 32) return;
    this.last = t;
    this.time += 0.016;

    // ease the pointer so motion feels weighted
    if (this.tx < 0) {
      this.px = -1;
      this.py = -1;
    } else {
      this.px = this.px < 0 ? this.tx : this.px + (this.tx - this.px) * 0.18;
      this.py = this.py < 0 ? this.ty : this.py + (this.ty - this.py) * 0.18;
    }

    const active = this.px >= 0;
    const R = this.radius;
    const R2 = R * R;

    // --- physics ---------------------------------------------------
    for (const n of this.nodes) {
      if (active) {
        const dx = n.x - this.px;
        const dy = n.y - this.py;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / R) ** 2 * 5.5;
          n.vx += (dx / d) * force;
          n.vy += (dy / d) * force;
        }
      }
      // spring home + damping
      n.vx += (n.hx - n.x) * 0.045;
      n.vy += (n.hy - n.y) * 0.045;
      n.vx *= 0.86;
      n.vy *= 0.86;
      n.x += n.vx + Math.sin(this.time * 0.6 + n.phase) * 0.12;
      n.y += n.vy + Math.cos(this.time * 0.5 + n.phase) * 0.12;
    }

    // --- draw ------------------------------------------------------
    ctx.clearRect(0, 0, this.w, this.h);

    // links
    ctx.lineWidth = 1;
    for (const [a, b] of this.links) {
      const na = this.nodes[a];
      const nb = this.nodes[b];
      let glow = 0;
      if (active) {
        const mx = (na.x + nb.x) * 0.5 - this.px;
        const my = (na.y + nb.y) * 0.5 - this.py;
        const d = Math.sqrt(mx * mx + my * my);
        glow = d < R * 1.5 ? 1 - d / (R * 1.5) : 0;
      }
      const alpha = 0.05 + glow * 0.55;
      ctx.strokeStyle = `rgba(124, 255, 178, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.stroke();
    }

    // nodes
    for (const n of this.nodes) {
      let glow = 0;
      if (active) {
        const dx = n.x - this.px;
        const dy = n.y - this.py;
        const d = Math.sqrt(dx * dx + dy * dy);
        glow = d < R * 1.4 ? 1 - d / (R * 1.4) : 0;
      }
      const size = 1 + glow * 2.6;
      ctx.fillStyle = `rgba(160, 255, 200, ${0.16 + glow * 0.84})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // cursor ring
    if (active) {
      ctx.strokeStyle = 'rgba(124, 255, 178, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.px, this.py, R * 0.55, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.runPackets(ctx, active);
  }

  /** Small pulses that travel along links near the cursor. */
  private runPackets(ctx: CanvasRenderingContext2D, active: boolean): void {
    if (active && this.packets.length < 26 && Math.random() < 0.35) {
      const [a, b] = this.links[(Math.random() * this.links.length) | 0];
      const na = this.nodes[a];
      const dx = na.x - this.px;
      const dy = na.y - this.py;
      if (dx * dx + dy * dy < (this.radius * 1.6) ** 2) {
        this.packets.push({ from: a, to: b, t: 0, speed: 0.012 + Math.random() * 0.022 });
      }
    }

    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.t += p.speed;
      if (p.t >= 1) {
        this.packets.splice(i, 1);
        continue;
      }
      const a = this.nodes[p.from];
      const b = this.nodes[p.to];
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;
      const fade = Math.sin(p.t * Math.PI);
      ctx.fillStyle = `rgba(210, 255, 230, ${fade})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
