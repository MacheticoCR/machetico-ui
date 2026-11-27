# machetico-ui

Free-to-use headless Angular components and interaction primitives developed by MacheTico. Licensed under [MIT](LICENSE), including commercial use, modification and redistribution with the copyright and permission notice retained. Angular ARIA first; signals, standalone components, OnPush and native accessible HTML. Your application supplies its Tailwind identity.

## Included

- Native button/link behavior with pending and disabled states.
- Angular ARIA combobox selects, choice lists and pagination toolbar.
- Native range slider and image carousel with explicit navigation, pause and reduced-motion support.
- Modal dialogs and controlled sidebars with focus restoration and scroll ownership; lightweight NavigationSidebar for nonmodal application navigation.
- Native data tables with loading/error/empty states and immutable sorting intents.
- Cards, panels, headings, form controls, feedback, skeletons and presentation helpers.
- Shared `Scrollbar` for reversible native-scrollbar styling activation and locally provided `ScrollReveal` for viewport/animation coordination. Consumer CSS and keyframes own all visual identity.
- Optional `machetico-ui/api`: generic Angular signal HTTP facade with runtime response parsing, cancellation and one-shot commands.

The package ships **no theme, CSS or Tailwind utilities**. Taurus, Megaphone and Folio decide appearance. Domain models, endpoints, sessions and permissions remain in each application.

## Install

Requires Node >=24.15.0, Angular >=22.2.6 <23 (including Localize) and Angular ARIA 22.2.6 in the consuming application.

```sh
npm install machetico-ui
```

The full library is published as `machetico-ui@0.2.0`. All UI entry points and `machetico-ui/api` come from this single package. For an exact version use `npm install machetico-ui@0.2.0`.

## Build and install locally

```sh
npm ci --ignore-scripts
npm run verify
npm run pack
```

Install the resulting `artifacts/machetico-ui-0.2.0.tgz` in a consumer:

```sh
npm install /path/to/machetico-ui-0.2.0.tgz
```

Registry installation for a published release:

```sh
npm install machetico-ui
```

Build output is `dist/machetico-ui`; for local development install the built tarball, not the workspace source. Check the [npm version history](https://www.npmjs.com/package/machetico-ui?activeTab=versions) for registry availability.

```ts
import { Button } from 'machetico-ui/button';
import { Select, SearchSelect } from 'machetico-ui/selection';
import { Sidebar } from 'machetico-ui/overlay';
import { Slider, Table } from 'machetico-ui/layout';
import { NativeField } from 'machetico-ui/native-field';
import { NativeTable } from 'machetico-ui/surface';
import { Api, provideMacheticoApi } from 'machetico-ui/api';
```

Prefer the narrow public entry points above in applications: importing bootstrap controls separately keeps optional forms, ARIA and media out of the initial chunk. Root aggregate imports remain available. `macheticoField` and `macheticoTable` share behavior on existing native controls without replacing validators, names, cells or form ownership.

Configure `@angular/localize/init` in Angular build `polyfills` for native i18n templates (or import it before a custom browser/server bootstrap). Your application owns locale configuration and translations.

Import standalone controls in the consuming component's `imports`. Configure HTTP in the application's bootstrap:

```ts
providers: [provideHttpClient(), provideMacheticoApi({ baseUrl: '/api' })];
```

The application passes a reactive path and a real response parser to `api.read(path, parse)`. `api.request(path, method, body, parse, { signal })` executes one explicit command and validates its result. No transport policy grants server permissions. Read-only POST lookups use `readForm`; do not point reactive reads at mutation endpoints. See [architecture](docs/architecture.md).

## Styling in the application

```html
<button macheticoButton="primary" [busy]="saving()" class="brand-action">Guardar</button>
<machetico-select label="Tipo" [options]="options()" [(value)]="selected" />
<machetico-sidebar title="Navegación" [(open)]="navigationOpen">...</machetico-sidebar>
```

Use your application's global Tailwind stylesheet:

```css
@layer components {
  .brand-action {
    @apply rounded-xl bg-blue-700 px-5 py-3 text-white disabled:opacity-50;
  }
  machetico-select [role='option'] {
    @apply px-4 py-2 aria-selected:bg-blue-100;
  }
  machetico-dialog dialog[data-placement='sidebar'] {
    @apply fixed inset-y-0 left-0 m-0 h-dvh w-80;
  }
}
```

Use native ARIA/data state selectors and `data-part` hooks to style internals. Avoid overriding behavior-critical hidden/inert/disabled semantics. The [demo consumer](demo/) keeps all of its Tailwind source outside the library.

## Playground and tests

Public documentation: [macheticocr.github.io/machetico-ui](https://macheticocr.github.io/machetico-ui/). The Pages workflow rebuilds the demo from source on every update to `master`; its header shows the package version and source revision. Static hosting uses CSR and hash routes so individual views survive refreshes. See [deployment](docs/deployment.md).

```sh
npm run demo
npm test
npx playwright install chromium
npm run test:e2e
```

The documentation SPA starts at [localhost:5173](http://localhost:5173/), with its MacheTico introduction and MIT terms. The [component index](http://localhost:5173/components) links to one view per control, with route-aware, mutually exclusive component/service/directive submenus and separate lazy routes for [services](http://localhost:5173/services) and [directives](http://localhost:5173/directives). It is built using machetico-ui itself: headings, panels, alerts, forms, selection controls, tables, buttons and sidebars. Every concrete public component (40) and native directive (9) has a live synthetic example, copyable template and an API table generated from source. Input and Textarea document their inherited FormControl contract; the abstract base is not instantiated. Individual routes include `/components/select`, `/components/image-slider` and `/directives/button`.

Run `npm run demo`, rather than starting Vite directly: it builds the library, generates the API catalogue and consumer Tailwind CSS before serving the application. The development server renders every documentation route on the server and hydrates it with Angular. Add `?render=csr` to any category route to compare a client-only bootstrap. `?dialog=open` on `/components/dialog` demonstrates hydration of a server-rendered open modal.

The same 41 Lucide icon names used by Taurus are generated from the pinned `lucide-static` development dependency. Only SVG paths and their license are distributed; no icon font, CDN or Lucide runtime is required.

The demo uses Angular JIT for local development only; the package retains partial AOT compilation for consumer builds. The local SSR harness is not a production deployment. API code samples use illustrative endpoints and do not send requests. The generic transport still rejects server-side commands and excludes reads from private SSR transfer.

```sh
npm run ssr:test      # Node: timers, open panels, injector isolation, blocked mutations
npm run test:e2e      # Chromium: SSR, DOM reuse on hydration, CSR, SPA and mobile controls
```

See [contributor rules](AGENTS.md), [architecture](docs/architecture.md), [extraction inventory](docs/extraction.md) and [third-party notices](THIRD_PARTY_NOTICES.md). Machetico UI is free to use under the [MIT license](LICENSE), developed by MacheTico. Retain the copyright and permission notice when redistributing.

## Individual service documentation

- `/services/api`: optional transport configuration, reads, commands, cancellation and SSR boundaries.
- `/services/scrollbar`: public `Scrollbar.acquire(element)` with reversible native styling markers; consumer Tailwind/CSS owns appearance.
- `/services/scroll-reveal`: public, locally provided `ScrollReveal.observe/enter/leave`; consumer keyframes and CSS own motion.
- `/services/scroll-lock`: public modal scroll ownership; Dialog/Sidebar share the same service.
- `/services/view-ids`: public request-scoped accessible identifiers shared by components.

Import Scrollbar and ScrollReveal from `machetico-ui/core`; import the ScrollRevealOptions type from the same entry point. Provide ScrollReveal on the owning component to preserve view-scoped observation and cleanup. Scrollbar is application-owned and supports overlapping idempotent acquisitions. Both services avoid browser work during SSR. The four frontend consumers use these shared implementations through their own identity and domain adapters.

## Consumer-owned design playground

The documentation header uses the library's Select to explore 14 consumer-owned designs: Liquid Glass, Aero, Glassmorphism, Neumorphism, Flat / Material, Material Design, Neo Brutalism, Editorial, Swiss / International, Retro Terminal, Blueprint, High Contrast, Samsung / One UI and Android / Material You. Material/Android/Samsung examples are visual inspirations, not official platform components or Angular Material dependencies. Their CSS exists only in `demo/styles.source.css`; the in-memory selection is scoped to the demo application. It survives SPA navigation and starts deterministically as Flat / Material on a fresh SSR/CSR bootstrap. No design token, palette, theme stylesheet or selector is exported by machetico-ui.

This is the intended consumption model: import library components for accessible behavior, and define global Tailwind/CSS in the application that uses them. Use host classes and semantic data-part/data-variant/ARIA state selectors. Preserve keyboard focus, labels, hidden, inert and disabled semantics while changing appearance. The home playground demonstrates a button and slider retaining their values across design changes.

## Publication readiness

Run `npm run release:check` to verify, build and inspect the package, perform a real isolated `npm install` with strict peers, compile an AOT/SSR consumer and simulate publishing. The command never publishes. See [release instructions](docs/release.md) and [frontend adoption](docs/integration.md). Version 0.2.0 is published on npm; install it with `npm install machetico-ui`. Documentation deployment does not automatically increment or republish npm versions.
