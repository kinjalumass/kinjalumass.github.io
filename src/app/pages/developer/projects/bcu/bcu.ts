import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BCU, BCU_COHORT, BCU_TEAM, CASE_STUDIES } from '../../../../data/bcu';

@Component({
  selector: 'app-bcu',
  imports: [RouterLink],
  templateUrl: './bcu.html',
  styleUrl: './bcu.scss',
})
export class Bcu {
  protected readonly p = BCU;
  protected readonly studies = CASE_STUDIES;
  protected readonly cohort = BCU_COHORT;
  protected readonly team = BCU_TEAM;

  /** Moves the specular highlight on a case-study panel. */
  protected onMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  }
}
