/* Oha Burger — scroll ile çalışan tek sayfa */
(function () {
  "use strict";

  /* ---------- Menü verisi (Migros Yemek listesinden) ---------- */
  var MENU = [
    { title: "Burgerler", tone: "", items: [
      ["Oha Burger", "120 gr köfte, biftek dilimleri, cheddar, karamelize soğan, Oha sos, 120 gr kaşık patates", "593,75"],
      ["King Kong Burger", "120 gr köfte, cheddar, mozzarella, füme antrikot, karamelize soğan, turşu, Oha sos + 200 gr patates", "650,00"],
      ["Double Burger", "2 × 120 gr köfte, 2 kat cheddar, 2 kat kaşar, turşu, Oha sos + 150 gr kaşık patates", "659,00"],
      ["Roastbeef Burger", "120 gr köfte, tereyağlı 70 gr roastbeef, cheddar, karamelize soğan, mantar sote, domates, turşu, Oha sos", "603,25"],
      ["Klasik Burger", "Dana köfte, cheddar, kaşar, cheddar sos, turşu, Oha sos + 150 gr patates", "451,25"],
      ["Cheese Forever Burger", "Dana köfte, cheddar, kaşar, turşu, Oha sos + 150 gr patates", "451,25"],
      ["Hot Burger", "120 gr köfte, cheddar, karamelize soğan, turşu, acı sos, Oha sos + 150 gr kaşık patates", "445,00"],
      ["Best Cheese Burger", "Dana köfte, çift cheddar, çift kaşar, mozzarella, turşu, Oha sos + 150 gr patates", "441,75"],
      ["Medium Et Burger Menü", "Dana köfte, cheddar, kaşar, karamelize soğan, turşu, Oha sos + 150 gr patates", "413,25"]
    ]},
    { title: "Tavuk", tone: "dark", items: [
      ["Hot Chicken Burger", "190 gr panelenmiş tavuk, acı sos, cheddar sos, marul, domates, turşu, Oha sos + 150 gr patates", "365,75"],
      ["Rus Tavuk Burger", "190 gr panelenmiş tavuk, cheddar, kaşar, cheddar sos, marul, turşu, Oha sos + 150 gr kaşık patates", "346,75"],
      ["Tavuk Burger", "190 gr panelenmiş tavuk, cheddar sos, marul, turşu, Oha sos + 150 gr kaşık patates", "323,00"],
      ["Schnitzel Menü 250 gr", "Özel soslarda marine edilmiş schnitzel, 150 gr patates, 2 soğan halkası", "385,00"],
      ["Çıtır Tavuk 500 gr + Patates + 1 L Fanta", "Özel marinasyonlu çıtır tavuk, 300 gr patates, 3 sos seçimi", "664,05"]
    ]},
    { title: "Kovalar", tone: "orange", items: [
      ["Big Gamer Kova", "7 tender, 6 soğan halkası, 300 gr kaşık patates", "525,00"],
      ["Acılı Big Gamer Kova", "7 tender, 6 soğan halkası, 300 gr kaşık patates, acı sos, ketçap, mayonez", "525,00"],
      ["Acılı Gamer Kova", "7 tender, 3 soğan halkası, 200 gr kaşık patates, acı sos, sweet chili, peri peri", "525,00"],
      ["Futbol Kova", "5 tender, 2 mozzarella sticks, 6 soğan halkası, 200 gr kaşık patates", "498,75"],
      ["Gamer Kova", "6 tender, 3 soğan halkası, 200 gr kaşık patates", "455,00"],
      ["Tender Kova", "6 tender, 3 soğan halkası, 200 gr patates, cheddar sos, ketçap, mayonez", "375,25"]
    ]},
    { title: "Menüler", tone: "", items: [
      ["3 Kişilik Oha Et Burger + 1 L Cola", "3 et burger, 6 soğan halkası, 300 gr patates, 1 L Coca-Cola", "1.200,00"],
      ["3 Kişilik Tavuk Burger + 1 L Cola", "3 tavuk burger, 3 tender, 3 soğan halkası, 1 L Cola", "897,75"],
      ["3 Kişilik Tavuk Burger Menü", "3 tavuk burger, 3 tender, 6 soğan halkası, 250 gr patates", "812,25"],
      ["2 Kişilik Tavuk Burger Menü", "2 tavuk burger, 2 tender, 2 soğan halkası, 200 gr kaşık patates", "698,25"],
      ["Hungry Menü", "1 tavuk burger, 2 tender, 2 soğan halkası, 150 gr patates", "456,00"],
      ["Çocuk Menüsü", "Et ya da tavuk burger, 120 gr patates + sürpriz oyuncak", "450,00"],
      ["Acılı Menü", "1 tavuk burger, 2 tender, 2 soğan halkası, 200 gr kaşık patates, acı sos", "441,75"]
    ]},
    { title: "Atıştırmalık", tone: "dark", items: [
      ["Patates Kızartması 500 gr", "Kaşık patates", "294,50"],
      ["Sigara Böreği 250 gr", "8–10 adet, iki çeşit peynirli", "190,00"],
      ["Hotdog", "Hindi sosis, patates kızartması, dilediğin soslar", "170,05"],
      ["Patates Kızartması 250 gr", "Kaşık patates", "132,05"],
      ["Tender (2 adet)", "Kemiksiz çıtır tavuk", "122,55"],
      ["Mozzarella Sticks (2 adet)", "Çıtır kaplamalı mozzarella", "122,55"],
      ["Soğan Halkası 12'li", "12 adet soğan halkası", "104,50"],
      ["Soğan Halkası 6'lı", "6 adet soğan halkası", "80,75"]
    ]},
    { title: "İçecek & Sos", tone: "", items: [
      ["Coca-Cola / Fanta / Sprite 1 L", "", "114,00"],
      ["Coca-Cola / Fanta / Sprite 33 cl", "", "85,50"],
      ["Su 33 cl", "", "30,00"],
      ["Cheddar Sos", "", "36,10"],
      ["Sweet Chili", "", "35,00"],
      ["Acı Sos · Hardal", "", "22,00"],
      ["Barbekü · Ranch", "", "20,90"],
      ["Ketçap · Mayonez", "", "19,00"]
    ]}
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var track = document.getElementById("menuTrack");
  if (track) {
    var html = MENU.map(function (cat, i) {
      var items = cat.items.map(function (it) {
        return "<li><b>" + esc(it[0]) + "</b><em>" + esc(it[2]) + " ₺</em>" +
          (it[1] ? "<span>" + esc(it[1]) + "</span>" : "") + "</li>";
      }).join("");
      return '<article class="menu-panel ' + cat.tone + '"><h3>' + esc(cat.title) +
        "<small>0" + (i + 1) + "</small></h3><ul class=\"menu-items\">" + items + "</ul></article>";
    }).join("");
    html += '<div class="menu-end"><h3>Acıktın mı?</h3><p>Telefonla ya da online sipariş platformlarından hemen sipariş ver.</p>' +
      '<div><a class="btn btn-orange" href="tel:+905015791912">Hemen Ara</a></div></div>';
    track.innerHTML = html;
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.querySelector(".header");
  function onScrollHeader() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis yumuşak kaydırma ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var target = id === "#top" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      else window.scrollTo({ top: target === 0 ? 0 : target.offsetTop, behavior: "smooth" });
    });
  });

  /* ---------- İlerleme çubuğu ---------- */
  gsap.to(".progress span", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 }
  });

  /* ---------- 1. HERO: açılış + scroll ---------- */
  var intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  intro
    .from(".hero-title .line > span", { yPercent: 110, duration: 1.1, stagger: 0.12 })
    .from(".hero .eyebrow", { y: 20, opacity: 0, duration: 0.7 }, 0.2)
    .from(".hero-sub, .hero-cta", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.45)
    .from(".hero-burger", { y: 220, rotate: -14, scale: 0.7, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.1)
    .from(".hero-glow", { scale: 0.3, opacity: 0, duration: 1.6 }, 0.2)
    .from(".header", { y: -30, opacity: 0, duration: 0.8 }, 0.5);

  gsap.to(".hero-burger", { y: -18, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });

  var heroTl = gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  heroTl
    .to(".hero-burger-wrap", { scale: 1.35, yPercent: 30, rotate: 8, ease: "none" }, 0)
    .to(".hero-copy", { yPercent: -40, opacity: 0, ease: "none" }, 0)
    .to(".scroll-hint", { opacity: 0, ease: "none" }, 0);

  /* ---------- 2. STACK: burger katmanlara ayrılır ---------- */
  var layers = gsap.utils.toArray(".burger-stack .layer");
  var tags = gsap.utils.toArray(".burger-stack .tag");
  var stackTl = gsap.timeline({
    scrollTrigger: { trigger: ".stack", start: "top top", end: "+=220%", pin: true, scrub: 1, anticipatePin: 1 }
  });
  stackTl
    .from(".burger-stack", { yPercent: 40, rotate: -6, duration: 0.6, ease: "power2.out" }, 0)
    .from(".stack-head > *", { y: 50, opacity: 0, stagger: 0.08, duration: 0.5 }, 0)
    .to(layers, {
      y: function (i, el) { return parseFloat(el.dataset.spread) || 0; },
      rotate: function (i) { return i % 2 ? 2 : -2; },
      duration: 1, ease: "power2.inOut"
    }, 0.5)
    .to(".stack-shadow", { scaleX: 0.7, opacity: 0.5, y: 190, duration: 1, ease: "power2.inOut" }, 0.5)
    .fromTo(tags, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.07, duration: 0.4 }, 1.1)
    .to({}, { duration: 0.5 })
    .to(layers, { y: 0, rotate: 0, duration: 0.8, ease: "power3.inOut" }, ">")
    .to(tags, { opacity: 0, duration: 0.3 }, "<")
    .to(".stack-shadow", { scaleX: 1, opacity: 1, y: 0, duration: 0.8 }, "<");

  /* ---------- 3. COMBO: kutu açılır, ürünler fırlar ---------- */
  var items = gsap.utils.toArray(".box-items .item");
  gsap.set(items, { y: "120%", opacity: 0 });
  var comboTl = gsap.timeline({
    scrollTrigger: { trigger: ".combo", start: "top top", end: "+=200%", pin: true, scrub: 1, anticipatePin: 1 }
  });
  comboTl
    .from(".combo-title .line > span", { yPercent: 110, stagger: 0.1, duration: 0.5 }, 0)
    .from(".combo .eyebrow, .combo-list li, .combo .price-pill", { x: -40, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.15)
    .from(".box", { y: 160, rotate: -4, duration: 0.6, ease: "power3.out" }, 0)
    .to(".box-lid", { rotateX: 4, duration: 0.6, ease: "back.out(1.6)" }, 0.6)
    .to(items, {
      y: function (i) {
        var k = document.querySelector(".box").offsetHeight / 300;
        return ([-190, -210, -190, -330, -360, -360, -380][i] || -100) * k;
      },
      x: function (i) { return [-30, 0, 30, -40, 40, -20, 20][i] || 0; },
      rotate: function (i) { return [-12, 0, 10, -20, 18, 30, -25][i] || 0; },
      opacity: 1, stagger: 0.07, duration: 0.7, ease: "back.out(1.4)"
    }, 0.85)
    .to(".combo-badge", { scale: 1, duration: 0.4, ease: "back.out(2)" }, 1.3)
    .to({}, { duration: 0.4 });

  /* ---------- 4. CRISPY: kayan bant + marquee ---------- */
  gsap.fromTo(".band-track", { x: 0 }, {
    x: function () {
      var t = document.querySelector(".band-track");
      return -(t.scrollWidth);
    },
    ease: "none",
    scrollTrigger: { trigger: ".crispy", start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true }
  });
  gsap.fromTo(".marquee-a span", { xPercent: 0 }, {
    xPercent: -35, ease: "none",
    scrollTrigger: { trigger: ".crispy", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.fromTo(".marquee-b span", { xPercent: -35 }, {
    xPercent: 0, ease: "none",
    scrollTrigger: { trigger: ".crispy", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.from(".crispy-copy > *", {
    y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: ".crispy-copy", start: "top 80%" }
  });

  /* ---------- 5. LINEUP ---------- */
  gsap.fromTo(".lineup-title", { scale: 2.2, opacity: 0.2 }, {
    scale: 1, opacity: 1, ease: "none",
    scrollTrigger: { trigger: ".lineup", start: "top bottom", end: "top 20%", scrub: true }
  });
  gsap.from(".card", {
    y: 140, rotate: function (i) { return [-6, 0, 6][i]; }, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".lineup-cards", start: "top 85%" }
  });

  /* ---------- 6. MENÜ: yatay kaydırma ---------- */
  var menuTrack = document.querySelector(".menu-track");
  function menuDistance() { return Math.max(0, menuTrack.scrollWidth - window.innerWidth); }
  gsap.to(menuTrack, {
    x: function () { return -menuDistance(); },
    ease: "none",
    scrollTrigger: {
      trigger: ".menu", start: "top top",
      end: function () { return "+=" + menuDistance(); },
      pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
    }
  });
  gsap.from(".menu-head h2", {
    yPercent: 60, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".menu", start: "top 70%" }
  });

  /* ---------- 7. SMASH: parallax ürünler ---------- */
  gsap.from(".smash-title span", {
    yPercent: 60, opacity: 0, stagger: 0.12, duration: 1, ease: "power4.out",
    scrollTrigger: { trigger: ".smash", start: "top 75%" }
  });
  [[".s-burger", -60, -6], [".s-fries", -160, -18], [".s-cup", -200, 16], [".s-ring", -260, 120], [".s-tender", -120, -30]]
    .forEach(function (cfg) {
      gsap.fromTo(cfg[0], { y: 140, rotate: 0 }, {
        y: cfg[1], rotate: cfg[2], ease: "none",
        scrollTrigger: { trigger: ".smash", start: "top bottom", end: "bottom top", scrub: true }
      });
    });

  /* ---------- 8. VISIT + footer ---------- */
  gsap.from(".visit-copy > *, .visit-map", {
    y: 50, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: ".visit", start: "top 75%" }
  });
  gsap.from(".footer-big", {
    yPercent: 40, opacity: 0, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true }
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
