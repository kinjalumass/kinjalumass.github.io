import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },

  // Each section is lazy-loaded, so the landing page only ships itself.
  {
    path: 'developer',
    loadChildren: () =>
      import('./pages/developer/developer.routes').then((m) => m.DEVELOPER_ROUTES),
  },
  {
    path: 'entrepreneur',
    loadChildren: () =>
      import('./pages/entrepreneur/entrepreneur.routes').then((m) => m.ENTREPRENEUR_ROUTES),
  },

  {
    path: 'model',
    loadComponent: () => import('./pages/model/model').then((m) => m.Model),
  },

  { path: '**', redirectTo: '' },
];
