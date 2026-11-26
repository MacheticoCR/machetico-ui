import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { ComparisonItem } from '../../interfaces';
/**
 * Read-only comparison table without bundling claims, pricing logic or persistence.
 * @class ComparisonList
 */
@Component({
  selector: 'machetico-comparison-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-list.html',
})
export class ComparisonList {
  /**
   * Accessible table caption.
   * @property caption
   */
  public readonly caption = input.required<string>();

  /**
   * Consumer-owned rows to compare.
   * @property items
   */
  public readonly items = input.required<readonly ComparisonItem[]>();

  /**
   * Heading of the baseline column.
   * @property beforeLabel
   */
  public readonly beforeLabel = input('Antes');

  /**
   * Heading of the alternative column.
   * @property afterLabel
   */
  public readonly afterLabel = input('Con esta opción');
}
