/* the funscroll webring · funscroll.life/kit
   Put this where you want the ring to appear:
   <div id="funscroll-ring"></div>
   <script src="https://funscroll.life/kit/ring.js" defer></script> */
(function () {
  const MEMBERS = [
    { name: 'funscroll.life', url: 'https://funscroll.life' },
    { name: 'lorenaorlando.com', url: 'https://lorenaorlando.com' },
  ];
  window.FUNSCROLL_RING = MEMBERS;
  const host = location.hostname.replace(/^www\./, '');
  let i = MEMBERS.findIndex(m => new URL(m.url).hostname.replace(/^www\./, '') === host);
  if (i < 0) i = 0;
  const prev = MEMBERS[(i - 1 + MEMBERS.length) % MEMBERS.length];
  const next = MEMBERS[(i + 1) % MEMBERS.length];
  const others = MEMBERS.filter((_, k) => k !== i);
  const rand = others[Math.floor(Math.random() * others.length)] || next;

  const el = document.getElementById('funscroll-ring');
  if (!el) return;
  const face = `<svg viewBox="0 0 140 210" width="18" height="27" fill="none" stroke="#17151F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-7px"><path d="M70 6 L96 38 H44 Z" fill="#FFDF4F"/><rect x="38" y="46" width="64" height="118" rx="32" fill="#FF5436"/><circle cx="58" cy="84" r="6" fill="#17151F" stroke="none"/><circle cx="82" cy="84" r="6" fill="#17151F" stroke="none"/><path d="M57 100 Q70 112 83 100"/><path d="M46 172 H70 L58 202 Z M70 172 H94 L82 202 Z" fill="#FFDF4F"/></svg>`;
  const a = 'color:#17151F;text-decoration:none;padding:4px 8px;border-radius:20px';
  el.innerHTML = `<nav aria-label="funscroll webring" style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;font:600 14px/1 system-ui,sans-serif;background:#FFDF4F;color:#17151F;border:2.5px solid #17151F;border-radius:40px;padding:6px 10px;box-shadow:4px 4px 0 #17151F">
    <a style="${a}" href="${prev.url}" title="${prev.name}">← prev</a>
    <a style="${a};font-weight:800" href="https://funscroll.life/funscrollers.html#ring">${face} funscroll ring</a>
    <a style="${a}" href="${rand.url}" title="somewhere random">🎲 random</a>
    <a style="${a}" href="${next.url}" title="${next.name}">next →</a>
  </nav>`;
})();
