import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ViewIds } from '../../services';
/**
 * Projected site navigation with progressive native disclosure; session and routes remain consumer-owned.
 * @class SiteHeader
 */
@Component({
  selector: 'machetico-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
})
export class SiteHeader implements AfterViewInit {
  /**
   * Request-scoped navigation relationship identifier, preserved during hydration.
   * @property navigationId
   */
  public readonly navigationId = inject(ViewIds).next('site-navigation');
  /**
   * Accessible name for navigation.
   * @property label
   */
  public readonly label = input('Navegación principal');
  /**
   * Text describing the disclosure action.
   * @property toggleLabel
   */
  public readonly toggleLabel = input('Mostrar u ocultar navegación');
  /**
   * Whether navigation uses a disclosure; consumers choose its responsive policy.
   * @property collapsible
   */
  public readonly collapsible = input(true);
  /**
   * Consumer-owned disclosure state.
   * @property open
   */
  public readonly open = model(false);
  /**
   * Keeps server-rendered navigation accessible before browser enhancement.
   * @property interactive
   */
  public readonly interactive = signal(false);
  /**
   * Browser platform gate for progressive enhancement.
   * @property browser
   */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  /**
   * Enables disclosure only after the client view exists.
   * @function ngAfterViewInit
   */
  public ngAfterViewInit(): void {
    if (this.browser) this.interactive.set(true);
  }
}
