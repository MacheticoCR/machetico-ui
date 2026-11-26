import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../directives/card/card.directive';
import { Text } from '../../directives/text/text.directive';

/**
 * Consumer-owned statistic label, value and explanation with semantic emphasis state.
 *
 * @class StatCard
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-stat-card',
  imports: [Card, Text],
  host: {},
  templateUrl: './stat-card.html',
})
export class StatCard {
  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Current typed value received from or emitted to the consuming contract.
   *
   * @property value
   */
  public readonly value = input.required<string | number>();

  /**
   * Human-readable description rendered as text, without executing user-supplied HTML.
   *
   * @property description
   */
  public readonly description = input('');

  /**
   * Semantic emphasis state for a statistic requiring consumer attention.
   *
   * @property attention
   */
  public readonly attention = input(false);
}
