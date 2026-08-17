import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { VENTURES, nextVenture } from '../../../data/ventures';

@Component({
  selector: 'app-nutri',
  imports: [RouterLink, Reveal],
  templateUrl: './nutri.html',
  styleUrl: './nutri.scss',
})
export class NutriNavigator {
  protected readonly v = VENTURES.find((x) => x.id === 'nutri-navigator')!;
  protected readonly next = nextVenture('nutri-navigator');

  /** The three input streams, shown as a triptych. */
  protected readonly streams = [
    { key: 'Body', detail: 'HRV · sleep · stress · glucose · strain' },
    { key: 'Calendar', detail: 'classes · meetings · commutes · gaps' },
    { key: 'Place', detail: 'walking time · menus · nutrition · price' },
  ];
}
