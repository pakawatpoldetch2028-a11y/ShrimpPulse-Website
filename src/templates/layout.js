// Document shell: <head>, header with navigation and language switch, footer.
import { h, fmt } from '../lib.js';
import { icon } from '../components.js';

export const PAGES = [
  { slug: 'home', path: '' },
  { slug: 'why', path: 'why/' },
  { slug: 'capabilities', path: 'capabilities/' },
  { slug: 'how', path: 'how-it-works/' },
  { slug: 'progress', path: 'progress/' },
  { slug: 'acknowledgements', path: 'acknowledgements/' },
];

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap';

function wordmark(ctx, { linkHome = true } = {}) {
  const { rel, lang, common } = ctx;
  const inner = `<img class="brand__mark" src="${h(rel('assets/images/brand/icon-192.png'))}" width="40" height="40" alt="" aria-hidden="true">
    <span class="brand__word"><span class="brand__shrimp">Shrimp</span><span class="brand__pulse">Pulse</span><svg class="brand__pulseline" viewBox="0 0 48 16" aria-hidden="true" focusable="false"><path d="M0 9h12l4-7 6 13 5-10 3 4h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg></span>`;
  return linkHome
    ? `<a class="brand" href="${h(rel(`${lang}/`))}" aria-label="ShrimpPulse – ${h(common.nav.home)}">${inner}</a>`
    : `<span class="brand">${inner}</span>`;
}

function nav(ctx) {
  const { rel, lang, common, slug } = ctx;
  return PAGES.map((p) => {
    const current = p.slug === slug;
    return `<li><a class="nav__link${current ? ' is-current' : ''}" href="${h(rel(`${lang}/${p.path}`))}"${current ? ' aria-current="page"' : ''}>${h(common.nav[p.slug])}</a></li>`;
  }).join('\n        ');
}

function langSwitch(ctx) {
  const { rel, lang, common, page } = ctx;
  const other = lang === 'th' ? 'en' : 'th';
  const otherHref = rel(`${other}/${page.path}`);
  const item = (code, label, isCurrent, href) =>
    isCurrent
      ? `<span class="lang__item is-current" aria-current="true" lang="${code}">${label}</span>`
      : `<a class="lang__item" href="${h(href)}" lang="${code}" hreflang="${code}" data-lang="${code}" aria-label="${h(common.switchToAria)}">${label}</a>`;
  return `<nav class="lang" aria-label="${h(common.languageSwitch)}">
      ${item('en', 'EN', lang === 'en', otherHref)}
      <span class="lang__sep" aria-hidden="true">|</span>
      ${item('th', 'ไทย', lang === 'th', otherHref)}
    </nav>`;
}

export function layout(ctx, { title, description, body, bodyClass = '' }) {
  const { lang, common, config, rel, abs, page } = ctx;
  const other = lang === 'th' ? 'en' : 'th';
  const year = new Date().getFullYear();
  const ogImage = abs('assets/images/brand/icon-512.png');
  return `<!doctype html>
<html lang="${lang}" data-page="${page.slug}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(title)}</title>
<meta name="description" content="${h(description)}">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#0F4C5C">
<link rel="canonical" href="${h(abs(`${lang}/${page.path}`))}">
<link rel="alternate" hreflang="${lang}" href="${h(abs(`${lang}/${page.path}`))}">
<link rel="alternate" hreflang="${other}" href="${h(abs(`${other}/${page.path}`))}">
<link rel="alternate" hreflang="x-default" href="${h(abs(`${config.site.defaultLanguage}/${page.path}`))}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ShrimpPulse">
<meta property="og:title" content="${h(title)}">
<meta property="og:description" content="${h(description)}">
<meta property="og:url" content="${h(abs(`${lang}/${page.path}`))}">
<meta property="og:image" content="${h(ogImage)}">
<meta property="og:locale" content="${lang === 'th' ? 'th_TH' : 'en_GB'}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${h(rel('assets/images/brand/favicon.ico'))}" sizes="32x32">
<link rel="icon" href="${h(rel('assets/images/brand/icon-192.png'))}" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="${h(rel('assets/images/brand/icon-180.png'))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}">
<link rel="stylesheet" href="${h(rel('assets/css/main.css'))}">
<script>document.documentElement.classList.add('js');</script>
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">${h(common.skipToContent)}</a>
<header class="site-header">
  <div class="container site-header__inner">
    ${wordmark(ctx)}
    <div class="site-header__tools">
      ${langSwitch(ctx)}
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-label-open="${h(common.menu)}" data-label-close="${h(common.closeMenu)}">
      <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="nav-toggle__label">${h(common.menu)}</span>
      </button>
    </div>
    <div class="site-header__nav" id="site-nav">
      <nav class="nav" aria-label="${h(common.menu)}">
        <ul class="nav__list">
        ${nav(ctx)}
        </ul>
      </nav>
    </div>
  </div>
</header>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__about">
      ${wordmark(ctx, { linkHome: false })}
      <p class="site-footer__tagline">${h(common.siteTagline)}</p>
      <p>${h(common.footer.about)}</p>
    </div>
    <nav class="site-footer__nav" aria-label="${h(common.menu)}">
      <ul>
        ${nav(ctx)}
      </ul>
    </nav>
    <div class="site-footer__notes">
      <p class="site-footer__status">${icon('available')} ${h(common.footer.statusNote)}</p>
      <p>${h(common.footer.disclaimer)}</p>
    </div>
    <div class="site-footer__bottom">
      <p>${h(fmt(common.footer.rights, { year }))}</p>
      <p>${h(common.footer.builtNote)}</p>
    </div>
  </div>
</footer>
<script src="${h(rel('assets/js/main.js'))}" defer></script>
</body>
</html>
`;
}
