import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Visual variants of {@link Alert} retained as semantic identifiers for consumer styling.
 */
export const alertVariants = { error: 'error', success: 'success', info: 'info' };
/**
 * Inline message that reports an error, a success or an informational note.
 *
 * @class Alert
 *
 * @example
 * ```html
 * <machetico-alert variant="error">No se pudo guardar.</machetico-alert>
 * ```
 */
@Component({
  selector: 'machetico-alert',
  templateUrl: './alert.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': "variant() === 'error' ? 'alert' : 'status'",
    'aria-atomic': 'true',
    '[attr.data-variant]': 'variant()',
  },
})
export class Alert {
  /**
   * Visual and semantic variant of the message.
   *
   * @property variant
   */
  public readonly variant = input<keyof typeof alertVariants>('info');

  /**
   * Semantic variant identifier derived from the input.
   *
   * @property variantClasses
   */
  public readonly variantClasses = computed(() => alertVariants[this.variant()]);
}
