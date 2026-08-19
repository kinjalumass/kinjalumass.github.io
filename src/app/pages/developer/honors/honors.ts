import { Component } from '@angular/core';
import { AssetStrip } from '../../../components/asset-viewer/asset-strip';
import {
  CERTIFICATIONS,
  HONOR_PLATES,
  HONORS,
  SELECTIONS,
  certDoc,
  certThumb,
} from '../../../data/profile';

@Component({
  selector: 'app-honors',
  imports: [AssetStrip],
  templateUrl: './honors.html',
  styleUrl: './honors.scss',
})
export class Honors {
  protected readonly honors = HONORS;
  protected readonly plates = HONOR_PLATES;
  protected readonly selections = SELECTIONS;
  protected readonly certifications = CERTIFICATIONS;

  /** Split so the ones with a document lead, rather than interleaving. */
  protected readonly documented = CERTIFICATIONS.filter((c) => !!c.slug);
  protected readonly undocumented = CERTIFICATIONS.filter((c) => !c.slug);

  protected readonly doc = certDoc;
  protected readonly thumb = certThumb;
}
