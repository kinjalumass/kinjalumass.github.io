import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { DevShell } from './dev-shell';
import { Developer } from './developer';
import { Education } from './education/education';
import { Experience } from './experience/experience';
import { Honors } from './honors/honors';
import { Projects } from './projects/projects';
import { Resume } from './resume/resume';

/** Lazy-loaded: the whole developer section ships as its own chunk. */
export const DEVELOPER_ROUTES: Routes = [
  {
    path: '',
    component: DevShell,
    children: [
      { path: '', component: Developer, title: 'Developer — Kinjal Pandey' },
      { path: 'education', component: Education, title: 'Education — Kinjal Pandey' },
      { path: 'experience', component: Experience, title: 'Experience — Kinjal Pandey' },
      { path: 'projects', component: Projects, title: 'Projects — Kinjal Pandey' },
      { path: 'honors', component: Honors, title: 'Honors & Awards — Kinjal Pandey' },
      { path: 'resume', component: Resume, title: 'Resume — Kinjal Pandey' },
      { path: 'contact', component: Contact, title: 'Contact — Kinjal Pandey' },
      { path: '**', redirectTo: '' },
    ],
  },
];
