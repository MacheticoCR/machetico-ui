import { Directive, input } from '@angular/core';

/**
 * Text exposes semantic state; consumers own styling.
 * @class Text
 */
@Directive({
  selector: '[macheticoText]',
  host: {
    '[attr.data-text]': 'macheticoText()',
  },
})
export class Text {
  /**
   * Semantic typography variant.
   * @property macheticoText
   */
  public readonly macheticoText = input<string>('body');
}
