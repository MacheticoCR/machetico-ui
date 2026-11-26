import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  afterRenderEffect,
  ElementRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, Panel, Button, Scrollbar } from 'machetico-ui';
import { usageExamples } from '../../../../usage-examples';
import template from './scrollbar.html?raw';

/**
 * Individual documentation and synthetic demonstration of the Scrollbar responsibility.
 * @class ScrollbarDocs
 */
export class ScrollbarDocs {
  /**
   * Copyable consumer-owned installation and integration examples.
   * @property examples
   */
  examples = usageExamples;
  /**
   * Native documentation host queried for its owned scroll container after browser rendering.
   * @property scrollArea
   */
  scrollArea = inject(ElementRef);
  /**
   * Shared reversible marker ownership; native scrolling is never intercepted.
   * @property scrollbar
   */
  scrollbar = inject(Scrollbar);
  /**
   * Consumer-owned example activation state.
   * @property enabled
   */
  enabled = signal(true);
  /**
   * Synthetic long content demonstrating native vertical and horizontal scrolling.
   * @property rows
   */
  rows = Array.from({ length: 24 }, (_, index) => index + 1);
  /**
   * Applies the service after rendering and releases each acquisition when toggled or unmounted.
   * @function constructor
   */
  constructor() {
    afterRenderEffect((cleanup) => {
      if (!this.enabled()) return;
      const area = this.scrollArea.nativeElement.querySelector('[data-scroll-area]');
      if (!area) return;
      const release = this.scrollbar.acquire(area);
      cleanup(release);
    });
  }
}
Component({
  selector: 'docs-scrollbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, Panel, Button],
  template,
})(ScrollbarDocs);
