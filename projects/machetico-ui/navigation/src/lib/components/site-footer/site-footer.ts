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
 * Brand-independent footer with consumer-projected navigation and copyright text.
 * @class SiteFooter
 */
@Component({
  selector: 'machetico-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  /**
   * Application-owned classes applied to the native footer layout.
   * @property footerClass
   */
  public readonly footerClass = input('');
  /**
   * Deterministic copyright text supplied by the consumer; no current date is computed.
   * @property copyright
   */
  public readonly copyright = input('');

  /**
   * Accessible label for the projected footer navigation.
   * @property navigationLabel
   */
  public readonly navigationLabel = input('Enlaces del sitio');
}
