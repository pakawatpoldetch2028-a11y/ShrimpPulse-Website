// ShrimpPulse — small progressive enhancements. The site works without this file.
(function () {
  'use strict';
  var KEY = 'shrimppulse-lang';
  var lang = document.documentElement.lang;

  // Remember the language of the page being viewed, so the root redirect
  // returns visitors to it next time. Default (first visit) is set at the root.
  try { if (lang === 'th' || lang === 'en') localStorage.setItem(KEY, lang); } catch (e) { /* storage unavailable */ }

  // Explicit switch: store the chosen language before navigating.
  document.querySelectorAll('.lang__item[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem(KEY, a.getAttribute('data-lang')); } catch (e) { /* ignore */ }
    });
  });

  // Mobile navigation toggle with keyboard support.
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('site-nav');
  if (toggle && panel) {
    var label = toggle.querySelector('.nav-toggle__label');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
      if (label) label.textContent = toggle.getAttribute(open ? 'data-label-close' : 'data-label-open');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    // Close the panel when focus leaves the header on small screens.
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) setOpen(false);
    });
  }
})();
