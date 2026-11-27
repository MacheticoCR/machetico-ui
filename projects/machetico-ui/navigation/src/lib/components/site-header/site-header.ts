import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ViewIds } from 'machetico-ui/view-ids';
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
   * Consumer classes applied to the native header without a distributed stylesheet.
   * @property headerClass
   */
  public readonly headerClass = input('');
  /**
   * Consumer classes applied to the native navigation region.
   * @property navigationClass
   */
  public readonly navigationClass = input('');
  /**
   * Consumer classes applied to the disclosure button.
   * @property toggleClass
   */
  public readonly toggleClass = input('');
  /**
   * Optional viewport width in CSS pixels below which disclosure is enabled.
   * @property collapseBelow
   */
  public readonly collapseBelow = input<number | null>(null);
  /**
   * Current browser breakpoint state, isolated to this view.
   * @property compact
   */
  private readonly compact = signal(false);
  /**
   * Effective disclosure policy; desktop navigation remains visible after closing a mobile menu.
   * @property isCollapsible
   */
  public readonly isCollapsible = computed(
    () => this.collapsible() && (this.collapseBelow() === null || this.compact()),
  );
  /**
   * Owning document used only for browser media-query coordination.
   * @property document
   */
  private readonly document = inject(DOCUMENT);
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
   * Registers responsive disclosure observation and releases it when configuration changes.
   * @function constructor
   */
  public constructor() {
    afterRenderEffect((cleanup) => {
      const width = this.collapseBelow();
      if (!this.browser || width === null) return;
      const media = this.document.defaultView?.matchMedia?.(
        '(max-width: ' + Math.max(0, width - 0.01) + 'px)',
      );
      if (!media) return;
      const update = (): void => this.compact.set(media.matches);
      update();
      media.addEventListener('change', update);
      cleanup(() => media.removeEventListener('change', update));
    });
  }
  /**
   * Enables disclosure only after the client view exists.
   * @function ngAfterViewInit
   */
  public ngAfterViewInit(): void {
    if (this.browser) this.interactive.set(true);
  }
}
