import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, Panel, Alert, Button, Dialog } from 'machetico-ui';
import { usageExamples } from '../../../../usage-examples';
import template from './scroll-lock.html?raw';

/**
 * Individual documentation and synthetic demonstration of the ScrollLock responsibility.
 * @class ScrollLockDocs
 */
export class ScrollLockDocs {
  /**
   * Copyable consumer-owned installation and integration examples.
   * @property examples
   */
  examples = usageExamples;
  /**
   * Parent-owned modal state used to demonstrate the internal lock through the public Dialog API.
   * @property open
   */
  open = signal(false);
}
Component({
  selector: 'docs-scroll-lock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, Panel, Alert, Button, Dialog],
  template,
})(ScrollLockDocs);
