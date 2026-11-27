import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { DisplayMetric } from 'machetico-ui/core';
/**
 * Semantic metric definitions using consumer-formatted values and no backend report contract.
 * @class MetricsList
 */
@Component({
  selector: 'machetico-metrics-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metrics-list.html',
})
export class MetricsList {
  /**
   * Accessible name of the metric list.
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Immutable display projections owned by the consumer.
   * @property metrics
   */
  public readonly metrics = input.required<readonly DisplayMetric[]>();

  /**
   * Text for an empty collection.
   * @property emptyLabel
   */
  public readonly emptyLabel = input('Todavía no hay datos.');

  /**
   * Display text when a metric value is null.
   * @property missingLabel
   */
  public readonly missingLabel = input('—');
}
