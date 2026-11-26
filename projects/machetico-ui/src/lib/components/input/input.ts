import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormControl } from '../form-control/form-control';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Input
 * @functions `validationInputs`, `validate`
 */
@Component({
  selector: 'machetico-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.name]': 'null', '[attr.id]': 'null' },
  templateUrl: './input.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Input), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => Input), multi: true },
  ],
})
export class Input extends FormControl {
  /**
   * Discriminator or input kind defined by the containing contract.
   *
   * @property type
   */
  public readonly type = input('text');

  /**
   * Minimum permitted numeric value, applied by the corresponding validator.
   *
   * @property min
   */
  public readonly min = input<string | number | null>(null);

  /**
   * Maximum permitted numeric value, applied by the corresponding validator.
   *
   * @property max
   */
  public readonly max = input<string | number | null>(null);

  /**
   * Native numeric input increment; server validation still controls accepted values.
   *
   * @property step
   */
  public readonly step = input<string | number | null>(null);

  /**
   * Native input-mode hint used to select a virtual keyboard.
   *
   * @property inputmode
   */
  public readonly inputmode = input('');

  /**
   * Browser capitalization policy for this field.
   *
   * @property autocapitalize
   */
  public readonly autocapitalize = input('');

  /**
   * Native browser spelling-check attribute value.
   *
   * @property spellcheck
   */
  public readonly spellcheck = input('');

  /**
   * Enables Angular email-format validation in addition to native control constraints.
   *
   * @property email
   */
  public readonly email = input(false, { transform: booleanAttribute });

  /**
   * Tracks the concrete control constraints used by Angular Forms validation.
   *
   * @function validationInputs
   */
  protected override validationInputs(): void {
    this.min();
    this.max();
    this.email();
    this.type();
  }

  /**
   * Evaluates the control value and returns its validation errors.
   *
   * @function validate
   * @param control - The control argument required by the Machetico UI user interface.
   * @returns The `ValidationErrors | null` value produced by this operation.
   *
   */
  public override validate(control: AbstractControl): ValidationErrors | null {
    const errors = { ...super.validate(control) };
    if (this.type() === 'number') {
      if (this.min() !== null) Object.assign(errors, Validators.min(Number(this.min()))(control));
      if (this.max() !== null) Object.assign(errors, Validators.max(Number(this.max()))(control));
    }
    if (this.email()) Object.assign(errors, Validators.email(control));
    return Object.keys(errors).length ? errors : null;
  }
}
