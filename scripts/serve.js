// Minimal dev server that mimics the GitHub Pages base path. Usage: npm run dev
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');
const config = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));
let base = process.env.BASE_PATH || new URL(config.site.siteUrl).pathname || '/';
if (!base.endsWith('/')) base += '/';
const port = Number(process.env.PORT || 8080);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.json': 'application/json' };

createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/' || (url + '/') === base) { res.writeHead(302, { Location: base }); return res.end(); }
  if (!url.startsWith(base)) { res.writeHead(404); return res.end('Outside base path'); }
  let file = join(DIST, url.slice(base.length));
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.endsWith('/')) { res.writeHead(301, { Location: url + '/' }); return res.end(); }
    file = join(file, 'index.html');
  }
  if (!existsSync(file)) { file = join(DIST, '404.html'); res.statusCode = 404; }
  res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
  res.end(readFileSync(file));
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}${base}`));
