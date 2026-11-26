# Architecture

## Approved decisions

On 26 November 2026 the maintainer approved an independent Angular library, machetico-ui, in the public Machetico organization. Taurus, Megaphone and Folio are reference implementations and future consumers. They remain unchanged.

The latest instruction makes the package headless: it owns accessible structure, signals and interactions. Each application owns Tailwind, CSS, colors, fonts, spacing, shape, breakpoints and visual branding. There is no exported theme and no Tailwind runtime/peer dependency. The demo is a separate consumer; its three example palettes are illustrative, not imported brand configurations.

## Package layout

```text
projects/machetico-ui/
  src/public-api.ts
  src/lib/components/       # external templates and direct component barrel
  src/lib/directives/       # native element behaviors
  src/lib/interfaces/       # one named contract per file
  src/lib/services/         # dialog focus identifiers and scroll ownership
  api/src/public-api.ts     # optional machetico-ui/api entry point
  api/src/services/         # generic API facade and central barrel
  api/src/interfaces/       # transport contracts only
```

Build with ng-packagr in partial compilation mode (Angular Package Format). Angular and Angular ARIA are peer dependencies, not bundled private framework copies. Root imports do not import HTTP or the API entry point. Internal imports use concrete siblings; public consumers use the package entry points. The package is side-effect free.

Angular ARIA 22.2.6 owns combobox, listbox and pagination toolbar behavior. This version matches Taurus's documented supported revision. The installed ARIA exports do not provide range sliders, modal dialogs or sidebars. Those use native range/dialog behavior. Data tables use native table/caption/th/scope/aria-sort semantics; an interactive spreadsheet grid would be a distinct ARIA-grid interaction contract.

The API entry point adapts signal HTTP reads and immutable one-shot commands from the existing application patterns. Applications configure the gateway, credentials and headers; provideHttpClient and its interceptors remain application-owned. Parsers validate unknown responses. Reads cancel reactively, commands execute once with no reload/retry, and Angular destruction or caller abort releases resources. Private SSR transfer and completed-response caching are disabled. Mutation methods are browser-only. There is no application endpoint, role, DTO, auth store, cookie forwarding, database access or business policy.

## Consumer styling contract

Style host elements and semantic data-part attributes in the application's global Tailwind components layer. Angular emulated component styles cannot style another component's template; use global rules rather than ::ng-deep. Caller-supplied labelClass/inputClass remain on the native control wrappers. Native hidden/inert/disabled/focus behavior must not be overridden by consumer CSS. Tokens and classes are not supplied by this package.

Dialogs expose data-placement and data-side; they own native modal focus, dismissal intent and scroll release. Consumers remove a dialog after its closed event. Sidebar wraps that contract in a controlled open model. Animations are application-owned and must not block dismissal or resource cleanup.

The API entry point is optional for consumers; importing UI cannot initialize transport. It does not replace application authorization, public SSR allowlists, gateways or session services.

## Verification

See AGENTS.md for mandatory commands. Tests import the built distribution. Browser tests run a separate synthetic consumer application. CI uploads a tarball artifact; it does not publish npm packages or deploy consumer applications. Existing application startup budgets remain unchanged because no consumer has been migrated.
