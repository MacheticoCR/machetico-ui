import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Panel
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-panel',
  host: {},
  templateUrl: './panel.html',
})
export class Panel {
  /**
   * Visible title of the associated record or published content.
   *
   * @property title
   */
  public readonly title = input('');
}
