import { Routes } from '@angular/router';
import { EntShell } from './ent-shell';
import { Studio } from './studio/studio';
import { CalendAI } from './ventures/calendai';
import { Karnah } from './ventures/karnah';
import { MeAsmi } from './ventures/measmi';
import { NutriNavigator } from './ventures/nutri';
import { Trendify } from './ventures/trendify';
import { Witness } from './ventures/witness';

/** Lazy-loaded: the whole Kinnovation section ships as its own chunk. */
export const ENTREPRENEUR_ROUTES: Routes = [
  {
    path: '',
    component: EntShell,
    children: [
      { path: '', component: Studio, title: 'Kinnovation — Kinjal Pandey' },
      { path: 'measmi', component: MeAsmi, title: 'MeAsmi — Kinnovation' },
      { path: 'karnah', component: Karnah, title: 'Karnah — Kinnovation' },
      { path: 'calendai', component: CalendAI, title: 'CalendAI — Kinnovation' },
      { path: 'nutri-navigator', component: NutriNavigator, title: 'NutriNavigator — Kinnovation' },
      { path: 'witness-platform', component: Witness, title: 'Witness — Kinnovation' },
      { path: 'trendify', component: Trendify, title: 'Trendify AI — Kinnovation' },
      { path: '**', redirectTo: '' },
    ],
  },
];
