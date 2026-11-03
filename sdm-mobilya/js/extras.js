// Two interactive sections:
//  #isik   day / evening compare: a range input over two stacked pictures; it sweeps once when it
//          first comes into view so visitors see that it moves (not with reduced motion).
//  #tasarla "Mutfağını tasarla": plan type, wall lengths, island, door, colour, worktop and LED give one
//          layout in cm (the D&M Mutfak demo's rules: 60 cm base runs, 35 cm wall units, a fridge column
//          closing the run, a 110 cm aisle in front of the island and 100 cm from a side run). From it:
//          the 3D kitchen (js/kitchen3d.js, three.js, loaded when the section is near and WebGL2 works),
//          a top-down SVG plan (shown until then, or instead of it), the module counts and the WhatsApp
//          message. The figures are a first idea, not a quote.
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
  const view = document.getElementById("cfg-view");
  const svg = document.getElementById("cfg-plan");
  const sum = document.getElementById("cfg-sum");
  const warn = document.getElementById("cfg-warn");
  const send = document.getElementById("cfg-send");
  const NS = "http://www.w3.org/2000/svg";

  const COLORS = { antrasit: ["Antrasit", "#34312e"], krem: ["Krem", "#e6dcc8"], gri: ["Gri", "#9a948b"], ceviz: ["Ceviz", "#8a5f40"], yesil: ["Zeytin yeşili", "#5b6150"] };
  const TOPS = { siyah: ["Siyah mermer", "#1b1a19", "#c9a46a"], beyaz: ["Beyaz mermer", "#efece6", "#b8b2a8"], ahsap: ["Ahşap", "#a9774c", "#6f4b2e"] };
  const TYPES = { duz: "Düz", l: "L", u: "U" };
  const DOORS = { klasik: "Shaker (çerçeveli)", kulpsuz: "Düz kulpsuz", lake: "Parlak lake" };
  const DEPTH = 60, WALL_CAB = 35, AISLE = 110, ISLAND_D = 100, CLEAR = 100, OPEN = 30;

  const read = () => {
    const f = new FormData(form);
    return {
      tip: f.get("type"), a: +f.get("a"), b: +f.get("b"), c: +f.get("c"), ada: f.get("ada") === "1",
      kapak: f.get("door"), renk: f.get("color"), tezgah: f.get("top"), led: f.get("led") === "1",
    };
  };

  // the plan in cm: runs along the walls, the fridge column, sink, hob and the island if it fits
  function layout(o) {
    const L = o.tip !== "duz", U = o.tip === "u";
    const runs = [{ x: 0, y: 0, w: o.a, h: DEPTH }];
    if (L) runs.push({ x: 0, y: DEPTH, w: DEPTH, h: o.b - DEPTH });
    if (U) runs.push({ x: o.a - DEPTH, y: DEPTH, w: DEPTH, h: o.c - DEPTH });
    const tall = o.tip === "duz" ? { x: 0, y: 0 } : { x: 0, y: o.b - DEPTH };
    let island = null, islandNote = "";
    if (o.ada) {
      const left = L ? DEPTH + CLEAR : OPEN, right = U ? DEPTH + CLEAR : OPEN;
      const x0 = left, x1 = o.a - right, span = x1 - x0;
      if (span >= 120) {
        const len = Math.min(300, Math.max(120, Math.round(o.a * .55 / 10) * 10), Math.floor(span / 10) * 10);
        island = { x: x0 + (span - len) / 2, y: DEPTH + AISLE, w: len, h: ISLAND_D };
      } else islandNote = `Ada için ana duvar en az ${left + right + 120} cm olmalı`;
    }
    const depthRoom = Math.max(L ? o.b : 0, U ? o.c : 0, island ? island.y + ISLAND_D + 90 : DEPTH + 200);
    const run = o.a + (L ? o.b - DEPTH : 0) + (U ? o.c - DEPTH : 0);
    const top = run - DEPTH;
    const sink = { x: (U ? o.a * .5 : o.a * .62) - 40, y: 8, w: 80, h: 44 };
    const hob = island ? { x: island.x + island.w / 2 - 30, y: island.y + 20, w: 60, h: 52 }
      : o.tip === "duz" ? { x: Math.max(DEPTH + 30, o.a * .3) - 30, y: 4, w: 60, h: 52 }
      : U ? { x: o.a - DEPTH + 4, y: DEPTH + (o.c - DEPTH) / 2 - 30, w: 52, h: 60 }
      : { x: 4, y: DEPTH + (o.b - 2 * DEPTH) / 2 - 30, w: 52, h: 60 };
    // counts, the way the 3D view builds them: one front stack per ~60 cm
    const n = len => len > 20 ? Math.max(1, Math.round(len / 60)) : 0;
    const base = n((U ? o.a - DEPTH : o.a) - (L || o.tip === "duz" ? DEPTH : 0)) + (L ? n(o.b - 2 * DEPTH) : 0) + (U ? n(o.c - DEPTH) : 0) + (island ? n(island.w - 8) : 0);
    const wallA = (U ? o.a - WALL_CAB : o.a) - (o.tip === "duz" ? DEPTH : L ? WALL_CAB : 0);
    const upper = n(wallA) + (L && o.b - DEPTH > WALL_CAB + 30 ? n(o.b - DEPTH - WALL_CAB) : 0) + (U ? n(o.c - WALL_CAB) : 0);
    return { L, U, runs, tall, island, islandNote, depthRoom, run, top, sink, hob, base, upper };
  }

  const el = (name, attrs, text) => {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (text != null) node.textContent = text;
    svg.appendChild(node);
    return node;
  };
  const fmt = cm => (cm / 100).toFixed(1).replace(".", ",");

  // top-down plan: shown until the 3D view is ready, and instead of it without WebGL2
  function plan(o, p) {
    const pad = 64, depth = p.depthRoom;
    svg.setAttribute("viewBox", `${-pad} ${-pad} ${o.a + 2 * pad} ${depth + pad + 24}`);
    svg.textContent = "";
    const front = COLORS[o.renk][1], [, topFill, topLine] = TOPS[o.tezgah];
    el("rect", { x: 0, y: 0, width: o.a, height: depth, fill: "#1b1714" });
    for (let x = 50; x < o.a; x += 50) el("line", { x1: x, y1: 0, x2: x, y2: depth, stroke: "rgba(240,225,200,.05)" });
    for (let y = 50; y < depth; y += 50) el("line", { x1: 0, y1: y, x2: o.a, y2: y, stroke: "rgba(240,225,200,.05)" });
    p.runs.forEach((r, k) => {
      el("rect", { x: r.x, y: r.y, width: r.w, height: r.h, fill: front, stroke: topLine, "stroke-width": 2.5 });
      const horiz = k === 0, len = horiz ? r.w : r.h;
      for (let m = 60; m < len - 1; m += 60)
        horiz ? el("line", { x1: r.x + m, y1: r.y, x2: r.x + m, y2: r.y + r.h, stroke: "rgba(0,0,0,.35)", "stroke-width": 1.2 })
              : el("line", { x1: r.x, y1: r.y + m, x2: r.x + r.w, y2: r.y + m, stroke: "rgba(0,0,0,.35)", "stroke-width": 1.2 });
    });
    el("rect", { x: p.tall.x, y: p.tall.y, width: DEPTH, height: DEPTH, fill: front, stroke: "#efe4d2", "stroke-width": 2 });
    el("line", { x1: p.tall.x, y1: p.tall.y, x2: p.tall.x + DEPTH, y2: p.tall.y + DEPTH, stroke: "rgba(239,228,210,.5)" });
    el("line", { x1: p.tall.x + DEPTH, y1: p.tall.y, x2: p.tall.x, y2: p.tall.y + DEPTH, stroke: "rgba(239,228,210,.5)" });
    el("rect", { x: 4, y: 4, width: o.a - 8, height: WALL_CAB - 4, fill: "none", stroke: "rgba(240,225,200,.45)", "stroke-dasharray": "6 5", "stroke-width": 1.2 });
    el("rect", { x: p.sink.x, y: p.sink.y, width: p.sink.w, height: p.sink.h, rx: 5, fill: "rgba(0,0,0,.35)", stroke: "rgba(255,255,255,.55)", "stroke-width": 1.2 });
    const hx = p.hob.x + p.hob.w / 2, hy = p.hob.y + p.hob.h / 2;
    for (const [dx, dy] of [[-13, -12], [13, -12], [-13, 12], [13, 12]]) el("circle", { cx: hx + dx, cy: hy + dy, r: 8, fill: "none", stroke: "rgba(255,255,255,.6)", "stroke-width": 1.2 });
    if (o.led) el("line", { x1: 6, y1: WALL_CAB + 3, x2: o.a - 6, y2: WALL_CAB + 3, stroke: "#ffcf8a", "stroke-width": 2.2, opacity: .85 });
    const is = p.island;
    if (is) {
      el("rect", { x: is.x, y: is.y, width: is.w, height: is.h, fill: topFill, stroke: topLine, "stroke-width": 2.5, rx: 2 });
      el("rect", { x: is.x + 6, y: is.y + 6, width: is.w - 12, height: 54, fill: front, opacity: .9 });
      for (let k = 0; k < Math.max(1, Math.min(4, Math.floor(is.w / 60))); k++) el("circle", { cx: is.x + is.w * (k + .5) / Math.max(1, Math.min(4, Math.floor(is.w / 60))), cy: is.y + is.h + 22, r: 16, fill: "none", stroke: "rgba(240,225,200,.5)", "stroke-width": 1.4 });
      el("text", { x: is.x + is.w / 2, y: is.y + is.h - 16, "text-anchor": "middle", class: "cfg-t cfg-t--in" }, `Ada ${is.w} × ${is.h}`);
      const ax = is.x + 18;
      el("line", { x1: ax, y1: DEPTH, x2: ax, y2: is.y, stroke: "#c9a46a", "stroke-width": 1.2 });
      el("text", { x: ax + 7, y: (DEPTH + is.y) / 2 + 5, class: "cfg-t cfg-t--brass" }, `${AISLE} cm`);
    }
    el("path", { d: `M0 ${depth} V0 H${o.a} V${depth}`, fill: "none", stroke: "#efe4d2", "stroke-width": 6 });
    const dim = (x1, y1, x2, y2, label, vert) => {
      el("line", { x1, y1, x2, y2, stroke: "#c9a46a", "stroke-width": 1.2 });
      const t = el("text", { x: (x1 + x2) / 2 - (vert ? 8 : 0), y: (y1 + y2) / 2 - (vert ? 0 : 8), "text-anchor": "middle", class: "cfg-t" }, label);
      if (vert) t.setAttribute("transform", `rotate(-90 ${(x1 + x2) / 2 - 8} ${(y1 + y2) / 2})`);
    };
    dim(0, -26, o.a, -26, `A · ${o.a} cm`);
    if (p.L) dim(-26, 0, -26, o.b, `B · ${o.b} cm`, true);
    if (p.U) dim(o.a + 26, 0, o.a + 26, o.c, `C · ${o.c} cm`, true);
  }

  let view3d = null;
  function update() {
    const o = read();
    form.querySelector('[data-for="b"]').hidden = o.tip === "duz";
    form.querySelector('[data-for="c"]').hidden = o.tip !== "u";
    for (const k of ["a", "b", "c"]) {
      form.querySelector(`output[for="cfg-${k}"]`).textContent = o[k] + " cm";
      const r = form.elements[k];
      r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%");  // filled part of the track
    }
    const p = layout(o);
    plan(o, p);
    if (view3d) view3d.update(o, p);

    const worktop = p.top + (p.island ? p.island.w : 0);
    const rows = [
      ["Plan", `${TYPES[o.tip]} mutfak${p.island ? " + ada" : ""}`],
      ["Alt modül", `${p.base} adet`],
      ["Üst dolap", `${p.upper} adet`],
      ["Tezgah", `~${fmt(worktop)} m`],
    ];
    sum.innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    warn.hidden = !p.islandNote;
    warn.textContent = p.islandNote ? p.islandNote + "." : "";

    const msg = [
      "Merhaba SDM Mobilya, sitenizdeki tasarım aracıyla bir mutfak taslağı hazırladım:",
      `• Plan: ${TYPES[o.tip]}${o.ada ? (p.island ? " + ada" : " (ada sığmadı)") : ""}`,
      `• Duvar A: ${o.a} cm${p.L ? `, B: ${o.b} cm` : ""}${p.U ? `, C: ${o.c} cm` : ""}`,
      p.island ? `• Ada: ${p.island.w} × ${p.island.h} cm` : null,
      `• Kapak: ${DOORS[o.kapak]}, ${COLORS[o.renk][0]}`,
      `• Tezgah: ${TOPS[o.tezgah][0]}`,
      `• Gizli LED: ${o.led ? "Evet" : "Hayır"}`,
      `• Tahmini: ${p.base} alt modül, ${p.upper} üst dolap, ~${fmt(worktop)} m tezgah`,
      "Ücretsiz keşif için randevu almak istiyorum.",
    ].filter(Boolean).join("\n");
    send.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();

  // 3D: three.js loads once the page has loaded, or earlier if the section comes within ~600 px.
  // The plan stays until the kitchen is ready, and for good without WebGL2 or if loading fails.
  const hasGL = (() => { try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; } })();
  if (hasGL) {
    let started = false;
    const start = () => {
      if (started) return;
      started = true; io.disconnect();
      view.classList.add("wait3d");
      import("./kitchen3d.js").then(m => {
        view3d = m.mount(view);
        view.classList.remove("wait3d");
        view.classList.add("is3d");
        update();
      }).catch(err => { view.classList.remove("wait3d", "is3d"); console.warn("3D view unavailable, showing the plan", err); });
    };
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) start(); }, { rootMargin: "600px 0px" });
    io.observe(view);
    if (document.readyState === "complete") setTimeout(start, 600);
    else addEventListener("load", () => setTimeout(start, 600), { once: true });
  }
})();
