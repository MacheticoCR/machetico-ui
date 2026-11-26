import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  HostAttributeToken,
  output,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AccordionGroup,
  AccordionTrigger,
  AccordionPanel,
  AccordionContent,
} from '@angular/aria/accordion';
import { Icon } from 'machetico-ui';
import { componentCatalog, directiveCatalog } from '../../../../catalog.generated';
import { serviceCatalog } from '../../../../service-catalog';
import template from './docs-navigation.html?raw';
/**
 * Route-aware single-expansion documentation navigation reused on desktop and mobile.
 * @class DocsNavigation
 */
export class DocsNavigation {
  /**
   * Distinguishes stable ARIA relationships between the desktop and mobile instances.
   * @property idPrefix
   */
  idPrefix = inject(new HostAttributeToken('data-nav-id'));
  /**
   * Leaf navigation intent allowing the shell to close its mobile modal.
   * @property selected
   */
  selected = output();
  /**
   * Angular Router owns successful SPA navigation state without subscriptions.
   * @property router
   */
  router = inject(Router);
  /**
   * Successful navigation URL selects its documentation category.
   * @property url
   */
  url = computed(
    () => this.router.lastSuccessfulNavigation()?.finalUrl?.toString() ?? this.router.url,
  );
  /**
   * Optional manual disclosure state for the current successful navigation identifier only.
   * @property expansion
   */
  expansion = signal(null);
  /**
   * Successful navigation selects its category; manual interaction allows at most one open panel.
   * @property expandedCategory
   */
  expandedCategory = computed(() => {
    const url = this.url();
    const manual = this.expansion();
    if (manual?.navigationId === (this.router.lastSuccessfulNavigation()?.id ?? 0))
      return manual.category;
    return url.split(/[/?#]/)[1] ?? null;
  });
  /**
   * Category-owned leaves; services list actual shared responsibilities, including marked internals.
   * @property groups
   */
  groups = [
    {
      id: 'components',
      label: 'Componentes',
      overview: 'Ver componentes',
      items: componentCatalog,
    },
    { id: 'services', label: 'Servicios', overview: 'Ver servicios', items: serviceCatalog },
    { id: 'directives', label: 'Directivas', overview: 'Ver directivas', items: directiveCatalog },
  ];
  /**
   * Stores an explicit accordion change without collapsing a newer selection from another trigger.
   * @function setExpanded
   * @param category - Owning documentation category.
   * @param expanded - New state emitted by Angular ARIA.
   */
  setExpanded(category, expanded) {
    if (expanded || this.expandedCategory() === category) {
      this.expansion.set({
        navigationId: this.router.lastSuccessfulNavigation()?.id ?? 0,
        category: expanded ? category : null,
      });
    }
  }
}
Component({
  selector: 'docs-navigation',
  outputs: ['selected'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    Icon,
  ],
  template,
})(DocsNavigation);
