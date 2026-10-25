/* funscroll.life — shared bits: face shapes, the helm menu, the scroll track */
(function () {
  const C = { red: '#FF5436', blue: '#3B5BFF', yellow: '#FFDF4F', white: '#FFFFFF', ink: '#17151F' };

  const BODIES = {
    circle:   ['<circle cx="50" cy="50" r="44"/>', 46],
    square:   ['<rect x="8" y="8" width="84" height="84" rx="16"/>', 46],
    triangle: ['<path d="M50 6 L95 90 Q96 94 91 94 H9 Q4 94 5 90 Z"/>', 62],
    half:     ['<path d="M6 76 A44 44 0 0 1 94 76 Z"/>', 56],
    arch:     ['<path d="M14 94 V48 A36 36 0 0 1 86 48 V94 Z"/>', 54],
    flower:   ['<path d="M50 6 C62 6 64 22 74 18 C88 14 90 30 86 38 C96 46 96 58 86 64 C90 76 82 90 70 84 C64 96 50 96 46 86 C36 94 22 90 24 78 C10 76 6 62 16 56 C6 46 12 30 26 30 C24 16 40 8 50 16 Z"/>', 48],
  };
  const MOUTHS = {
    happy: y => `<path d="M40 ${y + 12} Q50 ${y + 22} 60 ${y + 12}"/>`,
    wow:   y => `<ellipse cx="50" cy="${y + 16}" rx="5" ry="7" fill="${C.ink}"/>`,
    grin:  y => `<path d="M38 ${y + 10} Q50 ${y + 28} 62 ${y + 10} Z" fill="${C.ink}"/>`,
    meh:   y => `<path d="M42 ${y + 15} H58"/>`,
  };

  function shapeSVG(shape = 'circle', color = 'red', mood = 'happy') {
    const [body, ey] = BODIES[shape] || BODIES.circle;
    const sleepy = mood === 'sleepy', wink = mood === 'wink';
    const eye = (x, closed) => closed
      ? `<path d="M${x - 5} ${ey} Q${x} ${ey + 4} ${x + 5} ${ey}"/>`
      : `<circle cx="${x}" cy="${ey}" r="4.5" fill="${C.ink}" stroke="none"/>`;
    const mouth = (MOUTHS[mood] || MOUTHS.happy)(ey);
    return `<svg viewBox="0 0 100 100" fill="${C[color] || color}" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      ${body}<g fill="none">${eye(39, sleepy)}${eye(61, sleepy || wink)}${mouth}</g></svg>`;
  }

  function paintShapes(root = document) {
    root.querySelectorAll('.shp:not(.painted)').forEach(el => {
      el.innerHTML = shapeSVG(el.dataset.s, el.dataset.c, el.dataset.m);
      el.classList.add('painted');
    });
  }

  const SCROLLCITO = `<svg viewBox="0 0 140 210" fill="none" stroke="#17151F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M70 6 L96 38 H44 Z" fill="#FFDF4F"/><path d="M38 104 Q14 104 10 80"/><path d="M102 104 Q126 104 130 80"/><rect x="38" y="46" width="64" height="118" rx="32" fill="#FF5436"/><circle cx="58" cy="84" r="5" fill="#17151F" stroke="none"/><circle cx="82" cy="84" r="5" fill="#17151F" stroke="none"/><path d="M57 100 Q70 112 83 100"/><path d="M60 128 H80 M60 138 H80 M60 148 H80" stroke-width="5"/><path d="M46 172 H70 L58 202 Z M70 172 H94 L82 202 Z" fill="#FFDF4F"/></svg>`;

  // pages live in the root (English) and in es/ (Spanish); the manifesto is one bilingual page
  const lang = () => document.documentElement.lang.startsWith('es') ? 'es' : 'en';
  const ROOT = document.body.dataset.root || '';
  const ROUTES = {
    en: { home: 'index.html', man: 'manifiesto.html#en', fsc: 'funscrollers.html', kit: 'kit.html' },
    es: { home: 'es/index.html', man: 'manifiesto.html', fsc: 'es/funscrollers.html', kit: 'es/kit.html' },
  };
  const WORDS = {
    en: { foot: 'Making something funscrollable? <b>Write to me!</b> I\'d love to see it: how it moves, what surprises, how it ends.', by: 'FUNSCROLL is a project by', man: 'manifesto', fsc: 'funscrollers', kit: 'funscroll kit', menu: 'menu', hint: '← this is the menu.<br>it\'s a ship\'s wheel. spin it!', ends: p => `${p}% · this scroll ends`, start: 'this scroll ends ↓', end: 'the end ✿' },
    es: { foot: '¿Tienes un proyecto funscrolleable? <b>¡Escríbeme!</b> Me encantaría conocerlo: cómo se mueve, qué sorprende y cómo termina.', by: 'FUNSCROLL es un proyecto de', man: 'manifiesto', fsc: 'funscrollers', kit: 'funscroll kit', menu: 'menú', hint: '← este es el menú.<br>es un timón. ¡gíralo!', ends: p => `${p}% · este scroll se acaba`, start: 'este scroll se acaba ↓', end: 'fin ✿' },
  };
  const href = key => ROOT + ROUTES[lang()][key];

  function setLang() {
    const w = WORDS[lang()];
    document.querySelectorAll('.helm [data-key], .helm-list [data-key]').forEach(a => {
      a.href = href(a.dataset.key);
      const label = a.querySelector('.label');
      if (label) label.textContent = w[a.dataset.key];
    });
    const hint = document.querySelector('.helm-hint');
    if (hint) hint.innerHTML = w.hint;
    const hub = document.querySelector('.helm .hub');
    if (hub) hub.textContent = w.menu;
    const top = document.querySelector('.topbar');
    if (top) top.href = href('home');
    updateTrack();
    paintFooter();
  }

  function buildHelm() {
    const items = [
      { key: 'man', s: 'circle', c: 'red', m: 'happy', a: 0 },
      { key: 'fsc', s: 'square', c: 'blue', m: 'wow', a: 120 },
      { key: 'kit', s: 'triangle', c: 'yellow', m: 'grin', a: 240 },
    ];
    const spokes = [0, 60, 120, 180, 240, 300].map(a =>
      `<line x1="66" y1="66" x2="${66 + Math.sin(a * Math.PI / 180) * 62}" y2="${66 - Math.cos(a * Math.PI / 180) * 62}"/>`).join('');
    const helm = document.createElement('nav');
    helm.className = 'helm';
    helm.setAttribute('aria-label', 'menu');
    helm.innerHTML = `<div class="wheel">
      <svg class="rim" viewBox="0 0 132 132" fill="none" stroke="#17151F" stroke-linecap="round">
        <g stroke-width="5">${spokes}</g>
        <circle cx="66" cy="66" r="46" stroke-width="10" stroke="#17151F"/>
        <circle cx="66" cy="66" r="46" stroke-width="5" stroke="#FFFFFF" stroke-dasharray="10 14"/>
      </svg>
      ${items.map(it => `<a class="handle" data-key="${it.key}" style="--a:${it.a}deg"><span class="inner"><span class="shp" style="--size:100%" data-s="${it.s}" data-c="${it.c}" data-m="${it.m}"></span><span class="label"></span></span></a>`).join('')}
      <button class="hub" type="button" aria-expanded="false"></button>
    </div>`;
    document.body.appendChild(helm);
    const list = document.createElement('div');
    list.className = 'helm-list';
    list.innerHTML = items.map(it => `<a data-key="${it.key}"><span class="shp" style="--size:28px" data-s="${it.s}" data-c="${it.c}" data-m="${it.m}"></span><span class="label"></span></a>`).join('');
    document.body.appendChild(list);
    paintShapes(list);
    const hint = document.createElement('div');
    hint.className = 'helm-hint';
    document.body.appendChild(hint);
    paintShapes(helm);

    // the wheel turns with the scroll, and you can spin it by dragging too
    let extra = 0, dragging = false, startA = 0, startExtra = 0, moved = false;
    const center = () => { const r = helm.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const angle = e => { const [cx, cy] = center(); return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI; };
    const turn = () => helm.style.setProperty('--r', (scrollY * .25 + extra) + 'deg');
    addEventListener('scroll', () => { turn(); document.body.classList.toggle('scrolled', scrollY > 200); }, { passive: true });
    helm.addEventListener('pointerdown', e => { dragging = true; moved = false; startA = angle(e); startExtra = extra; });
    addEventListener('pointermove', e => {
      if (!dragging) return;
      const d = angle(e) - startA;
      if (Math.abs(d) > 4) moved = true;
      extra = startExtra + d; turn();
    });
    addEventListener('pointerup', () => { dragging = false; });
    helm.addEventListener('click', e => {
      if (moved) { e.preventDefault(); return; }
      const hub = helm.querySelector('.hub');
      const setOpen = v => { helm.classList.toggle('open', v); hub.setAttribute('aria-expanded', v); };
      // the "menu" button in the middle opens and closes the wheel
      if (e.target.closest('.hub')) { e.preventDefault(); setOpen(!helm.classList.contains('open')); return; }
      const onHandle = e.target.closest('.handle');
      const canHover = matchMedia('(hover: hover)').matches;
      if (!helm.classList.contains('open') && !(onHandle && canHover)) { e.preventDefault(); setOpen(true); }
    });
    document.addEventListener('click', e => {
      if (!helm.contains(e.target) && !list.contains(e.target)) { helm.classList.remove('open'); helm.querySelector('.hub').setAttribute('aria-expanded', false); }
    });
    turn();
  }

  function updateTrack() {
    const pct = document.querySelector('.track .pct');
    if (!pct) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.round(scrollY / max * 100) : 0;
    const w = WORDS[lang()];
    pct.textContent = p >= 99 ? w.end : p < 1 ? w.start : w.ends(p);
  }

  function buildTrack() {
    const t = document.createElement('div');
    t.className = 'track';
    t.setAttribute('aria-hidden', 'true');
    t.innerHTML = `<div class="mini">${SCROLLCITO}</div><div class="pct"></div>`;
    document.body.appendChild(t);
    addEventListener('scroll', updateTrack, { passive: true });
  }

  // EN | ES switch next to the logo, on pages that have a twin in the other language
  function buildLangSwitch() {
    const alt = document.body.dataset.alt;
    if (!alt) return;
    const here = lang();
    const el = document.createElement('div');
    el.className = 'langswitch';
    el.innerHTML = here === 'en'
      ? `<span class="on">EN</span><a href="${alt}" hreflang="es">ES</a>`
      : `<a href="${alt}" hreflang="en">EN</a><span class="on">ES</span>`;
    document.body.appendChild(el);
  }

  const EMAIL = 'soylorenaorlando@gmail.com';
  function buildFooter() {
    const f = document.createElement('footer');
    f.className = 'site-foot';
    document.body.appendChild(f);
  }
  function paintFooter() {
    const f = document.querySelector('.site-foot');
    if (!f) return;
    const w = WORDS[lang()];
    f.innerHTML = `<div class="in">
      <span class="shp" data-s="flower" data-c="yellow" data-m="grin" style="--size:64px"></span>
      <p>${w.foot}</p>
      <a class="mail" href="mailto:${EMAIL}">${EMAIL}</a>
      <small>${w.by} <a href="https://lorenaorlando.com" target="_blank" rel="noopener">Lorena Orlando</a></small>
    </div>`;
    paintShapes(f);
  }

  window.FUN = { shapeSVG, paintShapes, SCROLLCITO, setLang, lang };
  paintShapes();
  buildHelm();
  if (document.body.dataset.track !== 'off') buildTrack();
  buildLangSwitch();
  buildFooter();
  setLang();
})();
