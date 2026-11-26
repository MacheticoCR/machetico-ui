# Integración en los frontends MacheTico

## Base homologada

Decisión del responsable del 26 de noviembre de 2026. Landing, Taurus, Megaphone y Folio comparten Angular framework/compiler-cli/ARIA **22.2.6** (incluido Localize), CLI/build/SSR **22.2.7**, TypeScript **6.0.3** y Node **>=24.15.0**. Se conserva ARIA 22.2.6, validada con los controles de la biblioteca. El paquete declara ese mínimo de Angular y esa revisión exacta de ARIA; no use `--force` ni `--legacy-peer-deps` para ocultar incompatibilidad.

## Instalación

Antes de la primera publicación:

```sh
npm install /ruta/machetico-ui-0.1.0.tgz
```

Después de que el responsable publique la versión:

```sh
npm install machetico-ui
```

Configure Localize en `projects.<app>.architect.build.options.polyfills` de angular.json para el navegador y el servidor:

```json
{ "polyfills": ["@angular/localize/init"] }
```

En bootstraps personalizados sin el builder Angular, importe `@angular/localize/init` antes del bootstrap de cada entorno. Los controles conservan i18n nativo; la biblioteca declara el peer y el consumidor posee su inicialización. Taurus conserva su carga de idioma existente. Los otros tres frontends quedan preparados mediante la configuración de polyfills del builder.

Importe desde `machetico-ui` y añada los componentes standalone a `imports`. Para `ngModel`/formularios conserve FormsModule o ReactiveFormsModule en la pantalla propietaria. No importe archivos internos de dist, servicios internos o templates del paquete.

## Identidad y contratos

La biblioteca aporta comportamiento y estructura accesible. Cada aplicación define Tailwind/CSS global con sus propios tokens. `data-part`, `data-variant`, ARIA y clases provistas por el consumidor permiten dar apariencia a los controles. Conserve hidden, inert, disabled, foco visible y movimiento reducido. No use ::ng-deep ni copie los estilos del demo como dependencia de producción.

- Botones: `<button type="button" macheticoButton [busy]="saving()">…</button>`. El padre posee la acción y su estado pendiente.
- Select: `options` contiene `value/label`; `[(value)]` conserva el tipo del consumidor. Traduzca solo las etiquetas del sistema en la aplicación. No convierta identificadores en etiquetas ni persista valores visibles.
- Input/Textarea/Checkbox: son value accessors nativos. Mantenga names, labels, validadores y estado touched/disabled del formulario.
- Dialog: cree con `@if` y destruya al recibir `closed`; Sidebar usa `[(open)]`. Ambos conservan foco/scroll. Las animaciones visuales del consumidor no deben bloquear un cierre.
- Table: filas, claves y columnas pertenecen al dominio; orden/reintento son intenciones, no HTTP automático.
- Scrollbar: adquiera después de renderizar y registre liberación en el cleanup. ScrollReveal se provee localmente en el componente. Las reglas CSS y los keyframes pertenecen al frontend.

## Adopción por producto

| Frontend          | Estilo que conserva                                  | Adaptación que debe mantenerse                                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MacheTico landing | Tokens TenantTheme, `src/styles.css`                 | Contenido de industria, contratación, ONVO y sesión permanecen en la aplicación. Los controles genéricos reciben datos sin tenant/API internos.                                                                                   |
| Taurus            | Tokens de negocio, capas globales e i18n             | Traducir etiquetas de opciones antes de pasarlas al control; mantener Forms/CVA, moneda, menús de negocio y controles opcionales lazy. La fachada Api y sus coordinaciones de sesión no se reemplazan por el transporte genérico. |
| Megaphone         | Variables `--app-*`, restricciones de carga por ruta | Mantener selectores de país/teléfono especializados, interceptores y rutas SSR. No arrastrar Forms/ARIA a login por un barrel de funcionalidades.                                                                                 |
| Folio             | Tema del producto y formularios nativos              | Mantener expediente/proceso/documento, consulta sin cuenta, descargas y allowlist SSR. Un componente visual no decide autorización ni aceptación institucional.                                                                   |

La homologación de versiones prepara la instalación; no afirma una migración visual completa. Sustituya cada control local, sus imports y reglas globales en un cambio revisable. Elimine el comportamiento duplicado una vez cubiertos teclado, foco, estados, traducción y responsive; conserve wrappers de negocio que aporten responsabilidad real. No cambie contratos HTTP como parte de la adopción visual.

## Validación

`npm run consumer:check` instala el tarball en una aplicación aislada con peers estrictos y compila en producción con templates estrictos y prerender SSR. Usa datos sintéticos y comprueba imports UI/API públicos. Esta prueba acredita la instalación de la biblioteca; los builds y flujos completos de cada producto se verifican en sus propios repositorios.
