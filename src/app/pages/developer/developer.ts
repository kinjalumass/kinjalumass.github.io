import {
  Component,
  OnDestroy,
  afterNextRender,
  signal,
} from '@angular/core';
import { ConsoleBot } from '../../components/console-bot/console-bot';
import { MatrixRain } from '../../components/matrix-rain/matrix-rain';
import { NodeField } from '../../components/node-field/node-field';
import { HERO, INTRO, LINKS, STACK, STATS, TIMELINE, TRACKS } from '../../data/developer';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

@Component({
  selector: 'app-developer',
  imports: [NodeField, MatrixRain, ConsoleBot],
  templateUrl: './developer.html',
  styleUrl: './developer.scss',
})
export class Developer implements OnDestroy {
  protected readonly hero = HERO;
  protected readonly intro = INTRO;
  protected readonly stats = STATS;
  protected readonly tracks = TRACKS;
  protected readonly timeline = TIMELINE;
  protected readonly stack = STACK;
  protected readonly links = LINKS;

  /** Text currently rendered under the name — mid-scramble it is garbage. */
  protected readonly role = signal(HERO.roles[0]);
  protected readonly settled = signal(true);
  protected readonly ready = signal(false);

  private index = 0;
  private cycleTimer = 0;
  private scrambleTimer = 0;
  private reduced = false;

  constructor() {
    afterNextRender(() => {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => this.ready.set(true));
      this.cycleTimer = window.setInterval(() => this.advance(), 3200);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.cycleTimer);
    clearInterval(this.scrambleTimer);
  }

  /* ---------------------------------------------------------------
     Role cycling with a scramble transition
     --------------------------------------------------------------- */

  private advance(): void {
    this.index = (this.index + 1) % this.hero.roles.length;
    const target = this.hero.roles[this.index];

    if (this.reduced) {
      this.role.set(target);
      return;
    }

    clearInterval(this.scrambleTimer);
    this.settled.set(false);

    const from = this.role();
    const length = Math.max(from.length, target.length);
    let frame = 0;
    const frames = 18;

    this.scrambleTimer = window.setInterval(() => {
      frame++;
      const settledChars = Math.floor((frame / frames) * length);
      let out = '';
      for (let i = 0; i < length; i++) {
        if (i < settledChars) {
          out += target[i] ?? '';
        } else if (target[i] === ' ') {
          out += ' ';
        } else if (i < target.length) {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      this.role.set(out);

      if (frame >= frames) {
        clearInterval(this.scrambleTimer);
        this.role.set(target);
        this.settled.set(true);
      }
    }, 28);
  }

  /* ---------------------------------------------------------------
     Pointer-reactive surfaces
     --------------------------------------------------------------- */

  /** Tilts a card toward the cursor and moves its specular highlight. */
  protected onCardMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--ry', `${((x - 0.5) * 7).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
  }

  protected onCardLeave(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  }
}
