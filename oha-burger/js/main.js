/* Oha Burger — scroll ile çalışan tek sayfa */
(function () {
  "use strict";

  /* ---------- Menü verisi: Yemeksepeti "Oha Buger" (wvvf) liste fiyatları ---------- */
  var MENU = [
    { title: "Burgerler", tone: "", items: [
      ["Oha Burger", "120 gr hamburger köftesi, biftek dilimleri, cheddar peyniri, karamelize soğan, Oha burger sos + 120 gr kaşık patates", "535"],
      ["Double Burger", "2 adet (240 gr) hamburger köftesi, 2 kat cheddar, 2 kat kaşar peyniri, turşu, Oha burger sos + 150 gr kaşık patates", "650"],
      ["Rus Tavuk Burger", "190 gr panelenmiş tavuk, cheddar peyniri, kaşar peyniri, cheddar sos, marul, turşu, Oha burger sos + 150 gr kaşık patates", "550"],
      ["Best Cheeseburger", "120 gr dana hamburger köftesi, çift kat cheddar, çift kat kaşar, turşu, Oha burger sos + 150 gr patates", "510"],
      ["King Kong Burger", "120 gr hamburger köftesi, cheddar, mozzarella, füme antrikot, karamelize soğan, turşu, Oha burger sos + 200 gr patates", "500"],
      ["Roastbeef Burger", "120 gr hamburger köftesi, tereyağlı 70 gr roastbeef dilimleri, cheddar, karamelize soğan, turşu, Oha burger sos + 150 gr kaşık patates", "495"],
      ["Chicken Burger", "190 gr panelenmiş tavuk, cheddar sos, marul, Oha burger sos + 120 gr kaşık patates", "485"],
      ["Hot Chicken Burger", "190 gr panelenmiş tavuk, acı sos, cheddar sos, marul, domates, turşu, Oha burger sos + 150 gr patates", "485"],
      ["Tavuk Burger", "190 gr panelenmiş tavuk, cheddar sos, marul, turşu, Oha burger sos + 150 gr kaşık patates", "470"],
      ["Klasik Burger", "120 gr dana hamburger köftesi, cheddar, kaşar, cheddar sos, turşu, Oha burger sos + 150 gr patates", "465"],
      ["Cheese Forever Burger", "120 gr dana hamburger köftesi, cheddar peyniri, kaşar peyniri, turşu, Oha burger sos + 150 gr patates", "932"]
    ]},
    { title: "Tavuklar", tone: "dark", items: [
      ["Acılı Gamer Kova", "6 tender, 3 soğan halkası, 200 gr kaşık patates, acı sos, sweet chili, peri peri sos", "750"],
      ["Tender Kova", "5 tender, 3 soğan halkası, 200 g patates. Cheddar sos, ketçap, mayonez ile", "720"],
      ["Futbol Kova", "5 tender, 2 mozzarella sticks, 6 soğan halkası, 200 g kaşık patates", "700"],
      ["Big Gamer Kova", "6 tender, 6 soğan halkası, 300 gr kaşık patates", "700"],
      ["Acılı Big Gamer Kova", "6 tender, 6 soğan halkası, 300 gr kaşık patates, acı sos, ketçap, mayonez", "700"],
      ["Gamer Kova", "5 tender, 3 soğan halkası, 200 gr kaşık patates", "660"],
      ["Çıtır Tavuk Dürüm", "190 g çıtır tavuk, mayonez, ketçap, cheddar sos, turşu, marul", "460"]
    ]},
    { title: "Menüler", tone: "orange", items: [
      ["3'lü Oha Et Burger Menü", "3 Oha Et Burger + 300 g patates + 6 soğan halkası + Pepsi (1 l)", "2.692"],
      ["2'li Çıtır Tavuk Dürüm Menü", "2 çıtır tavuk dürüm + patates + Pepsi (1 l)", "1.923"],
      ["2'li Çıtır Tavuk Dürüm & Ayran Menü", "2 çıtır tavuk dürüm (190 g) + patates + 2 ayran (20 cl)", "1.730"],
      ["3'lü Oha Et Burger + Patates", "3 Oha Et Burger + 300 g patates (2 sos ile)", "1.538"],
      ["3 Kişilik Tavuk Burger Menü", "3 tavuk burger (190 gr), 3 chicken tender, 3 soğan halkası, 1 L Cola Zero", "1.299"],
      ["Çıtır Tavuk (1 kg) Menü", "1 kg çıtır tavuk + patates (2 sos ile) + Pepsi (1 l)", "1.250"],
      ["Tavuk Burger Menü (2 Kişilik)", "2 tavuk burger, 3 chicken tender, 3 soğan halkası + Coca-Cola Zero Sugar (1 l)", "990"],
      ["Çıtır Tavuk (1 kg.) Menü 1", "1 kg çıtır tavuk + 300 gr patates + Coca-Cola (1 L)", "985"],
      ["Klasik Burger Menü", "Klasik Burger + 150 g patates + Coca-Cola (33 cl)", "961"],
      ["2'li Lavaş Arası Karışık Sandviç", "2 lavaş arası karışık sandviç + 150 gr patates + Coca-Cola (1 L)", "945"],
      ["2'li Lavaş Arası Çıtır Tavuk Menü", "2 lavaş arası çıtır tavuk + Coca-Cola (1 L)", "885"],
      ["Çıtır Tavuk Dürüm Menü", "Çıtır tavuk dürüm (190 g) + patates + kutu içecek (33 cl)", "865"],
      ["Çıtır Tavuk (500 g) Menü", "500 g çıtır tavuk + patates (2 sos ile) + Pepsi (1 l)", "865"],
      ["Tavuk Burger Menü", "Tavuk Burger + 150 g kaşık patates + Coca-Cola (33 cl)", "860"],
      ["Çıtır Tavuk (500 gr.) Menü", "500 gr çıtır tavuk + patates + Coca-Cola (1 L)", "845"],
      ["2'li Lavaş Arası Çıtır Tavuk & Ayran", "2 lavaş arası çıtır tavuk (190 g, mayonez, ketçap, marul, turşu, kaşar) + 2 ayran", "826"],
      ["Çıtır Tavuk (1 kg.) Menü", "1 kg çıtır tavuk + Coca-Cola (1 L)", "745"],
      ["Hot Dogs Kanka Menü", "4 hot dog + 300 g patates + 2 sos", "730"],
      ["Oha Klasik Burger Menü", "Oha Klasik Burger + içecek", "695"],
      ["Lavaş Arası Çıtır Tavuk Menü", "Lavaş arası çıtır tavuk + 150 gr patates + Coca-Cola (33 cl)", "615"],
      ["Klasik Burger & Coca-Cola Menü", "Klasik Burger + 150 g patates + Coca-Cola (33 cl)", "615"],
      ["Hungry Menü", "1 tavuk burger (190 gr), 2 tender, 2 soğan halkası, 150 gr patates", "599"],
      ["Chicken Burger Menü", "Chicken Burger + 200 gr kaşık patates + 2 soğan halkası + 2 chicken tender", "565"],
      ["Tavuk Burger & Coca-Cola Menü", "Tavuk Burger + 150 g kaşık patates + Coca-Cola (33 cl)", "538"],
      ["Oha Tavuk Burger Menü", "Oha Tavuk Burger + Coca-Cola (33 cl)", "495"],
      ["Lavaş Arası Karışık Sandviç Menü", "Lavaş arası karışık sandviç + ayran (20 cl)", "495"],
      ["Çocuk Menüsü Tavuk", "Tavuk burger (120 gr), ketçap, mayonez, marul, 120 gr patates + sürpriz oyuncak", "480"]
    ]},
    { title: "Yan Ürünler", tone: "", items: [
      ["Hot Dog Sandviç", "Hindi sosis, patates kızartması ve seçeceğin 2 sos", "384"],
      ["Peynirli Sigara Böreği (250 g)", "Beyaz peynir", "249"],
      ["Tenders (2 adet)", "Çıtır tavuk tender", "201"],
      ["Mozzarella Sticks (2 adet)", "Mozzarella peyniri", "201"],
      ["Patates Kızartması (500 g)", "Parmak dilim", "192"],
      ["Soğan Halkası (12 adet)", "Çıtır soğan halkası", "152"],
      ["Soğan Halkası (6 adet)", "Çıtır soğan halkası", "134"],
      ["Patates Kızartması (250 g)", "Parmak dilim", "115"]
    ]},
    { title: "İçecekler", tone: "dark", items: [
      ["Coca-Cola (1 L)", "", "130"],
      ["Coca-Cola Zero Sugar (1 L)", "", "130"],
      ["Fanta (1 L)", "", "130"],
      ["Coca-Cola (33 cl)", "", "90"],
      ["Coca-Cola Zero Sugar (33 cl)", "", "90"],
      ["Fanta (33 cl)", "", "90"],
      ["Sprite (33 cl)", "", "90"],
      ["Sade Soda (20 cl)", "", "40"],
      ["Damla Su (1 L)", "", "40"],
      ["Damla Su (50 cl)", "", "30"]
    ]},
    { title: "Soslar", tone: "", items: [
      ["Hardal Sos", "", "48"],
      ["Ranch Sos", "", "48"],
      ["Sweet Chili Sos", "", "48"],
      ["Barbekü Sos", "", "40"],
      ["Acı Sos", "", "40"],
      ["Cheddar Sos", "", "40"],
      ["Mayonez", "", "40"],
      ["Ketçap", "", "38"]
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
        "<small>0" + (i + 1) + "</small></h3><ul class=\"menu-items\" data-lenis-prevent>" + items + "</ul></article>";
    }).join("");
    html += '<div class="menu-end"><h3>Acıktın mı?</h3><p>Telefonla ya da Yemeksepeti üzerinden hemen sipariş ver.</p>' +
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
