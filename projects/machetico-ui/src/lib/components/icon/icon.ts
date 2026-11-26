import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { IconName } from '../../interfaces';

/**
 * Decorative SVG rendering of the curated Lucide names shared with Taurus; consumers label enclosing actions.
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
