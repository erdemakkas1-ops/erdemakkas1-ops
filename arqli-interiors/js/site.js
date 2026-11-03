// Arqli: header and menu, reveals, the pinned project reel, the process line, the contact form.
// The scroll film is js/film.js, the configurator js/studio.js (both modules).
(() => {
  const IG = 'arqli.interiors';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const live = document.documentElement.classList.contains('live-film');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // ---------- header + menu ----------
  const top = $('#top'), film = $('#film'), btn = $('.menu-btn'), nav = $('#nav');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open); nav.classList.toggle('open', open); onScroll();
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { btn.click(); btn.focus(); } });

  // ---------- reel: pinned and moved sideways by scroll on wide screens ----------
  const reel = $('#projeler'), pin = $('.reel-pin', reel), track = $('#reel'), prog = $('#reel-prog');
  const wide = matchMedia('(min-width:901px)');
  let reelRun = 0;
  function sizeReel() {
    const on = live && wide.matches;
    reel.classList.toggle('pinned', on);
    track.style.transform = '';
    if (!on) { reel.style.height = ''; reelRun = 0; return; }
    reelRun = Math.max(0, track.scrollWidth - innerWidth);
    reel.style.height = (pin.offsetHeight + reelRun) + 'px';
  }
  function moveReel() {
    if (!reel.classList.contains('pinned')) {
      const p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth);
      prog.style.setProperty('--p', p.toFixed(3)); return;
    }
    const r = reel.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, reelRun));
    track.style.transform = `translate3d(${(-p * reelRun).toFixed(1)}px,0,0)`;
    prog.style.setProperty('--p', p.toFixed(3));
  }
  track.addEventListener('scroll', moveReel, { passive: true });

  // ---------- process line ----------
  const steps = $('#steps'), stepItems = $$('li', steps);
  function moveSteps() {
    const r = steps.getBoundingClientRect();
    const vertical = getComputedStyle(steps).gridTemplateColumns.split(' ').length === 1;
    const p = vertical ? clamp((innerHeight * .7 - r.top) / r.height) : clamp((innerHeight * .85 - r.top) / (innerHeight * .5));
    steps.style.setProperty('--p', p.toFixed(3));
    stepItems.forEach((li, i) => li.classList.toggle('lit', p >= (vertical ? (li.offsetTop + 8) / r.height : i / (stepItems.length - 1) - .001)));
  }

  // ---------- slab drift ----------
  const note = $('#malzeme'), slab = $('.slab', note);
  function moveSlab() {
    const r = note.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    slab.style.setProperty('--slab', ((r.top + r.height / 2 - innerHeight / 2) * -.12).toFixed(1) + 'px');
  }

  function onScroll() {
    const filmEnd = film.offsetTop + film.offsetHeight - innerHeight;
    top.classList.toggle('solid', scrollY > filmEnd - 10 || nav.classList.contains('open'));
    moveReel(); moveSteps(); if (live) moveSlab();
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { sizeReel(); onScroll(); });
  wide.addEventListener?.('change', () => { sizeReel(); onScroll(); });
  addEventListener('load', () => { sizeReel(); onScroll(); });
  $$('img', track).forEach(img => img.addEventListener('load', () => { sizeReel(); onScroll(); }, { once: true }));
  sizeReel(); onScroll();

  // ---------- reveals ----------
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));

  // ---------- toast + "copy, then open Instagram" (Instagram DMs cannot be prefilled) ----------
  const toast = $('#toast'); let tt = 0;
  function say(msg) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 4200); }
  async function copyAndOpen(text) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      // older browsers: a hidden textarea and execCommand
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch { ok = false; } ta.remove();
    }
    window.open(`https://ig.me/m/${IG}`, '_blank', 'noopener');
    say(ok ? 'Mesaj kopyalandı. Instagram sohbetine yapıştırıp gönderin.' : 'Instagram açıldı. Mesajınızı yazıp gönderin.');
  }
  window.Arqli = { copyAndOpen, say };

  // ---------- contact form ----------
  const form = $('#ct-form'), err = $('#ct-err');
  $('#ct-send').addEventListener('click', () => {
    const f = new FormData(form), name = $('#ct-name');
    name.removeAttribute('aria-invalid');
    if (!f.get('name').trim()) { name.setAttribute('aria-invalid', 'true'); err.textContent = 'Adınızı yazın, size nasıl hitap edeceğimizi bilelim.'; name.focus(); return; }
    err.textContent = '';
    const kinds = f.getAll('kind');
    const msg = ['Merhaba Arqli, web sitenizden yazıyorum.',
      `Ad: ${f.get('name').trim()}`,
      f.get('city').trim() && `Yer: ${f.get('city').trim()}`,
      kinds.length && `Mekân: ${kinds.join(', ')}`,
      `Hizmet: ${f.get('svc')}`,
      f.get('note').trim() && `Not: ${f.get('note').trim()}`].filter(Boolean).join('\n');
    copyAndOpen(msg);
  });
  form.addEventListener('submit', e => e.preventDefault());
})();
