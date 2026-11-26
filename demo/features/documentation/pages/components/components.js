import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as ui from 'machetico-ui';
import { componentCatalog, componentCode, iconNames } from '../../../../catalog.generated';
import { componentExamples } from '../../../../example-markup';
import { apiColumns, apiKey, sampleSvg, samplePortrait } from '../../../../sample-data';
import { componentGuides } from '../../../../component-guides';
import template from './components.html?raw';
/**
 * Interactive public component catalogue with synthetic data owned by the documentation page.
 * @class ComponentsDocs
 */
export class ComponentsDocs {
  /**
   * Complete catalogue used by the category overview.
   * @property catalogue
   */
  catalogue = componentCatalog;
  /**
   * Per-control integration, keyboard, state and styling guidance owned by the documentation.
   * @property guides
   */
  guides = componentGuides;
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
    return this.route.snapshot.paramMap.get('component');
  });
  /**
   * Only the selected example is instantiated; other controls and their timers stay unloaded.
   * @property entries
   */
  entries = computed(() => componentCatalog.filter((item) => item.id === this.selectedId()));
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
   * Current native range value selected in the synthetic slider example.
   * @property value
   */
  value = signal(30);
  /**
   * Synthetic editable person name used by the native form examples.
   * @property name
   */
  name = signal('Alex Ejemplo');
  /**
   * Transient sample text owned by the documentation page.
   * @property notes
   */
  notes = signal('Estos datos son sintéticos.');
  /**
   * Current synthetic checkbox selection, independent of persisted application data.
   * @property agreed
   */
  agreed = signal(false);
  /**
   * Selected sample radio-card identifier.
   * @property plan
   */
  plan = signal('basic');
  /**
   * Selected sample view identifier controlled by the ARIA choice list.
   * @property view
   */
  view = signal('list');
  /**
   * Selected sample value controlled by the ARIA combobox.
   * @property choice
   */
  choice = signal('uno');
  /**
   * Number of retry intents emitted by the deferred-error demonstration.
   * @property retries
   */
  retries = signal(0);
  /**
   * Number of create intents emitted from the empty-state example.
   * @property emptyAction
   */
  emptyAction = signal(0);
  /**
   * Consumer-owned modal visibility; the optional query flag demonstrates open-modal hydration.
   * @property dialog
   */
  dialog = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('dialog') === 'open');
  /**
   * Consumer-owned visibility of the example navigation panel.
   * @property sidebar
   */
  sidebar = signal(false);
  /**
   * Synthetic pending state that prevents the example modal from being dismissed.
   * @property modalBusy
   */
  modalBusy = signal(false);
  /**
   * Accessible feedback for synthetic submit and cancel intents.
   * @property formMessage
   */
  formMessage = signal('');
  /**
   * One-based selected page for the pagination demonstration.
   * @property page
   */
  page = signal(1);
  /**
   * Selected successful or failed feedback state in the synthetic demonstration.
   * @property feedbackState
   */
  feedbackState = signal('success');
  /**
   * Selected data, loading, empty or error state for the table demonstration.
   * @property tableState
   */
  tableState = signal('ready');
  /**
   * Latest immutable sorting intent emitted by the example data table.
   * @property sort
   */
  sort = signal(null);
  /**
   * Stable synthetic choices for the select demonstration.
   * @property options
   */
  options = [
    { value: 'uno', label: 'Primera opción' },
    { value: 'dos', label: 'Segunda opción' },
  ];
  /**
   * Synthetic view options for the ARIA listbox demonstration.
   * @property viewOptions
   */
  viewOptions = [
    { value: 'list', label: 'Lista' },
    { value: 'cards', label: 'Tarjetas' },
  ];
  /**
   * Selectable success and failure states for the feedback example.
   * @property feedbackOptions
   */
  feedbackOptions = [
    { value: 'success', label: 'Éxito' },
    { value: 'error', label: 'Error' },
  ];
  /**
   * Selectable table states used to exercise loading, failure and recovery.
   * @property tableOptions
   */
  tableOptions = [
    { value: 'ready', label: 'Datos' },
    { value: 'loading', label: 'Cargando' },
    { value: 'empty', label: 'Vacío' },
    { value: 'error', label: 'Error' },
  ];
  /**
   * Deterministic synthetic records owned by this documentation page.
   * @property baseRows
   */
  baseRows = [
    { id: 1, name: 'Ejemplo A' },
    { id: 2, name: 'Ejemplo B' },
    { id: 3, name: 'Ejemplo C' },
  ];
  /**
   * Derived synthetic rows reflecting the sorting intent without network requests.
   * @property rows
   */
  rows = computed(() =>
    this.sort()?.direction === 'desc' ? [...this.baseRows].reverse() : this.baseRows,
  );
  /**
   * Consumer-owned display accessors for the example table or service reference.
   * @property columns
   */
  columns = [{ key: 'name', label: 'Nombre', sortable: true, value: (row) => row.name }];
  /**
   * Stable consumer-owned identity accessor for the displayed example records.
   * @property key
   */
  key = (row) => row.id;
  /**
   * Complete public Lucide icon-name subset generated from the library contract.
   * @property icons
   */
  icons = iconNames;
  /**
   * Deterministic server-safe decorative poster for the local background-video example.
   * @property poster
   */
  poster = sampleSvg('#ddd6fe', 'Video de ejemplo');
  /**
   * Local synthetic slides with unique identity and accessible captions.
   * @property slides
   */
  slides = [
    {
      id: 'a',
      src: samplePortrait('#bfdbfe', 'Primera imagen'),
      alt: 'Ejemplo azul',
      caption: 'Primera imagen',
    },
    {
      id: 'b',
      src: samplePortrait('#bbf7d0', 'Segunda imagen'),
      alt: 'Ejemplo verde',
      caption: 'Segunda imagen',
    },
    {
      id: 'c',
      src: samplePortrait('#ddd6fe', 'Tercera imagen'),
      alt: 'Ejemplo violeta',
      caption: 'Tercera imagen',
    },
  ];
  /**
   * Copyable source snippets rendered as text rather than executed as application logic.
   * @property examples
   */
  examples = componentCode;
}
const cases = componentCatalog
  .map((entry) => `@case ('${entry.id}') {${componentExamples[entry.id]}}`)
  .join('');
Component({
  selector: 'docs-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    ...componentCatalog.map((entry) => ui[entry.name]),
    ui.Button,
    ui.Card,
  ],
  template: template.replace('<!-- live-examples -->', cases),
})(ComponentsDocs);
