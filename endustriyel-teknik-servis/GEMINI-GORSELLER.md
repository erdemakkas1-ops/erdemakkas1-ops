# Gemini görselleri – sinematik sahneler için

Ana sayfadaki üç sahne fotoğraf tabanlıdır. Şu an elimizdeki 3 gerçek fotoğraf (baskı silindirleri, elektrik panosu,
motor-redüktör) temsilî olarak kullanılıyor. Aşağıdaki görseller Gemini ile üretildiğinde tek satırla değiştirilir.

## Kurallar (her görsel için)

- **Fotogerçekçi**, gerçek bir fabrikada çekilmiş belgesel fotoğraf hissi: doğal ışık + endüstriyel tavan ışıkları,
  hafif toz, kullanılmış ama bakımlı makine yüzeyleri, gerçek kablo ve hortum karmaşası.
- **Logo, marka adı, model yazısı, okunabilir etiket YOK.** Görsel BOBST veya manroland gibi gösterilmemeli.
- Oyuncak / plastik / 3D render / bilim kurgu görünümü YOK; aşırı parlak, aşırı doygun renk YOK.
- İnsan varsa yüzü seçilmesin (arkadan, yandan veya eller); KKD kullansın (eldiven, iş kıyafeti).
- Palet sitenin renkleriyle uyumlu: antrasit, çelik grisi, titanyum; tek vurgu sıcak amber ışık olabilir.
- Sol taraf metin içindir: kompozisyonun **sol %40'ı sakin** (koyu zemin, odak dışı), ana konu sağ yarıda.
- Çözünürlük: en az **2400×1350 (16:9)**. Mobilde aynı görselin sağ-orta bölümü kırpılarak kullanılır.

## Dosyalar

Dosyaları `public/images/cinema/` klasörüne koyun, sonra `python3 scripts/optimize-images.py public/images/cinema/*.png`
çalıştırın (aynı adla `.avif` + `.webp` üretir). Ardından `src/data/media.ts` içinde ilgili slotun `file` değerini
`/images/cinema/<dosya-adı>` yapın ve `position` (odak noktası) değerini ayarlayın. Görsel üzerindeki etiketlerin
konumları (`heroHotspots`, `data/systems.ts` → `hotspots`) yeni görsele göre yüzde olarak güncellenmelidir.

| Slot (`media.ts`) | Dosya adı | Sahne | Ne görünmeli |
| --- | --- | --- | --- |
| `heroMachine` | `hero-baski-makinesi` | 1 – Açılış, yakınlaşma | Büyük, çok üniteli tabaka ofset baskı makinesi, fabrika salonunda; yan çerçeveler, silindirler, rulman yatakları |
| `electrical` | `sistem-elektrik-pano` | 2 – Elektrik ve kontrol | Kapağı açık endüstriyel elektrik panosu: kontaktörler, sigortalar, klemens sıraları, düzenli kablo kanalları |
| `plc` | `sistem-plc` | 2 – PLC | PLC rafı ve giriş/çıkış modüllerinin yakın planı, LED'ler, numaralı kablolar (okunamaz) |
| `servo` | `sistem-servo-surucu` | 2 – Sürücü ve servo | Panoda yan yana servo sürücüler ve küçük ekranları; arka planda servo motor kabloları |
| `mechanical` | `sistem-mekanik-tahrik` | 2 – Mekanik aktarma | Servo motor + redüktör, kaplin, dişli/kayış, rulman yatağı; makine gövdesine bağlı |
| `service` | `servis-mudahale` | 3 – Servis ve müdahale | Teknisyen elleri: makine yanında multimetre/pens ampermetre ile ölçüm, açık pano veya yatak bölgesi; arkada büyük makine |

## İstem (prompt) örnekleri

**hero-baski-makinesi**
> Documentary photograph of a large multi-unit sheetfed offset printing press in a real industrial print factory,
> three-quarter view from the operator side, heavy cast-iron side frames painted light grey, polished steel cylinders and
> bearing housings, hydraulic hoses, subtle dust, overhead industrial lighting with one warm amber accent light, shallow
> depth of field, the left 40% of the frame is a calm dark out-of-focus factory floor, 35mm lens, f/2.8, natural color,
> no logos, no brand names, no readable text, photorealistic, 16:9

**sistem-elektrik-pano**
> Photorealistic close photograph of an open industrial electrical control cabinet in a factory, rows of contactors, motor
> protection breakers, fuses and terminal blocks on DIN rails, neatly routed grey cable ducts, soft daylight from the left,
> realistic wear, no logos, no readable labels, left 40% calm and dark, 16:9

**sistem-plc**
> Macro photograph of a PLC rack with input/output modules inside an industrial cabinet, status LEDs glowing green and
> amber, numbered wire markers (not readable), shallow depth of field, realistic metal and plastic textures, no logos, 16:9

**sistem-servo-surucu**
> Photorealistic photograph of several servo drives mounted side by side in an industrial control cabinet, small status
> displays, shielded motor and encoder cables, technician-grade realism, no brand names, no readable text, 16:9

**sistem-mekanik-tahrik**
> Photorealistic photograph of an industrial servo motor with a gearbox mounted on a machine frame, coupling, bearing
> housing and linear guide rail, cable chain, factory background out of focus, realistic oil traces and wear,
> no logos, 16:9

**servis-mudahale**
> Documentary photograph of a technician's gloved hands measuring with a clamp meter at an open machine control cabinet
> next to a large printing press, face not visible, work clothes, factory lighting, warm amber accent light, realistic,
> no logos, no readable text, left 40% calm, 16:9

Not: Görseller temsilîdir; sitede gerçek bir müşteri işi gibi sunulmaz. Gerçek iş fotoğrafları gelince
`src/data/projects.ts` üzerinden "Çalışmalarımız" bölümüne eklenir.
