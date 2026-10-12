# Oha Burger — Web Sitesi

İzmir Şemikler / Karşıyaka'daki **Oha Burger** için scroll ile çalışan tek sayfalık tanıtım sitesi.

## Bölümler (hepsi scroll ile animasyonlu)
1. **Hero** — "İzmir'in En Oha'sı", burger kaydırdıkça büyür
2. **Katman Katman** — Oha Burger kaydırdıkça katmanlarına ayrılır (ekmek, sos, soğan, cheddar, biftek, köfte)
3. **Gamer Kova** — kutu açılır, patates / burger / içecek / tender fırlar
4. **Çıtır Çıtır** — kayan marka bandı ve kayan yazılar
5. **Kadro** — öne çıkan ürün kartları
6. **Menü** — tüm menü yatay kaydırmalı (Yemeksepeti liste fiyatları)
7. **Siparişe Özel** — parallax ürünler + sipariş butonları
8. **Bizi Bul** — adres, telefon, harita

## Çalıştırma
Build gerekmez. `index.html` dosyasını tarayıcıda açmak yeterli
(ya da `npx serve oha-burger`). GSAP 3.12.5, ScrollTrigger ve Lenis `vendor/` klasöründe.

## Güncellenecekler
- Menü ve fiyatlar `js/main.js` içindeki `MENU` listesinde (kaynak: Yemeksepeti "Oha Buger" sayfası).
- Görseller şu an SVG illüstrasyon; gerçek ürün fotoğrafları eklenebilir.
