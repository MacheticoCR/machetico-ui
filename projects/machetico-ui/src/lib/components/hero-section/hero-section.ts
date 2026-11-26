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
 * Brand-independent landing hero with consumer-projected media and actions.
 * @class HeroSection
 */
@Component({
  selector: 'machetico-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.html',
})
export class HeroSection {
  /**
   * Main heading owned by the consuming page.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Optional introductory context.
   * @property eyebrow
   */
  public readonly eyebrow = input('');

  /**
   * Supporting landing text.
   * @property description
   */
  public readonly description = input('');
}
