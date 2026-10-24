/* funscroll kit v0.1 · funscroll.life/kit
   No dependencies. Add data-fs-* attributes to any element:

   data-fs-reveal="up|down|left|right|pop|spin"   enters the screen with a move
   data-fs-parallax="0.3"                          moves at another speed (negative = opposite way)
   data-fs-parallax-x="0.5"                        ...sideways
   data-fs-spin="360"                              rotates as you scroll past it
   data-fs-letters="scatter|wave|dance"            splits text into letters that play with the scroll
   data-fs-dance                                   leans and wobbles with your scroll speed (dancescroll)
   data-fs-float                                   bobs gently forever
   data-fs-jelly                                   squishes on hover/tap
   data-fs-drag                                    can be dragged around
   data-fs-tilt="20"                               reacts to phone tilt (or mouse on desktop)
   data-fs-horizontal + child data-fs-track        vertical scroll moves the track sideways
   data-fs-slow="0.3" + child data-fs-track        slowscroll: content moves slower than your finger
   data-fs-cursor="🍓"                             emoji cursor inside this element
   data-fs-door='["https://a.com","https://b.com"]' click to go somewhere random
   data-fs-progress                                fills as you scroll the page

   FS.enableTilt()   call from a button click to ask iOS for motion permission */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let vh = innerHeight, vw = innerWidth, velocity = 0, lastY = scrollY;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  // progress of an element through the viewport: 0 = just below, 1 = just gone above
  function progress(el) {
    const r = el.getBoundingClientRect();
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  }

  function splitLetters(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    el.setAttribute('aria-label', words.join(' '));
    let i = 0;
    words.forEach((w, wi) => {
      const ws = document.createElement('span');
      ws.className = 'fs-w';
      ws.setAttribute('aria-hidden', 'true');
      [...w].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'fs-l';
        s.textContent = ch;
        s.dataset.i = i++;
        s.dataset.rx = (Math.random() - .5) * 2;
        s.dataset.ry = (Math.random() - .5) * 2;
        s.dataset.rr = (Math.random() - .5) * 2;
        ws.appendChild(s);
      });
      el.appendChild(ws);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  function emojiCursor(emoji) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='4' y='32' font-size='30'>${emoji}</text></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 8 8, auto`;
  }

  function sizeSections() {
    $$('[data-fs-horizontal]').forEach(sec => {
      const track = sec.querySelector('[data-fs-track]');
      sec.style.height = (track.scrollWidth - vw + vh) + 'px';
    });
    $$('[data-fs-slow]').forEach(sec => {
      const track = sec.querySelector('[data-fs-track]');
      const f = parseFloat(sec.dataset.fsSlow) || .3;
      const travel = Math.max(track.scrollHeight - vh, 0) + vh * .6;
      sec.style.height = (vh + travel / f) + 'px';
    });
  }

  function update() {
    const y = scrollY;
    velocity += ((y - lastY) - velocity) * .2;
    lastY = y;
    tilt.x += (tilt.tx - tilt.x) * .1;
    tilt.y += (tilt.ty - tilt.y) * .1;

    if (!reduced) {
    $$('[data-fs-parallax], [data-fs-parallax-x], [data-fs-spin]').forEach(el => {
      const p = progress(el) - .5;
      const sy = parseFloat(el.dataset.fsParallax || 0) * p * vh;
      const sx = parseFloat(el.dataset.fsParallaxX || 0) * p * vw;
      const rot = parseFloat(el.dataset.fsSpin || 0) * p;
      el.style.transform = `translate(${sx}px, ${sy}px) rotate(${rot}deg)`;
    });

    $$('[data-fs-letters]').forEach(el => {
      const mode = el.dataset.fsLetters;
      const p = progress(el);
      $$('.fs-l', el).forEach(s => {
        const i = +s.dataset.i;
        if (mode === 'scatter') {
          // letters fly apart at the edges of the screen and come together in the middle
          const r = el.getBoundingClientRect();
          const d = Math.abs((r.top + r.height / 2 - vh / 2) / vh);
          const k = Math.pow(clamp((d - .3) / .5, 0, 1), 2);
          s.style.transform = `translate(${s.dataset.rx * 260 * k}px, ${s.dataset.ry * 200 * k}px) rotate(${s.dataset.rr * 160 * k}deg)`;
        } else if (mode === 'wave') {
          s.style.transform = `translateY(${Math.sin(p * 14 + i * .6) * 18}px)`;
        } else if (mode === 'dance') {
          const v = clamp(velocity, -60, 60);
          s.style.transform = `translateY(${Math.sin(i * 1.3 + y * .02) * v * .6}px) rotate(${(i % 2 ? 1 : -1) * v * .5}deg)`;
        }
      });
    });

    const v = clamp(velocity, -80, 80);
    $$('[data-fs-dance]').forEach(el => {
      el.style.transform = `skewY(${v * .12}deg) rotate(${v * .08}deg)`;
    });

    $$('[data-fs-tilt]').forEach(el => {
      const s = parseFloat(el.dataset.fsTilt) || 20;
      el.style.transform = `translate(${tilt.x * s}px, ${tilt.y * s}px) rotate(${tilt.x * s * .3}deg)`;
    });

    }

    $$('[data-fs-horizontal]').forEach(sec => {
      const track = sec.querySelector('[data-fs-track]');
      const r = sec.getBoundingClientRect();
      const max = track.scrollWidth - vw;
      track.style.transform = `translateX(${-clamp(-r.top, 0, max)}px)`;
    });

    $$('[data-fs-slow]').forEach(sec => {
      const track = sec.querySelector('[data-fs-track]');
      const r = sec.getBoundingClientRect();
      const total = r.height - vh;
      const p = clamp(-r.top / total, 0, 1);
      const travel = Math.max(track.scrollHeight - vh, 0) + vh * .6;
      track.style.transform = `translateY(${vh * .3 - p * travel}px)`;
    });

    const docP = clamp(y / (document.documentElement.scrollHeight - vh), 0, 1);
    document.documentElement.style.setProperty('--fs-page', docP);
    $$('[data-fs-progress]').forEach(el => el.style.setProperty('--fs-p', docP));

    requestAnimationFrame(update);
  }

  function initDrag(el) {
    let sx, sy, ox = 0, oy = 0;
    el.addEventListener('pointerdown', e => {
      el.setPointerCapture(e.pointerId);
      el.classList.add('fs-dragging');
      sx = e.clientX - ox; sy = e.clientY - oy;
    });
    el.addEventListener('pointermove', e => {
      if (!el.classList.contains('fs-dragging')) return;
      ox = e.clientX - sx; oy = e.clientY - sy;
      el.style.translate = `${ox}px ${oy}px`;
    });
    const stop = () => el.classList.remove('fs-dragging');
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
  }

  function init(root = document) {
    $$('[data-fs-letters]', root).forEach(splitLetters);
    $$('[data-fs-drag]', root).forEach(initDrag);
    $$('[data-fs-cursor]', root).forEach(el => el.style.cursor = emojiCursor(el.dataset.fsCursor));
    // doors are real links: the destination is re-rolled right before every click
    $$('[data-fs-door]', root).forEach(el => {
      const list = JSON.parse(el.dataset.fsDoor || '[]');
      if (!list.length) return;
      const roll = () => { el.href = list[Math.floor(Math.random() * list.length)]; };
      el.target = '_blank';
      el.rel = 'noopener';
      roll();
      el.addEventListener('pointerdown', roll);
      el.addEventListener('click', () => setTimeout(roll, 0));
    });

    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add('fs-in');
    }), { threshold: .15 });
    $$('[data-fs-reveal]', root).forEach(el => io.observe(el));
  }

  function enableTilt() {
    const listen = () => addEventListener('deviceorientation', e => {
      tilt.tx = clamp((e.gamma || 0) / 45, -1, 1);
      tilt.ty = clamp(((e.beta || 0) - 45) / 45, -1, 1);
    });
    if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
      return DeviceOrientationEvent.requestPermission().then(r => { if (r === 'granted') listen(); return r; });
    }
    listen();
    return Promise.resolve('granted');
  }

  addEventListener('mousemove', e => {
    tilt.tx = (e.clientX / vw - .5) * 2;
    tilt.ty = (e.clientY / vh - .5) * 2;
  });
  addEventListener('resize', () => { vh = innerHeight; vw = innerWidth; sizeSections(); });

  function start() {
    init();
    sizeSections();
    addEventListener('load', sizeSections);
    requestAnimationFrame(update);
  }

  window.FS = { init, enableTilt, refresh: sizeSections };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
