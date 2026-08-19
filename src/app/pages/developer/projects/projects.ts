import { Component, afterNextRender, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PUBLICATION } from '../../../data/publication';
import { FALLBACK, GITHUB_USER, Repo } from '../../../data/repos';
import { GithubService } from './github.service';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly user = GITHUB_USER;
  protected readonly paper = PUBLICATION;
  /**
   * Seeded with the curated list rather than empty.
   *
   * The live fetch runs in `afterNextRender`, which does not run while the
   * page is prerendered — so starting empty meant the static HTML shipped a
   * loading spinner and no projects at all. A crawler saw nothing. Now the
   * prerendered page carries the curated list, and the browser swaps in live
   * GitHub data on hydration.
   */
  protected readonly repos = signal<Repo[]>(FALLBACK);
  protected readonly loading = signal(false);
  protected readonly live = signal(true);

  /** The single strongest repo, given a full-width treatment of its own. */
  protected readonly lead = computed(() => this.repos().find((r) => r.featured) ?? null);
  protected readonly featured = computed(() =>
    this.repos().filter((r) => r.featured && r.name !== this.lead()?.name),
  );
  protected readonly rest = computed(() => this.repos().filter((r) => !r.featured));

  constructor(private readonly github: GithubService) {
    afterNextRender(async () => {
      const { repos, live } = await this.github.load();
      this.repos.set(repos);
      this.live.set(live);
      this.loading.set(false);
    });
  }

  /** "Jun 2026" — enough to show a repo is current without false precision. */
  protected when(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  /** Moves the specular highlight on a project panel. */
  protected onMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  }
}
