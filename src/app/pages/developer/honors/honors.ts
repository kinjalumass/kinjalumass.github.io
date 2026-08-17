import { Component } from '@angular/core';
import { AssetStrip } from '../../../components/asset-viewer/asset-strip';
import { CERTIFICATIONS, HONORS, SELECTIONS } from '../../../data/profile';

@Component({
  selector: 'app-honors',
  imports: [AssetStrip],
  templateUrl: './honors.html',
  styleUrl: './honors.scss',
})
export class Honors {
  protected readonly honors = HONORS;
  protected readonly selections = SELECTIONS;
  protected readonly certifications = CERTIFICATIONS;
}
