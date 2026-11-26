import { Directive, input } from '@angular/core';

/**
 * Badge exposes semantic state; consumers own styling.
 * @class Badge
 */
@Directive({ selector: '[macheticoBadge]', host: { '[attr.data-badge]': 'macheticoBadge()' } })
export class Badge {
  /**
   * Semantic status variant.
   * @property macheticoBadge
   */
  public readonly macheticoBadge = input<string>('neutral');
}
