# Arqli Interiors — scroll film demo

One-page demo for Arqli Interiors (@arqli.interiors), an interior design and architecture studio
founded by @ozgeeralpp and @mina_gurkan. Same family as the Maviron Çelik and D&M Mutfak demos:
the opener is a 3D film scrubbed by page scroll, and the page ends with a "design your own" tool.
No build step: `index.html`, `css/`, `js/`, `fonts/`, `img/` and `favicon.svg` are the whole site.

Preview locally: `python3 -m http.server 5540` in this folder, then http://localhost:5540.

## The film (`js/film.js`)

A cutaway living room built in code (`js/room.js`, three.js r180 from `js/vendor/`), like the
isometric cutaways in their own posts. Film seconds 0–12:

1. **Plan** — outlines plot in on a slate board with a 50 cm grid and gold dimension lines.
2. **Doku** — walls, oak floor and built-ins take their materials; the board turns to daylight.
3. **Mobilya** — rug, sofa, travertine table, chair, side table, plant and the ring light settle in.
4. **Işık** — the sun goes down; the arched niche, the shelves and the ring light glow at 2700 K.

- `html.live-film` is set by the inline script in `<head>`. Without it (reduced motion, `?still`)
  or without WebGL2, the film shows `img/film-poster.webp` with the chapters as text.
- Tags use `data-at` (a part name from `room.js`) or `data-dim`, and `data-from`/`data-to` in film
  seconds; `data-mob="0"` hides a tag on phones. The camera path is `keys` in `film.js`.
- `?capture` turns off easing; `__film.seek(t)` jumps to a film second. The poster and `img/og.jpg`
  are captures at t = 11.3 with the UI hidden.

## Other sections

Stüdyo (founders, facts) · Projeler (horizontal reel, pinned and moved by scroll on wide screens) ·
Hizmetler · Malzeme notu ("Neden porselen?", from their story highlight) · Süreç (a line lit by
scroll) · **Mekânını tasarla** · İletişim.

**Mekânını tasarla** (`js/studio.js`): style palette (Sıcak minimal, Japandi, Modern lüks,
Toprak & kil), wall detail (kemerli niş, ahşap çıta, mermer panel, sade), floor, ceiling light,
colour temperature and room size rebuild the same room in 3D; drag or arrow keys turn it, day /
evening switches the light. The result is copied and Instagram DM opens (`ig.me/m/arqli.interiors`);
Instagram cannot prefill messages, so the visitor pastes it.

## Security

- No third-party requests: fonts, three.js and images are served from this folder.
- CSP `<meta>` in `index.html`; the two inline scripts are allowed by hash. After changing either,
  run `python3 tools/csp.py`. `vercel.json` sets the header-only rules on Vercel.
- `innerHTML` is never used with visitor text.

## Content sources and tools

- Bio, founders, the porcelain note: their Instagram profile and story highlight.
- Project photos: cropped from a phone screenshot of their grid (`python3 tools/instagram.py`,
  source in `instagram-raw/`, kept out of git), ~356 px wide — ask for full-resolution files.
- Fonts (`python3 tools/fonts.py`, SIL OFL): Fraunces, Manrope, JetBrains Mono.
- Floor texture: CC0 Poly Haven `oak_veneer_01` (same files as the D&M demo).

## Before going live

- Get: phone / WhatsApp, e-mail, city/address, full names of the founders, a vector logo,
  full-resolution project images and the post links for each project.
- Confirm the services list (especially "uygulama takibi" / anahtar teslim) and the process steps.
- The film and the configurator are visualisations, not one of their projects.
