import { Routes } from '@angular/router';

/**
 * Routes for the standalone kinnovationgroup.com build.
 *
 * The entrepreneur section becomes the whole site: the studio is the home
 * page and each venture sits directly under the root, so a visitor sees
 * kinnovationgroup.com/calendai rather than
 * kinjalpandey.com/entrepreneur/calendai.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/entrepreneur/entrepreneur.routes').then((m) => m.ENTREPRENEUR_ROUTES),
  },
];
