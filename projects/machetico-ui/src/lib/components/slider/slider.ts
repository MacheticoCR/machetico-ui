import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

/**
 * Slider owns reusable visual interactions; consumers own data and persistence.
 * @class Slider
 */
@Component({
  selector: 'machetico-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slider.html',
})
export class Slider {
  /**
   * Accessible visible control label.
   * @property label
   */
  public readonly label = input.required<string>();

  /**
   * Current numeric value; updates emit valueChange through Angular model.
   * @property value
   */
  public readonly value = model(0);

  /**
   * Lower inclusive limit.
   * @property min
   */
  public readonly min = input(0);

  /**
   * Upper inclusive limit.
   * @property max
   */
  public readonly max = input(100);

  /**
   * Native step increment.
   * @property step
   */
  public readonly step = input(1);

  /**
   * Whether editing is prevented.
   * @property disabled
   */
  public readonly disabled = input(false);

  /**
   * Emits the browser-clamped range value from an explicit input interaction.
   * @function change
   * @param event - Native range input event.
   */
  public change(event: Event): void {
    if (this.disabled() || !(event.target instanceof HTMLInputElement)) return;
    this.value.set(event.target.valueAsNumber);
  }
}
