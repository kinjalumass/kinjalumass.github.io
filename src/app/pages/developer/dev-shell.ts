import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AssetLightbox } from '../../components/asset-viewer/asset-lightbox';

interface NavItem {
  path: string;
  label: string;
  exact: boolean;
}

/**
 * Chrome shared by every /developer page: scanline and vignette overlays,
 * the fixed nav, and the footer. Pages render into the outlet.
 */
@Component({
  selector: 'app-dev-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AssetLightbox],
  templateUrl: './dev-shell.html',
  styleUrl: './dev-shell.scss',
})
export class DevShell {
  protected readonly items: NavItem[] = [
    { path: '/developer', label: 'overview', exact: true },
    { path: '/developer/education', label: 'education', exact: false },
    { path: '/developer/experience', label: 'experience', exact: false },
    { path: '/developer/projects', label: 'projects', exact: false },
    { path: '/developer/honors', label: 'honors', exact: false },
    { path: '/developer/resume', label: 'resume', exact: false },
    { path: '/developer/contact', label: 'contact', exact: false },
  ];

  protected readonly year = new Date().getFullYear();
}
