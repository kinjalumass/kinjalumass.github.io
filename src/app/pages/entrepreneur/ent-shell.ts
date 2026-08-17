import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { VENTURES } from '../../data/ventures';

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
  protected readonly ventures = VENTURES;
  protected readonly year = new Date().getFullYear();
}
