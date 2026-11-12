# Ahima Dekorasyon: scroll ile döşenen salon

Boş bir salon, kaydırdıkça **aynı kameradan, aynı odada** parke ve duvar kaplamaları, mobilya ve son dokunuşlarla
tamamlanır. Yukarı kaydırınca film birebir geri sarılır. Ortada geçiş efekti, kesme ya da birbirine benzemeyen
fotoğraflar yok: tek, kesintisiz bir film kare kare scroll'a bağlı.

**Next.js 15 (App Router) · TypeScript · GSAP ScrollTrigger · Canvas 2D kare dizisi**

```bash
npm install
npm run dev                 # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

GitHub Pages (statik export): `PAGES_BASE_PATH=/erdemakkas1-ops/ahima-salon-3d npm run build` → `out/`.

## Film nasıl üretildi

Plan ve promptlar: `docs/higgsfield/PROMPTLAR.txt`.

1. **Gemini, 4 anahtar kare** (`docs/higgsfield/kareler/K0–K3.png`). Her kare bir öncekinin düzenlenmiş hâli
   olduğu için kamera, pencere ve ışık hepsinde aynı:
   K0 boş salon → K1 zemin ve duvar → K2 mobilya → K3 tamamlanmış salon.
2. **Higgsfield, 3 video** (`paket/film/v1–v3.mp4`). Her video bir anahtar kareden başlayıp bir sonrakinde
   bitiyor (V1 K0→K1, V2 K1→K2, V3 K2→K3). Böylece her videonun son karesi bir sonrakinin ilk karesiyle aynı.
3. **Birleştirme:** `scripts/build_film.sh`. Videolar uç uca eklenir. Video modelinin ek yerinde bıraktığı küçük
   netlik ve pozlama farkı 0,3 sn'lik harmanlamayla kapatılır (geometri zaten aynı; görünür bir geçiş değil).
   Çıktı: 20 fps, 288 kare WebP, masaüstü için 1280 px (`public/film/`), telefon için 960 px (`public/film/m/`).

```bash
bash scripts/build_film.sh [fps=20] [quality=78]   # ffmpeg gerekir
```

## Scroll

- Tek GSAP ScrollTrigger, `story.p` (0–1) değerini scrub eder. Kare, telefon kaydırması ve yazılar bu sayının
  saf fonksiyonudur; ileri ve geri kaydırma her zaman aynı kareyi gösterir.
- Akış: 0–0.06 boş salon bekler · 0.06–0.94 film · 0.94–1 tamamlanmış salon ve CTA.
- Kareler kademeli yüklenir. Önce boş salon, sonra filmin tamamına seyrek bir geçiş, ardından aradaki kareler
  gelir. Henüz inmemiş bir kare yerine en yakın inmiş kare gösterilir.
- Telefonda film, header'ın altında geniş bir bant olarak gösterilir. Bant, o an değişen bölgeye yumuşakça kayar:
  sol duvar → TV duvarı → koltuk → halı ve dekor.
- Sağdaki aşama göstergesi tıklanabilir; finalde "Başa sar" düğmesi var. `prefers-reduced-motion` açıkken scrub
  yumuşatması kapanır.

## Dürüstlük notları

- Film **yapay zekâ ile üretilmiş örnek bir yaşam alanıdır**, gerçek bir Ahima projesi değildir. Sayfada
  "Yapay zekâ görselleştirmesi · örnek yaşam alanı" etiketi var.
- Logo (`AHIMA / DEKORASYON` kelime işareti), hizmet kapsamı, projeler ve iletişim bilgileri **yer tutucudur**,
  hiçbiri uydurulmadı. Kontrol listesi: `paket/docs/MUSTERI_ICERIK_KONTROL.md`.
- İlk sürümdeki gerçek zamanlı Three.js / React Three Fiber sahnesi kullanıcı isteğiyle bu filmle değiştirildi;
  kaynağı git geçmişinde duruyor.

## Klasör yapısı

```
app/                    layout (fontlar, metadata), sayfa, global CSS
components/Experience   ScrollTrigger + sticky sahne
components/FilmScrub    kare dizisini canvas'a çizer (kademeli yükleme, telefon kaydırması)
components/Overlay      başlık, aşama açıklamaları, ilerleme göstergesi, final CTA
components/sections/    Hizmetler / Projeler / İletişim / Footer (yer tutucular)
lib/story.ts            ilerleme deposu, aşamalar, zamanlama
public/film/            kare dizisi (+ m/ telefon seti, manifest.json)
scripts/build_film.sh   videolar → kare dizisi
docs/higgsfield/        promptlar, referanslar, anahtar kareler
paket/                  hazırlık paketi + kaynak videolar
```

Ekran görüntüsü testleri için `?shot` parametresi GSAP lag smoothing'i kapatır; normal kullanımda etkisi yoktur.
