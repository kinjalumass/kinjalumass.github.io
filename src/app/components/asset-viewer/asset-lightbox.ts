import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssetService } from './asset.service';

/**
 * Full-screen viewer for whatever the AssetService currently holds.
 * Rendered once, in DevShell, so it never inherits a transformed ancestor.
 */
@Component({
  selector: 'app-asset-lightbox',
  templateUrl: './asset-lightbox.html',
  styleUrl: './asset-lightbox.scss',
  host: {
    '(document:keydown)': 'onKey($event)',
  },
})
export class AssetLightbox {
  protected readonly viewer = inject(AssetService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly pdfSrc = computed<SafeResourceUrl | null>(() => {
    const asset = this.viewer.current();
    if (!asset || asset.kind !== 'pdf') return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${asset.src}#view=FitH`);
  });

  protected onKey(event: KeyboardEvent): void {
    if (!this.viewer.isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.viewer.close();
    } else if (event.key === 'ArrowRight' && this.viewer.count() > 1) {
      event.preventDefault();
      this.viewer.step(1);
    } else if (event.key === 'ArrowLeft' && this.viewer.count() > 1) {
      event.preventDefault();
      this.viewer.step(-1);
    }
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.viewer.close();
  }
}
