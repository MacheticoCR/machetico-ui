/**
 * Consumer documentation for the behavior and integration boundaries of every concrete control.
 * @property componentGuides
 */
export const componentGuides = {
  'navigation-sidebar': {
    usage: 'Usar navegación no modal sin cargar Dialog, iconos ni formularios.',
    state:
      'El padre controla open y proyecta enlaces con sus permisos. collapseBelow determina cuándo se contrae.',
    accessibility:
      'SiteHeader conserva disclosure nativo, foco y relaciones ARIA. SSR mantiene los enlaces visibles.',
    styling:
      'La aplicación define headerClass, navigationClass y toggleClass, además de los estilos del aside.',
  },
  'search-select': {
    usage:
      'Proporcione options con value/label, label accesible y [(value)] para confirmar una opción.',
    state:
      'query filtra localmente; escribir no cambia value. expanded puede controlarse sin duplicar selección ni overlay.',
    accessibility:
      'Angular ARIA gestiona flechas, Enter y Escape. El popup comparte el posicionamiento de Select y no desplaza el contenido.',
    styling:
      'La aplicación estiliza el input, [role=listbox], [role=option] y los estados ARIA. Los datos y las lecturas remotas pertenecen al consumidor.',
  },
  'site-header': {
    usage: 'Proyectá marca, enlaces y acciones con headerBrand, headerLinks y headerActions.',
    state:
      'open es un modelo de disclosure; collapsible define si se ocultan los enlaces. Sin JavaScript la navegación SSR permanece visible.',
    accessibility:
      'El botón nativo informa aria-expanded y aria-controls. La navegación conserva su landmark, enlaces y orden de Tab.',
    styling:
      'La aplicación elige breakpoints, distribución y colores. hidden debe conservar su efecto; no existe lógica de sesión ni router.',
  },
  'background-video': {
    usage:
      'Usá video decorativo con una URL exacta y un poster. El demo incluye un WebM sintético local.',
    state:
      'El video se carga cerca del viewport y se pausa fuera de vista o con la pestaña oculta. Movimiento reducido, ahorro de datos y minimumWidth mantienen el poster.',
    accessibility:
      'Es decorativo, está aria-hidden, silenciado y fuera de Tab. No lo uses para información que requiera audio o subtítulos.',
    styling:
      'Los data-part poster/video/background permiten superponer las capas. data-playing informa reproducción; el consumidor define tamaño, object-fit y transiciones.',
  },
  alert: {
    usage:
      'Comunicar un aviso contextual dentro del flujo de una página. Elegí variant según el significado del mensaje.',
    state:
      'El contenido se proyecta; la página decide cuándo aparece y cuándo se resuelve. No desaparece automáticamente.',
    accessibility:
      'El mensaje conserva su semántica de anuncio. No uses solamente el color para comunicar éxito o error.',
    styling: 'Estilizá el host y data-variant; conservá texto legible y contraste.',
  },
  checkbox: {
    usage:
      'Editar una opción booleana mediante Angular Forms. Importá FormsModule al usar ngModel y asigná name dentro de formularios.',
    state:
      'La página posee el booleano; ngModelChange actualiza su signal. disabled y required expresan restricciones del formulario.',
    accessibility:
      'La etiqueta está asociada al checkbox nativo. Tab mueve el foco y Espacio cambia la selección.',
    styling:
      'Usá labelClass/inputClass o selectores globales; preservá el foco visible y el estado checked.',
  },
  'choice-card': {
    usage:
      'Presentar opciones mutuamente excluyentes como tarjetas con radio nativo. Compartí name entre las opciones.',
    state:
      'checked proviene de la página y chosen emite la intención; actualizá la opción elegida en el padre.',
    accessibility:
      'El radio conserva navegación nativa por flechas y Espacio. label y description deben diferenciar cada opción.',
    styling:
      'Definí la tarjeta y sus estados selected/disabled en el consumidor, sin ocultar el radio de tecnologías asistivas.',
  },
  'choice-list': {
    usage:
      'Cambiar entre opciones cortas mediante el listbox oficial de Angular ARIA. Proporcioná valores estables y únicos.',
    state:
      'value es un modelo: [(value)] sincroniza la selección. Las opciones y su disponibilidad pertenecen al consumidor.',
    accessibility:
      'Angular ARIA administra foco, selección y teclado del listbox; probá flechas y activación con Enter o Espacio.',
    styling:
      'Estilizá roles listbox/option y aria-selected; no reemplaces sus manejadores de teclado.',
  },
  'deferred-error': {
    usage: 'Mostrar el fallo de una sección cargada de forma diferida e invitar a reintentar.',
    state:
      'retryRequested es una intención. El padre recupera el recurso y reemplaza el error por su estado de carga o contenido.',
    accessibility:
      'El botón de reintento es nativo y accesible por teclado; mantené el error comprensible sin exponer detalles privados.',
    styling:
      'La aplicación define la superficie del error y el botón; el componente no registra errores ni realiza peticiones.',
  },
  dialog: {
    usage:
      'Montar un diálogo modal con @if cuando una acción requiera atención. Desmontalo al recibir closed.',
    state:
      'busy impide cerrar durante una operación. El padre ejecuta la acción, maneja su error y decide cuándo desmontar.',
    accessibility:
      'El dialog nativo gestiona foco modal, Tab y Escape; al cerrar se restaura el foco al elemento que lo abrió.',
    styling:
      'Estilizá dialog y ::backdrop globalmente. Conservalo dentro del viewport con scroll interno; no anules su modalidad.',
  },
  'empty-state': {
    usage:
      'Explicar por qué una colección no contiene resultados y proyectar una acción pertinente.',
    state:
      'La página diferencia vacío de carga y error. El componente no consulta datos ni inventa contenido.',
    accessibility:
      'Un mensaje concreto y un botón etiquetado permiten recuperarse sin depender de una ilustración.',
    styling: 'Proyectá botones o enlaces; aplicá la identidad en el host y el contenido.',
  },
  feedback: {
    usage: 'Presentar el resultado de una acción con notice o error.',
    state:
      'El padre mantiene los mensajes y los limpia antes de una nueva acción. El fallo tiene prioridad cuando ambos existen.',
    accessibility:
      'Los mensajes de error y estado se anuncian según su semántica; evitá anuncios duplicados en el padre.',
    styling: 'Definí las variantes de aviso y error globalmente y conservá contraste.',
  },
  'form-actions': {
    usage:
      'Agrupar envío y cancelación de un formulario nativo. Ubicalo dentro del form propietario.',
    state:
      'El envío sigue el submit del form. cancelled emite una intención separada; busy/disabled controlan disponibilidad.',
    accessibility:
      'Enter conserva el envío nativo; cancelar no debe enviar el formulario. Las etiquetas describen la acción concreta.',
    styling: 'La distribución y el orden responsive pertenecen a Tailwind del consumidor.',
  },
  icon: {
    usage:
      'Mostrar uno de los nombres Lucide incluidos en el sprite local. El ejemplo muestra todo el vocabulario disponible.',
    state:
      'name selecciona un SVG; el sprite se distribuye con el paquete y no requiere una fuente remota.',
    accessibility:
      'Los iconos son decorativos. Un botón que solo contiene un icono necesita aria-label en el botón.',
    styling: 'Dimensioná el host/SVG y usá currentColor. La aplicación elige tamaño y color.',
  },
  'image-slider': {
    usage:
      'Presentar una galería circular como la de Taurus: marco vertical, desplazamiento horizontal, indicadores y controles de rotación. Cada slide requiere id único, src, alt y caption.',
    state:
      'initialIndex elige la imagen inicial. interval usa milisegundos; cero desactiva rotación. La carga y el fallo son independientes por imagen; Reintentar vuelve a crear la imagen. La navegación manual pausa la rotación.',
    accessibility:
      'Hover, entrada de foco y pestaña oculta detienen rotación. Se respeta movimiento reducido. Los botones anterior/siguiente e indicadores funcionan con teclado; las imágenes inactivas están inert.',
    styling:
      'El demo reproduce el marco 4:5 y controles de Taurus usando estilos del consumidor. data-part expone viewport, track, slide, controls e indicator; data-snapping requiere transición cero durante el reajuste circular.',
  },
  input: {
    usage:
      'Editar texto con un input nativo integrado a Angular Forms. Importá FormsModule y proveé label y name.',
    state:
      'ngModel o FormControl poseen el valor. Las entradas heredadas incluyen validación, placeholder, autocomplete y estados nativos.',
    accessibility:
      'Etiqueta visible, required y tipo de input deben corresponder al dato. Asociá errores de validación desde el formulario propietario.',
    styling: 'labelClass/inputClass y reglas globales permiten aplicar Tailwind sin ::ng-deep.',
  },
  textarea: {
    usage:
      'Editar texto de varias líneas con Angular Forms. rows reserva altura inicial y maxlength limita la entrada nativa.',
    state:
      'La página mantiene el valor, la validación y el contador. No se guarda automáticamente.',
    accessibility:
      'Conservá la etiqueta y la navegación nativa; no captures Enter para enviar mientras se edita texto multilínea.',
    styling:
      'Definí borde, altura, resize y foco en el consumidor; permití ampliar el área si el contenido lo requiere.',
  },
  'page-heading': {
    usage: 'Introducir una página con title, eyebrow opcional, description y acciones proyectadas.',
    state: 'La página provee contenido y acciones. El encabezado no decide navegación ni permisos.',
    accessibility:
      'El título principal comunica el contexto de la página. Evitá varias cabeceras principales para el mismo contenido.',
    styling:
      'Usá el contenido proyectado para acciones y reglas globales para jerarquía tipográfica.',
  },
  'page-skeleton': {
    usage:
      'Reservar la estructura de una página mientras carga. variant selecciona la estructura y count su repetición.',
    state: 'La página alterna skeleton, error, vacío y contenido real según su recurso.',
    accessibility:
      'El estado de carga debe tener una descripción útil; las formas decorativas no sustituyen el texto.',
    styling:
      'La animación y sus colores pertenecen al consumidor; desactivá movimiento con prefers-reduced-motion.',
  },
  pagination: {
    usage: 'Navegar una colección paginada a partir de page, total y pageSize. page usa base uno.',
    state:
      'pageChanged emite una página válida; el padre actualiza filtros/lecturas. No pagina ni consulta datos por sí mismo.',
    accessibility:
      'Angular ARIA administra el toolbar; los botones conservan etiquetas y estados disabled en los extremos.',
    styling: 'Estilizá el toolbar y la página actual; mantené objetivos táctiles amplios.',
  },
  panel: {
    usage: 'Agrupar contenido con título y acciones. Proyectá acciones usando panelActions.',
    state:
      'El padre provee el contenido, sus estados y handlers. Panel no colapsa ni solicita datos.',
    accessibility:
      'El título debe describir el contenido y las acciones deben tener nombres distinguibles.',
    styling:
      'La tarjeta, separación y tipografía se definen globalmente sobre el host y sus partes.',
  },
  'section-skeleton': {
    usage: 'Indicar que una sección está cargando sin bloquear el resto de la vista.',
    state: 'label describe qué carga y count reserva filas. La página decide cuándo retirarlo.',
    accessibility: 'El estado anuncia la carga sin volver accesibles las formas decorativas.',
    styling: 'Definí dimensiones y animación en el consumidor, incluyendo movimiento reducido.',
  },
  select: {
    usage:
      'Elegir una opción con el combobox/listbox oficial de Angular ARIA. options contiene pares value/label estables.',
    state:
      '[(value)] mantiene la selección del padre. disabled impide interacción. Las opciones se abren sobre el contenido, sin desplazarlo.',
    accessibility:
      'Flechas y Enter permiten seleccionar; Escape cierra y conserva foco. El clic exterior cierra el popup. Proporcioná label visible.',
    styling:
      'El popover nativo usa la capa superior con posición fija y ajuste al viewport. Estilizá listbox/option globalmente; la biblioteca solo decide posición y espacio disponible.',
  },
  sidebar: {
    usage:
      'Mostrar navegación o contenido lateral modal con un modelo open controlado por la página.',
    state:
      '[(open)] recibe cierres por Escape o botón. side define el borde. El padre puede cerrar tras navegar.',
    accessibility:
      'Reutiliza el diálogo nativo, bloqueo de scroll y retorno de foco. Proyectá un nav etiquetado para navegación.',
    styling:
      'Estilizá dialog[data-placement=sidebar] y data-side; en móvil debe caber en el viewport y permitir scroll.',
  },
  slider: {
    usage: 'Elegir un número con input range nativo. min, max y step delimitan el rango.',
    state:
      '[(value)] sincroniza el número; disabled conserva el valor sin permitir cambios. La aplicación decide unidades y persistencia.',
    accessibility:
      'Tab enfoca; flechas cambian por step y Home/End van a los extremos. label identifica la magnitud.',
    styling:
      'La pista y el pulgar son del navegador y la identidad de la aplicación. Mostrá unidades junto al valor.',
  },
  'stat-card': {
    usage: 'Mostrar una cifra ya calculada con label, value y description.',
    state:
      'attention solo comunica un estado visual; la biblioteca no calcula métricas ni interpreta permisos.',
    accessibility:
      'No dependas solo del color para advertencias; description debe explicar qué necesita atención.',
    styling: 'La aplicación define la variante de atención, tipografía y superficie.',
  },
  table: {
    usage:
      'Presentar registros con una tabla HTML semántica. rows y columns separan datos de acceso; rowKey debe devolver identidad estable.',
    state:
      'sortChanged emite intención; el padre ordena o consulta. loading, error y vacío son estados explícitos; retryRequested no ejecuta HTTP.',
    accessibility:
      'caption describe los datos; th y aria-sort anuncian orden. No es una hoja de cálculo ni una grilla editable.',
    styling:
      'Conservá semántica table y contené el overflow horizontal localmente en móvil. Estilizá encabezados, filas y estados con Tailwind global.',
  },
  'route-status': {
    usage:
      'Anunciar una navegación o carga pendiente sin instalar dependencias del router en la biblioteca.',
    state: 'busy muestra/oculta el estado; la aplicación conecta su navegación o recurso.',
    accessibility:
      'El contenedor usa status y aria-live polite. Evitá montarlo varias veces para la misma carga.',
    styling:
      'El spinner es decorativo; la animación y movimiento reducido se resuelven en la aplicación.',
  },
  'site-footer': {
    usage: 'Componer el pie con copyright aportado y enlaces proyectados en footerLinks.',
    state:
      'El texto y las URLs pertenecen a la aplicación; no se leen fecha, sesión ni configuración del tenant.',
    accessibility:
      'El footer conserva su landmark y el nav necesita navigationLabel que distinga sus enlaces.',
    styling: 'Aplicá una distribución responsive y contraste apropiado a pie y navegación.',
  },
  'field-group': {
    usage: 'Agrupar campos relacionados con fieldset y legend nativos.',
    state:
      'disabled deshabilita los controles nativos descendientes; el padre conserva sus modelos y validación.',
    accessibility:
      'legend proporciona el nombre del grupo. Cada campo también requiere su propia etiqueta.',
    styling:
      'Estilizá fieldset/legend globalmente; no elimines el nombre accesible al quitar el borde.',
  },
  'metrics-list': {
    usage:
      'Mostrar métricas ya resueltas mediante una lista descriptiva. Cada métrica tiene id, label, value y detalle opcional.',
    state:
      'null muestra missingLabel; una lista vacía muestra emptyLabel. No se calculan monedas ni estadísticas.',
    accessibility:
      'dt identifica la métrica y dd contiene el valor. El detalle debe aportar contexto y unidades.',
    styling:
      'Podés convertir el dl en una grilla responsive desde Tailwind manteniendo su estructura semántica.',
  },
  'comparison-list': {
    usage: 'Comparar dos alternativas mediante una tabla semántica con caption.',
    state: 'items contiene id, title, before y after; la página calcula toda diferencia.',
    accessibility:
      'Encabezados de fila y columna relacionan cada valor con su concepto y alternativa.',
    styling:
      'Contené el overflow y estilizá las columnas sin depender del color para expresar diferencias.',
  },
  checklist: {
    usage: 'Presentar una secuencia de preparación con detalles, paso actual y pasos completados.',
    state:
      'items es información de presentación; current/completed no ejecutan provisión ni prueban que una operación de backend terminó.',
    accessibility:
      'La lista ordenada preserva secuencia y aria-current=step identifica el paso actual.',
    styling:
      'Usá data-completed y aria-current para indicadores y conservá descripciones textuales.',
  },
  'summary-card': {
    usage: 'Resumir un registro con título, descripción, estado y una acción opcional.',
    state:
      'activated emite una intención; busy y disabled bloquean la acción. El contenido adicional se proyecta.',
    accessibility:
      'El botón nativo conserva teclado y disabled. El estado textual es independiente del color.',
    styling:
      'Estilizá data-part=card/status/action y proyectá contenido propio sin acoplar DTOs de negocio.',
  },
  'legal-document': {
    usage:
      'Presentar texto versionado aportado por el consumidor. title, version y sections son obligatorios.',
    state:
      'printRequested solicita imprimir/exportar; la aplicación decide cómo. Renderizar un borrador no prueba aprobación ni validez legal.',
    accessibility:
      'Títulos y secciones preservan lectura estructurada. notice debe aclarar el estado del documento.',
    styling:
      'La aplicación define estilos de lectura e impresión; las fechas ya vienen formateadas para mantener SSR determinista.',
  },
  consent: {
    usage:
      'Recoger una confirmación explícita con checkbox nativo inicialmente sin marcar. Proyectá enlaces a las condiciones.',
    state:
      '[(accepted)] mantiene el booleano en la página. La interpretación, registro de versión y validación pertenecen a la aplicación.',
    accessibility:
      'Tab y Espacio conservan la interacción nativa. label debe explicar el alcance y los enlaces deben ser identificables.',
    styling:
      'Conservá checkbox visible o una alternativa accesible; no uses una tarjeta clickeable que active enlaces accidentalmente.',
  },
  'content-section': {
    usage: 'Construir secciones editoriales con título, contexto opcional y contenido proyectado.',
    state:
      'Los datos y acciones son responsabilidad del padre; no hay lecturas ni animación implícita.',
    accessibility:
      'El h2 introduce la sección; el contenido proyectado mantiene su propia semántica.',
    styling:
      'Los slots data-part=section/content/eyebrow permiten aplicar la identidad sin copiar comportamiento.',
  },
  'feature-chapter': {
    usage:
      'Combinar una ilustración, una explicación y una lista de beneficios. featureMedia y featureActions son slots explícitos.',
    state: 'features y align son presentación; la aplicación posee enlaces y acciones.',
    accessibility:
      'El h2 introduce el capítulo; una ilustración informativa necesita alt y la decorativa debe ocultarse de lectores.',
    styling:
      'data-align permite alternar distribución en desktop; el orden móvil debe preservar lectura coherente.',
  },
  'hero-section': {
    usage:
      'Componer la portada principal mediante contenido, medio decorativo y acciones proyectadas.',
    state: 'El padre aporta texto e identidad; el componente no decide sesión, tenant ni rutas.',
    accessibility:
      'El título es h1: usá una portada por página. heroMedia es decorativo y está aria-hidden; no proyectes controles allí.',
    styling:
      'Aplicá fondo, altura y responsive al hero. heroActions conserva enlaces o botones nativos propios.',
  },
  stepper: {
    usage:
      'Mostrar pasos de presentación usando tabs oficiales de Angular ARIA con activación explícita.',
    state:
      'steps define id, etiqueta, descripción y disabled; value mantiene el paso seleccionado. No valida formularios ni autoriza avanzar en un flujo de negocio.',
    accessibility:
      'Flechas mueven foco y Enter/Espacio activan; los paneles usan relaciones ARIA y contenido diferido.',
    styling:
      'Estilizá tablist, tab y tabpanel globalmente; conservá foco visible y diferencia entre foco y selección.',
  },
};
