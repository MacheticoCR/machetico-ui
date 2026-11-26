import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeading, Panel, Alert } from 'machetico-ui';
import { usageExamples } from '../../../../usage-examples';
import template from './view-ids.html?raw';

/**
 * Individual documentation and synthetic demonstration of the ViewIds responsibility.
 * @class ViewIdsDocs
 */
export class ViewIdsDocs {
  /**
   * Copyable consumer-owned installation and integration examples.
   * @property examples
   */
  examples = usageExamples;
}
Component({
  selector: 'docs-view-ids',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeading, Panel, Alert],
  template,
})(ViewIdsDocs);
