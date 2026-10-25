/* funscroll.life — analytics
   Off until an ID is filled in below. Visitors in Spain are asked for consent before anything loads. */
(function () {
  const CONFIG = {
    ga4: 'G-RF1V6F07LN', // Google Analytics 4 measurement ID
  };

  function loadGA() {
    if (!CONFIG.ga4 || window.gtag) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CONFIG.ga4);
  }

  // Visitors in Spain get asked first; Google Analytics only loads after a "yes".
  // Spain is detected from the browser's time zone, so no IP lookup is needed.
  const SPAIN = ['Europe/Madrid', 'Atlantic/Canary', 'Africa/Ceuta'];
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  const askFirst = SPAIN.includes(tz);
  const KEY = 'fs-consent';
  const getChoice = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const setChoice = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  const WORDS = {
    es: { text: '🍪 ¿Nos dejas contar visitas? Usamos Google Analytics solo para saber cuánta gente pasa por aquí y qué le gusta. Nada de publicidad.', yes: 'vale', no: 'no, gracias', change: 'cookies' },
    en: { text: '🍪 Can we count visits? We use Google Analytics only to know how many people drop by and what they enjoy. No ads.', yes: 'okay', no: 'no, thanks', change: 'cookies' },
  };
  const w = () => WORDS[(document.documentElement.lang || 'en').startsWith('es') ? 'es' : 'en'];

  function showBanner() {
    if (document.getElementById('fs-cookies')) return;
    const b = document.createElement('div');
    b.id = 'fs-cookies';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'cookies');
    b.innerHTML = `<p>${w().text}</p><div><button data-c="yes">${w().yes}</button><button data-c="no">${w().no}</button></div>`;
    b.addEventListener('click', e => {
      const c = e.target.closest('button');
      if (!c) return;
      setChoice(c.dataset.c);
      if (c.dataset.c === 'yes') loadGA();
      b.remove();
    });
    document.body.appendChild(b);
  }

  const css = document.createElement('style');
  css.textContent = `
#fs-cookies { position: fixed; left: 16px; bottom: 16px; z-index: 90; max-width: 400px; background: var(--white, #fff); color: var(--ink, #17151F);
  border: 3px solid var(--ink, #17151F); border-radius: 22px; box-shadow: 5px 5px 0 var(--ink, #17151F); padding: 16px 18px; font: 400 15px/1.4 var(--voice, sans-serif); }
#fs-cookies div { display: flex; gap: 10px; margin-top: 12px; }
#fs-cookies button { font: 800 15px var(--display, sans-serif); padding: 7px 16px; border-radius: 30px; border: 2.5px solid var(--ink, #17151F); background: var(--white, #fff); color: var(--ink, #17151F); cursor: pointer; }
#fs-cookies button[data-c="yes"] { background: var(--yellow, #FFDF4F); }
.fs-cookie-link { background: none; border: 0; padding: 0; font: inherit; color: var(--yellow, #FFDF4F); text-decoration: underline; cursor: pointer; }
body:has(.tl) #fs-cookies { bottom: 100px; }
@media (max-width: 700px) { #fs-cookies { right: 16px; bottom: 150px; } }`;
  document.head.appendChild(css);

  if (!askFirst) loadGA();
  else if (getChoice() === 'yes') loadGA();

  addEventListener('DOMContentLoaded', () => {
    if (!askFirst) return;
    if (!getChoice()) showBanner();
    // a way to change your mind, next to the credit in the footer
    setTimeout(() => {
      const credit = document.querySelector('.site-foot small');
      if (!credit || credit.querySelector('.fs-cookie-link')) return;
      const link = document.createElement('button');
      link.className = 'fs-cookie-link';
      link.textContent = w().change;
      link.addEventListener('click', showBanner);
      credit.append(' · ', link);
    }, 300);
  });

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
