import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { VENTURES, nextVenture } from '../../../data/ventures';

@Component({
  selector: 'app-trendify',
  imports: [RouterLink, Reveal],
  templateUrl: './trendify.html',
  styleUrl: './trendify.scss',
})
export class Trendify {
  protected readonly v = VENTURES.find((x) => x.id === 'trendify')!;
  protected readonly next = nextVenture('trendify');

  /** The match, stated as a swap: what you have → what it becomes. */
  protected readonly matches = [
    { have: 'Travel clips', becomes: 'Rising nostalgic montage', signal: 'Audio velocity ↑' },
    { have: 'Gym footage', becomes: 'High-retention transformation', signal: 'Retention 92%' },
    { have: 'Clips with friends', becomes: 'Comedic POV format', signal: 'Peaking this week' },
    { have: 'Food and cafés', becomes: 'Aesthetic slow-cut', signal: 'Early, low saturation' },
  ];

  /** What the trend engine watches. */
  protected readonly signals = [
    'Audio adoption velocity',
    'View-to-like ratio',
    'Structural format',
    'Theme clusters',
    'Cut timing',
    'Trend decay',
  ];
}
