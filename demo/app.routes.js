import { componentCatalog, directiveCatalog } from './catalog.generated';
/**
 * Public documentation categories; page modules remain lazy in the consumer application.
 * @property routes
 */
export const routes = [
  {
    path: '',
    title: 'Machetico UI · Desarrollada por MacheTico',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/documentation/pages/home').then((page) => page.HomeDocs),
  },
  {
    path: 'components/:component',
    title: (route) =>
      (componentCatalog.find((item) => item.id === route.paramMap.get('component'))?.name ??
        'Componente no encontrado') + ' | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/components').then((page) => page.ComponentsDocs),
  },
  {
    path: 'components',
    title: 'Componentes | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/components').then((page) => page.ComponentsDocs),
  },
  {
    path: 'services/api',
    title: 'Api | Machetico UI',
    loadComponent: () => import('./features/documentation/pages/api').then((page) => page.ApiDocs),
  },
  {
    path: 'services/scrollbar',
    title: 'Scrollbar | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/scrollbar').then((page) => page.ScrollbarDocs),
  },
  {
    path: 'services/scroll-reveal',
    title: 'ScrollReveal | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/scroll-reveal').then((page) => page.ScrollRevealDocs),
  },
  {
    path: 'services/scroll-lock',
    title: 'ScrollLock | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/scroll-lock').then((page) => page.ScrollLockDocs),
  },
  {
    path: 'services/view-ids',
    title: 'ViewIds | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/view-ids').then((page) => page.ViewIdsDocs),
  },
  {
    path: 'services/:service',
    loadComponent: () =>
      import('./features/documentation/pages/service-not-found').then(
        (page) => page.ServiceNotFoundDocs,
      ),
    title: 'Servicio no encontrado | Machetico UI',
  },
  {
    path: 'services',
    title: 'Servicios | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/services').then((page) => page.ServicesDocs),
  },
  {
    path: 'directives/:directive',
    title: (route) =>
      (directiveCatalog.find((item) => item.id === route.paramMap.get('directive'))?.name ??
        'Directiva no encontrada') + ' | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/directives').then((page) => page.DirectivesDocs),
  },
  {
    path: 'directives',
    title: 'Directivas | Machetico UI',
    loadComponent: () =>
      import('./features/documentation/pages/directives').then((page) => page.DirectivesDocs),
  },
  { path: '**', redirectTo: 'components' },
];
