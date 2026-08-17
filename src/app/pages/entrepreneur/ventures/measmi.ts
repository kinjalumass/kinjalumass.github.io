import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { VENTURES, nextVenture } from '../../../data/ventures';

@Component({
  selector: 'app-measmi',
  imports: [RouterLink, Reveal],
  templateUrl: './measmi.html',
  styleUrl: './measmi.scss',
})
export class MeAsmi {
  protected readonly v = VENTURES.find((x) => x.id === 'measmi')!;
  protected readonly next = nextVenture('measmi');
}
