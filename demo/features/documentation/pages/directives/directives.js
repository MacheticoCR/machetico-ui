import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as ui from 'machetico-ui';
import { directiveCatalog, directiveCode } from '../../../../catalog.generated';
import { directiveExamples } from '../../../../example-markup';
import { apiColumns, apiKey, sampleSvg } from '../../../../sample-data';
import template from './directives.html?raw';
/**
 * Native directive demonstrations with consumer-owned classes and synthetic data.
 * @class DirectivesDocs
 */
export class DirectivesDocs {
  /**
   * Immutable parent-owned sort for the native-table example; no request is sent.
   * @property nativeSort
   */
  nativeSort = signal(null);
  /**
   * Complete catalogue used by the category overview.
   * @property catalogue
   */
  catalogue = directiveCatalog;
  /**
   * Current route snapshot, read after Angular's successful navigation signal changes.
   * @property route
   */
  route = inject(ActivatedRoute);
  /**
   * Reactive router navigation ownership without Observable subscriptions.
   * @property router
   */
  router = inject(Router);
  /**
   * Selected documentation identifier for the current SPA deep link.
   * @property selectedId
   */
  selectedId = computed(() => {
    this.router.lastSuccessfulNavigation();
    return this.route.snapshot.paramMap.get('directive');
  });
  /**
   * Only the selected example is instantiated; other controls and their timers stay unloaded.
   * @property entries
   */
  entries = computed(() => directiveCatalog.filter((item) => item.id === this.selectedId()));
  /**
   * Public method documentation columns derived from checked-in source.
   * @property methodColumns
   */
  methodColumns = [
    { key: 'name', label: 'Método', value: (row) => row.name },
    { key: 'signature', label: 'Firma', value: (row) => row.signature },
    { key: 'description', label: 'Responsabilidad', value: (row) => row.description },
  ];
  /**
   * Copyable source snippets rendered as text rather than executed as application logic.
   * @property examples
   */
  examples = directiveCode;
  /**
   * Consumer-owned column definitions for the input/output reference tables.
   * @property apiColumns
   */
  apiColumns = apiColumns;
  /**
   * Stable public property name used to track API table rows.
   * @property apiKey
   */
  apiKey = apiKey;
  /**
   * Synthetic pending action state shared by the button and checkbox demonstrations.
   * @property busy
   */
  busy = signal(false);
  /**
   * Number of enabled button activations in the synthetic example.
   * @property count
   */
  count = signal(0);
  /**
   * Deterministic local SVG source for responsive-image bindings.
   * @property sampleImage
   */
  sampleImage = sampleSvg('#bfdbfe', 'Imagen adaptable');
}
const cases = directiveCatalog
  .map((entry) => `@case ('${entry.id}') {${directiveExamples[entry.id]}}`)
  .join('');
Component({
  selector: 'docs-directives',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    ...directiveCatalog.map((entry) => ui[entry.name]),
    ui.Card,
    ui.Checkbox,
    ui.PageHeading,
    ui.Panel,
    ui.Alert,
    ui.Table,
  ],
  template: template.replace('<!-- live-examples -->', cases),
})(DirectivesDocs);
