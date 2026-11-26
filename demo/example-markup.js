/**
 * Executable synthetic example templates shared by live demonstrations and source listings.
 * @property componentExamples
 */
export const componentExamples = {
  'site-header':
    '<machetico-site-header label="Navegación de ejemplo" toggleLabel="Mostrar navegación"><a headerBrand href="/components">Marca de ejemplo</a><a headerLinks href="/components/slider">Slider</a><a headerActions href="/services">Servicios</a></machetico-site-header>',
  'background-video':
    '<machetico-background-video src="/samples/background.webm" [poster]="poster" /><p>Video decorativo local: con movimiento reducido se mantiene el poster.</p>',
  alert:
    '<machetico-alert variant="info">Información de ejemplo.</machetico-alert><machetico-alert variant="success">Cambios sintéticos guardados.</machetico-alert><machetico-alert variant="error">Ejemplo de un error recuperable.</machetico-alert>',
  checkbox:
    '<machetico-checkbox label="Recibir novedades" name="updates" [ngModel]="agreed()" (ngModelChange)="agreed.set($event)" /><p>Seleccionado: {{ agreed() ? "Sí" : "No" }}</p>',
  'choice-card':
    '<div class="sample-grid"><machetico-choice-card name="plan" value="basic" label="Plan básico" description="Para una persona" [checked]="plan() === \'basic\'" (chosen)="plan.set(\'basic\')" /><machetico-choice-card name="plan" value="team" label="Plan equipo" description="Para colaboración" [checked]="plan() === \'team\'" (chosen)="plan.set(\'team\')" /></div><p>Plan seleccionado: {{ plan() }}</p>',
  'choice-list':
    '<machetico-choice-list label="Vista de ejemplo" [options]="viewOptions" [(value)]="view" /><p>Vista seleccionada: {{ view() }}</p>',
  'deferred-error':
    '<machetico-deferred-error section="los datos de ejemplo" (retryRequested)="retries.set(retries() + 1)" /><p role="status">Reintentos solicitados: {{ retries() }}</p>',
  dialog:
    '<button type="button" macheticoButton id="open-dialog" (click)="dialog.set(true)">Abrir diálogo</button>@if (dialog()) { <machetico-dialog title="Confirmación" [busy]="modalBusy()" (closed)="dialog.set(false)"><p>Esta es una confirmación con datos sintéticos.</p><machetico-checkbox label="Simular acción pendiente" [ngModel]="modalBusy()" (ngModelChange)="modalBusy.set($event)" /><button type="button" macheticoButton (click)="dialog.set(false)" [disabled]="modalBusy()">Confirmar ejemplo</button></machetico-dialog> }',
  'empty-state':
    '<machetico-empty-state message="No hay resultados para este ejemplo."><button type="button" macheticoButton="secondary" (click)="emptyAction.set(emptyAction() + 1)">Crear un ejemplo</button></machetico-empty-state><p role="status">Intenciones de creación: {{ emptyAction() }}</p>',
  feedback:
    "<machetico-choice-list label=\"Estado del mensaje\" [options]=\"feedbackOptions\" [(value)]=\"feedbackState\" /><machetico-feedback [error]=\"feedbackState() === 'error' ? 'No se pudo guardar el ejemplo.' : ''\" [notice]=\"feedbackState() === 'success' ? 'Ejemplo guardado.' : ''\" />",
  'form-actions':
    '<form (submit)="$event.preventDefault(); formMessage.set(\'Formulario sintético enviado.\')"><machetico-input label="Nombre del ejemplo" name="exampleName" [ngModel]="name()" (ngModelChange)="name.set($event)" required /><machetico-form-actions submitLabel="Guardar ejemplo" cancelLabel="Cancelar ejemplo" (cancelled)="formMessage.set(\'Edición cancelada.\')" /></form><p role="status">{{ formMessage() }}</p>',
  icon: '<div class="icon-gallery">@for (icon of icons; track icon) { <figure><machetico-icon [name]="icon" /><figcaption>{{ icon }}</figcaption></figure> }</div><p>Lucide: la misma biblioteca y el mismo conjunto de nombres de Taurus. Los SVG son decorativos; etiquetá el botón que los contiene.</p>',
  'image-slider':
    '<machetico-image-slider label="Galería de paisajes sintéticos" [slides]="slides" [interval]="5000" />',
  input:
    '<machetico-input label="Nombre de ejemplo" name="personName" placeholder="Escribí un nombre" autocomplete="name" [ngModel]="name()" (ngModelChange)="name.set($event)" required /><p>Valor: {{ name() }}</p>',
  'page-heading':
    '<machetico-page-heading title="Panel de ejemplo" eyebrow="ESPACIO SINTÉTICO" description="La página provee los datos y las acciones."><button type="button" macheticoButton="secondary">Acción de ejemplo</button></machetico-page-heading>',
  'page-skeleton': '<machetico-page-skeleton variant="account" [count]="2" />',
  pagination:
    '<machetico-pagination label="Páginas de ejemplo" [page]="page()" [total]="42" [pageSize]="10" (pageChanged)="page.set($event)" /><p role="status">Página seleccionada: {{ page() }}</p>',
  panel:
    '<machetico-panel title="Resumen de ejemplo"><p>Contenido proyectado por tu aplicación.</p><button panelActions type="button" macheticoButton="ghost">Acción del panel</button></machetico-panel>',
  'section-skeleton':
    '<machetico-section-skeleton label="Cargando registros de ejemplo" [count]="2" />',
  select:
    '<machetico-select label="Seleccionar opción" [options]="options" [(value)]="choice" /><p>Valor seleccionado: {{ choice() }}</p>',
  sidebar:
    '<button type="button" id="open-sidebar" macheticoButton (click)="sidebar.set(true)">Abrir sidebar</button><machetico-sidebar title="Navegación" [(open)]="sidebar"><nav aria-label="Navegación de ejemplo"><a href="#sidebar" (click)="sidebar.set(false)">Resumen</a><a href="#sidebar" (click)="sidebar.set(false)">Historial</a></nav></machetico-sidebar>',
  slider:
    '<machetico-slider label="Volumen" [min]="0" [max]="100" [step]="1" [(value)]="value" /><p>Nivel actual: {{ value() }}%</p><machetico-slider label="Rango deshabilitado" [value]="65" [disabled]="true" />',
  'stat-card':
    '<div class="sample-grid"><machetico-stat-card label="Ejemplos disponibles" [value]="24" description="Datos sintéticos" /><machetico-stat-card label="Pendientes" [value]="3" [attention]="true" description="Requieren atención de ejemplo" /></div>',
  textarea:
    '<machetico-textarea label="Notas de ejemplo" name="notes" [rows]="3" [maxlength]="200" [ngModel]="notes()" (ngModelChange)="notes.set($event)" /><p>Caracteres: {{ notes().length }}/200</p>',
  table:
    '<machetico-choice-list label="Estado de tabla" [options]="tableOptions" [(value)]="tableState" /><machetico-table caption="Datos sintéticos" [rows]="tableState() === \'empty\' ? [] : rows()" [columns]="columns" [rowKey]="key" [sort]="sort()" [loading]="tableState() === \'loading\'" [error]="tableState() === \'error\' ? \'Error sintético de lectura.\' : \'\'" (sortChanged)="sort.set($event)" (retryRequested)="tableState.set(\'ready\')" />',
  'route-status': '<machetico-route-status label="Cargando la vista de ejemplo" />',
  'site-footer':
    '<machetico-site-footer copyright="© Machetico · Ejemplo"><a footerLinks href="/components">Componentes</a></machetico-site-footer>',
  'field-group':
    '<machetico-field-group legend="Preferencias de ejemplo" description="Campos nativos agrupados."><machetico-checkbox label="Recibir resumen" [ngModel]="agreed()" (ngModelChange)="agreed.set($event)" /></machetico-field-group>',
  'metrics-list':
    "<machetico-metrics-list label=\"Métricas sintéticas\" [metrics]=\"[{id: 'a', label: 'Vistas de ejemplo', value: 128}, {id: 'b', label: 'Dato pendiente', value: null}]\" />",
  'comparison-list':
    "<machetico-comparison-list caption=\"Comparación sintética\" [items]=\"[{id: 'a', title: 'Configuración', before: 'Por aplicación', after: 'Comportamiento compartido'}]\" />",
  checklist:
    "<machetico-checklist label=\"Preparación de ejemplo\" [items]=\"[{id: 'a', title: 'Instalar', details: ['Agregar la dependencia'], completed: true}, {id: 'b', title: 'Personalizar', details: ['Definir Tailwind en la aplicación'], current: true}]\" />",
  'summary-card':
    '<machetico-summary-card title="Proyecto de ejemplo" description="Contenido sintético sin conexión al backend." status="Disponible" actionLabel="Abrir ejemplo" (activated)="emptyAction.set(emptyAction() + 1)" /><p role="status">Acciones: {{ emptyAction() }}</p>',
  'legal-document':
    '<machetico-legal-document title="Documento de ejemplo" version="Borrador 1" updatedAt="26 de noviembre de 2026" notice="Texto sintético, sin validez institucional." [sections]="[{id: \'intro\', title: \'Introducción\', paragraphs: [\'Texto de demostración aportado por la aplicación.\']}]" (printRequested)="emptyAction.set(emptyAction() + 1)" /><p role="status">Solicitudes de impresión: {{ emptyAction() }}</p>',
  consent:
    '<machetico-consent label="He leído las condiciones de ejemplo" [(accepted)]="agreed"><a href="/components/legal-document">Ver documento sintético</a></machetico-consent><p>Aceptado: {{ agreed() ? "Sí" : "No" }}</p>',
  'content-section':
    '<machetico-content-section title="Contenido de ejemplo" eyebrow="SECCIÓN" description="Composición provista por el consumidor."><p>Podés proyectar contenido accesible y cualquier componente de la biblioteca.</p></machetico-content-section>',
  'feature-chapter':
    '<machetico-feature-chapter title="Una función de ejemplo" description="Texto y medios provistos por el consumidor." [features]="[\'Comportamiento reutilizable\', \'Identidad propia\']"><span featureMedia aria-label="Ilustración sintética">◇</span><a featureActions href="/components">Ver catálogo</a></machetico-feature-chapter>',
  'hero-section':
    '<machetico-hero-section title="Tu identidad, comportamiento compartido" eyebrow="EJEMPLO" description="Una portada compuesta con contenido sintético."><span heroMedia>◇</span><a heroActions href="/components">Explorar componentes</a></machetico-hero-section>',
  stepper:
    "<machetico-stepper label=\"Pasos de ejemplo\" [steps]=\"[{id: 'one', label: 'Configurar', description: 'Instalar la biblioteca'}, {id: 'two', label: 'Personalizar', description: 'Definir la identidad visual'}]\" />",
};
/**
 * Native directive demonstrations; every class is supplied by the consumer application.
 * @property directiveExamples
 */
export const directiveExamples = {
  reveal:
    '<article macheticoReveal macheticoCard><h3>Aparición progresiva</h3><p>Contenido visible en SSR; la aplicación define su transición.</p></article>',
  button:
    '<div class="sample-actions"><button type="button" macheticoButton [busy]="busy()" (click)="count.set(count() + 1)">Acción {{ count() }}</button><button type="button" macheticoButton="secondary">Secundario</button><button type="button" macheticoButton="danger" [disabled]="true">Deshabilitado</button></div><machetico-checkbox label="Simular pendiente" [ngModel]="busy()" (ngModelChange)="busy.set($event)" />',
  card: '<article macheticoCard="surface" macheticoCardPadding="lg"><h3>Tarjeta de ejemplo</h3><p>El elemento conserva su semántica nativa. Los atributos data-card y data-cardpadding permiten que tu aplicación defina la apariencia.</p></article>',
  badge:
    '<div class="sample-actions"><span macheticoBadge="success">Completado</span><span macheticoBadge="warning">Pendiente</span><span macheticoBadge="danger">Revisar</span></div>',
  grid: '<div macheticoGrid [macheticoGridColumns]="3" macheticoGridGap="md">@for (item of [1,2,3]; track item) {<div macheticoCard>Elemento {{ item }}</div>}</div>',
  'responsive-image':
    '<img [macheticoImage]="sampleImage" [imageWidths]="[320,640,960]" imageSizes="(min-width: 768px) 50vw, 100vw" alt="Paisaje sintético de ejemplo" width="480" height="240" /><p>Las imágenes locales o de otros proveedores conservan su URL. Las transformaciones de ancho solo se generan para URLs Cloudinary públicas compatibles.</p>',
  text: '<p macheticoText="eyebrow">CONTEXTO DE EJEMPLO</p><p macheticoText="body">Texto de contenido.</p><p macheticoText="caption">Descripción secundaria.</p>',
};
