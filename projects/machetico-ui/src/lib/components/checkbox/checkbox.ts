import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Reusable headless presentation component owned by Angular.
 *
 * @class Checkbox
 * @functions `writeValue` , `registerOnChange` , `registerOnTouched` , `setDisabledState` ,
 * `changed` , `touched`
 */
@Component({
  selector: 'machetico-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.name]': 'null', '[attr.id]': 'null' },
  templateUrl: './checkbox.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true }],
})
export class Checkbox implements ControlValueAccessor {
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
   * Whether interaction is disabled; it does not grant or revoke server permissions.
   *
   * @property disabled
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Current checkbox value synchronized with Angular Forms.
   *
   * @property checked
   */
  public readonly checked = signal(false);

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
  private onChange: (value: boolean) => void = () => {};

  /**
   * Notifies the registered interaction callback.
   *
   * @function onTouched
   * @property onTouched
   */
  private onTouched: () => void = () => {};

  /**
   * Updates the control from Angular Forms without replaying a user edit.
   *
   * @function writeValue
   * @param value - Value to validate or transform under this operation contract.
   *
   */
  public writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  /**
   * Stores the callback used to notify Angular Forms about a value change.
   *
   * @function registerOnChange
   * @param fn - Callback supplied by the consuming framework or owner; it is retained for the
   * matching notification.
   *
   */
  public registerOnChange(fn: (value: boolean) => void): void {
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
   * Propagates an explicit native edit to the Angular Forms value-change callback.
   *
   * @function changed
   * @param event - Native interaction event from the owned control.
   *
   */
  public changed(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.checked.set(event.target.checked);
    this.onChange(event.target.checked);
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
