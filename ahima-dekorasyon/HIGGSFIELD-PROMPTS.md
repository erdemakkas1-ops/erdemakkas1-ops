# Higgsfield görsel üretim planı — Ahima Dekorasyon

Bu demoda sahneler **Blender Cycles ile path-traced 3D render** olarak üretildi (`scripts/bathroom.py`, `scripts/kitchen.py`).
Bu oturumdaki Higgsfield bağlantısı yalnızca model listesini ve geçmişi okuyabiliyor, **görsel üretemiyor**; bu yüzden
aşağıdaki promptlar Higgsfield arayüzünde (veya üretim yetkisi olan bir bağlantıyla) çalıştırılmak üzere hazırlandı.
Hesapta görünen uygun modeller: **Nano Banana Pro** / **Seedream 4.5** (görselden görsele, referanslı),
**Seedance 2.0** ve **Cinema Studio Video 3.0** (başlangıç + bitiş karesiyle video).

## Neden render + Higgsfield birlikte?

Metinden bağımsız üretilen 6 görsel aynı banyo gibi görünmez: pencere kayar, duvar boyu değişir, kamera başka yerdedir.
Çözüm: **geometriyi 3D render kilitler, Higgsfield yalnızca fotogerçekçiliği ekler.**

1. `public/media/config/once.webp` (eski banyo) ve `public/media/config/marble-ceviz.webp` (final) zaten aynı
   kamerayla, aynı odadan alınmış karelerdir. Ara aşamalar için film karelerini kullanın
   (`public/media/bath/d/0024.webp` ≈ söküm sonrası, `0040.webp` ≈ seramik, `0060.webp` ≈ lavabo, `0072.webp` ≈ duş/WC).
2. Her promptta ilgili kareyi **image reference** olarak verin ve "keep the exact camera, room geometry and fixture
   positions of the reference" ifadesini koruyun.
3. Fotogerçekçi kareler hazır olunca ardışık iki kareyi **start_image / end_image** olarak Seedance 2.0'a verip
   4–6 sn'lik, ses kapalı geçiş videoları üretin; sonra karelere ayırın (aşağıda). Sitede video **oynatılmaz**;
   kareler yine kaydırmaya bağlı canvas'ta gösterilir.

### Ortak sahne tanımı (her prompta eklenecek blok)

```
Interior architectural photograph of the SAME small bathroom in every image: 2.70 m wide, 3.60 m deep,
2.75 m ceiling. Camera at the doorway, 1.30 m high, perfectly level (vertical lines stay vertical),
full-frame 18 mm rectilinear lens, slight downward lens shift, f/8, deep focus. Back wall: vanity on the left half,
shower zone on the right half. A small horizontal window high on the right wall above the shower (0.60 x 0.53 m).
Left wall: floor-standing toilet near the camera. Natural daylight through the window, no people, no text,
no logos, no watermark. Photorealistic, Canon EOS R5 interior photography, true-to-life materials, no CGI look.
```

---

## 1. Eski banyonun başlangıç sahnesi

**Model:** Nano Banana Pro, 16:9, 2K · **Referans:** `once.webp`

```
[Ortak sahne tanımı]
A tired 1990s Turkish apartment bathroom before renovation. Walls: small 25 x 33 cm glossy cream ceramic tiles
up to 1.42 m with yellowed grout and a narrow teal-blue border strip, above them old yellowish painted plaster with
faint moisture stains. Floor: 33 x 33 cm beige-brown ceramic tiles with dark grout. White pedestal washbasin with a
chrome two-handle tap, a small white plastic mirror cabinet with a bare fluorescent tube above it, a white enamel
bathtub across the back right with a pale blue plastic shower curtain on a chrome rod, an old floor-standing toilet
with a ceramic cistern. Flat, cool overcast daylight mixed with greenish fluorescent light, slightly underexposed,
honest documentary look. Keep the exact camera, room geometry and fixture positions of the reference image.
Negative: modern fixtures, people, clutter, fisheye distortion, tilted verticals, text.
```

## 2. Seramiklerin tamamlandığı ara sahne

**Model:** Nano Banana Pro, 16:9, 2K · **Referans:** `bath/d/0044.webp`

```
[Ortak sahne tanımı]
Mid-renovation, tiling just finished. Every wall and the floor are clad in large-format 60 x 120 cm polished
porcelain slabs with a white Calacatta marble look: soft grey veins running diagonally, a faint warm vein,
2 mm light grey grout joints, perfectly aligned rows. No fixtures yet: copper and white PPR pipe stubs only where
the vanity, toilet and shower will go, a bare work bulb hanging from the ceiling on a black flex, a plaster-dusted
plastic bucket on the floor. Warm work-light mixed with daylight from the window, crisp reflections of the window in
the polished tiles. Keep the exact camera, room geometry, window and tile layout of the reference image.
Negative: furniture, people, tools scattered, wet look, text.
```

## 3. Banyo ekipmanlarının yerleştiği ara sahne

**Model:** Nano Banana Pro, 16:9, 2K · **Referans:** `bath/d/0070.webp`

```
[Ortak sahne tanımı]
Fixtures installed, before final styling. The same white marble-look 60 x 120 cm porcelain on walls and floor.
On the back wall: a 120 cm wall-hung walnut vanity with two handleless doors and a thin matte black finger-pull
line, a 3 cm countertop cut from the same marble-look slab, an oval white ceramic vessel basin, a brushed brass
wall-mounted spout. Shower zone: a frameless 8 mm clear glass walk-in panel parallel to the back wall with a slim
brushed brass wall channel and stabiliser bar, a 30 x 30 cm square brass rain shower on a ceiling arm, a square
brass concealed mixer plate, a brass linear drain. Brass ladder towel rail on the right wall. No mirror yet,
bare work bulb still hanging. Daylight from the window, neutral white balance.
Keep the exact camera, room geometry and fixture positions of the reference image.
Negative: chrome, gold glitter, extra fixtures, people, text.
```

## 4. Tamamlanmış premium banyo finali

**Model:** Nano Banana Pro, 16:9, 2K (ayrıca 9:16 telefon kadrajı) · **Referans:** `config/marble-ceviz.webp`

```
[Ortak sahne tanımı]
The finished luxury bathroom at dusk. White Calacatta-look polished porcelain slabs on walls and floor, walnut
wall-hung vanity, marble-look countertop, oval white vessel basin, brushed brass fixtures, frameless clear glass
walk-in shower with a brass rain head, a 100 x 85 cm rectangular mirror with warm LED backlight glowing on the
tiles, a dropped ceiling with a hidden 3000 K LED cove washing the upper walls, three small recessed downlights
creating soft scallops of light, folded linen towels in cream and sand on the counter, an amber glass soap bottle,
a small olive tree in a textured stone pot, a woven sand-colored bath mat. Warm sunset light grazing through the
high window onto the left wall. Realistic reflections in the glass, the mirror and the polished floor, subtle
contact shadows, calm editorial mood like an Architectural Digest feature.
Keep the exact camera, room geometry and fixture positions of the reference image.
Negative: oversaturated gold, plastic-looking materials, CGI sheen, fisheye, people, text, watermark.
```

## 5. Modern mutfak sahnesi

**Model:** Nano Banana Pro, 16:9, 2K · **Referans:** `kitchen/d/0040.webp`

```
Interior architectural photograph of a modern Turkish apartment kitchen, 4.2 x 4.4 m, 2.75 m ceiling, camera at the
doorway 1.50 m high, level, 19 mm rectilinear lens. Back wall: a run of matte anthracite handleless base units with
a slim brushed brass gola line, a 4 cm white marble-look porcelain worktop with an undermount steel sink and a
brass gooseneck tap, the same marble-look slab as a full-height backsplash, walnut veneer wall units with a hidden
3300 K LED strip underneath washing the backsplash. Right: floor-to-ceiling walnut tall units with a built-in black
glass oven and microwave. Centre: a kitchen island in walnut with marble-look waterfall ends and a black induction
hob, two cylindrical brushed brass pendants above it. Anthracite stone-look 60 x 120 cm porcelain floor, warm
greige painted walls, a tall window on the left wall with soft daylight. Evening mood, lights on, realistic
reflections on the worktop. Keep the exact camera and layout of the reference image.
Negative: clutter, people, logos, text, fisheye, plastic look.
```

## 6. Konfigüratör: aynı banyonun malzeme varyasyonları

**Model:** Nano Banana Pro (görselden görsele), 16:9, 2K · **Referans:** her biri için ilgili render
(`config/<seramik>-<dolap>.webp`, 9 adet). Promptun yalnızca malzeme cümlesi değişir; geri kalanı **4. prompt** ile aynıdır.

| Dosya | Malzeme cümlesi |
|---|---|
| `marble-ceviz` | white Calacatta-look polished porcelain, natural walnut veneer vanity |
| `marble-beyaz` | white Calacatta-look polished porcelain, silky matte white lacquer vanity |
| `marble-antrasit` | white Calacatta-look polished porcelain, matte anthracite lacquer vanity |
| `anthra-ceviz` | honed anthracite stone-look porcelain with sparse thin pale veins, natural walnut vanity |
| `anthra-beyaz` | honed anthracite stone-look porcelain, silky matte white lacquer vanity |
| `anthra-antrasit` | honed anthracite stone-look porcelain, matte anthracite lacquer vanity (tone-on-tone) |
| `beige-ceviz` | honed beige travertine-look porcelain with soft horizontal strata and small pores, walnut vanity |
| `beige-beyaz` | honed beige travertine-look porcelain, silky matte white lacquer vanity |
| `beige-antrasit` | honed beige travertine-look porcelain, matte anthracite lacquer vanity |

Ek talimat (hepsine): `Change ONLY the wall/floor/countertop material and the vanity finish. Every object, the
camera, the light and the reflections stay where they are in the reference.`

---

## Video geçişleri ve kare dizisine çevirme

Seedance 2.0 (std, 1080p, 16:9, `generate_audio: false`, 5 sn), start → end:
1 → 2 *"time-lapse renovation, old tiles disappear and large marble-look porcelain slabs appear row by row, static
locked-off camera, no people"*, 2 → 3 *"fixtures appear one by one: vanity, basin, glass panel, rain shower, static
camera"*, 3 → 4 *"final styling and lights switching on, slow 20 cm dolly-in"*.

```bash
# Her klibi 32 kareye indirip WebP yapın, sırayla birleştirin (ffmpeg gerekli)
ffmpeg -i clip1.mp4 -vf "fps=32/5,scale=1280:-2" /tmp/seq/a_%04d.png
python3 scripts/encode_frames.py /tmp/seq public/media/bath/d --quality 84
```

Kare sayısı değişirse `lib/media.ts` içindeki `frames` değerini ve `scripts/verify-media.mjs` listesini güncelleyin,
`MEDIA_VERSION`'ı bir artırın.
