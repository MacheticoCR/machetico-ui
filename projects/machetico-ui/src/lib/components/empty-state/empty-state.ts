import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Consumer-supplied empty-result explanation with projected recovery actions.
 *
 * @class EmptyState
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-empty-state',
  host: {},
  templateUrl: './empty-state.html',
})
export class EmptyState {
  /**
   * Meaningful empty-result explanation supplied by the consuming view.
   *
   * @property message
   */
  public readonly message = input.required<string>();
}
