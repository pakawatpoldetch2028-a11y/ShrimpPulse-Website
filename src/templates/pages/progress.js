import { h, fmt } from '../../lib.js';
import { statusBadge, sectionHead, media, button, process, contours, icon } from '../../components.js';

export function render(ctx) {
  const { content: c, common, config, rel, lang, fmtDate, fmtRange } = ctx;

  const hero = `<section class="page-hero" aria-labelledby="page-title">
  ${contours('page-hero__contours')}
  <div class="container">
    <p class="eyebrow">${h(c.hero.eyebrow)}</p>
    <h1 id="page-title" class="page-title">${h(c.hero.title)}</h1>
    <p class="page-lead">${h(c.hero.lead)}</p>
  </div>
</section>`;

  const item = (m, kind) => `<li class="timeline__item timeline__item--${kind}">
        <span class="timeline__marker" aria-hidden="true">${kind === 'done' ? icon('check') : ''}</span>
        <div class="timeline__body">
          <time class="timeline__date" datetime="${h(m.date.replace(/-Q(\d)/, (s, q) => `-${String((q - 1) * 3 + 1).padStart(2, '0')}`))}">${h(fmtRange(m.date, m.dateTo))}</time>
          <span class="timeline__kind">${h(kind === 'done' ? c.timeline.completedLabel : c.timeline.plannedLabel)}</span>
          <h4 class="timeline__title">${h(m.title)}</h4>
          <p class="timeline__text">${h(m.text)}</p>
        </div>
      </li>`;

  const timeline = `<section class="section" id="roadmap" aria-labelledby="timeline-title">
  <div class="container">
    <h2 id="timeline-title" class="section-title">${h(c.timeline.title)}</h2>
    <p class="note note--source">${h(c.timeline.sourceNote)}</p>
    <div class="timeline">
      <h3 class="timeline__heading timeline__heading--done">${icon('check')} ${h(c.timeline.completedTitle)}</h3>
      <ol class="timeline__list">
      ${c.timeline.completed.map((m) => item(m, 'done')).join('\n')}
      </ol>
      <h3 class="timeline__heading timeline__heading--planned">${icon('planned')} ${h(c.timeline.plannedTitle)}</h3>
      <ol class="timeline__list">
      ${c.timeline.planned.map((m) => item(m, 'planned')).join('\n')}
      </ol>
    </div>
  </div>
</section>`;

  const feedback = `<section class="section section--aqua" id="feedback" aria-labelledby="feedback-title">
  <div class="container">
    ${sectionHead({ eyebrow: c.feedback.eyebrow, title: c.feedback.title, id: 'feedback-title' })}
    <div class="split split--wide">
      <div>
        <p class="asof">${h(fmt(c.feedback.asOfLabel, { date: fmtDate(config.feedback.asOf) }))}</p>
        <dl class="stats">
          <div class="stat"><dt>${h(c.feedback.stats[0].label)}</dt><dd>${h(config.feedback.responses)}</dd></div>
          <div class="stat"><dt>${h(c.feedback.stats[1].label)}</dt><dd>${h(config.feedback.activeUsers)}</dd></div>
        </dl>
        <p class="prose">${h(c.feedback.text)}</p>
        <h3 class="sub-title">${h(c.feedback.requestsTitle)}</h3>
        <ul class="requests">
          ${c.feedback.requests.map((r) => `<li class="request"><strong>${h(r.title)}</strong><span>${h(r.text)}</span></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        ${media({ src: config.images.feedbackChart, alt: c.feedback.chartAlt, label: c.feedback.chartLabel, caption: c.feedback.chartCaption, ratio: '4/3', rel })}
      </div>
    </div>
    <h3 class="sub-title">${h(c.loop.title)}</h3>
    ${process(c.loop.steps, { cls: 'process--five' })}
  </div>
</section>`;

  const upd = config.updates.latest;
  const updateText = upd && upd[lang];
  const update = `<section class="section section--narrow" aria-labelledby="update-title">
  <div class="container container--prose">
    ${sectionHead({ eyebrow: c.update.eyebrow, title: c.update.title, id: 'update-title' })}
    ${updateText
      ? `<article class="update"><time datetime="${h(upd.date)}" class="update__date">${h(fmtDate(upd.date))}</time><p>${h(updateText)}</p></article>`
      : `<div class="placeholder placeholder--text"><span class="placeholder__label">${h(c.update.label)}</span><p class="media__caption media__caption--pending">${h(c.update.pending)}</p></div>`}
  </div>
</section>`;

  const email = config.contact.email;
  const participate = `<section class="section section--teal" id="participate" aria-labelledby="participate-title">
  <div class="container">
    ${sectionHead({ eyebrow: c.participate.eyebrow, title: c.participate.title, text: c.participate.text, id: 'participate-title' })}
    <ul class="ways">
      ${c.participate.ways.map((w) => `<li class="way"><h3>${h(w.title)}</h3><p>${h(w.text)}</p></li>`).join('\n      ')}
    </ul>
    <div class="contact-grid">
      <div class="contact-card">
        <h3>${h(c.participate.formTitle)}</h3>
        <p>${h(c.participate.formText)}</p>
        ${config.links.feedbackFormUrl
          ? button({ href: config.links.feedbackFormUrl, label: common.cta.feedbackForm, kind: 'primary', external: true })
          : `<p class="pending pending--compact" role="status"><strong>${h(common.cta.feedbackPending)}</strong><br>${h(c.participate.formPending)}</p>`}
      </div>
      <div class="contact-card" id="contact">
        <h3>${h(c.participate.contactTitle)}</h3>
        ${email
          ? `<p>${icon('mail')} <span class="visually-hidden">${h(c.participate.emailLabel)}: </span><a href="mailto:${h(email)}">${h(email)}</a></p>${config.contact.organisation ? `<p>${h(config.contact.organisation)}</p>` : ''}`
          : `<div class="placeholder placeholder--text"><span class="placeholder__label">${h(c.participate.contactPending)}</span><p class="media__caption media__caption--pending">${h(c.participate.contactPendingText)}</p></div>`}
      </div>
    </div>
  </div>
</section>`;

  return {
    title: c.meta.title,
    description: c.meta.description,
    bodyClass: 'page-progress',
    body: [hero, timeline, feedback, update, participate].join('\n'),
  };
}
