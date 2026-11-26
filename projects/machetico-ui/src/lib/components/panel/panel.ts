import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Content container with an optional heading and a projected consumer action slot.
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
