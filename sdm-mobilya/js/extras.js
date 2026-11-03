// Two interactive sections:
//  #isik   day / evening compare: a range input over two stacked pictures; it sweeps once when it
//          first comes into view so visitors see that it moves (not with reduced motion).
//  #tasarla "Mutfağını tasarla": plan type, wall lengths, island, door, colour, worktop and LED give a
//          top-down SVG plan in cm with module counts and worktop length, and a WhatsApp message.
//          Rules of thumb: 60 cm base units and modules, 35 cm wall units on wall A with a 60 cm hood gap,
//          a 110 cm aisle between the run and the island, at least 100 cm between a side run and the
//          island. The figures are a first idea, not a quote.
(function () {
  const WHATSAPP = "905358784749";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- day / evening compare ----------
  const cmp = document.getElementById("cmp");
  if (cmp) {
    const range = cmp.querySelector("input");
    const set = v => { cmp.style.setProperty("--v", v + "%"); };
    range.addEventListener("input", () => set(range.value));
    set(range.value);
    if (!calm && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const keys = [[0, 50], [700, 78], [1500, 24], [2200, 50]], t0 = performance.now();
        (function step(now) {
          const t = now - t0;
          let k = 1;
          while (k < keys.length - 1 && t > keys[k][0]) k++;
          const [ta, va] = keys[k - 1], [tb, vb] = keys[k];
          const u = Math.min(1, Math.max(0, (t - ta) / (tb - ta))), e = u * u * (3 - 2 * u);
          const v = va + (vb - va) * e;
          range.value = v; set(v);
          if (t < keys[keys.length - 1][0] && !cmp.dataset.touched) requestAnimationFrame(step);
        })(t0);
      }, { threshold: .5 });
      io.observe(cmp);
      range.addEventListener("pointerdown", () => { cmp.dataset.touched = 1; }, { once: true });
    }
  }

  // ---------- Mutfağını tasarla ----------
  const form = document.getElementById("cfg");
  if (!form) return;
  const svg = document.getElementById("cfg-plan");
  const sum = document.getElementById("cfg-sum");
  const warn = document.getElementById("cfg-warn");
  const send = document.getElementById("cfg-send");
  const NS = "http://www.w3.org/2000/svg";

  const COLORS = { antrasit: ["Antrasit", "#34312e"], krem: ["Krem", "#e6dcc8"], gri: ["Gri", "#9a948b"], ceviz: ["Ceviz", "#8a5f40"], yesil: ["Zeytin yeşili", "#5b6150"] };
  const TOPS = { siyah: ["Siyah mermer", "#1b1a19", "#c9a46a"], beyaz: ["Beyaz mermer", "#efece6", "#b8b2a8"], ahsap: ["Ahşap", "#a9774c", "#6f4b2e"] };
  const TYPES = { duz: "Düz", l: "L", u: "U" };
  const DOORS = { shaker: "Shaker (çerçeveli)", duz: "Düz kulpsuz", lake: "Parlak lake" };
  const D = 60, AISLE = 110, SIDE = 100, ISL_D = 90;

  const read = () => {
    const f = new FormData(form);
    return {
      type: f.get("type"), a: +f.get("a"), b: +f.get("b"), c: +f.get("c"),
      ada: f.get("ada") === "1", door: f.get("door"), color: f.get("color"), top: f.get("top"), led: f.get("led") === "1",
    };
  };

  function island(o) {
    const xs = o.type === "duz" ? 40 : D + SIDE, xe = o.type === "u" ? o.a - D - SIDE : o.a - 40;
    const len = Math.min(220, Math.floor((xe - xs) / 10) * 10);
    if (len < 120) return { fail: o.type === "u" ? "U planda ada için A duvarı en az 440 cm olmalı." : "Ada için A duvarı biraz kısa; en az 120 cm ada gerekir." };
    return { x: xs + (xe - xs - len) / 2, y: D + AISLE, len, d: ISL_D };
  }

  const el = (name, attrs, text) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    svg.appendChild(n);
    return n;
  };
  const fmt = cm => (cm / 100).toFixed(1).replace(".", ",");

  function draw() {
    const o = read();
    form.querySelector('[data-for="b"]').hidden = o.type === "duz";
    form.querySelector('[data-for="c"]').hidden = o.type !== "u";
    for (const k of ["a", "b", "c"]) form.querySelector(`output[for="cfg-${k}"]`).textContent = o[k] + " cm";

    const B = o.type !== "duz" ? o.b : 0, C = o.type === "u" ? o.c : 0;
    const isl = o.ada ? island(o) : null;
    const ok = isl && !isl.fail;
    const depth = Math.max(o.type === "duz" ? 300 : 0, B + 60, C + 60, ok ? isl.y + isl.d + 90 : 0);
    const pad = 64;
    svg.setAttribute("viewBox", `${-pad} ${-pad} ${o.a + 2 * pad} ${depth + pad + 24}`);
    svg.textContent = "";
    const [, front] = COLORS[o.color], [, topFill, topLine] = TOPS[o.top];

    el("rect", { x: 0, y: 0, width: o.a, height: depth, fill: "#1b1714" });
    // floor grid every 50 cm
    for (let x = 50; x < o.a; x += 50) el("line", { x1: x, y1: 0, x2: x, y2: depth, stroke: "rgba(240,225,200,.05)" });
    for (let y = 50; y < depth; y += 50) el("line", { x1: 0, y1: y, x2: o.a, y2: y, stroke: "rgba(240,225,200,.05)" });

    // runs: [x, y, w, h, along x?]
    const runs = [[0, 0, o.a, D, true]];
    if (B) runs.push([0, D, D, B - D, false]);
    if (C) runs.push([o.a - D, D, D, C - D, false]);
    for (const [x, y, w, h, horiz] of runs) {
      el("rect", { x, y, width: w, height: h, fill: front, stroke: topLine, "stroke-width": 2.5 });
      const len = horiz ? w : h;
      for (let m = 60; m < len - 1; m += 60)
        horiz ? el("line", { x1: x + m, y1: y, x2: x + m, y2: y + h, stroke: "rgba(0,0,0,.35)", "stroke-width": 1.2 })
              : el("line", { x1: x, y1: y + m, x2: x + w, y2: y + m, stroke: "rgba(0,0,0,.35)", "stroke-width": 1.2 });
    }
    // worktop front edge
    el("line", { x1: B ? D : 0, y1: D, x2: C ? o.a - D : o.a, y2: D, stroke: topLine, "stroke-width": 3 });
    // wall units on wall A (dashed), hood gap over the hob
    const hob = Math.round(o.a * .62 / 10) * 10, sink = Math.max(B ? 90 : 40, Math.round(o.a * .28 / 10) * 10);
    el("rect", { x: 4, y: 4, width: o.a - 8, height: 31, fill: "none", stroke: "rgba(240,225,200,.45)", "stroke-dasharray": "6 5", "stroke-width": 1.2 });
    el("rect", { x: hob - 30, y: 2, width: 60, height: 35, fill: "#1b1714", stroke: "rgba(240,225,200,.45)", "stroke-width": 1.2 });
    // sink and hob
    el("rect", { x: sink - 25, y: 14, width: 50, height: 36, rx: 5, fill: "rgba(0,0,0,.35)", stroke: "rgba(255,255,255,.55)", "stroke-width": 1.2 });
    for (const [dx, dy] of [[-13, -9], [13, -9], [-13, 9], [13, 9]]) el("circle", { cx: hob + dx, cy: 32 + dy, r: 7, fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 1.2 });
    if (o.led) el("line", { x1: 6, y1: 38, x2: o.a - 6, y2: 38, stroke: "#ffcf8a", "stroke-width": 2.2, opacity: .85 });

    // island and its aisle
    if (ok) {
      el("rect", { x: isl.x, y: isl.y, width: isl.len, height: isl.d, fill: topFill, stroke: topLine, "stroke-width": 2.5, rx: 2 });
      el("rect", { x: isl.x + 6, y: isl.y + 6, width: isl.len - 12, height: isl.d - 12, fill: front, opacity: .9 });
      for (let i = 0; i < Math.floor(isl.len / 70); i++) el("circle", { cx: isl.x + 35 + i * 70, cy: isl.y + isl.d + 24, r: 16, fill: "none", stroke: "rgba(240,225,200,.5)", "stroke-width": 1.4 });
      el("text", { x: isl.x + isl.len / 2, y: isl.y + isl.d / 2 + 5, "text-anchor": "middle", class: "cfg-t cfg-t--in" }, `Ada ${isl.len} × ${isl.d}`);
      // the aisle between the run and the island, on the island's left
      const ax = isl.x + 18;
      el("line", { x1: ax, y1: D, x2: ax, y2: isl.y, stroke: "#c9a46a", "stroke-width": 1.2 });
      el("text", { x: ax + 7, y: (D + isl.y) / 2 + 5, class: "cfg-t cfg-t--brass" }, `${AISLE} cm`);
    }
    // walls
    const wall = d => el("path", { d, fill: "none", stroke: "#efe4d2", "stroke-width": 6, "stroke-linecap": "square" });
    wall(`M0 ${depth} V0 H${o.a} V${depth}`);
    // dimensions
    const dim = (x1, y1, x2, y2, label, vert) => {
      el("line", { x1, y1, x2, y2, stroke: "#c9a46a", "stroke-width": 1.2 });
      for (const [x, y] of [[x1, y1], [x2, y2]]) el("line", vert ? { x1: x - 7, y1: y, x2: x + 7, y2: y } : { x1: x, y1: y - 7, x2: x, y2: y + 7 }, null).setAttribute("stroke", "#c9a46a");
      const t = el("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - (vert ? 0 : 8), "text-anchor": "middle", class: "cfg-t" }, label);
      if (vert) t.setAttribute("transform", `rotate(-90 ${(x1 + x2) / 2 - 8} ${(y1 + y2) / 2})`), t.setAttribute("x", (x1 + x2) / 2 - 8);
    };
    dim(0, -26, o.a, -26, `A · ${o.a} cm`);
    if (B) dim(-26, 0, -26, B, `B · ${B} cm`, true);
    if (C) dim(o.a + 26, 0, o.a + 26, C, `C · ${C} cm`, true);

    // figures
    const base = Math.floor(o.a / 60) + (B ? Math.floor((B - D) / 60) : 0) + (C ? Math.floor((C - D) / 60) : 0);
    const upper = Math.max(0, Math.floor((o.a - 60) / 60));
    const worktop = o.a + (B ? B - D : 0) + (C ? C - D : 0) + (ok ? isl.len : 0);
    const rows = [
      ["Plan", `${TYPES[o.type]} mutfak${ok ? " + ada" : ""}`],
      ["Alt modül", `${base} adet`],
      ["Üst dolap", `${upper} adet`],
      ["Tezgah", `~${fmt(worktop)} m`],
    ];
    sum.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    warn.hidden = !(isl && isl.fail);
    warn.textContent = isl && isl.fail ? isl.fail : "";

    const msg = [
      "Merhaba SDM Mobilya, sitenizdeki tasarım aracıyla bir mutfak taslağı hazırladım:",
      `• Plan: ${TYPES[o.type]}${o.ada ? (ok ? " + ada" : " (ada sığmadı)") : ""}`,
      `• Duvar A: ${o.a} cm${B ? `, B: ${B} cm` : ""}${C ? `, C: ${C} cm` : ""}`,
      ok ? `• Ada: ${isl.len} × ${isl.d} cm` : null,
      `• Kapak: ${DOORS[o.door]}, ${COLORS[o.color][0]}`,
      `• Tezgah: ${TOPS[o.top][0]}`,
      `• Gizli LED: ${o.led ? "Evet" : "Hayır"}`,
      `• Tahmini: ${base} alt modül, ${upper} üst dolap, ~${fmt(worktop)} m tezgah`,
      "Ücretsiz keşif için randevu almak istiyorum.",
    ].filter(Boolean).join("\n");
    send.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  form.addEventListener("input", draw);
  form.addEventListener("change", draw);
  draw();
})();
