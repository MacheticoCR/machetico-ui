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
 * Unchecked native consent control; the consumer owns its text, links and legal interpretation.
 * @class Consent
 */
@Component({
  selector: 'machetico-consent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consent.html',
})
export class Consent {
  /**
   * Accessible description of what the checkbox represents.
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Consumer-owned checkbox selection; false by default.
   * @property accepted
   */
  public readonly accepted = model(false);

  /**
   * Whether interaction is unavailable.
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Native required constraint for the owning form.
   * @property required
   */
  public readonly required = input(false);

  /**
   * Propagates an enabled native checkbox edit without implying signature or payment.
   * @function change
   * @param event - Native checkbox change event.
   */
  public change(event: Event): void {
    if (
      !this.disabled() &&
      typeof HTMLInputElement !== 'undefined' &&
      event.target instanceof HTMLInputElement
    )
      this.accepted.set(event.target.checked);
  }
}
