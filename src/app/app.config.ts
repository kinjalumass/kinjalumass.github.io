import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    /**
     * Pages are prerendered to static HTML for crawlers; hydration reuses that
     * markup instead of throwing it away and re-rendering.
     *
     * Event replay is on by default in Angular 22 and cannot be switched off,
     * which means two inline <script> blocks land in every prerendered page.
     * Our CSP is `script-src 'self'` with no 'unsafe-inline', so the browser
     * would block both. `tools/csp-hashes.mjs` runs after each build and adds
     * a sha256 hash for each one to that page's own policy, which keeps the
     * feature and the strict policy at the same time.
     */
    provideClientHydration(),
    provideRouter(
      routes,
      // Lets Section read its `id` straight from the route's `data`.
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
  ],
};
