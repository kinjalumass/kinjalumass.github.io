import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FALLBACK, GITHUB_USER, HIDE, KEEP_FORKS, NOTES, Repo } from '../../../data/repos';

const CACHE_KEY = 'gh-repos-v1';
const CACHE_MS = 30 * 60 * 1000;

interface GhRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
}

/**
 * Pulls the public repo list from GitHub and merges it with the hand-written
 * notes in `repos.ts`.
 *
 * Unauthenticated GitHub allows 60 requests per hour per IP, which is plenty
 * for a portfolio — and the result is cached per session anyway. If anything
 * fails we render the curated fallback rather than an empty page.
 */
@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  async load(): Promise<{ repos: Repo[]; live: boolean }> {
    // During prerendering there is no session and no reason to hit the API:
    // the crawler gets the curated list immediately, and the browser swaps in
    // live data on hydration. It also keeps the build deterministic.
    if (!this.isBrowser) return { repos: FALLBACK, live: false };

    const cached = this.readCache();
    if (cached) return { repos: cached, live: true };

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const raw: GhRepo[] = await response.json();
      const repos = this.shape(raw);
      if (!repos.length) throw new Error('No repos returned');

      this.writeCache(repos);
      return { repos, live: true };
    } catch (err) {
      console.warn('[github] falling back to curated list:', err);
      return { repos: FALLBACK, live: false };
    }
  }

  private shape(raw: GhRepo[]): Repo[] {
    return raw
      // Forks are noise, except the ones holding her own work.
      .filter((r) => (!r.fork || KEEP_FORKS.has(r.name)) && !r.archived && !HIDE.has(r.name))
      .map((r) => {
        const note = NOTES[r.name] ?? {};
        return {
          name: r.name,
          title: note.title ?? r.name,
          blurb: note.blurb ?? r.description ?? '',
          url: r.html_url,
          language: r.language,
          topics: note.topics ?? r.topics ?? [],
          updated: r.pushed_at,
          stars: r.stargazers_count,
          featured: note.featured,
          rank: note.rank ?? 50,
        };
      })
      // featured first, then by explicit rank, then most recently pushed
      .sort((a, b) => {
        const f = Number(b.featured ?? false) - Number(a.featured ?? false);
        if (f !== 0) return f;
        if (a.rank !== b.rank) return a.rank - b.rank;
        return b.updated.localeCompare(a.updated);
      });
  }

  /* --- session cache ------------------------------------------------------ */

  private readCache(): Repo[] | null {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { at, repos } = JSON.parse(raw);
      if (Date.now() - at > CACHE_MS) return null;
      return repos as Repo[];
    } catch {
      return null;
    }
  }

  private writeCache(repos: Repo[]): void {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
    } catch {
      /* private browsing, quota — not worth handling */
    }
  }
}
