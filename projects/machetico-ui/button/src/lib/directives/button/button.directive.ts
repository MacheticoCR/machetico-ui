import { booleanAttribute, Directive, input } from '@angular/core';

/**
 * Button exposes semantic state; consumers own styling.
 * @class Button
 */
@Directive({
  selector: 'button[macheticoButton], a[macheticoButton]',
  host: {
    '[attr.data-variant]': 'macheticoButton() || "primary"',
    '[attr.data-size]': 'macheticoButtonSize()',
    '[attr.disabled]': 'disabled() || busy() ? "" : null',
    '[attr.aria-disabled]': 'disabled() || busy() ? true : null',
    '[attr.aria-busy]': 'busy() ? true : null',
    '(click)': 'guard($event)',
  },
})
export class Button {
  /**
   * Semantic action variant.
   * @property macheticoButton
   */
  public readonly macheticoButton = input<
    'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | ''
  >('primary');

  /**
   * Consumer-owned size variant.
   * @property macheticoButtonSize
   */
  public readonly macheticoButtonSize = input<'sm' | 'md'>('md');

  /**
   * Unavailable action.
   * @property disabled
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Pending action that cannot activate again.
   * @property busy
   */
  public readonly busy = input(false);

  /**
   * Cancels unavailable anchor navigation; native buttons also receive disabled.
   * @function guard
   * @param event - Native activation event.
   */
  public guard(event: Event): void {
    if (this.disabled() || this.busy()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
