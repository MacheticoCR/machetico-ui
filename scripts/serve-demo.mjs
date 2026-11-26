import { createServer as createHttpServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';
const root = resolve('demo');
const port = Number(process.env.MACHETICO_DEMO_PORT ?? 5173);
const server = createHttpServer();
const vite = await createViteServer({
  root,
  appType: 'custom',
  server: { middlewareMode: true, hmr: { server } },
});
server.on('request', (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1:' + port);
  if (request.method === 'GET' && url.pathname === '/license') {
    readFile(resolve('LICENSE'), 'utf8')
      .then((license) => {
        response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end(license);
      })
      .catch(() => {
        response.statusCode = 500;
        response.end('License unavailable');
      });
    return;
  }
  if (
    request.method === 'GET' &&
    /^\/(?:components(?:\/[a-z0-9-]+)?|directives(?:\/[a-z0-9-]+)?|services(?:\/[a-z0-9-]+)?)?$/.test(
      url.pathname,
    )
  ) {
    (async () => {
      const csr = url.searchParams.get('render') === 'csr';
      let document = await readFile(resolve(root, 'index.html'), 'utf8');
      document = document.replace(
        '<html lang="es">',
        `<html lang="es" data-render-mode="${csr ? 'csr' : 'ssr'}">`,
      );
      document = await vite.transformIndexHtml(request.url, document);
      const result = csr
        ? document
        : await (await vite.ssrLoadModule('/render.js')).renderDocumentation(document, url.href);
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      response.end(result);
    })().catch((error) => {
      vite.ssrFixStacktrace(error);
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Documentation rendering failed. See the local server log.');
    });
  } else
    vite.middlewares(request, response, () => {
      response.statusCode = 404;
      response.end('Not found');
    });
});
server.listen(port, '127.0.0.1', () =>
  console.log(
    `Machetico UI documentation: http://127.0.0.1:${port}/components (SSR); add ?render=csr for CSR.`,
  ),
);
/**
 * Releases the development server and its owned Vite watchers.
 * @function shutdown
 */
async function shutdown() {
  await vite.close();
  server.close();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
