// Post-build checks: every internal link, image, stylesheet and script in dist/
// must resolve to a real file; every page must declare lang and a title.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');
const config = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));
let base = process.env.BASE_PATH || new URL(config.site.siteUrl).pathname || '/';
if (!base.endsWith('/')) base += '/';

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const errors = [];
const statuses = { available: 0, developing: 0, planned: 0, considering: 0 };

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const relPage = relative(DIST, page);
  if (!/<html lang="(th|en)"/.test(html)) errors.push(`${relPage}: missing <html lang>`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${relPage}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${relPage}: missing meta description`);
  for (const m of html.matchAll(/class="status status--(\w+)/g)) statuses[m[1]] = (statuses[m[1]] || 0) + 1;
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    const clean = url.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target;
    if (clean.startsWith('/')) {
      if (!clean.startsWith(base)) { errors.push(`${relPage}: absolute link outside base path: ${url}`); continue; }
      target = join(DIST, clean.slice(base.length));
    } else {
      target = resolve(dirname(page), clean);
    }
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${relPage}: broken link ${url}`);
  }
  // Images must have alt attributes.
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errors.push(`${relPage}: <img> without alt: ${m[0].slice(0, 80)}`);
  }
}

// Every page should exist in both languages.
const slugs = new Set(pages.map((p) => relative(DIST, p)).filter((p) => /^(th|en)\//.test(p)).map((p) => p.replace(/^(th|en)\//, '')));
for (const s of slugs) for (const l of ['th', 'en']) if (!existsSync(join(DIST, l, s))) errors.push(`missing ${l}/${s}`);

console.log(`Checked ${pages.length} pages. Status labels rendered:`, statuses);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('All links, assets, alt attributes, titles and language attributes OK.');
