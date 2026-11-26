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
 * Reusable statement section with projected content and actions, independent of landing copy.
 * @class ContentSection
 */
@Component({
  selector: 'machetico-content-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-section.html',
})
export class ContentSection {
  /**
   * Visible section heading.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Optional context label.
   * @property eyebrow
   */
  public readonly eyebrow = input('');

  /**
   * Optional introductory text.
   * @property description
   */
  public readonly description = input('');
}
