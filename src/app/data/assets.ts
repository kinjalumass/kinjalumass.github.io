/**
 * A viewable document or photo attached to a degree, role, project, or award.
 */
export interface Asset {
  kind: 'image' | 'pdf';
  /** Path relative to the site root, e.g. 'docs/certificates/vt-diploma.pdf' */
  src: string;
  title: string;
  caption?: string;
  /**
   * When false the lightbox offers no open-in-new-tab or download link, so the
   * file is only viewable inside the site. Used for transcripts.
   * Note: this is a UI affordance, not access control — see README.
   */
  shareable?: boolean;
}

export const cert = (src: string, title: string, caption?: string): Asset => ({
  kind: 'pdf',
  src: `docs/certificates/${src}.pdf`,
  title,
  caption,
  shareable: true,
});

export const photo = (src: string, title: string, caption?: string): Asset => ({
  kind: 'image',
  src: `img/gallery/${src}.jpg`,
  title,
  caption,
  shareable: true,
});
