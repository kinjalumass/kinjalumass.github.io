import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Deterrents against casually saving the photographs.
 *
 * ⚠️  READ THIS BEFORE TRUSTING IT.
 *
 * No website can prevent an image being copied. The browser has to receive
 * the file in order to draw it, so it is always in the cache, always in
 * devtools, and always one screenshot away. Anything claiming otherwise is
 * selling something.
 *
 * What this actually does is raise the effort above "right-click, Save image"
 * — which is how the overwhelming majority of casual reuse happens. The real
 * protection is the invisible watermark in every photograph (see
 * `tools/watermark.py`), which makes a leaked copy traceable back to this
 * site even after it has been screenshotted, rescaled and re-compressed.
 *
 * Deliberately narrow: it only intercepts events on images. Right-click still
 * works everywhere else on the page, because breaking the whole context menu
 * annoys legitimate visitors — including the casting directors and recruiters
 * this site exists for.
 */
@Injectable({ providedIn: 'root' })
export class ImageGuard {
  private readonly doc = inject(DOCUMENT);

  install(): void {
    const isImage = (target: EventTarget | null): boolean =>
      target instanceof Element &&
      (target.tagName === 'IMG' || !!target.closest('figure, .plate, .card__img'));

    // "Save image as…" / "Copy image"
    this.doc.addEventListener(
      'contextmenu',
      (event) => {
        if (isImage(event.target)) event.preventDefault();
      },
      { capture: true },
    );

    // Dragging a photograph onto the desktop saves it
    this.doc.addEventListener(
      'dragstart',
      (event) => {
        if (isImage(event.target)) event.preventDefault();
      },
      { capture: true },
    );
  }
}
