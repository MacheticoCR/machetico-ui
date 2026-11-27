import { booleanAttribute, Directive, effect, input, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import type { FieldValue } from 'machetico-ui/core';

/**
 * Reusable abstract base for the Machetico UI user interface.
 *
 * @class FormControl
 * @abstract
 * @functions `onChange` , `onTouched` , `validationInputs` , `writeValue` , `registerOnChange` ,
 * `registerOnTouched` , `setDisabledState` , `registerOnValidatorChange` , `validate` , `changed` ,
 * `touched`
 *
 * @example
 * ```ts
 * class TextValueControl extends FormControl {}
 * ```
 */
@Directive()
export abstract class FormControl implements ControlValueAccessor, Validator {
  /**
   * Visible label, configured or translated according to its source.
   *
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Display name supplied by the business or account; user-entered content is not translated
   * automatically.
   *
   * @property name
   */
  public readonly name = input('');

  /**
   * String representation of the entity identifier; it does not create a second identity.
   *
   * @property id
   */
  public readonly id = input('');

  /**
   * Example or hint shown while the native control has no value.
   *
   * @property placeholder
   */
  public readonly placeholder = input('');

  /**
   * Native browser autofill policy chosen by the consuming form.
   *
   * @property autocomplete
   */
  public readonly autocomplete = input('off');

  /**
   * Whether the form requires a nonempty value before submission.
   *
   * @property required
   */
  public readonly required = input(false, { transform: booleanAttribute });

  /**
   * Whether interaction is disabled; it does not grant or revoke server permissions.
   *
   * @property disabled
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Minimum accepted text length, or null to omit the constraint.
   *
   * @property minlength
   */
  public readonly minlength = input<string | number | null>(null);

  /**
   * Maximum accepted text length, or null to omit the constraint.
   *
   * @property maxlength
   */
  public readonly maxlength = input<string | number | null>(null);

  /**
   * Native and Angular text-validation pattern supplied by the consumer.
   *
   * @property pattern
   */
  public readonly pattern = input<string | RegExp | null>(null);

  /**
   * Consumer-owned classes applied to the native label wrapper.
   *
   * @property labelClass
   */
  public readonly labelClass = input('');

  /**
   * Consumer-owned classes applied to the native form control.
   *
   * @property inputClass
   */
  public readonly inputClass = input('');

  /**
   * IDs of help or error elements connected with aria-describedby.
   *
   * @property describedBy
   */
  public readonly describedBy = input<string | null>(null);

  /**
   * Explicit aria-invalid state supplied by the consuming form.
   *
   * @property invalid
   */
  public readonly invalid = input<string | null>(null);

  /**
   * Current typed value received from or emitted to the consuming contract.
   *
   * @property value
   */
  public readonly value = signal<FieldValue>('');

  /**
   * Disabled state supplied by Angular Forms, combined with the explicit component input.
   *
   * @property formDisabled
   */
  protected readonly formDisabled = signal(false);

  /**
   * Notifies the registered value-change callback.
   *
   * @function onChange
   * @property onChange
   */
  protected onChange: (value: FieldValue) => void = () => {};

  /**
   * Notifies the registered interaction callback.
   *
   * @function onTouched
   * @property onTouched
   */
  protected onTouched: () => void = () => {};

  /**
   * Callback registered by Angular Forms to re-evaluate changed validation constraints.
   *
   * @function onValidatorChange
   * @property onValidatorChange
   */
  private onValidatorChange: () => void = () => {};

  /**
   * Creates the instance and wires its explicit dependencies.
   *
   * @remarks
   * Effects are registered in this constructor. Resource cleanup follows the owning Angular injection
   * scope.
   *
   * @function constructor
   */
  public constructor() {
    effect(() => {
      this.required();
      this.minlength();
      this.maxlength();
      this.pattern();
      this.validationInputs();
      this.onValidatorChange();
    });
  }

  /**
   * Tracks the concrete control constraints used by Angular Forms validation.
   *
   * @function validationInputs
   */
  protected validationInputs(): void {}

  /**
   * Updates the control from Angular Forms without replaying a user edit.
   *
   * @function writeValue
   * @param value - Value to validate or transform under this operation contract.
   *
   */
  public writeValue(value: FieldValue): void {
    this.value.set(value ?? '');
  }

  /**
   * Stores the callback used to notify Angular Forms about a value change.
   *
   * @function registerOnChange
   * @param fn - Callback supplied by the consuming framework or owner; it is retained for the
   * matching notification.
   *
   */
  public registerOnChange(fn: (value: FieldValue) => void): void {
    this.onChange = fn;
  }

  /**
   * Stores the callback used to notify Angular Forms about interaction.
   *
   * @function registerOnTouched
   * @param fn - Callback supplied by the consuming framework or owner; it is retained for the
   * matching notification.
   *
   */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Applies the disabled state received from Angular Forms.
   *
   * @function setDisabledState
   * @param disabled - Whether interaction is disabled; it does not grant or revoke server
   * permissions.
   *
   */
  public setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  /**
   * Prepares the `registerOnValidatorChange` operation for the Machetico UI user interface.
   *
   * @function registerOnValidatorChange
   * @param fn - Callback supplied by the consuming framework or owner; it is retained for the
   * matching notification.
   *
   */
  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  /**
   * Evaluates the control value and returns its validation errors.
   *
   * @function validate
   * @param control - The control argument required by the Machetico UI user interface.
   * @returns The `ValidationErrors | null` value produced by this operation.
   *
   */
  public validate(control: AbstractControl): ValidationErrors | null {
    const validators = [];
    if (this.required()) validators.push(Validators.required);
    if (this.minlength() !== null) validators.push(Validators.minLength(Number(this.minlength())));
    if (this.maxlength() !== null) validators.push(Validators.maxLength(Number(this.maxlength())));
    const pattern = this.pattern();
    if (pattern !== null) validators.push(Validators.pattern(pattern));
    return Validators.compose(validators)?.(control) ?? null;
  }

  /**
   * Propagates an explicit native edit to the Angular Forms value-change callback.
   *
   * @function changed
   * @param event - Native interaction event from the owned control.
   *
   */
  public changed(event: Event): void {
    const target = event.target;
    if (
      typeof HTMLInputElement === 'undefined' ||
      typeof HTMLTextAreaElement === 'undefined' ||
      !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
    )
      return;
    const value =
      target instanceof HTMLInputElement && target.type === 'number'
        ? target.value === ''
          ? null
          : Number.parseFloat(target.value)
        : target.value;
    this.value.set(value);
    this.onChange(value);
  }

  /**
   * Marks the native control as interacted with through Angular Forms.
   *
   * @function touched
   *
   */
  public touched(): void {
    this.onTouched();
  }
}
