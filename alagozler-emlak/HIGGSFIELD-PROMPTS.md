# Alagözler Emlak — Higgsfield görsel listesi

**Model:** GPT Image 2 (`gpt_image_2`) · **Kalite:** high · **Çözünürlük:** 2k
**Kural:** Görseller yapay zekâ ile üretilmiş **temsili** görsellerdir. Sitede "Temsili görsel" etiketiyle gösterilir. Gerçek ilan fotoğrafları gelince değiştirilmelidir. Görsellerde yazı, logo, filigran ve insan yüzü olmamalı.

Üretimler bitince Claude'a "Higgsfield görselleri hazır" yazmanız yeterli. Claude hesabınızdaki üretimleri okur ve aşağıdaki sırayla `src/data/media.ts` dosyasına yerleştirir. **Lütfen aşağıdaki sırayla üretin.** Sırayı bozarsanız hangi görselin hangisi olduğunu yazın.

Her prompt'un sonuna şu ortak stil bloğunu ekleyin:

> **STYLE:** Ultra-photorealistic professional real estate photography, shot on a full-frame camera with a 24–35 mm lens, natural colour grading, realistic textures and scale, true-to-life southeastern Turkey (Şanlıurfa) landscape and architecture, crisp detail, gentle contrast, no HDR halo. No text, no signs with readable letters, no logos, no watermark, no people's faces, no cars with readable plates.

---

## A. Zorunlu görseller (19 adet)

### 1 · Ana sayfa hero — `hero` · **16:9**
> Wide cinematic golden-hour landscape on the outskirts of Şanlıurfa, Turkey. In the foreground, a flat surveyed land plot of reddish-ochre soil with thin white survey stakes and a faint string line marking the parcel corners; a newly paved asphalt road runs diagonally from the lower right toward the horizon. Mid-ground: scattered pistachio orchards and a few low cream-coloured limestone houses. Far horizon: the soft silhouette of the city's low skyline with mid-rise residential blocks, under a warm amber sky with the sun low on the right. Calm, premium, trustworthy mood. The left third of the frame is quieter, darker sky and land to leave room for a headline. + STYLE

### 2 · Kategori: Arsa — `categories.arsa` · **3:4**
> Vertical shot of an empty residential building plot at the edge of a growing Şanlıurfa neighbourhood: level reddish-brown soil, white survey stakes at the corners, a freshly paved road along one side with a concrete kerb, utility poles, new cream limestone apartment blocks in the soft-focus background, late-afternoon warm light. + STYLE

### 3 · Kategori: Tarla — `categories.tarla` · **3:4**
> Vertical view of the fertile Harran plain near Şanlıurfa: long straight rows of young green cotton or wheat stretching to a flat horizon, a narrow concrete irrigation canal running alongside, one lone mulberry tree, golden-hour side light, big clear sky. + STYLE

### 4 · Kategori: Daire — `categories.daire` · **3:4**
> Vertical exterior of a modern 10-storey residential building in Karaköprü, Şanlıurfa: cream limestone and light beige facade, large windows, glass balcony railings, landscaped entrance with young trees, warm sunset light reflecting on the glass, a few lit windows. + STYLE

### 5 · Kategori: Müstakil ev — `categories.mustakil` · **3:4**
> Vertical shot of a two-storey detached house built from traditional cut Urfa limestone with arched windows and a flat roof terrace, surrounded by a walled garden with fruit trees and a stone-paved path, warm late-afternoon light. + STYLE

### 6 · Kategori: Ticari / Diğer — `categories.diger` · **3:4**
> Vertical street-level view of a modern ground-floor retail unit on a busy avenue in Şanlıurfa: wide clean glass shopfront with an empty bright interior, cream stone facade above, dark grey awning, wide pavement, early-evening light with warm interior glow. The shop sign area is blank. + STYLE

### 7 · AE-1001 Karaköprü 1,5 dönüm arsa (kapak) — `listings["AE-1001"][0]` · **4:3**
> A 1,500 m² flat land plot just outside Karaköprü, Şanlıurfa: dry reddish soil with sparse wild grass, survey stakes at the corners, frontage on a two-lane asphalt road, a wooden electricity pole line along the road, a water-supply manhole cover at the edge, the city's new apartment blocks visible about 10 km away on the horizon, clear afternoon sky. + STYLE

### 8 · AE-1002 Haliliye köşe parsel (kapak) — `listings["AE-1002"][0]` · **4:3**
> Corner building plot inside an established neighbourhood of Haliliye, Şanlıurfa, fronting two paved streets with kerbs and pavements, levelled soil ready for construction, neighbouring 5–6 storey cream apartment buildings on both sides, street lamps, morning light. + STYLE

### 9 · AE-1003 Eyyübiye yatırımlık arsa (kapak) — `listings["AE-1003"][0]` · **4:3**
> Large open investment plot on the developing edge of Eyyübiye, Şanlıurfa: gently undulating ochre land, a graded gravel road at the front, distant new residential construction cranes on the horizon, soft golden-hour light, wide sky. + STYLE

### 10 · AE-2001 Harran sulu tarla (kapak) — `listings["AE-2001"][0]` · **4:3**
> 18-decare irrigated farm field on the flat Harran plain: lush green cotton rows in perfect lines, a concrete irrigation canal with flowing water at the edge, a dirt farm road, the distant silhouette of beehive-shaped mud-brick houses on the horizon, late-afternoon light. + STYLE

### 11 · AE-2002 Bozova fıstık bahçesi (kapak) — `listings["AE-2002"][0]` · **4:3**
> Mature pistachio orchard in Bozova, Şanlıurfa: evenly spaced pistachio trees with clusters of reddish nuts, dry reddish soil between the rows, a low stone boundary wall, rolling hills in the background, warm summer light. + STYLE

### 12 · AE-2003 Siverek tarım arazisi (kapak) — `listings["AE-2003"][0]` · **4:3**
> Vast 25-decare dry farmland near Siverek, Şanlıurfa: golden harvested wheat stubble on gently sloping land, scattered dark basalt stones typical of the region, a dirt village road, wide open sky with light clouds. + STYLE

### 13 · AE-3001 Karaköprü 3+1 daire (kapak) — `listings["AE-3001"][0]` · **4:3**
> Bright living room of a modern 3+1 apartment in a gated residential complex in Şanlıurfa: large windows with city view, light oak floor, neutral beige sofa, open-plan kitchen with white cabinets in the background, soft afternoon daylight, tidy and staged. + STYLE

### 14 · AE-3002 Haliliye kiralık 2+1 (kapak) — `listings["AE-3002"][0]` · **4:3**
> Clean, well-kept living room of a mid-range 2+1 rental apartment in central Şanlıurfa: light tiled floor, simple grey sofa, white walls, a window with a balcony door, modest but bright and welcoming, daylight. + STYLE

### 15 · AE-3003 Karaköprü 4+1 lüks daire (kapak) — `listings["AE-3003"][0]` · **4:3**
> Spacious luxury 4+1 apartment living room on the 8th floor in Şanlıurfa at dusk: floor-to-ceiling windows overlooking the city lights, high ceiling with indirect lighting, large porcelain floor tiles, elegant cream and walnut furniture, built-in kitchen visible beyond. + STYLE

### 16 · AE-4001 Karaköprü bahçeli müstakil ev (kapak) — `listings["AE-4001"][0]` · **4:3**
> Two-storey detached family house in Karaköprü built with cream Urfa limestone, arched ground-floor windows, a large 600 m² garden with fruit trees, lawn and a stone path, a closed garage door on the side, warm late-afternoon light. + STYLE

### 17 · AE-4002 Eyyübiye avlulu müstakil ev (kapak) — `listings["AE-4002"][0]` · **4:3**
> Renovated single-storey traditional Urfa stone house with an inner courtyard: cut limestone walls, arched doorways, a small fig tree in the courtyard, clean stone paving, soft morning light. + STYLE

### 18 · AE-5001 Haliliye kiralık dükkan (kapak) — `listings["AE-5001"][0]` · **4:3**
> Empty street-front retail shop for rent on a busy avenue in Haliliye, Şanlıurfa: 8 m wide glass shopfront, bright empty interior with white walls and light floor, cream stone building above, wide pavement, daylight. The sign band is blank. + STYLE

### 19 · AE-5002 Karaköprü depo / işyeri (kapak) — `listings["AE-5002"][0]` · **4:3**
> Modern single-storey warehouse with an attached small office near a main road in Karaköprü, Şanlıurfa: high grey steel-clad walls, a tall roller shutter door wide enough for trucks, a concrete yard, clear blue sky. No signage text. + STYLE

---

## B. İsteğe bağlı galeri görselleri (her ilan için +2, toplam 26)

Her ilan için 2. ve 3. görsel. Kapak görselini **referans görsel** olarak ekleyip (image-to-image) aynı yeri farklı açıdan üretin; böylece galeri tutarlı olur. Sıra: ilanın 2. görseli, ardından 3. görseli.

| İlan | 2. görsel | 3. görsel |
| --- | --- | --- |
| AE-1001 | Same plot seen from the road edge, showing the asphalt frontage and electricity poles | Close view of a corner survey stake with the plot and distant city behind |
| AE-1002 | Same corner plot from the opposite street corner | Street-level view of the neighbourhood: school building and shops nearby |
| AE-1003 | Same land from a slightly elevated angle showing its full extent | The gravel access road leading to the plot |
| AE-2001 | Low-angle shot along the irrigation canal beside the field | Wide aerial-style view (drone, 60 m) of the field rectangle |
| AE-2002 | Between two pistachio tree rows, looking down the row | Close-up of pistachio clusters on the branch |
| AE-2003 | Drone view of the large field boundaries | The village road and field entrance |
| AE-3001 | Master bedroom with en-suite bathroom door | Building exterior with the gated garden and playground |
| AE-3002 | Kitchen with white cabinets and a small dining table | Building exterior on a residential street |
| AE-3003 | Large balcony with city view at dusk | Walk-in dressing room with walnut shelving |
| AE-4001 | The garden with fruit trees seen from the house terrace | Interior living room with stone arch details |
| AE-4002 | Inside the courtyard looking toward the arched entrance | Renovated interior room with stone walls |
| AE-5001 | Empty shop interior with storage room door at the back | The avenue with pedestrian traffic (no faces) |
| AE-5002 | Warehouse interior: high ceiling, concrete floor, daylight | Small office inside the warehouse with a window |

Galeri görselleri yoksa ilan sayfasında yalnızca kapak görseli gösterilir.
