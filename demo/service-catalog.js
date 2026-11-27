/**
 * Actual service responsibilities with explicit public and internal consumption boundaries.
 * @property serviceCatalog
 */
export const serviceCatalog = [
  {
    id: 'api',
    name: 'Api',
    description: 'Lecturas reactivas y comandos HTTP explícitos, con validación y cancelación.',
    visibility: 'Público · entrada opcional',
    entryPoint: 'machetico-ui/api',
  },
  {
    id: 'scrollbar',
    name: 'Scrollbar',
    description:
      'Activa de forma reversible los estilos de barras nativas definidos por su aplicación.',
    visibility: 'Público',
    entryPoint: 'machetico-ui/core',
  },
  {
    id: 'scroll-reveal',
    name: 'ScrollReveal',
    description:
      'Observación de viewport y ciclo de vida de animaciones, con movimiento definido por el consumidor.',
    visibility: 'Público · proveedor local',
    entryPoint: 'machetico-ui/core',
  },
  {
    id: 'scroll-lock',
    name: 'ScrollLock',
    description:
      'Coordina los bloqueos de scroll de diálogos y restaura el documento al cerrar el último modal.',
    visibility: 'Público · compartido con Dialog y Sidebar',
    entryPoint: 'machetico-ui/core',
  },
  {
    id: 'view-ids',
    name: 'ViewIds',
    description: 'Asigna identificadores accesibles dentro de cada aplicación o solicitud SSR.',
    visibility: 'Público · por aplicación/solicitud SSR',
    entryPoint: 'machetico-ui/view-ids',
  },
];
