import '@angular/localize/init';
import '@angular/compiler';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button, Sidebar, Select } from 'machetico-ui';
import { DocsNavigation } from './features/documentation/components';
import { DEMO_APPEARANCE, DEMO_DESIGNS } from './appearance';
import template from './demo.html?raw';
/**
 * Documentation shell with consumer-owned abstract designs and shared desktop/mobile navigation.
 * @class DocumentationApp
 */
export class DocumentationApp {
  /**
   * Parent-owned mobile navigation state.
   * @property menuOpen
   */
  menuOpen = signal(false);
  /**
   * Consumer-owned design choice applied to the documentation shell, never to library behavior.
   * @property appearance
   */
  appearance = inject(DEMO_APPEARANCE);
  /**
   * Design names shown by the public Select used in the consumer header.
   * @property designs
   */
  designs = DEMO_DESIGNS;
}
Component({
  selector: 'machetico-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsNavigation, RouterLink, RouterOutlet, Button, Sidebar, Select],
  template,
})(DocumentationApp);
