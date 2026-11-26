import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve('artifacts/pages');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webm': 'video/webm',
};
createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:5181');
  if (!url.pathname.startsWith('/machetico-ui/')) {
    response.writeHead(404).end();
    return;
  }
  const relative = decodeURIComponent(url.pathname.slice('/machetico-ui/'.length)) || 'index.html';
  const file = resolve(root, relative);
  if (!file.startsWith(root + sep)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(file);
    response.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'text/plain; charset=utf-8',
    });
    response.end(content);
  } catch {
    response.writeHead(404).end();
  }
}).listen(5181, '127.0.0.1');
