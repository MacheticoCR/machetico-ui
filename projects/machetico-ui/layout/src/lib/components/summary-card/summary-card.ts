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
 * Generic record summary with explicit action intent, without subscription or permission decisions.
 * @class SummaryCard
 */
@Component({
  selector: 'machetico-summary-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary-card.html',
})
export class SummaryCard {
  /**
   * Consumer-owned record title.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Supporting record explanation.
   * @property description
   */
  public readonly description = input('');

  /**
   * Already resolved status text; no application enum is interpreted.
   * @property status
   */
  public readonly status = input('');

  /**
   * Action text; an empty value omits the action.
   * @property actionLabel
   */
  public readonly actionLabel = input('');

  /**
   * Whether the action is pending.
   * @property busy
   */
  public readonly busy = input(false);

  /**
   * Consumer-owned availability state.
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Explicit action intent; the parent performs the command.
   * @property activated
   */
  public readonly activated = output<void>();

  /**
   * Emits one enabled action intent without issuing a command.
   * @function activate
   */
  public activate(): void {
    if (!this.busy() && !this.disabled()) this.activated.emit();
  }
}
