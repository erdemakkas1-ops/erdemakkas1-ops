# HALO — Orbit Sneaker Store

Havada süzülen ayakkabılarla interaktif sneaker mağazası demosu. Saf HTML/CSS/JS, kurulum gerektirmez.

## GitHub Pages'te yayınlama
Bu klasör, `.github/workflows/pages.yml` iş akışıyla otomatik yayınlanır:
1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions** seç.
2. Değişiklikleri `main` dalına birleştir (veya **Actions → Deploy HALO Store to GitHub Pages → Run workflow**).
3. Site şu adreste açılır: `https://erdemakkas1-ops.github.io/erdemakkas1-ops/`

## Yerelde açmak
`index.html` dosyasına çift tıkla ya da klasörde `python3 -m http.server` çalıştırıp `http://localhost:8000` adresine git.

## Ürünleri düzenleme
`index.html` içinde `const SHOES=[...]` dizisinde isim, fiyat, stokta olmayan numaralar (`out`) ve açıklama; `const SPECS=[...]` içinde ürün özellikleri var. Görseller `img/` klasöründe (arka planı şeffaf `.webp`).

> Not: Görseller demo amaçlıdır; ticari kullanımda kendi ürün fotoğraflarını kullan.
