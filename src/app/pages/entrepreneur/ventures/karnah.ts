import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { VENTURES, nextVenture } from '../../../data/ventures';

@Component({
  selector: 'app-karnah',
  imports: [RouterLink, Reveal],
  templateUrl: './karnah.html',
  styleUrl: './karnah.scss',
})
export class Karnah {
  protected readonly v = VENTURES.find((x) => x.id === 'karnah')!;
  protected readonly next = nextVenture('karnah');
}
