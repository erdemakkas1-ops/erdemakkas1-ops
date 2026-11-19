# Gemini görselleri – sinematik sahneler için

**Durum (Aşama 2): 4 onaylı görsel entegre edildi.** Hepsi temsilîdir; sitede gerçek müşteri işi olarak sunulmaz.

| Slot (`media.ts`) | Dosya (`public/images/cinema/`) | Kaynak | Kullanıldığı yer |
| --- | --- | --- | --- |
| `heroMachine` | `hero-baski-makinesi-{960,1600,2400}.avif/.webp` | Görsel 01 – Hero | Açılış sahnesi (öncelikli yükleme) |
| `mechanical` | `sistem-mekanik-tahrik-{960,1600,2400}` | Görsel 02 – Mekanik | Mekanik kamera turu |
| `electrical` | `sistem-elektrik-pano-{960,1600}` | Görsel 03 – PLC panosu (kaynak 1672 px) | PLC ve otomasyon kamera turu |
| `service` | `servis-mudahale-{960,1600,2400}` | Görsel 04 – Saha teknisyeni | Sahada müdahale bölümü |

Görsel değiştirilirse: `python3 scripts/optimize-images.py <kaynak> public/images/cinema/<ad>` ve
`src/data/tours.ts` içindeki odak (`focus`) ve etiket (`hotspots`) koordinatlarını yeni görsele göre güncelleyin.
Eksik dosya yok.

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

Dosyaları `public/images/cinema/` klasörüne koyun, sonra `python3 scripts/optimize-images.py <kaynak> <hedef-ad>`
çalıştırın (960/1600/2400 genişlikte `.avif` + `.webp` üretir). Ardından `src/data/media.ts` içinde ilgili slotun `file` değerini
`/images/cinema/<dosya-adı>` yapın ve `position` (odak noktası) değerini ayarlayın. Görsel üzerindeki etiketlerin
konumları (`data/tours.ts` → `focus`, `hotspots`) yeni görsele göre yüzde olarak güncellenmelidir.

Yeniden üretim gerekirse kullanılabilecek tanımlar ve istemler:

| Slot (`media.ts`) | Dosya adı | Sahne | Ne görünmeli |
| --- | --- | --- | --- |
| `heroMachine` | `hero-baski-makinesi` | 1 – Açılış, yakınlaşma | Büyük, çok üniteli tabaka ofset baskı makinesi, fabrika salonunda; yan çerçeveler, silindirler, rulman yatakları |
| `electrical` | `sistem-elektrik-pano` | 2 – Elektrik ve kontrol | Kapağı açık endüstriyel elektrik panosu: kontaktörler, sigortalar, klemens sıraları, düzenli kablo kanalları |
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
