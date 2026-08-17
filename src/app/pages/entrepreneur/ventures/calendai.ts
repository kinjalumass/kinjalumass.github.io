import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { VENTURES, nextVenture } from '../../../data/ventures';

@Component({
  selector: 'app-calendai',
  imports: [RouterLink, Reveal],
  templateUrl: './calendai.html',
  styleUrl: './calendai.scss',
})
export class CalendAI {
  protected readonly v = VENTURES.find((x) => x.id === 'calendai')!;
  protected readonly next = nextVenture('calendai');
}
