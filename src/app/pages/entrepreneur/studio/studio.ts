import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../components/reveal/reveal';
import { STUDIO, VENTURES } from '../../../data/ventures';

@Component({
  selector: 'app-studio',
  imports: [RouterLink, Reveal],
  templateUrl: './studio.html',
  styleUrl: './studio.scss',
})
export class Studio {
  protected readonly studio = STUDIO;
  protected readonly ventures = VENTURES;

  /** Index of the venture row under the pointer, for the preview image. */
  protected readonly active = signal(0);

  protected onHover(index: number): void {
    this.active.set(index);
  }
}
