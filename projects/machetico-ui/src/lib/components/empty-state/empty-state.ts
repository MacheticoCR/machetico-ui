import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable headless presentation component owned by Angular.
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
