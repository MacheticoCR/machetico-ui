# machetico-ui

Reusable headless Angular components and interaction primitives by Machetico. Angular ARIA first; signals, standalone components, OnPush and native accessible HTML. Your application supplies its Tailwind identity.

## Included

- Native button/link behavior with pending and disabled states.
- Angular ARIA combobox selects, choice lists and pagination toolbar.
- Native range slider and image carousel with explicit navigation, pause and reduced-motion support.
- Modal dialogs and controlled sidebars with focus restoration and scroll ownership.
- Native data tables with loading/error/empty states and immutable sorting intents.
- Cards, panels, headings, form controls, feedback, skeletons and presentation helpers.
- Optional `machetico-ui/api`: generic Angular signal HTTP facade with runtime response parsing, cancellation and one-shot commands.

The package ships **no theme, CSS or Tailwind utilities**. Taurus, Megaphone and Folio decide appearance. Domain models, endpoints, sessions and permissions remain in each application.

## Build and install locally

Requires Node 24+ and Angular 22.2.x in the consuming application.

```sh
npm ci --ignore-scripts
npm run verify
npm run pack
```

Install the resulting `artifacts/machetico-ui-0.1.0.tgz` in a consumer:

```sh
npm install /path/to/machetico-ui-0.1.0.tgz
```

No npm registry release has been published by this bootstrap. Build output is `dist/machetico-ui`; install the built tarball, not the workspace source.

```ts
import { Button, Select, Sidebar, Slider, Table } from 'machetico-ui';
import { Api, provideMacheticoApi } from 'machetico-ui/api';
```

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

```sh
npm run demo
npm test
npx playwright install chromium
npm run test:e2e
```

The playground runs on localhost:5173 with synthetic content and three sample identities. It uses Angular JIT only as a development consumer; the distributed package uses partial AOT compilation for consumer builds.

See [contributor rules](AGENTS.md), [architecture](docs/architecture.md), [extraction inventory](docs/extraction.md) and [third-party notices](THIRD_PARTY_NOTICES.md). The repository is publicly readable; an open-source redistribution license has not yet been selected.
