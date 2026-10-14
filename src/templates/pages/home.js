import { h } from '../../lib.js';
import { statusBadge, sectionHead, media, quote, button, lineButton, process, contours, icon } from '../../components.js';

export function render(ctx) {
  const { content: c, common, config, rel, lang, fmtDate } = ctx;
  const img = config.images;

  const hero = `<section class="hero" aria-labelledby="hero-title">
  ${contours('hero__contours')}
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow">${h(c.hero.eyebrow)}</p>
      <h1 id="hero-title" class="hero__title">${h(c.hero.headline)}</h1>
      <p class="hero__lead">${h(c.hero.lead)}</p>
      <p class="hero__audience">${h(c.hero.audience)}</p>
      <div class="hero__actions">
        ${lineButton(ctx)}
        ${button({ href: `${rel(`${lang}/progress/`)}#roadmap`, label: common.cta.roadmap, kind: 'secondary', iconName: 'arrow' })}
      </div>
      <ul class="hero__badges" aria-label="${h(c.statusStrip.title)}">
        <li>${statusBadge('available', common)}</li>
        <li>${statusBadge('developing', common)}</li>
      </ul>
    </div>
    <div class="hero__visual">
      <img class="hero__mascot" src="${h(rel(img.mascotMedium))}" srcset="${h(rel(img.mascotSmall))} 320w, ${h(rel(img.mascotMedium))} 640w, ${h(rel(img.mascot))} 711w" sizes="(min-width: 900px) 380px, 55vw" width="711" height="785" alt="${h(c.hero.mascotAlt)}" decoding="async" fetchpriority="high">
      <div class="phone" aria-label="${h(c.hero.screenshotAlt)}">
        <div class="phone__notch" aria-hidden="true"></div>
        ${media({ src: img.lineScreenshotHome, alt: c.hero.screenshotAlt, label: c.hero.screenshotLabel, ratio: '9/18', cls: 'phone__screen', rel, eager: true })}
      </div>
      <p class="hero__visual-caption">${h(img.lineScreenshotHome ? c.hero.screenshotCaptionLive : c.hero.screenshotCaption)}</p>
    </div>
  </div>
</section>`;

  const strip = `<section class="strip" aria-labelledby="strip-title">
  <div class="container">
    <h2 id="strip-title" class="strip__title">${h(c.statusStrip.title)}</h2>
    <ol class="strip__list">
      ${c.statusStrip.items
        .map(
          (it) => `<li class="strip__item strip__item--${it.status}">
        ${statusBadge(it.status, common)}
        <h3 class="strip__item-title">${h(it.title)}</h3>
        <p>${h(it.text)}</p>
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;

  const founderQuote = config.quotes.founder[lang] || '';
  const why = `<section class="section section--editorial" aria-labelledby="why-title">
  <div class="container editorial">
    <div class="editorial__text">
      ${sectionHead({ eyebrow: c.why.eyebrow, title: c.why.title, id: 'why-title' })}
      <p class="prose">${h(c.why.text)}</p>
      ${button({ href: rel(`${lang}/why/`), label: common.cta.readStory, kind: 'text', iconName: 'arrow' })}
    </div>
    <div class="editorial__aside">
      ${quote({ text: founderQuote, label: c.why.quoteLabel, attribution: founderQuote ? config.people.founder[lang] : '' })}
    </div>
  </div>
</section>`;

  const capCol = (col) => `<article class="versions__col versions__col--${col.status}">
      ${statusBadge(col.status, common)}
      <h3 class="versions__title">${h(col.title)}</h3>
      <ul class="versions__list">
        ${col.items.map((t) => `<li>${h(t)}</li>`).join('\n        ')}
      </ul>
    </article>`;
  const capabilities = `<section class="section section--aqua" aria-labelledby="cap-title">
  <div class="container">
    ${sectionHead({ eyebrow: c.capabilities.eyebrow, title: c.capabilities.title, id: 'cap-title' })}
    <div class="versions">
      ${capCol(c.capabilities.now)}
      ${capCol(c.capabilities.next)}
    </div>
    <p class="note note--inline">${icon('developing')} ${h(c.capabilities.note)}</p>
    ${button({ href: rel(`${lang}/capabilities/`), label: common.cta.compare, kind: 'secondary', iconName: 'arrow' })}
  </div>
</section>`;

  const how = `<section class="section" aria-labelledby="how-title">
  <div class="container split">
    <div>
      ${sectionHead({ eyebrow: c.how.eyebrow, title: c.how.title, id: 'how-title' })}
      <p class="prose">${h(c.how.text)}</p>
      ${button({ href: rel(`${lang}/how-it-works/`), label: common.cta.seeHow, kind: 'text', iconName: 'arrow' })}
    </div>
    <div>
      ${process(c.how.steps, { cls: 'process--compact' })}
    </div>
  </div>
</section>`;

  const roadmap = `<section class="section section--teal" aria-labelledby="road-title">
  <div class="container split split--reverse">
    <div>
      ${sectionHead({ eyebrow: c.roadmap.eyebrow, title: c.roadmap.title, id: 'road-title' })}
      <p class="prose">${h(c.roadmap.text)}</p>
      ${button({ href: `${rel(`${lang}/progress/`)}#roadmap`, label: common.cta.roadmap, kind: 'light', iconName: 'arrow' })}
    </div>
    <ol class="mini-timeline">
      ${c.roadmap.milestones
        .map(
          (m) => `<li class="mini-timeline__item">
        <time datetime="${h(m.date)}" class="mini-timeline__date">${h(fmtDate(m.date))}</time>
        <span class="mini-timeline__title">${h(m.title)}</span>
        ${statusBadge(m.status, common, { size: 'sm' })}
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;

  const hasLine = Boolean(config.links.lineUrl);
  const access = `<section class="section section--access" id="access" aria-labelledby="access-title">
  <div class="container access">
    <div class="access__copy">
      ${sectionHead({ eyebrow: c.access.eyebrow, title: c.access.title, id: 'access-title' })}
      <p class="prose">${h(c.access.text)}</p>
      ${hasLine
        ? button({ href: config.links.lineUrl, label: common.cta.useLine, kind: 'primary', iconName: 'line', external: true })
        : `<div class="pending" role="status">
        <strong class="pending__title">${h(c.access.pendingTitle)}</strong>
        <p>${h(c.access.pendingText)}</p>
      </div>`}
    </div>
    <div class="access__qr">
      ${media({ src: config.links.lineQrImage, alt: c.access.qrAlt, label: common.placeholders.lineQr, caption: hasLine && config.links.lineQrImage ? c.access.qrCaption : '', ratio: '1/1', cls: 'media--qr', rel })}
    </div>
  </div>
</section>`;

  return {
    title: c.meta.title,
    description: c.meta.description,
    bodyClass: 'page-home',
    body: [hero, strip, why, capabilities, how, roadmap, access].join('\n'),
  };
}
