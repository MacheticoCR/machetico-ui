import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Text } from 'machetico-ui/surface';

/**
 * Accessible native radio card shared by visual editors and onboarding.
 * Owns selection presentation only; the parent validates choices and persists its draft.
 * Project decorative content through the choicePreview slot, without interactive descendants.
 *
 * @class ChoiceCard
 */
@Component({
  selector: 'machetico-choice-card',
  imports: [Text],
  templateUrl: './choice-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
})
export class ChoiceCard {
  /**
   * Native group name shared by mutually exclusive choices.
   *
   * @property name
   */
  public readonly name = input.required<string>();

  /**
   * Persisted identifier rendered on the underlying radio.
   *
   * @property value
   */
  public readonly value = input.required<string>();

  /**
   * Already localized visible accessible label.
   *
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Optional already localized explanation.
   *
   * @property description
   */
  public readonly description = input('');

  /**
   * Parent-owned selected state; this component never mutates a draft.
   *
   * @property checked
   */
  public readonly checked = input(false);

  /**
   * Prevents selection during a pending or forbidden operation.
   *
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Emits exactly once for an enabled native radio change.
   *
   * @property chosen
   */
  public readonly chosen = output<void>();

  /**
   * Reports explicit selection without performing persistence or navigating.
   *
   * @function choose
   */
  protected choose(): void {
    if (!this.disabled()) this.chosen.emit();
  }
}
