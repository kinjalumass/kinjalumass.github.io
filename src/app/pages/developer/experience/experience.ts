import { Component, computed, signal } from '@angular/core';
import { AssetStrip } from '../../../components/asset-viewer/asset-strip';
import { ROLES, ROLE_KINDS, RoleKind } from '../../../data/profile';

@Component({
  selector: 'app-experience',
  imports: [AssetStrip],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  protected readonly kinds = ROLE_KINDS;
  protected readonly filter = signal<RoleKind>('All');

  protected readonly roles = computed(() =>
    this.filter() === 'All' ? ROLES : ROLES.filter((r) => r.kind === this.filter()),
  );

  protected readonly total = ROLES.length;

  protected countFor(kind: RoleKind): number {
    return kind === 'All' ? ROLES.length : ROLES.filter((r) => r.kind === kind).length;
  }

  protected select(kind: RoleKind): void {
    this.filter.set(kind);
  }
}
