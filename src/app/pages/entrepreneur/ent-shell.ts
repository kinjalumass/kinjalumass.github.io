import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { VENTURES } from '../../data/ventures';
import { EXTERNAL, VENTURE_BASE } from '../../data/site';

/**
 * Chrome shared by every /entrepreneur page: the aurora atmosphere, the nav,
 * and the footer. Venture pages set their own --v1/--v2/--v3 palette inside.
 */
@Component({
  selector: 'app-ent-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './ent-shell.html',
  styleUrl: './ent-shell.scss',
})
export class EntShell {
  /**
   * '/entrepreneur' on kinjalpandey.com, '' on kinnovationgroup.com — the
   * same components serve both, so paths are built rather than hardcoded.
   */
  protected readonly base = VENTURE_BASE;
  protected readonly external = EXTERNAL;

  /** RouterLink target for the studio, and for a given venture. */
  protected studioLink(): string[] { return this.base ? [this.base] : ['/']; }
  protected ventureLink(id: string): string[] {
    return this.base ? [this.base, id] : ['/', id];
  }

  protected readonly ventures = VENTURES;
  protected readonly year = new Date().getFullYear();
}
