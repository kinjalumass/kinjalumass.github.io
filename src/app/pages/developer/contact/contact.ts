import { Component, computed, signal } from '@angular/core';

import { EMAILJS, emailjsReady } from '../../../data/emailjs.config';
import { AVAILABILITY, CHANNELS } from '../../../data/profile';

type SendState = 'idle' | 'sending' | 'sent' | 'handoff' | 'error';

/** Deliberately loose. Its job is to catch typos, not to police addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  /* --- form ---------------------------------------------------------------- */

  /**
   * With EmailJS configured the form sends in place. Without it the same form
   * still works: it hands a fully composed message to the visitor's email app.
   * That way the form is never a dead end while the keys are being set up.
   */
  protected readonly sendsInPlace = emailjsReady();

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly subject = signal('');
  protected readonly message = signal('');
  /**
   * Honeypot. Hidden from people, irresistible to the bots that fill in every
   * input they find. A non-empty value means we silently drop the submission.
   */
  protected readonly company = signal('');

  protected readonly state = signal<SendState>('idle');
  protected readonly errorText = signal('');
  /** Only show validation messages once they have tried to send. */
  protected readonly touched = signal(false);

  protected readonly errors = computed(() => ({
    name: this.name().trim().length < 2 ? 'Please give a name.' : '',
    email: !EMAIL.test(this.email().trim()) ? 'Please give an email address she can reply to.' : '',
    message: this.message().trim().length < 10 ? 'A sentence or two, so she knows what this is about.' : '',
  }));

  protected readonly valid = computed(() => !Object.values(this.errors()).some(Boolean));

  protected set(field: 'name' | 'email' | 'subject' | 'message' | 'company', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    ({ name: this.name, email: this.email, subject: this.subject, message: this.message, company: this.company })[
      field
    ].set(value);
    if (this.state() === 'error') this.state.set('idle');
  }

  protected async send(event: Event): Promise<void> {
    event.preventDefault();
    this.touched.set(true);

    if (this.company()) {
      // A bot filled the honeypot. Show success and send nothing.
      this.state.set('sent');
      return;
    }
    if (!this.valid() || this.state() === 'sending') return;

    if (!this.sendsInPlace) {
      window.location.href = this.mailtoFallback();
      this.state.set('handoff');
      return;
    }

    this.state.set('sending');
    this.errorText.set('');

    try {
      const response = await fetch(EMAILJS.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS.serviceId,
          template_id: EMAILJS.templateId,
          user_id: EMAILJS.publicKey,
          template_params: {
            from_name: this.name().trim(),
            from_email: this.email().trim(),
            subject: this.subject().trim() || 'Message from kinjalpandey.com',
            message: this.message().trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text().catch(() => `HTTP ${response.status}`));
      }

      this.state.set('sent');
      this.name.set('');
      this.email.set('');
      this.subject.set('');
      this.message.set('');
      this.touched.set(false);
    } catch (error) {
      this.state.set('error');
      this.errorText.set(error instanceof Error ? error.message.slice(0, 140) : 'Something went wrong.');
    }
  }

  /** Everything typed so far, preserved in a mailto if sending fails. */
  protected readonly mailtoFallback = computed(() => {
    const subject = encodeURIComponent(this.subject().trim() || 'Hello');
    const body = encodeURIComponent(
      `${this.message().trim()}\n\n${this.name().trim()}\n${this.email().trim()}`.trim(),
    );
    return `mailto:kinjalpandey18@gmail.com?subject=${subject}&body=${body}`;
  });

  protected async copy(key: string, value: string, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      this.copied.set(key);
      clearTimeout(this.timer);
      this.timer = window.setTimeout(() => this.copied.set(null), 1800);
    } catch {
      // Clipboard blocked. The link itself still works.
    }
  }
}
