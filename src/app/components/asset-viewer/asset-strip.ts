import { Component, inject, input } from '@angular/core';
import { Asset } from '../../data/assets';
import { AssetService } from './asset.service';

/**
 * Row of clickable tiles for a set of attached documents and photos.
 * Images render as thumbnails; PDFs render as labelled document chips.
 */
@Component({
  selector: 'app-asset-strip',
  templateUrl: './asset-strip.html',
  styleUrl: './asset-strip.scss',
})
export class AssetStrip {
  private readonly viewer = inject(AssetService);

  readonly assets = input.required<Asset[]>();
  /** Small caption above the row */
  readonly label = input<string>('');

  protected open(index: number): void {
    this.viewer.open(this.assets(), index);
  }
}
