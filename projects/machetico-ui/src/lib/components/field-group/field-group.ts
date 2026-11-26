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
 * Native accessible fieldset grouping existing controls; validation and values remain consumer-owned.
 * @class FieldGroup
 */
@Component({
  selector: 'machetico-field-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-group.html',
})
export class FieldGroup {
  /**
   * Visible accessible name for the grouped form controls.
   * @property legend
   */
  public readonly legend = input.required<string>();

  /**
   * Native disabled state inherited by descendants supporting fieldset semantics.
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Optional instructions for this field group.
   * @property description
   */
  public readonly description = input('');
}
