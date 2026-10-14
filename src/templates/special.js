// Root redirect page and 404 page. Both use absolute base-path URLs because
// GitHub Pages serves 404.html from arbitrary paths.
import { h } from '../lib.js';
import { PAGES } from './layout.js';

export function rootRedirect({ config, basePath, contents }) {
  const def = config.site.defaultLanguage;
  const th = contents.th.common;
  const en = contents.en.common;
  return `<!doctype html>
<html lang="${def}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ShrimpPulse</title>
<meta name="description" content="${h(contents[def].common.siteDescription)}">
<meta name="robots" content="noindex">
<link rel="icon" href="${h(basePath)}assets/images/brand/favicon.ico" sizes="32x32">
<link rel="alternate" hreflang="th" href="${h(config.site.siteUrl.replace(/\/$/, ''))}/th/">
<link rel="alternate" hreflang="en" href="${h(config.site.siteUrl.replace(/\/$/, ''))}/en/">
<noscript><meta http-equiv="refresh" content="0;url=${h(basePath)}${def}/"></noscript>
<script>
(function(){
  var pref=null;try{pref=localStorage.getItem('shrimppulse-lang');}catch(e){}
  var lang=(pref==='en'||pref==='th')?pref:'${def}';
  var base='${h(basePath)}';
  location.replace(base+lang+'/'+location.hash);
})();
</script>
<link rel="stylesheet" href="${h(basePath)}assets/css/main.css">
</head>
<body class="page-redirect">
<main class="container redirect">
  <img src="${h(basePath)}assets/images/brand/icon-192.png" width="96" height="96" alt="ShrimpPulse">
  <h1>ShrimpPulse</h1>
  <p><a class="btn btn--primary" href="${h(basePath)}th/" lang="th" hreflang="th">${h(th.nav.home)} (ไทย)</a>
     <a class="btn btn--secondary" href="${h(basePath)}en/" lang="en" hreflang="en">${h(en.nav.home)} (English)</a></p>
</main>
</body>
</html>
`;
}

export function notFound({ config, basePath, contents }) {
  const def = config.site.defaultLanguage;
  const slugs = JSON.stringify(PAGES.map((p) => p.path.replace(/\/$/, '')).filter(Boolean));
  const block = (lang) => {
    const c = contents[lang].common;
    return `<section lang="${lang}" class="notfound__block">
    <h2>${h(c.notFound.title)}</h2>
    <p>${h(c.notFound.body)}</p>
    <p><a class="btn btn--${lang === def ? 'primary' : 'secondary'}" href="${h(basePath)}${lang}/">${h(c.notFound.home)}</a></p>
  </section>`;
  };
  return `<!doctype html>
<html lang="${def}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 · ShrimpPulse</title>
<meta name="description" content="ShrimpPulse – page not found">
<meta name="robots" content="noindex">
<link rel="icon" href="${h(basePath)}assets/images/brand/favicon.ico" sizes="32x32">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Sans+Thai+Looped:wght@400;600&display=swap">
<link rel="stylesheet" href="${h(basePath)}assets/css/main.css">
<script>
// If a visitor lands on a language-less path such as /why/, send them to the
// equivalent page in their preferred language.
(function(){
  var base='${h(basePath)}';
  var slugs=${slugs};
  var rest=location.pathname.indexOf(base)===0?location.pathname.slice(base.length):'';
  var first=rest.split('/')[0];
  if(first&&slugs.indexOf(first)>=0){
    var pref=null;try{pref=localStorage.getItem('shrimppulse-lang');}catch(e){}
    var lang=(pref==='en'||pref==='th')?pref:'${def}';
    location.replace(base+lang+'/'+first+'/'+location.hash);
  }
})();
</script>
</head>
<body class="page-notfound">
<main class="container notfound">
  <img src="${h(basePath)}assets/images/brand/icon-192.png" width="96" height="96" alt="ShrimpPulse">
  ${block(def)}
  ${block(def === 'th' ? 'en' : 'th')}
</main>
</body>
</html>
`;
}
