# Preparación y publicación npm

## Artefacto publicable

El workspace raíz es privado. El paquete publicable es la salida Angular Package Format de `projects/machetico-ui`, con entradas públicas `machetico-ui` y `machetico-ui/api`. No publique la raíz del workspace ni los archivos TypeScript originales.

```sh
npm ci --ignore-scripts
npm run release:check
```

El gate ejecuta formato, arquitectura, TSDoc, tipos estrictos, compilación, regresiones unitarias/SSR/navegador, audit, empaquetado, inspección de contenidos, instalación real en consumidor AOT/SSR y `npm publish --dry-run`. No publica al registro. El tarball queda en `artifacts/machetico-ui-<version>.tgz`. Compruebe que la versión de `projects/machetico-ui/package.json` es la deseada antes de construir.

El paquete conserva MIT/autoría MacheTico, licencia de Lucide, tipos y exports APF. No contiene CSS/temas, aplicaciones consumidoras, secretos ni dependencias runtime de Tailwind, Router o Lucide. Angular/ARIA son peers y tslib es su única dependencia propia.

## Paso de publicación del responsable

Después de revisar el artefacto y autorizar su publicación, autentique una cuenta npm que pueda publicar el nombre sin scope `machetico-ui`. La organización de GitHub no concede automáticamente permisos en npm. Un 404 al consultar el registro no reserva el nombre.

```sh
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
npm publish ./artifacts/machetico-ui-0.1.0.tgz --access public --registry=https://registry.npmjs.org/
```

Sustituya la versión por la del artefacto validado. Después compruebe `npm view machetico-ui version` y pruebe `npm install machetico-ui` en un consumidor limpio. La simulación valida empaquetado/configuración, pero no demuestra credenciales, permisos de publicación ni disponibilidad futura del nombre.

Para automatizaciones futuras, npm recomienda trusted publishing/OIDC; requiere configurar el publisher en npm. El workflow de este repositorio valida y produce artefactos, sin publicar automáticamente. No guarde tokens en archivos del repositorio.

Referencias oficiales: [npm publish y dry-run](https://docs.npmjs.com/cli/v12/commands/npm-publish/), [trusted publishers](https://docs.npmjs.com/trusted-publishers/).
