import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Asset } from '../../data/assets';

interface ViewerState {
  assets: Asset[];
  index: number;
}

/**
 * Single source of truth for the lightbox. Any page can call `open()`;
 * one `AssetLightbox` instance lives in DevShell and renders the result.
 */
@Injectable({ providedIn: 'root' })
export class AssetService {
  /** Injected rather than global, so this file is safe to prerender. */
  private readonly doc = inject(DOCUMENT);

  private readonly state = signal<ViewerState | null>(null);

  readonly isOpen = computed(() => this.state() !== null);
  readonly current = computed(() => {
    const s = this.state();
    return s ? s.assets[s.index] : null;
  });
  readonly index = computed(() => this.state()?.index ?? 0);
  readonly count = computed(() => this.state()?.assets.length ?? 0);

  open(assets: Asset[], index = 0): void {
    if (!assets.length) return;
    this.state.set({ assets, index: Math.max(0, Math.min(index, assets.length - 1)) });
    this.doc.body.style.overflow = 'hidden';
  }

  close(): void {
    this.state.set(null);
    this.doc.body.style.overflow = '';
  }

  step(delta: number): void {
    this.state.update((s) => {
      if (!s) return s;
      const next = (s.index + delta + s.assets.length) % s.assets.length;
      return { ...s, index: next };
    });
  }
}
