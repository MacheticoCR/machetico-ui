import { NgTemplateOutlet } from '@angular/common';
import type { TemplateRef } from '@angular/core';
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
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-section.html',
})
export class HeroSection {
  /**
   * Optional application-owned composition, retaining the shared semantic section and naming.
   * @property contentTemplate
   */
  public readonly contentTemplate = input<TemplateRef<unknown> | null>(null);
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
