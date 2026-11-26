import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import type { Choice } from '../../interfaces';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Select
 * @typeParam T - Caller-supplied type retained by the shared implementation.
 * @functions `select`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'machetico-select',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option],
  host: {},
  templateUrl: './select.html',
})
export class Select<T extends string = string> {
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
   * Whether the popup is open; accessibility directives own its keyboard and focus behavior.
   *
   * @property expanded
   */
  public readonly expanded = signal(false);

  /**
   * Display label derived from the selected value and currently available choices.
   *
   * @property selectedLabel
   */
  public readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? 'Seleccionar',
  );

  /**
   * Updates the selected value.
   *
   * @function select
   * @param values - Selected values supplied by the Angular ARIA listbox.
   *
   */
  public select(values: T[]): void {
    if (this.disabled() || values[0] === undefined) return;
    this.value.set(values[0]);
    this.expanded.set(false);
  }
}
