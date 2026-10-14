#!/usr/bin/env node
// Static site build. No dependencies: reads site.config.json + content/<lang>/*.json,
// renders every page in every language, copies assets, writes to dist/.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyTokens, formatDate, formatDateRange } from './src/lib.js';
import { layout, PAGES } from './src/templates/layout.js';
import { rootRedirect, notFound } from './src/templates/special.js';
import * as home from './src/templates/pages/home.js';
import * as why from './src/templates/pages/why.js';
import * as capabilities from './src/templates/pages/capabilities.js';
import * as how from './src/templates/pages/how.js';
import * as progress from './src/templates/pages/progress.js';
import * as acknowledgements from './src/templates/pages/acknowledgements.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'dist');
const RENDERERS = { home, why, capabilities, how, progress, acknowledgements };

const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const config = readJson('site.config.json');

// Base path: env BASE_PATH wins, otherwise the path part of siteUrl, otherwise "/".
let basePath = process.env.BASE_PATH || new URL(config.site.siteUrl).pathname || '/';
if (!basePath.startsWith('/')) basePath = `/${basePath}`;
if (!basePath.endsWith('/')) basePath += '/';
const origin = new URL(config.site.siteUrl).origin;

const languages = config.site.languages;
const contents = {};
for (const lang of languages) {
  const common = applyTokens(readJson(`content/${lang}/common.json`), lang, config);
  contents[lang] = { common };
  for (const p of PAGES) {
    contents[lang][p.slug] = applyTokens(readJson(`content/${lang}/${p.slug}.json`), lang, config);
  }
}

// Validate that every image path in the manifest exists.
for (const [key, value] of Object.entries(config.images)) {
  if (key.startsWith('_') || !value) continue;
  if (!existsSync(join(ROOT, value))) throw new Error(`images.${key} points to a missing file: ${value}`);
}
if (config.links.lineQrImage && !existsSync(join(ROOT, config.links.lineQrImage))) {
  throw new Error(`links.lineQrImage points to a missing file: ${config.links.lineQrImage}`);
}
if (config.links.lineQrImage && !config.links.lineUrl) {
  throw new Error('links.lineQrImage is set but links.lineUrl is empty. A QR code must come from the real link.');
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Assets: static files, stylesheet, script.
cpSync(join(ROOT, 'assets'), join(OUT, 'assets'), { recursive: true });
mkdirSync(join(OUT, 'assets/css'), { recursive: true });
mkdirSync(join(OUT, 'assets/js'), { recursive: true });
cpSync(join(ROOT, 'src/styles/main.css'), join(OUT, 'assets/css/main.css'));
cpSync(join(ROOT, 'src/scripts/main.js'), join(OUT, 'assets/js/main.js'));
writeFileSync(join(OUT, '.nojekyll'), '');

let count = 0;
for (const lang of languages) {
  for (const page of PAGES) {
    const outDir = join(OUT, lang, page.path);
    const depth = 1 + page.path.split('/').filter(Boolean).length;
    const prefix = '../'.repeat(depth);
    const rel = (p) => `${prefix}${p}`.replace(/\/\.\//g, '/');
    const abs = (p) => `${origin}${basePath}${p}`;
    const common = contents[lang].common;
    const ctx = {
      lang,
      slug: page.slug,
      page,
      common,
      config,
      content: contents[lang][page.slug],
      rel,
      abs,
      fmtDate: (v) => formatDate(v, lang, common, config),
      fmtRange: (a, b) => formatDateRange(a, b, lang, common, config),
    };
    const rendered = RENDERERS[page.slug].render(ctx);
    const html = layout(ctx, rendered);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    count++;
  }
}

writeFileSync(join(OUT, 'index.html'), rootRedirect({ config, basePath, contents }));
writeFileSync(join(OUT, '404.html'), notFound({ config, basePath, contents }));

console.log(`Built ${count} pages (${languages.join(', ')}) + redirect + 404 → dist/  [base path ${basePath}]`);
