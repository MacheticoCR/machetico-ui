import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { IconName } from '../../interfaces';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Icon
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-icon',
  host: {
    'aria-hidden': 'true',
  },
  templateUrl: './icon.html',
})
export class Icon {
  /**
   * Display name supplied by the business or account; user-entered content is not translated
   * automatically.
   *
   * @property name
   */
  public readonly name = input.required<IconName>();
}
