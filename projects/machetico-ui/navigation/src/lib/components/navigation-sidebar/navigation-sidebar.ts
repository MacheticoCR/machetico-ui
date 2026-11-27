import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { SiteHeader } from '../site-header/site-header';
/**
 * Nonmodal navigation sidebar sharing responsive disclosure without importing modal or form dependencies.
 * Applications project permission-aware links and own their visual identity.
 * @class NavigationSidebar
 */
@Component({
  selector: 'machetico-navigation-sidebar',
  imports: [SiteHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-sidebar.html',
})
export class NavigationSidebar {
  /**
   * Inline navigation breakpoint in CSS pixels.
   * @property collapseBelow
   */
  public readonly collapseBelow = input(769);
  /**
   * Inline header identity supplied by the application.
   * @property headerClass
   */
  public readonly headerClass = input('');
  /**
   * Inline navigation identity supplied by the application.
   * @property navigationClass
   */
  public readonly navigationClass = input('');
  /**
   * Inline toggle identity supplied by the application.
   * @property toggleClass
   */
  public readonly toggleClass = input('');
  /**
   * Application-owned label for the inline disclosure action.
   * @property toggleLabel
   */
  public readonly toggleLabel = input('Menú');
  /**
   * Accessible title for the navigation panel.
   * @property title
   */
  public readonly title = input.required<string>();

  /**
   * Whether the parent has opened this panel.
   * @property open
   */
  public readonly open = model(false);
}
