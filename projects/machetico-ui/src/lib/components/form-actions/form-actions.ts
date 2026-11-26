import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../../directives/button/button.directive';

/**
 * Consistent submit and return actions for an enclosing native form.
 * The owning feature handles submission, persistence and cancellation policy.
 *
 * @class FormActions
 */
@Component({
  selector: 'machetico-form-actions',
  imports: [Button],
  templateUrl: './form-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
})
export class FormActions {
  /**
   * Already localized text describing the form's explicit save action.
   *
   * @property submitLabel
   */
  public readonly submitLabel = input.required<string>();

  /**
   * Already localized text for leaving the unsaved editor.
   *
   * @property cancelLabel
   */
  public readonly cancelLabel = input('Volver');

  /**
   * Prevents actions during a mutation or an owned media upload.
   *
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Explicit user intent to leave the editor; never deletes stored data itself.
   *
   * @property cancelled
   */
  public readonly cancelled = output<void>();
}
