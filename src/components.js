// Reusable HTML components. Every function returns a string.
import { h, join } from './lib.js';

const ICONS = {
  available: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8.5" fill="currentColor" opacity=".18"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  developing: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8.5" fill="currentColor" opacity=".18"/><path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  planned: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3.2 2.6"/><circle cx="10" cy="10" r="2.2" fill="currentColor"/></svg>',
  considering: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="1.5 2.4"/><path d="M7.8 8.1a2.3 2.3 0 1 1 3.3 2.1c-.7.4-1.1.8-1.1 1.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14.4" r="1.1" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  dash: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 10h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  arrow: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M11 4h5v5M16 4l-7 7M14 11.5V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  line: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3C6.9 3 2.8 6.4 2.8 10.6c0 3.7 3.3 6.9 7.8 7.5.3.1.7.2.8.5.1.2.1.6 0 .9l-.1.8c0 .2-.2.9.8.5s5.3-3.1 7.2-5.3c1.3-1.5 2-3 2-4.9C21.2 6.4 17.1 3 12 3z" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><rect x="3" y="5" width="14" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 6l6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  image: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/><path d="M4.5 17l5-5 3.5 3.5 2.5-2.5 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  quote: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.5 6.5C5 8 4 10.3 4 13.2c0 2.4 1.5 4.3 3.6 4.3 1.9 0 3.2-1.4 3.2-3.1 0-1.7-1.2-3-2.9-3-.3 0-.6 0-.9.1.4-1.5 1.3-2.7 2.8-3.6zm9 0C14 8 13 10.3 13 13.2c0 2.4 1.5 4.3 3.6 4.3 1.9 0 3.2-1.4 3.2-3.1 0-1.7-1.2-3-2.9-3-.3 0-.6 0-.9.1.4-1.5 1.3-2.7 2.8-3.6z" fill="currentColor"/></svg>',
};

export function icon(name) {
  return ICONS[name] || '';
}

/** Release-status label: icon + words + colour, never colour alone. */
export function statusBadge(status, common, { size = 'md', short = false } = {}) {
  const s = common.status[status];
  if (!s) throw new Error(`Unknown status "${status}"`);
  return `<span class="status status--${status} status--${size}" title="${h(s.hint)}">${ICONS[status]}<span class="status__text">${h(short ? s.short : s.label)}</span></span>`;
}

export function statusLegend(common) {
  return `<section class="legend" aria-labelledby="legend-title">
  <h2 id="legend-title" class="legend__title">${h(common.statusLegendTitle)}</h2>
  <ul class="legend__list">
    ${['available', 'developing', 'planned', 'considering']
      .map((k) => `<li class="legend__item">${statusBadge(k, common)}<span class="legend__hint">${h(common.status[k].hint)}</span></li>`)
      .join('\n    ')}
  </ul>
</section>`;
}

export function sectionHead({ eyebrow, title, text, level = 2, id, cls = '' }) {
  const tag = `h${level}`;
  return `<div class="section-head ${cls}">
  ${eyebrow ? `<p class="eyebrow">${h(eyebrow)}</p>` : ''}
  <${tag}${id ? ` id="${id}"` : ''} class="section-title">${h(title)}</${tag}>
  ${text ? `<p class="section-lead">${h(text)}</p>` : ''}
</div>`;
}

/**
 * Reserved media area. Renders a real <img> when the manifest provides a path,
 * otherwise a clearly labelled, neutral placeholder. The editorial label is kept
 * separate from factual copy.
 */
export function media({ src, alt, label, caption, ratio = '4/3', cls = '', rel, sizes, eager = false }) {
  if (src) {
    return `<figure class="media ${cls}" style="--ratio:${ratio}">
  <img src="${h(rel(src))}" alt="${h(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${sizes ? ` sizes="${h(sizes)}"` : ''}>
  ${caption ? `<figcaption class="media__caption">${h(caption)}</figcaption>` : ''}
</figure>`;
  }
  return `<div class="media media--placeholder ${cls}" style="--ratio:${ratio}">
  <div class="placeholder">
    <span class="placeholder__icon">${ICONS.image}</span>
    <span class="placeholder__label">${h(label)}</span>
  </div>
  ${caption ? `<p class="media__caption media__caption--pending">${h(caption)}</p>` : ''}
</div>`;
}

/** Reserved quotation area, or the real quote when supplied. */
export function quote({ text, attribution, label }) {
  if (text) {
    return `<figure class="pullquote">
  <span class="pullquote__mark">${ICONS.quote}</span>
  <blockquote class="pullquote__text"><p>${h(text)}</p></blockquote>
  ${attribution ? `<figcaption class="pullquote__by">${h(attribution)}</figcaption>` : ''}
</figure>`;
  }
  return `<div class="pullquote pullquote--placeholder">
  <span class="pullquote__mark">${ICONS.quote}</span>
  <p class="placeholder__label">${h(label)}</p>
  ${attribution ? `<p class="pullquote__by">${h(attribution)}</p>` : ''}
</div>`;
}

export function button({ href, label, kind = 'primary', iconName, external = false, pending = false, extra = '' }) {
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="btn btn--${kind}${pending ? ' btn--pending' : ''}" href="${h(href)}"${attrs}${extra}>${iconName ? ICONS[iconName] : ''}<span>${h(label)}</span>${external ? ICONS.external : ''}</a>`;
}

/**
 * Primary LINE action. If the real link is missing, the button points to the
 * access-information section instead of leading nowhere.
 */
export function lineButton(ctx, { kind = 'primary' } = {}) {
  const { config, common, rel, slug } = ctx;
  if (config.links.lineUrl) {
    return button({ href: config.links.lineUrl, label: common.cta.useLine, kind, iconName: 'line', external: true });
  }
  const href = slug === 'home' ? '#access' : `${rel(`${ctx.lang}/`)}#access`;
  return button({ href, label: common.cta.useLinePending, kind, iconName: 'line', pending: true });
}

/** Horizontal (or stacked on phones) process illustration. */
export function process(steps, { loopLabel, cls = '' } = {}) {
  const items = steps
    .map(
      (s, i) => `<li class="process__step">
      <span class="process__num" aria-hidden="true">${i + 1}</span>
      <span class="process__title">${h(s.title ?? s)}</span>
      ${s.text ? `<span class="process__text">${h(s.text)}</span>` : ''}
    </li>`
    )
    .join('\n');
  const loop = loopLabel
    ? `<div class="process__loop" role="note">
      <svg class="process__loop-arrow" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M98 2v12a6 6 0 0 1-6 6H8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3"/><path d="M12 15l-6 5 6 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="process__loop-label">${h(loopLabel)}</span>
    </div>`
    : '';
  return `<div class="process ${cls}${loopLabel ? ' process--loop' : ''}">
  <ol class="process__list">
${items}
  </ol>
  ${loop}
</div>`;
}

/** Decorative water contours used behind heroes. */
export function contours(cls = '') {
  return `<svg class="contours ${cls}" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" stroke-width="1.2">
    <path d="M-20 320c120-40 220 20 340-20s200-90 320-60 160 60 180 70"/>
    <path d="M-20 350c120-40 230 10 350-30s190-80 310-50 170 60 190 70" opacity=".7"/>
    <path d="M-20 380c120-40 240 0 360-40s180-70 300-40 180 60 200 70" opacity=".45"/>
    <path d="M520 40c60-30 140-10 180 30s20 90-40 100-130-10-150-50 0-70 10-80z" opacity=".5"/>
    <path d="M540 60c50-25 110-5 140 25s10 70-35 78-105-8-120-40 5-55 15-63z" opacity=".3"/>
  </g>
</svg>`;
}

export { join };
