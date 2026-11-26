# Machetico UI — Taurus engineering rules

## Authority and approved scope

This repository adopts Taurus engineering conventions. These local rules are the complete reference; contributors must not require a private sibling checkout. Read this file, docs/architecture.md, package.json, the lockfile, TypeScript/Prettier configuration, checks, affected source and tests before editing.

The maintainer explicitly approved a separate Angular library named machetico-ui, reusable by Taurus, Megaphone and Folio. The library owns behavior and accessible structure. Consuming applications own all Tailwind styling, visual identity, business contracts, permissions and persistence. The optional machetico-ui/api entry point owns generic transport only. This is an approved library boundary, not permission to import application modules or publish their private source/configuration.

Distinguish policy, verified implementation and proposals. Never invent framework APIs, endpoints, roles, infrastructure or test results. Verify public signatures in the installed version. Changes to architecture, dependencies or public contracts require an explicit maintainer decision documented before implementation. Preserve strict checks and meaningful coverage; never weaken them to hide a failure.

## Ownership and collaboration

- Inspect git status, branch and diff before editing. Never reset, discard, reformat or publish another contributor's pending changes.
- Keep work small and reviewable. Coordinate shared files/contracts before parallel work. Do not spawn competing agents or migrate consumer applications without authorization.
- dev is integration; master is the validated release source. Use PRs for subsequent changes and delete temporary branches after integration. Only dev and master are persistent source branches. Generated deployment branches are unnecessary for this library. Do not force-push.
- Public source publication does not authorize npm publication, paid services, consumer upgrades or infrastructure provisioning.
- Never include credentials, private environment files, personal/customer records or backend business code. Use synthetic fixtures.
- Report exact files/contracts changed, actual checks, manual/browser verification and limitations. Never describe omitted checks as passed.

## Angular and architecture

- Use the pinned Angular 22 versions, standalone components, OnPush, signals, native control flow, external HTML templates and lazy optional entry points. Node 24+ and npm ci --ignore-scripts are required. Keep the lockfile.
- Angular ARIA first: use stable official public directives for supported interactions. Never use private/experimental exports or implement competing keyboard/focus/selection logic for a supported pattern. Keep native accessible buttons, links, forms, range inputs and dialogs where ARIA does not provide the pattern.
- One component per folder. Components and directives have direct central barrels. Consumer code imports their public package entry point. Internal implementations import concrete siblings to prevent runtime cycles. Never import a consumer application.
- Root services use @Service() and inject(), live under the owning entry point's services/ folder, and are consumed through its services barrel. Keep deliberately scoped providers scoped. Services use DestroyRef for cleanup, never component hooks.
- Every named interface or type alias lives in its own interfaces/ file and is exported through the direct type-only barrel. Keep TypeScript strict; no any, unsafe assertions, suppression comments or ignored failures.
- Components register effect/afterRenderEffect only in constructors. Other initialization uses ngOnInit; view work uses ngAfterViewInit; cleanup uses ngOnDestroy. Effects are not substitutes for derived state or explicit commands.
- Declare member visibility and method return types explicitly. Keep imports, declarations, methods and logical steps visibly separated. Use the checked-in Taurus Prettier configuration.
- No RxJS imports, Observable/Subject state, operators, interop imports or Observable subscriptions, including tests. Angular output intent testing is allowed.
- Presentation receives signal inputs/models and emits immutable intents. It never owns HTTP, authorization or domain persistence.
- All application reads use httpResource. The optional API client uses Angular HTTP, provideHttpClient(), and a single immutable resource per explicit command with cleanup. A command cannot reload or retry. No completed private-response cache, hidden credential storage, automatic cookie forwarding or server-rendered mutations. SSR transfer is disabled by default. Response parsers receive unknown and validate at runtime.
- No CSS theme, visual utility classes or Tailwind dependency in the distributed library. Accept caller-provided classes and expose semantic data attributes/parts. Focus/scroll/visibility changes needed for behavior are allowed. Tailwind belongs to demo/ and consumer applications. Keep reduced motion, keyboard, contrast under each consumer identity, mobile layout and loading/error/empty states verifiable.
- UI text and accessible labels belong to the consuming application. Preserve native Angular i18n markers and expose configurable labels for cross-application use. Never translate user-authored business content or change currency.

## Documentation and verification

Write English multiline TSDoc for classes, properties, constructors, methods, functions and named contracts. Explain real ownership, values, parameters, generic parameters, meaningful returns, failure behavior and useful examples. Include @class, @property, @function, @param and @typeParam as applicable. Omit void-return documentation. Do not copy irrelevant business/persistence boilerplate.

Required gates:

```sh
npm ci --ignore-scripts
npm run format:check
npm run architecture:check
npm run docs:check
npm run typecheck
npm run build
npm test
npm run demo:styles
npm run test:e2e
npm audit
npm run pack
```

Browser checks must cover ARIA selection with arrows/Enter/Escape, native range keyboard input, button pending state, dialog/sidebar focus restoration and Escape, table states and mobile overflow. Test the packaged optional API with synthetic HTTP: command exactly once, cancellation, failure and invalid-response validation. Keep checks against the distributable. Do not claim a jsdom test is a browser or device check.

For library releases inspect tarball contents, entry points, peer dependencies, bundle separation, absence of application source/secrets/styles and consumer installation. Only publish to a registry when explicitly authorized. Taurus-specific backend, business currency, SSR gateway, generated hosting and deployment rules stay in the consuming applications; never invent equivalent infrastructure here.
