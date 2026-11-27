import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';

/**
 * Polite loading announcement for routed views and pending reads, without owning HTTP.
 * @class RouteStatus
 */
@Component({
  selector: 'machetico-route-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './route-status.html',
})
export class RouteStatus {
  /**
   * Meaningful loading text supplied by the consumer.
   * @property label
   */
  public readonly label = input('Cargando');

  /**
   * Whether the loading announcement should be displayed.
   * @property busy
   */
  public readonly busy = input(true);
}
