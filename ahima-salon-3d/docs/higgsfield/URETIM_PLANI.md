# Ahima salon: üretim planı (Gemini → Higgsfield)

**Sıra:** önce **Gemini** ile 4 anahtar görsel, sonra **Higgsfield** ile bu görseller arasında 3 video.

- **Görseller Gemini'de:** Gemini'nin görsel modeli (Nano Banana) aynı sohbet içinde "bu fotoğrafı düzenle" dendiğinde kamerayı ve odayı en iyi koruyan araç. Higgsfield kredisi de harcanmaz.
- **Videolar Higgsfield'da:** Seedance 2.0, hem **başlangıç** hem **bitiş** karesi alıyor. Kesintisizliği bu sağlıyor: 1. videonun son karesi 2. videonun ilk karesiyle aynı görüntü olur.

```
K0 boş ──V1──▶ K1 yüzeyler ──V2──▶ K2 mobilya ──V3──▶ K3 tamamlanmış
```

---

## 1. Gemini: 4 anahtar görsel

Hepsini **tek bir Gemini sohbetinde, sırayla** yapın. Her adımda Gemini'nin bir önceki çıktısını düzenletiyoruz. Yeni sohbet açarsanız, son ürettiğiniz görseli yükleyip devam edin.
Promptları aynen kopyalayın; İngilizce daha tutarlı sonuç veriyor. Her görseli **indirip** `K0.png … K3.png` diye kaydedin.

### K0: Boş salon
`referans_bos_salon.jpg` dosyasını yükleyin ve şunu yazın:

```
Turn this 3D render into a real photograph. Keep exactly the same camera position, lens, framing, room proportions and window position. Output 16:9 landscape.
A completely empty, unfinished modern living room: raw smooth grey concrete screed floor, plain warm-white plastered walls, flat white ceiling, one wide floor-to-ceiling window in the back wall with thin dark bronze aluminium frames and two vertical mullions, lush green garden and soft sky outside. Late afternoon sunlight enters through the window and casts long soft window-shaped light patches with mullion shadows on the concrete floor.
No furniture, no objects, no people, no text. Full-frame camera, 24mm lens, eye level, natural light, realistic materials, real estate photography.
```

### K1: Zemin ve duvar
Aynı sohbette devam edin:

```
Edit the last image. Keep the camera, framing, window, ceiling, sunlight and outside view exactly identical. Change only the finishes:
- floor: light natural oak herringbone parquet, satin finish
- left wall: tall vertical walnut wood slats with dark gaps, floor to ceiling
- right wall: large honed beige travertine stone panels with thin vertical joints
- ceiling: a slim dropped ceiling edge with a recessed cove around the perimeter (lights off)
The room stays empty: no furniture, no decor, no lamps, no people, no text. Same 16:9 framing.
```

### K2: Mobilya
`referans_dolu_salon_yerlesim.jpg` dosyasını da yükleyin ve yazın:

```
Edit the previous photo (the herringbone room), NOT the uploaded 3D render. Use the 3D render only as a layout guide for where furniture goes. Keep camera, framing, floor, walls, window, ceiling and sunlight exactly identical.
Add: a large low cream boucle L-shaped sectional sofa on the left, a round honed travertine coffee table in the centre, two cognac leather lounge chairs with walnut frames near the window, a long low floating walnut TV console on the right wall with a large black wall-mounted TV above it, a small round walnut side table at the far left.
No rug, no cushions, no plants, no decor yet. Photorealistic fabrics and wood, soft contact shadows, no people, no text. Same 16:9 framing.
```

### K3: Tamamlanmış salon

```
Edit the last image. Keep the camera, framing, architecture and every piece of furniture exactly in place. Add the finishing touches: a large soft ivory wool rug under the sofa and coffee table, linen and taupe throw pillows and a knitted throw on the sofa, a tall olive tree in a stone planter in the back left corner, sheer ivory linen curtains at both sides of the window, a two-ring brass LED pendant above the coffee table, a vase of white hydrangeas and a stack of books on the coffee table, small ceramic vases on the TV console.
Turn on warm 2700K hidden LED strips in the ceiling cove and the pendant, glowing softly, while golden late afternoon sunlight still enters the window. Warm minimal luxury, magazine-quality interior photography, no people, no text. Same 16:9 framing.
```

**Kontrol:** 4 görseli yan yana açın. Pencere, tavan çizgisi ve kamera açısı **aynı yerde** olmalı. Kayan bir görsel varsa aynı promptla "keep the camera exactly identical to the previous image" diye tekrar isteyin. Videoların akıcılığı tamamen buna bağlı.

---

## 2. Higgsfield: 3 video

**Model:** Seedance 2.0 · **Mode:** std · **Resolution:** 1080p (kredi yetmezse 720p) · **Duration:** 5 sn · **Aspect:** 16:9 · **Audio:** kapalı

Her videoda **Start frame** ve **End frame** alanına Gemini görsellerini yükleyin:

| Video | Start frame | End frame |
|---|---|---|
| V1 | K0 | K1 |
| V2 | K1 | K2 |
| V3 | K2 | K3 |

### V1
```
Locked-off static tripod camera, absolutely no camera movement, no zoom. Seamless continuous transformation of the same room: oak herringbone parquet spreads across the concrete floor from the window towards the camera, walnut slats rise one by one along the left wall, travertine panels slide into place on the right wall, the ceiling cove forms. Calm, elegant motion. No people, no tools, no text, no cuts.
```

### V2
```
Locked-off static tripod camera, absolutely no camera movement, no zoom. The same room furnishes itself: the walnut TV console and TV settle onto the right wall, the cream sectional sofa glides into place on the left, the travertine coffee table and two leather lounge chairs appear and settle softly with realistic weight. Calm, continuous, physically believable motion. No people, no text, no cuts.
```

### V3
```
Locked-off static tripod camera, absolutely no camera movement, no zoom. Final styling of the same room: the ivory rug unrolls across the floor, pillows and a throw land on the sofa, the olive tree, curtains, flowers and decor appear, the brass ring pendant lowers from the ceiling and the warm cove LED lights slowly fade on. Ends on a still, finished luxury living room. No people, no text, no cuts.
```

Kamera oynarsa, oda değişirse ya da insan görünürse o videoyu aynı karelerle yeniden üretin.

**Kredi:** hesapta 141 kredi var. Higgsfield her üretimden önce maliyeti gösteriyor; 3 video + 1–2 tekrar için önce kontrol edin.

---

## 3. Bittiğinde

Bana "**üretim bitti**" yazın ve K0–K3 görsellerini sohbete ekleyin. Videoları Higgsfield geçmişinizden kendim çekerim. Ardından:

- videoları uç uca birleştiririm,
- masaüstü ve telefon için kare dizisine çeviririm,
- scroll animasyonunu bu filme göre baştan kurarım: kare kare ilerleme, birebir geri sarma, geçiş efekti yok.
