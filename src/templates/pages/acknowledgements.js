import { h } from '../../lib.js';
import { media, contours } from '../../components.js';

export function render(ctx) {
  const { content: c, config, rel } = ctx;

  const hero = `<section class="page-hero" aria-labelledby="page-title">
  ${contours('page-hero__contours')}
  <div class="container">
    <p class="eyebrow">${h(c.hero.eyebrow)}</p>
    <h1 id="page-title" class="page-title">${h(c.hero.title)}</h1>
    <p class="page-lead">${h(c.hero.lead)}</p>
  </div>
</section>`;

  const sections = `<section class="section" aria-label="${h(c.hero.eyebrow)}">
  <div class="container">
    <ol class="credits">
      ${c.sections
        .map(
          (s, i) => `<li class="credit">
        <p class="eyebrow">${h(s.eyebrow)}</p>
        <h2 class="credit__title">${h(s.title)}</h2>
        <p class="credit__role">${h(s.role)}</p>
        <p class="credit__text">${h(s.text)}</p>
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;

  const photos = `<section class="section section--aqua" aria-label="Photographs">
  <div class="container photo-pair">
    ${media({ src: config.images.farmVisitPhoto, alt: c.photos.farmAlt, label: c.photos.farmLabel, ratio: '4/3', rel })}
    ${media({ src: config.images.communityPhoto, alt: c.photos.communityAlt, label: c.photos.communityLabel, ratio: '4/3', rel })}
  </div>
</section>`;

  const closing = `<section class="section section--narrow" aria-labelledby="closing-title">
  <div class="container container--prose">
    <h2 id="closing-title" class="section-title">${h(c.closing.title)}</h2>
    <p class="prose prose--lg">${h(c.closing.text)}</p>
  </div>
</section>`;

  return {
    title: c.meta.title,
    description: c.meta.description,
    bodyClass: 'page-acknowledgements',
    body: [hero, sections, photos, closing].join('\n'),
  };
}
