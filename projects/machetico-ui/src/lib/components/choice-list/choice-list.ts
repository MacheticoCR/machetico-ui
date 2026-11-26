import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { Choice } from '../../interfaces';

/**
 * Angular ARIA listbox with explicit selection and caller-owned choices and value.
 *
 * @class ChoiceList
 * @typeParam T - Caller-supplied type retained by the shared implementation.
 * @functions `select`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-choice-list',
  imports: [Listbox, Option],
  host: {},
  templateUrl: './choice-list.html',
})
export class ChoiceList<T extends string = string> {
  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Allowed choices or explicit operation configuration, according to the containing contract.
   *
   * @property options
   */
  public readonly options = input.required<readonly Choice<T>[]>();

  /**
   * Current typed value received from or emitted to the consuming contract.
   *
   * @property value
   */
  public readonly value = model.required<T>();

  /**
   * Whether interaction is disabled; it does not grant or revoke server permissions.
   *
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Updates the selected value.
   *
   * @function select
   * @param values - Selected values supplied by the Angular ARIA listbox.
   *
   */
  public select(values: T[]): void {
    if (!this.disabled() && values[0] !== undefined) this.value.set(values[0]);
  }
}
