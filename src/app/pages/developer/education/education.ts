import { Component, inject } from '@angular/core';
import { AssetStrip } from '../../../components/asset-viewer/asset-strip';
import { AssetService } from '../../../components/asset-viewer/asset.service';
import { Asset } from '../../../data/assets';
import { CERTIFICATIONS, DEGREES, FOCUS_AREAS } from '../../../data/profile';

@Component({
  selector: 'app-education',
  imports: [AssetStrip],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education {
  private readonly viewer = inject(AssetService);

  protected readonly degrees = DEGREES;
  protected readonly focus = FOCUS_AREAS;
  protected readonly certifications = CERTIFICATIONS;

  protected openTranscript(transcript: Asset): void {
    this.viewer.open([transcript], 0);
  }
}
