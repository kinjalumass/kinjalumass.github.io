import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { DevShell } from './dev-shell';
import { Developer } from './developer';
import { Education } from './education/education';
import { Experience } from './experience/experience';
import { Honors } from './honors/honors';
import { Bcu } from './projects/bcu/bcu';
import { Projects } from './projects/projects';
import { Resume } from './resume/resume';

/** Lazy-loaded: the whole developer section ships as its own chunk. */
export const DEVELOPER_ROUTES: Routes = [
  {
    path: '',
    component: DevShell,
    children: [
      { path: '', component: Developer },
      { path: 'education', component: Education },
      { path: 'experience', component: Experience },
      { path: 'projects', component: Projects },
      {
        path: 'projects/bcu',
        component: Bcu,
      },
      { path: 'honors', component: Honors },
      { path: 'resume', component: Resume },
      { path: 'contact', component: Contact },
      { path: '**', redirectTo: '' },
    ],
  },
];
