import { Directive, input } from '@angular/core';

/**
 * Card exposes semantic state; consumers own styling.
 * @class Card
 */
@Directive({
  selector: '[macheticoCard]',
  host: {
    '[attr.data-card]': 'macheticoCard()',
    '[attr.data-cardpadding]': 'macheticoCardPadding()',
  },
})
export class Card {
  /**
   * Semantic surface variant.
   * @property macheticoCard
   */
  public readonly macheticoCard = input<string>('surface');

  /**
   * Consumer-owned spacing variant.
   * @property macheticoCardPadding
   */
  public readonly macheticoCardPadding = input<string>('none');
}
