import { h } from '../../lib.js';
import { statusBadge, sectionHead, media, process, contours, icon } from '../../components.js';

const paras = (list) => list.map((p) => `<p>${h(p)}</p>`).join('\n');

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

  const rag = `<section class="section" id="rag" aria-labelledby="rag-title">
  <div class="container">
    <div class="tech-head">
      ${statusBadge(c.rag.status, common)}
      <p class="eyebrow">${h(c.rag.eyebrow)}</p>
      <h2 id="rag-title" class="section-title">${h(c.rag.title)}</h2>
    </div>
    <div class="prose prose--cols">${paras(c.rag.paragraphs)}</div>
    <figure class="tech-figure">
      <figcaption class="tech-figure__title">${h(c.rag.processTitle)}</figcaption>
      ${process(c.rag.steps)}
      <p class="note">${icon('available')} ${h(c.rag.flowNote)}</p>
    </figure>
  </div>
</section>`;

  const loop = `<section class="section section--aqua" id="loop-agent" aria-labelledby="loop-title">
  <div class="container">
    <div class="tech-head">
      ${statusBadge(c.loop.status, common)}
      <p class="eyebrow">${h(c.loop.eyebrow)}</p>
      <h2 id="loop-title" class="section-title">${h(c.loop.title)}</h2>
    </div>
    <div class="prose prose--cols">${paras(c.loop.paragraphs)}</div>
    <figure class="tech-figure">
      <figcaption class="tech-figure__title">${h(c.loop.processTitle)}</figcaption>
      ${process(c.loop.steps, { loopLabel: c.loop.loopLabel })}
    </figure>
    <div class="skills-block">
      <h3 class="tech-figure__title">${h(c.loop.skillsTitle)}</h3>
      <ul class="skills">
        ${c.loop.skills.map((s) => `<li class="skill"><strong>${h(s.title)}</strong><span>${h(s.text)}</span></li>`).join('\n        ')}
      </ul>
      <p class="note">${icon('developing')} ${h(c.loop.skillsNote)}</p>
    </div>
  </div>
</section>`;

  const together = `<section class="section section--teal" aria-labelledby="together-title">
  <div class="container split">
    <div>
      ${sectionHead({ title: c.together.title, id: 'together-title' })}
      <p class="prose">${h(c.together.text)}</p>
    </div>
    <div class="boundaries">
      <h3 class="boundaries__title">${h(c.boundaries.title)}</h3>
      <ul class="boundaries__list">${c.boundaries.items.map((i) => `<li>${h(i)}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;

  const illustration = `<section class="section" aria-label="${h(c.illustration.alt)}">
  <div class="container">
    ${media({ src: config.images.architectureIllustration, alt: c.illustration.alt, label: c.illustration.label, caption: c.illustration.caption, ratio: '16/7', cls: 'media--wide', rel })}
  </div>
</section>`;

  return {
    title: c.meta.title,
    description: c.meta.description,
    bodyClass: 'page-how',
    body: [hero, rag, loop, together, illustration].join('\n'),
  };
}
