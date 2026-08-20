/**
 * Contact form delivery.
 *
 * The site is static, so there is no server to accept a form post. EmailJS
 * takes the submission straight from the browser and emails it on, which is
 * why the three values below are safe to commit: the public key is designed to
 * be visible, and EmailJS restricts use by domain rather than by secrecy.
 *
 * Until these are filled in the form does not render at all, and the contact
 * page falls back to the direct channels. Nothing breaks while it is empty.
 *
 * Setup, about ten minutes and free for 200 emails a month:
 *
 *   1. Sign up at https://www.emailjs.com and add an Email Service
 *      (Gmail works; connect kinjalpandey18@gmail.com). Copy the Service ID.
 *   2. Create an Email Template. Use these variable names in it, because they
 *      are what this form sends:
 *        {{from_name}}  {{from_email}}  {{subject}}  {{message}}
 *      Set the template's "Reply To" to {{from_email}} so replying goes to
 *      the sender rather than to yourself. Copy the Template ID.
 *   3. Account, then General, then copy the Public Key.
 *   4. Account, then Security: turn OFF "Allow EmailJS API for non-browser
 *      applications", and add kinjalpandey.com to the allowed origins so
 *      nobody can use these IDs from anywhere else.
 *   5. Paste the three values below, rebuild, and push.
 */
export const EMAILJS = {
  serviceId: '',
  templateId: '',
  publicKey: '',

  /** Where the browser posts. Also allowlisted in the CSP in index.html. */
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
};

/** The form only appears once all three IDs are present. */
export const emailjsReady = (): boolean =>
  Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey);
