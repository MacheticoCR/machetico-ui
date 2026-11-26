import '@angular/localize/init';
import '@angular/compiler';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button, Sidebar, Select } from 'machetico-ui';
import { DocsNavigation } from './features/documentation/components';
import { DEMO_APPEARANCE, DEMO_DESIGNS } from './appearance';
import template from './demo.html?raw';
import packageInfo from '../projects/machetico-ui/package.json';
/**
 * Documentation shell with consumer-owned abstract designs and shared desktop/mobile navigation.
 * @class DocumentationApp
 */
export class DocumentationApp {
  /**
   * Package version compiled from the source manifest, not a separately maintained label.
   * @property version
   */
  version = packageInfo.version;
  /**
   * Deployment source revision supplied by the Pages build, or local for development.
   * @property revision
   */
  revision = import.meta.env.VITE_DOCS_REVISION ?? 'local';
  /**
   * Moves native focus to the content without changing a hash-router route.
   * @function skipToContent
   * @param event - Native activation of the skip-navigation anchor.
   */
  skipToContent(event) {
    event.preventDefault();
    const content = event.currentTarget.ownerDocument.getElementById('contenido');
    content?.focus();
    content?.scrollIntoView();
  }
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
