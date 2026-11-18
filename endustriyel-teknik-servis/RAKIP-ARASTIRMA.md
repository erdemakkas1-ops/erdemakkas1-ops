# Sektör araştırması: bağımsız baskı/ambalaj makinesi servis siteleri

Tarih: 18 Kasım 2026. Amaç: şahıs olarak (veya çok küçük ekiple) baskı ve ambalaj makinelerine teknik servis
veren kişilerin sitelerini incelemek, sitemizi bu sınıfın üstüne çıkarmak. Üst sınır olarak üreticinin
(BOBST) kendi saha servisi sayfası da incelendi.

## İncelenen siteler

| Site | Kim | Öne çıkan |
| --- | --- | --- |
| printingpressservice.com (Press Mechanic) | ABD, tek kişi | Ustanın adı; "35 yıl deneyim; Miller'da 7, Man Roland'da 7, Heidelberg'de 5 yıl fabrika eğitimli servis teknisyeni, 2002'den beri bağımsız"; elektrik + mekanik; telefon en üstte; adres ve çalışma saatleri |
| heidelbergservice.com | ABD, bağımsız mekanik ağı | Tek tek sayılan modeller (S, SBG, SBB, SBD, Windmill, Speedmaster…); açıklamalı gerçek iş fotoğrafları ("SBD, baskı krikosu değişimi sırasında"); "Heidelberg AG ile bağlantılı değildir" notu |
| Üzeyir Usta (Facebook grubu) | Türkiye, tek kişi | Kendini adıyla tanıtıyor; BOBST düz kesim ve folyo makinelerinde tamir, bakım, eğitim, ekspertiz |
| rtmmakina.com | Türkiye, küçük firma | Uzun marka listeleri, "15 yıl tecrübe", blog; doğrulanmamış "7/24" vaadi |
| karttamiri.com.tr | Türkiye, kart tamiri | Marka bazlı sayfalar (ör. "Manroland baskı makinesi kart tamiri"): sık arızalar, süreç, sonuç – arama motoru trafiği için |
| cmserviceitalia.it | İtalya, küçük firma | Yalnızca BOBST platin kesim / flekso revizyonu; uzmanlaşma, video, garanti süresi |
| bobst.com – Field Maintenance Service | Üretici | Servis türlerinin dökümü (acil onarım, önleyici bakım, danışmanlık, taşıma-kurulum, eğitim), uzaktan destek, "talep tipi" seçilen form, bakım programı aboneliği, rakamlarla performans |

## Ortak bulgular

1. **Güven kişiden gelir.** Bağımsız ustaların sitelerinin teknik kalitesi düşük (hazır şablon), ama hepsi ad,
   deneyim yılı, üretici servisindeki geçmiş ve gerçek iş fotoğrafıyla güven kuruyor.
2. **Model bazlı dil.** "Heidelberg tamiri" yerine "SBD, Windmill, Speedmaster" – müşteri kendi makinesini görmek istiyor.
3. **Ulaşılabilirlik.** Telefon numarası her sayfanın en üstünde; çalışma saatleri açık.
4. **Marka bağımsızlığı notu** iyi örneklerde mutlaka var.
5. **Arama motoru içeriği.** Türk firmaları marka bazlı sayfa ve blogla trafik topluyor; içerik çoğunlukla jenerik.
6. **Üretici standardı.** Talep tipine göre ayrışan form, uzaktan ön değerlendirme, önleyici bakım programı.

## Sitemize uygulananlar (bu tur)

- **Marka sayfaları:** `/makineler/bobst`, `/makineler/manroland` – teyit edilen modeller (Novacut, Expertcut,
  Mastercut; ROLAND 700, ROLAND 900), model bazlı "arıza bildir" bağlantısı (form marka ve modelle dolu açılır),
  makinenin ana grupları (bildirimde bölüm belirtmeyi kolaylaştırır), ilgili hizmetler, bağımsızlık notu.
- **Teknik rehber:** `/rehber` + 3 özgün yazı (arıza bildirimi, sürücü hata kodu, planlı bakım), Article JSON-LD,
  her yazıda iş güvenliği notu. Ana sayfada rehber bölümü.
- **Form:** "Makinenin durumu" (Makine durdu / Çalışıyor, sorun var / Planlı bakım) – önceliklendirme içindir,
  müdahale süresi vaadi değildir; WhatsApp mesajına "Durum" satırı olarak eklenir.
- **Telefon başlıkta:** numara girildiğinde masaüstü başlıkta görünür (veri yokken gizli).
- Görsel tutarlılık: eski turuncu kalıntıları (çizimler, ikon, paylaşım görseli) bakır palete çevrildi.

## Bilinçli olarak yapılmayanlar

- Deneyim yılı, üretici geçmişi, sertifika, referans, müşteri yorumu, "7/24", "%95 ilk ziyarette çözüm" gibi
  rakamlar: doğrulanmadan yazılmadı.
- Üretici logoları ve fotoğrafları kullanılmadı.

## Bu sınıfa çıkmak için işletme sahibinden gerekenler (öncelik sırasıyla)

1. **Ad, fotoğraf ve geçmiş** – rakip sitelerin tamamında en güçlü unsur. Örn. "X yıl Y firmasında servis
   teknisyeni, 20XX'ten beri bağımsız" (yalnızca gerçekse).
2. **Telefon / WhatsApp ve çalışma saatleri.**
3. **Açıklamalı gerçek iş fotoğrafları** (müşteri izniyle): "Expertcut, pense zinciri gerginlik ayarı" gibi.
4. **Hizmet bölgesi.**
5. Teyit gereken olası hizmetler (sitede şu an YOK): uzaktan (video) ön değerlendirme, makine söküm-taşıma-kurulum,
   operatör/bakım ekibi eğitimi, yıllık bakım anlaşması, acil müdahale. Hangileri gerçekten veriliyorsa eklenebilir.
6. Referans verilebilecek müşteriler (izinli) ve varsa yorumları.
