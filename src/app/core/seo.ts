import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ORIGIN, metaFor, urlFor } from '../data/site';

/**
 * Keeps the document head in step with the route.
 *
 * A single-page app serves one index.html for every URL, so without this
 * every page shares one title and one description. Search engines then treat
 * the whole site as one thin page, and social previews all look identical.
 *
 * This runs on the client for navigation, and during prerendering it runs
 * once per route — which is what actually lands the tags in the static HTML
 * that crawlers read first.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  watchRoutes(): void {
    this.apply(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.apply(e.urlAfterRedirects));
  }

  private apply(url: string): void {
    const path = url.split(/[?#]/)[0];
    const page = metaFor(path);
    // A page may credit a different URL — see PageMeta.canonical.
    const canonical = page.canonical ?? urlFor(page.path);
    const image = page.image ? `${ORIGIN}/${page.image}` : `${ORIGIN}/img/tiles/tile-developer.jpg`;

    this.title.setTitle(page.title);

    const tags: Record<string, string> = {
      description: page.description,
      'og:type': page.path === '' ? 'website' : 'profile',
      'og:site_name': 'Kinjal Pandey',
      'og:title': page.title,
      'og:description': page.description,
      'og:url': canonical,
      'og:image': image,
      'og:image:alt': page.title,
      'twitter:card': 'summary_large_image',
      'twitter:title': page.title,
      'twitter:description': page.description,
      'twitter:image': image,
    };

    for (const [name, content] of Object.entries(tags)) {
      const selector = name.startsWith('og:') ? `property='${name}'` : `name='${name}'`;
      this.meta.updateTag(
        name.startsWith('og:') ? { property: name, content } : { name, content },
        selector,
      );
    }

    this.setCanonical(canonical);
  }

  /** One canonical link, rewritten rather than appended, per navigation. */
  private setCanonical(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
