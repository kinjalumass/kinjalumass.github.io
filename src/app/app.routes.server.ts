import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Every route is prerendered to a static HTML file at build time.
 *
 * This is the whole point of the exercise: without it GitHub Pages serves one
 * empty index.html for every URL, and a crawler that does not run JavaScript
 * — which includes most social preview bots and several search engines — sees
 * nothing at all. With it, each page ships real markup with its own title,
 * description and content.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender },
];
