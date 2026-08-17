import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { VENTURES, nextVenture } from '../../../data/ventures';

@Component({
  selector: 'app-witness',
  imports: [RouterLink, Reveal],
  templateUrl: './witness.html',
  styleUrl: './witness.scss',
})
export class Witness {
  protected readonly v = VENTURES.find((x) => x.id === 'witness-platform')!;
  protected readonly next = nextVenture('witness-platform');

  /** Design constraints stated as commitments. */
  protected readonly principles = [
    { rule: 'Events, never people', body: 'The record describes what happened. It never stores who someone is.' },
    { rule: 'Nothing is published', body: 'There is no feed, no profile, no public record. Sealed is the default state.' },
    { rule: 'Contact requires consent', body: 'A witness is asked, never surfaced. Declining leaves no trace and costs nothing.' },
    { rule: 'No reputational scoring', body: 'The platform builds no dossiers and ranks no one. That is the line it will not cross.' },
  ];
}
