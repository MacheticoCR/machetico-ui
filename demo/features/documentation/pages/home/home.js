import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert, Button, Card, ContentSection, HeroSection, Panel, Slider } from 'machetico-ui';
import { DEMO_APPEARANCE, DEMO_DESIGNS } from '../../../../appearance';
import template from './home.html?raw';
/**
 * Public library introduction with MacheTico authorship and the repository's MIT usage terms.
 * @class HomeDocs
 */
export class HomeDocs {
  /**
   * Shared consumer design choice retained only within the current documentation application.
   * @property appearance
   */
  appearance = inject(DEMO_APPEARANCE);
  /**
   * Abstract design references implemented exclusively by the demo's Tailwind/CSS stylesheet.
   * @property designs
   */
  designs = DEMO_DESIGNS;
  /**
   * Synthetic action count remains unchanged when the consumer switches visual identity.
   * @property activations
   */
  activations = signal(0);
  /**
   * Synthetic range value demonstrates behavior independent of consumer design.
   * @property level
   */
  level = signal(40);
}
Component({
  selector: 'docs-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Alert, Button, Card, ContentSection, HeroSection, Panel, Slider],
  template,
})(HomeDocs);
