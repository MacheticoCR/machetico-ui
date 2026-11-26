# Architecture

## Approved decisions

On 26 November 2026 the maintainer authorized hosting the documentation on GitHub Pages and redeploying it on every update to master. The existing demo gains a static Vite build with hash routing and a repository-relative base path; Pages serves CSR only. The local SSR/hydration harness and the partial-AOT library package remain separate. The documentation bundle deliberately includes Angular's JIT compiler for its existing JavaScript examples; it is not a consumer production application template. No backend, session data or npm publishing credential is deployed. A dedicated Pages workflow validates and deploys master, while PRs validate the static artifact without deployment. Package version and source revision identify the displayed documentation; deploying docs does not change or republish an npm version.

On 26 November 2026 the maintainer approved an independent Angular library, machetico-ui, in the public Machetico organization. Taurus, Megaphone and Folio are reference implementations and future consumers. They remain unchanged.

The latest instruction makes the package headless: it owns accessible structure, signals and interactions. Each application owns Tailwind, CSS, colors, fonts, spacing, shape, breakpoints and visual branding. There is no exported theme and no Tailwind runtime/peer dependency. The demo is a separate consumer; its abstract design references are illustrative and owned exclusively by the demo application.

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

## Documentation SPA and rendering decision

The maintainer requested separate SPA documentation for components, services and directives, live synthetic examples for every public concrete component, and SSR/CSR compatibility. The demo uses Angular Router 22.2.6 (aligned with the existing framework) with lazy category pages. Its sidebar, panels, headings, feedback, option controls and reference tables consume machetico-ui itself. This is demo-only routing, not a router dependency in the distributed library.

The development documentation server renders deep links with Angular platform-server and hydrates the same tree in the browser. A render=csr query selects a client-only bootstrap for regression comparison. This local development harness is not a production hosting deployment. Browser-only modal/visibility/timer work must not run on the server; request-owned injectors isolate identifiers and state. Both rendering paths must preserve accessible controls and framework-owned DOM.

The maintainer also requested Taurus's icon library. Its installed reference is lucide-static 1.74.0. Machetico UI pins that build-only source, generates the existing 41-name SVG subset, and preserves its license. No icon font, remote CDN, new icon vocabulary or lucide runtime dependency is introduced.

## Select popup behavior

A select popup must not participate in document flow. Angular ARIA continues to own combobox/listbox keyboard and selection semantics. Machetico UI owns the structural overlay behavior through the native Popover API, viewport positioning, scroll/resize updates and outside-pointer dismissal. This introduces no styling system or positioning dependency; colors, border, typography and spacing remain consumer-owned. Browser work is registered in afterRenderEffect and cleaned up when the popup closes. SSR renders only the closed trigger.

## Individual documentation views and landing extraction

The maintainer requested one SPA view per component on 26 November 2026. `/components` is an index; `/components/:component` instantiates only the selected live example and documents its integration, state ownership, keyboard behavior, styling, public API and SSR/CSR. Directives follow `/directives/:directive`. Unknown identifiers show an explicit empty state. The router remains demo-only.

The maintainer also authorized reusable visual extraction from the Machetico landing frontend. Generic editorial sections, summary cards, metrics, comparison, checklist, field grouping, consent, document presentation and ARIA step navigation contain synthetic examples. Authentication, payments, tenant configuration, provisioning commands, business DTOs and backend authorization remain application-owned. No reference repository is changed.

## Free-use authorship decision

On 26 November 2026 the maintainer requested that the main view state free use and MacheTico authorship. The repository and distributed package use the MIT license, retaining the MacheTico copyright and permission notice. Third-party licenses remain applicable. The demo root is an individual lazy introduction page, with company copy based on the public hero/statement in the MacheTico landing frontend; it does not expose tenant, session or payment data.

## Grouped navigation and shared scroll services

On 26 November 2026 the maintainer requested mutually exclusive documentation submenus and individual service views. The demo uses the installed public Angular ARIA accordion directives; successful navigation opens only the route's category, including SSR, browser history and mobile navigation. Services have individual `/services/:service` views.

The maintainer explicitly requested both Taurus scroll concerns. Taurus implements native scrollbar appearance in `src/scrollbars.css` and scoped viewport animations in `services/scroll-reveal`. The shared library exposes Scrollbar for reversible semantic activation on native scroll containers and scoped ScrollReveal for intersection/animation lifecycle. Consumer CSS owns colors, width, shapes and pending-state visuals; caller-provided Web Animations keyframes own animation identity. Native scrolling is retained. Reveal delegates its observation to ScrollReveal so it does not maintain a competing implementation. ScrollLock and ViewIds retain their internal scope and are documented individually as internal implementation responsibilities.

## Demo identity and action simplification

On 26 November 2026 the maintainer removed product-named identities and the redundant CallToAction component. The header Select now uses the abstract design choices described below. Public actions use Button on native buttons or anchors; accompanying copy remains application-owned section content. CallToAction is removed from the unpublished public API, its examples and source inventory.

## Abstract consumer designs

The maintainer explicitly clarified that Material is an additional demo design, not an Angular Material comparison or dependency. The demo-owned `material` appearance takes inspiration from classic Material elevation, indigo surfaces and compact corners. It styles the same machetico-ui instances through consumer CSS; Flat / Material and Android / Material You remain separate design choices. No library dependency, component contract or interaction implementation changes.

The maintainer replaced product-named demo identities with five design references on 26 November 2026: Liquid Glass, Aero, Glassmorphism, Neumorphism and Flat / Material. The maintainer then explicitly requested reusing the header Select for these five abstract design names. That public control selects a demo-owned InjectionToken signal; each SSR application starts deterministically with Flat / Material. SPA navigation shares this ephemeral choice without browser storage. All surfaces, control variants, colors and keyframes remain in consumer CSS. Library templates, interaction services and package exports do not import or select these designs. The home documentation explicitly teaches this headless consumption model.

## Additional designs and npm readiness

The maintainer requested additional distinctive consumer designs and preparation for adoption in the landing, Taurus, Megaphone and Folio frontends. Demo designs remain application-owned. Native interactions must retain their behavior under typography, surface, color and elevation changes. Publication preparation includes metadata, an inspected tarball, strict isolated npm installations against the observed consumer Angular versions, AOT consumer template compilation, SSR checks, and documented adoption recipes. Reference frontends retain their own source, lockfiles, API/session facades and release workflows; no consumer migration or registry publication is performed by preparation commands.

## Consumer version alignment

The maintainer explicitly requested homologation of all four frontends after reviewing their differing framework versions. The approved target follows the working Taurus/landing baseline: Angular framework/compiler-cli/ARIA 22.2.6, Angular CLI/build/SSR 22.2.7, TypeScript 6.0.3 and Node >=24.15.0. ARIA remains pinned to its validated revision. Only existing framework dependencies are aligned; business contracts and unrelated dependencies remain owned by their applications. The library declares matching framework peers and a pinned ARIA peer. Isolated consumer tests install the packaged artifact without force/legacy peer bypasses. Actual frontend validation is reported separately from library compatibility.

The package consumer regression uses official Angular CLI/build 22.2.7 as workspace-only development tools. The isolated application installs the published UI/API package with strict peers and its own Angular framework/compiler. Build tooling remains outside its installation contract and outside the distributed package. This avoids conflating an optional WASM toolchain peer conflict with the library's Angular peer compatibility. The regression still performs a real optimized Angular build and SSR prerender.

The production consumer regression exposed the required Angular Localize initialization for native i18n templates. The package declares @angular/localize as a framework peer, and consumers configure @angular/localize/init in Angular builder polyfills for browser and server (or import it before a custom bootstrap). The library does not install a global polyfill as an import side effect. Taurus already owns its initialization; the other three frontends receive the matching dependency and builder polyfill as part of the approved compatibility preparation.
