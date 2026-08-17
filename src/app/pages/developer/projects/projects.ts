import { Component } from '@angular/core';
import { AssetStrip } from '../../../components/asset-viewer/asset-strip';
import { PROJECTS } from '../../../data/profile';

@Component({
  selector: 'app-projects',
  imports: [AssetStrip],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly projects = PROJECTS;

  /** Moves the specular highlight on a project panel. */
  protected onMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  }
}
