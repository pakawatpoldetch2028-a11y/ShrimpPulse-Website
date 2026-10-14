import { h } from '../../lib.js';
import { sectionHead, media, quote, button, contours } from '../../components.js';

const paras = (list) => list.map((p) => `<p>${h(p)}</p>`).join('\n');

export function render(ctx) {
  const { content: c, config, rel, lang } = ctx;
  const img = config.images;

  const hero = `<section class="page-hero page-hero--portrait" aria-labelledby="page-title">
  ${contours('page-hero__contours')}
  <div class="container page-hero__grid">
    <div>
      <p class="eyebrow">${h(c.hero.eyebrow)}</p>
      <h1 id="page-title" class="page-title">${h(c.hero.title)}</h1>
      <p class="page-lead">${h(c.hero.lead)}</p>
    </div>
    ${media({ src: img.founderPortrait, alt: c.hero.portraitAlt, label: c.hero.portraitLabel, ratio: '4/5', cls: 'media--portrait', rel, eager: true })}
  </div>
</section>`;

  const founder = `<section class="section section--narrow" aria-labelledby="founder-title">
  <div class="container container--prose">
    <h2 id="founder-title" class="section-title">${h(c.founder.title)}</h2>
    <div class="prose prose--lg">${paras(c.founder.paragraphs)}</div>
  </div>
</section>`;

  const research = `<section class="section section--aqua" aria-labelledby="research-title">
  <div class="container editorial editorial--photo-right">
    <div class="editorial__text">
      ${sectionHead({ eyebrow: c.research.eyebrow, title: c.research.title, id: 'research-title' })}
      <div class="prose">${paras(c.research.paragraphs)}</div>
    </div>
    <div class="editorial__aside">
      ${media({ src: img.researchPhoto, alt: c.research.photoAlt, label: c.research.photoLabel, caption: c.research.photoCaption, ratio: '4/5', rel })}
    </div>
  </div>
</section>`;

  const question = `<section class="section" aria-labelledby="question-title">
  <div class="container container--prose">
    ${sectionHead({ eyebrow: c.question.eyebrow, title: c.question.title, id: 'question-title' })}
    <div class="prose prose--lg">${paras(c.question.paragraphs)}</div>
  </div>
</section>`;

  const answer = `<section class="section section--photo-band" aria-labelledby="answer-title">
  <div class="band-photo">
    ${media({ src: img.farmVisitPhoto, alt: c.answer.farmAlt, label: c.answer.farmLabel, ratio: '21/9', cls: 'media--band', rel })}
  </div>
  <div class="container editorial editorial--photo-left">
    <div class="editorial__text">
      ${sectionHead({ eyebrow: c.answer.eyebrow, title: c.answer.title, id: 'answer-title' })}
      <div class="prose">${paras(c.answer.paragraphs)}</div>
    </div>
    <div class="editorial__aside">
      ${quote({ text: config.quotes.founder[lang] || '', label: c.quote.label, attribution: c.quote.attribution })}
    </div>
  </div>
</section>`;

  const amr = `<section class="section section--teal" aria-labelledby="amr-title">
  <div class="container split">
    <div>
      ${sectionHead({ eyebrow: c.amr.eyebrow, title: c.amr.title, id: 'amr-title' })}
      <div class="prose">${paras(c.amr.paragraphs)}</div>
    </div>
    <div class="onehealth">
      ${sectionHead({ eyebrow: c.oneHealth.eyebrow, title: c.oneHealth.title, level: 3 })}
      <p class="prose">${h(c.oneHealth.text)}</p>
      <ul class="onehealth__ring" aria-label="One Health">
        ${c.oneHealth.nodes
          .map((n, i) => `<li class="onehealth__node onehealth__node--${i + 1}"><strong>${h(n.title)}</strong><span>${h(n.text)}</span></li>`)
          .join('\n        ')}
      </ul>
    </div>
  </div>
</section>`;

  const ack = `<section class="section" aria-labelledby="ack-title">
  <div class="container container--prose">
    ${sectionHead({ eyebrow: c.acknowledgementsPreview.eyebrow, title: c.acknowledgementsPreview.title, id: 'ack-title' })}
    <p class="prose">${h(c.acknowledgementsPreview.text)}</p>
    ${button({ href: rel(`${lang}/acknowledgements/`), label: c.acknowledgementsPreview.link, kind: 'text', iconName: 'arrow' })}
  </div>
</section>`;

  return {
    title: c.meta.title,
    description: c.meta.description,
    bodyClass: 'page-why',
    body: [hero, founder, research, question, answer, amr, ack].join('\n'),
  };
}
