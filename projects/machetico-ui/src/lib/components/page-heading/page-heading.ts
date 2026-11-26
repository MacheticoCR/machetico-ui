import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Text } from '../../directives/text/text.directive';

/**
 * Shared page heading with an optional context label, description and projected actions.
 * Rendering is independent of authentication, business state and browser document titles.
 * The owning routed feature remains responsible for those side effects.
 *
 * @class PageHeading
 */
@Component({
  selector: 'machetico-page-heading',
  imports: [Text],
  templateUrl: './page-heading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {},
})
export class PageHeading {
  /**
   * Localized or business-owned heading rendered without HTML interpolation.
   *
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Optional localized supporting text.
   *
   * @property description
   */
  public readonly description = input('');

  /**
   * Optional business context; never inferred from a domain profile.
   *
   * @property eyebrow
   */
  public readonly eyebrow = input('');

  /**
   * Display scale used by public landing introductions and operational pages.
   *
   * @property prominent
   */
  public readonly prominent = input(false);
}
