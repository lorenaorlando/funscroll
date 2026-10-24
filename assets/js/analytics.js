/* funscroll.life — analytics
   Off until an ID is filled in below. Nothing is loaded or sent while it's empty. */
(function () {
  const CONFIG = {
    ga4: '', // Google Analytics 4 measurement ID, like 'G-XXXXXXXXXX'
  };

  if (CONFIG.ga4) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CONFIG.ga4);
  }

  // one call for every provider; does nothing if none is set up
  function track(name, params = {}) {
    if (window.gtag) window.gtag('event', name, params);
    if (window.plausible) window.plausible(name, { props: params });
    if (window.umami && window.umami.track) window.umami.track(name, params);
  }
  window.FUN_TRACK = track;

  // the funscroll moments worth counting
  document.addEventListener('click', e => {
    const el = e.target.closest('a, button');
    if (!el) return;
    const href = el.getAttribute('href') || '';
    if (el.id === 'door' || el.hasAttribute('data-fs-door')) return track('door_open', { url: el.href });
    if (el.id === 'nothing') return track('useless_button');
    if (el.closest('.helm')) return track('menu_click', { to: el.dataset.key || href });
    if (el.closest('.langswitch') || el.closest('.lang')) return track('language_switch', { to: el.dataset.l || el.textContent.trim().toLowerCase() });
    if (el.classList.contains('tl-stop')) return track('timeline_jump', { chapter: el.dataset.title });
    if (el.closest('.prompt')) return track('prompt_copy', { prompt: el.closest('.prompt').querySelector('.tag').textContent });
    if (href.startsWith('mailto:')) return track('contact_email');
    if (el.hasAttribute('download')) return track('file_download', { file: href.split('/').pop() });
    if (/^https?:/.test(href) && new URL(href).host !== location.host) return track('outbound_click', { url: href });
  }, true);
})();
