# AHIMA — Sahne yönetmenliği ve scroll hareket tasarımı

## Tek cümlelik kreatif fikir

**'Hayal ettiğiniz yaşam alanı, gözlerinizin önünde şekilleniyor.'** Boş salon tek bir sabit dünyada tamamlanır. Film değil; geri sarılabilen gerçek 3D dönüşüm.

## Açılış (desktop)

- 100svh tam ekran tek salon: pencere, doğal gün ışığı, boş ve yalın yüzeyler.
- Sol altta veya köşede küçük `AHIMA DEKORASYON` yazı logosu, başlık **'Mekân, sizinle anlam kazanır.'** ve alt satır **'Boş bir alandan kendinize ait bir dünyaya.'**
- Üstte minimal navigasyon: Projeler / Hizmetler / İletişim (doğrulanmamış sayfalara link oluşturma, ilk demoda anasayfa anchor'ları kullan).
- Altta ince dikey scroll progress; sağda süreç isimleri: BOŞ / YÜZEYLER / MOBİLYALAR / SON DOKUNUŞ.
- İlk ekranda son hâl görünmemeli; oda gerçekten boş olmalı.

## Bir scroll hikâyesi (birbirinden kopuk 4 fotoğraf değil)

| Normalize scroll | Dönüşüm | Yönetmenlik |
|---|---|---|
| 0.00–0.12 | Boş oda | Kamerayı hafif ileri taşı, hiçbir dekoratif öğe yok |
| 0.12–0.36 | Mimari yüzeyler | Ham zeminin üstüne ahşap zemin, duvar panelleri ve traverten detaylar oturur |
| 0.30–0.76 | Mobilyalar | Koltuk zemine kayarak yerleşir; masalar, koltuklar ve TV ünitesi yumuşak stagger ile gelir |
| 0.70–0.94 | Yaşanmışlık | Halı, yastık, kitaplar, bitkiler ve sarkıtlar tamamlanır; cove ışıklar yumuşakça açılır |
| 0.94–1.00 | Final | Kamera hafif geri/sağa kayar ve tam salonu gösterir; CTA görünür |

Not: Bu zaman aralıkları hafif overlap içerir; kasıtlı olarak aşamalar aynı dünyada birbirine akmalıdır.

## Sahneye giriş/çıkış formülü

- Eşyaların son konumları GLB'deki mutlak pozisyonlarıdır. `userData.finalPosition = node.position.clone()`.
- Başlangıç için: mobilyalarda z ekseninde +0.30–0.75m, y ekseninde 0.10–0.25m ve görünürlük 0; bitişte orijinal transform + görünürlük 1. Büyük, fizik dışı sıçramalar yok.
- Paneller için dönüşüm `scale.y` + gizli ilk aşama; zemin için parça-parça reveal veya dissolve yerine mekânda tutarlı, yüzeyin üzerinde süzülen mask.
- GLB içindeki bir nesne, yanlışlıkla görünmez olsa dahi kullanıcı yukarı scroll ile tamamını geri çevirebilmeli.
- Opak meshlerin opacity değişiminde `transparent=true`, depthWrite ve sorting artefaktlarına dikkat.
- Tek bir GSAP ScrollTrigger timeline `scrub` ile kamera ve reveal değerlerini sürmeli. Her frame'de yeni `ScrollTrigger` yaratılmamalı.
- Kullanıcı scroll'u hızlı veya ters yönde kullandığında objeler çakışmamalı ve konumları drift yapmamalı.

## İstenen kamera yolu

Başlangıç `[0,2.15,7.7]`, hedef `[0,1.4,-0.35]`.

- %0–20: `[0,2.15,7.7]` → `[0,2.10,7.35]`.
- %20–65: `[0,2.10,7.35]` → `[0.22,2.05,6.9]`.
- %65–100: `[0.22,2.05,6.9]` → `[-0.12,1.98,7.22]`.
- `lookAt` hareketini paralel ease ile uygula; agresif dönme, drone efekti, kesme veya kat planı yok.
- `FOV` başlangıçta 45–50 derece, görüntüleme alanına göre adaptif; mobilya viewport dışına taşarsa hafif uzaklaş.

## Performans kabul kriterleri

- Masaüstünde stabil render hissi hedefi; 60 fps hedef ama gerçek ölçümden önce garanti verme.
- Mobilde piksel oranı ve doku çözünürlüğü uyarlanmalı; en azından anlaşılır bir 3D hikâye, gerekiyorsa aynı odanın performans-dostu daha sade sürümü.
- Canvas oluşmadan önce poster olarak `konsept/01_salon_fotogercekci_hedef.png` GÖSTERME (dolu odayı açılışta gösterip boş oda kuralını bozar). İlk gerçek boş ekran hazır olana kadar düz arka plan/placeholder kullanılabilir.
- `prefers-reduced-motion` açık olduğunda animasyonu sadeleştir; son hâl veya kullanıcının kontrollü geçişi için alternatif sun.
- WebGL desteklenmiyorsa 3D animasyonun olmaması düzgün ve erişilebilir hata/fallback metni ile yönetilsin.

## Sonraki bölümler

Tek scroll sahnesi tamamlandıktan sonra sadece gerçek hizmetlere/projelere ait içerik alanı, bir CTA ve iletişim bölümü. Kurgu dışındaki alakasız animasyonlar yok.
