import { FIYAT, MODELLER, FIRMA } from './data.js';

const TL = (n) => '₺' + Math.round(n).toLocaleString('tr-TR');

function segment(container, name, options, selected, label) {
  const fs = document.createElement('fieldset');
  fs.className = 'seg-field';
  fs.innerHTML = `<legend>${label}</legend>`;
  const wrap = document.createElement('div');
  wrap.className = 'seg';
  for (const o of options) {
    const id = `${name}-${o.key}`;
    wrap.insertAdjacentHTML(
      'beforeend',
      `<input type="radio" name="${name}" id="${id}" value="${o.key}" ${o.key === selected ? 'checked' : ''}><label for="${id}">${o.ad}</label>`,
    );
  }
  fs.appendChild(wrap);
  container.appendChild(fs);
}

export function createCalculator(root) {
  const $ = (s) => root.querySelector(s);
  const state = { alan: 108, teslim: 'anahtar', beton: '30', yukseklik: '250', icDuvar: '6', disDuvar: '10', ekstra: new Set(['veranda']), pesinat: 50, vade: 12 };

  // Model kısayolları
  const presets = $('[data-presets]');
  for (const m of MODELLER) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.alan = m.brut;
    b.textContent = `${m.ad} ${m.tip} · ${m.brut} m²`;
    b.addEventListener('click', () => {
      state.alan = m.brut;
      $('#alan').value = m.brut;
      update();
    });
    presets.appendChild(b);
  }

  const teslimWrap = $('[data-teslim]');
  for (const t of FIYAT.teslim) {
    teslimWrap.insertAdjacentHTML(
      'beforeend',
      `<label class="teslim-card"><input type="radio" name="teslim" value="${t.key}" ${t.key === state.teslim ? 'checked' : ''}>
        <span class="t-ad">${t.ad}</span><span class="t-not">${t.not}</span><span class="t-m2">${TL(t.m2)} / m²</span></label>`,
    );
  }

  const opts = $('[data-options]');
  segment(opts, 'beton', FIYAT.beton, state.beton, 'Beton yüksekliği');
  segment(opts, 'yukseklik', FIYAT.yukseklik, state.yukseklik, 'Bina yüksekliği');
  segment(opts, 'icDuvar', FIYAT.icDuvar, state.icDuvar, 'İç duvar kalınlığı');
  segment(opts, 'disDuvar', FIYAT.disDuvar, state.disDuvar, 'Dış duvar kalınlığı');

  const ekWrap = $('[data-ekstra]');
  for (const e of FIYAT.ekstra) {
    ekWrap.insertAdjacentHTML(
      'beforeend',
      `<label class="check"><input type="checkbox" value="${e.key}" ${state.ekstra.has(e.key) ? 'checked' : ''}><span>${e.ad}</span><span class="muted">+${TL(e.tutar)}</span></label>`,
    );
  }

  root.addEventListener('input', (e) => {
    const t = e.target;
    if (t.id === 'alan') state.alan = +t.value;
    else if (t.id === 'pesinat') state.pesinat = +t.value;
    else if (t.id === 'vade') state.vade = +t.value;
    else if (t.type === 'radio') state[t.name] = t.value;
    else if (t.type === 'checkbox') t.checked ? state.ekstra.add(t.value) : state.ekstra.delete(t.value);
    update();
  });

  function fill(input) {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--fill', `${p}%`);
  }

  function hesapla() {
    const A = state.alan;
    const pick = (list, key) => list.find((x) => x.key === key);
    const teslim = pick(FIYAT.teslim, state.teslim);
    const satirlar = [
      [`${teslim.ad} (${A} m²)`, A * teslim.m2],
      ['Zemin betonu ' + pick(FIYAT.beton, state.beton).ad, A * pick(FIYAT.beton, state.beton).m2],
      ['İç duvar ' + pick(FIYAT.icDuvar, state.icDuvar).ad, A * pick(FIYAT.icDuvar, state.icDuvar).m2],
      ['Dış duvar ' + pick(FIYAT.disDuvar, state.disDuvar).ad, A * pick(FIYAT.disDuvar, state.disDuvar).m2],
    ];
    const ara = satirlar.reduce((t, [, v]) => t + v, 0);
    const yk = pick(FIYAT.yukseklik, state.yukseklik);
    satirlar.push(['Bina yüksekliği ' + yk.ad, ara * yk.oran]);
    for (const e of FIYAT.ekstra) if (state.ekstra.has(e.key)) satirlar.push([e.ad, e.tutar]);
    const toplam = satirlar.reduce((t, [, v]) => t + v, 0);
    return { satirlar, toplam, teslim };
  }

  let last;
  function update() {
    const r = (last = hesapla());
    $('#alan-out').textContent = `${state.alan} m²`;
    $('#pesinat-out').textContent = `%${state.pesinat}`;
    $('#vade-out').textContent = state.pesinat >= 100 ? 'Peşin' : `${state.vade} ay`;
    $('#vade').disabled = state.pesinat >= 100;
    ['#alan', '#pesinat', '#vade'].forEach((s) => fill($(s)));
    presets.querySelectorAll('.chip').forEach((c) => (c.dataset.on = +c.dataset.alan === state.alan));

    $('[data-breakdown]').innerHTML = r.satirlar
      .map(([ad, v]) => `<li><span>${ad}</span><span class="${v ? '' : 'muted'}">${v ? TL(v) : 'Dahil'}</span></li>`)
      .join('');
    $('[data-total]').textContent = TL(r.toplam);
    $('[data-per-m2]').textContent = `${TL(r.toplam / state.alan)} / m²`;
    const pes = (r.toplam * state.pesinat) / 100;
    $('[data-down]').textContent = TL(pes);
    $('[data-monthly]').textContent = state.pesinat >= 100 ? '—' : TL((r.toplam - pes) / state.vade);
  }

  $('[data-send]').addEventListener('click', () => {
    const r = last;
    const msg = [
      `Merhaba, web sitenizdeki hesaplama aracından teklif almak istiyorum:`,
      `• Alan: ${state.alan} m²`,
      `• Teslim: ${r.teslim.ad}`,
      `• Beton: ${state.beton} cm, Bina yük.: ${state.yukseklik} cm`,
      `• İç/Dış duvar: ${state.icDuvar} / ${state.disDuvar} cm`,
      state.ekstra.size ? `• Ekstralar: ${FIYAT.ekstra.filter((e) => state.ekstra.has(e.key)).map((e) => e.ad).join(', ')}` : null,
      `• Tahmini tutar: ${TL(r.toplam)}`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  update();
  return {
    setAlan(a) {
      state.alan = a;
      $('#alan').value = a;
      update();
    },
  };
}
