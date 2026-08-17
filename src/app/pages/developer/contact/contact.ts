import { Component, signal } from '@angular/core';
import { AVAILABILITY, CHANNELS } from '../../../data/profile';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly channels = CHANNELS;
  protected readonly availability = AVAILABILITY;

  /** Key of the channel whose value was just copied. */
  protected readonly copied = signal<string | null>(null);
  private timer = 0;

  protected async copy(key: string, value: string, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      this.copied.set(key);
      clearTimeout(this.timer);
      this.timer = window.setTimeout(() => this.copied.set(null), 1800);
    } catch {
      // Clipboard blocked — the link itself still works.
    }
  }
}
