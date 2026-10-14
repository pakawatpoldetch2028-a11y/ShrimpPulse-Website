import { h } from '../../lib.js';
import { statusBadge, statusLegend, sectionHead, media, icon, contours } from '../../components.js';

export function render(ctx) {
  const { content: c, common, config, rel } = ctx;

  const hero = `<section class="page-hero" aria-labelledby="page-title">
  ${contours('page-hero__contours')}
  <div class="container">
    <p class="eyebrow">${h(c.hero.eyebrow)}</p>
    <h1 id="page-title" class="page-title">${h(c.hero.title)}</h1>
    <p class="page-lead">${h(c.hero.lead)}</p>
  </div>
</section>`;

  const cell = (v) => {
    if (v === 'yes') return `<span class="cell cell--yes">${icon('check')}<span>${h(c.comparison.yes)}</span></span>`;
    if (v === 'developing') return `<span class="cell cell--developing">${icon('developing')}<span>${h(c.comparison.developing)}</span></span>`;
    return `<span class="cell cell--no">${icon('dash')}<span>${h(c.comparison.no)}</span></span>`;
  };
  const cols = c.comparison.columns;
  const table = `<div class="table-wrap">
    <table class="compare">
      <caption class="visually-hidden">${h(c.comparison.caption)}</caption>
      <thead>
        <tr>
          <th scope="col">${h(cols.capability)}</th>
          <th scope="col">${h(cols.v2)}</th>
          <th scope="col">${h(cols.v4)}</th>
          <th scope="col">${h(cols.status)}</th>
        </tr>
      </thead>
      <tbody>
        ${c.comparison.rows
          .map(
            (r) => `<tr>
          <th scope="row">${h(r.name)}<span class="compare__note">${h(r.note)}</span></th>
          <td>${cell(r.v2)}</td>
          <td>${cell(r.v4)}</td>
          <td>${statusBadge(r.status, common)}</td>
        </tr>`
          )
          .join('\n        ')}
      </tbody>
    </table>
  </div>
  <ul class="compare-cards" aria-label="${h(c.comparison.caption)}">
    ${c.comparison.rows
      .map(
        (r) => `<li class="compare-card compare-card--${r.status}">
      <h3 class="compare-card__title">${h(r.name)}</h3>
      ${statusBadge(r.status, common)}
      <dl class="compare-card__grid">
        <dt>${h(cols.v2)}</dt><dd>${cell(r.v2)}</dd>
        <dt>${h(cols.v4)}</dt><dd>${cell(r.v4)}</dd>
      </dl>
      <p class="compare-card__note">${h(r.note)}</p>
    </li>`
      )
      .join('\n    ')}
  </ul>`;

  const comparison = `<section class="section" aria-labelledby="compare-title">
  <div class="container">
    <h2 id="compare-title" class="section-title">${h(c.comparison.title)}</h2>
    ${statusLegend(common)}
    ${table}
  </div>
</section>`;

  const modules = `<section class="section section--aqua" aria-labelledby="modules-title">
  <div class="container">
    <h2 id="modules-title" class="section-title">${h(c.modules.title)}</h2>
    <div class="modules">
      ${c.modules.items
        .map(
          (m) => `<article class="module module--${m.status}" id="${h(m.id)}" aria-labelledby="module-${h(m.id)}">
        <div class="module__status">
          ${statusBadge(m.status, common)}
          ${m.alsoDeveloping ? statusBadge('developing', common, { size: 'sm' }) : ''}
        </div>
        <h3 id="module-${h(m.id)}" class="module__title">${h(m.title)}</h3>
        <p class="module__text">${h(m.text)}</p>
        ${m.examples.length
          ? `<div class="module__examples">
          <h4 class="module__examples-title">${h(m.examplesTitle)}</h4>
          <ul>${m.examples.map((e) => `<li>${h(e)}</li>`).join('')}</ul>
        </div>`
          : ''}
      </article>`
        )
        .join('\n      ')}
    </div>
    <aside class="callout callout--planned" aria-labelledby="improve-title">
      ${statusBadge(c.improvement.status, common)}
      <h3 id="improve-title" class="callout__title">${h(c.improvement.title)}</h3>
      <p>${h(c.improvement.text)}</p>
    </aside>
  </div>
</section>`;

  const screenshot = `<section class="section section--narrow" aria-label="LINE">
  <div class="container split split--center">
    <div class="phone phone--static">
      <div class="phone__notch" aria-hidden="true"></div>
      ${media({ src: config.images.lineScreenshotCapabilities, alt: c.screenshot.alt, label: c.screenshot.label, ratio: '427/934', cls: 'phone__screen', rel })}
    </div>
    <div class="callout callout--note">
      <h2 class="callout__title">${h(c.professionalNote.title)}</h2>
      <p>${h(c.professionalNote.text)}</p>
      <p class="media__caption media__caption--pending">${h(c.screenshot.caption)}</p>
    </div>
  </div>
</section>`;

  const longer = `<section class="section section--muted" aria-labelledby="longer-title">
  <div class="container">
    ${sectionHead({ title: c.longerTerm.title, text: c.longerTerm.lead, id: 'longer-title' })}
    <div class="ambitions">
      ${c.longerTerm.groups
        .map(
          (g) => `<div class="ambitions__group">
        <h3 class="ambitions__title">${h(g.title)}</h3>
        <p>${h(g.text)}</p>
        <ul class="ambitions__list">${g.items.map((i) => `<li>${h(i)}</li>`).join('')}</ul>
      </div>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

  return {
    title: c.meta.title,
    description: c.meta.description,
    bodyClass: 'page-capabilities',
    body: [hero, comparison, modules, screenshot, longer].join('\n'),
  };
}
