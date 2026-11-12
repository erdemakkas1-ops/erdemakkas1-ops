# Lisans durumu doğrulanmış 3D/PBR kaynakları

Ticari müşteri demosu için lisansı belirsiz Instagram/Google/Sketchfab varlıkları doğrudan indirilmesin. İlk tercih **Poly Haven**, kendi açıklamasına göre bütün varlıkları CC0 ve ticari projelerde kullanılabiliyor.

Poly Haven lisans: https://polyhaven.com/license
Poly Haven modeller: https://polyhaven.com/models
Poly Haven materyaller: https://polyhaven.com/textures

Önerilen sayfalar (dokuların bizzat indirilip kurulduğu iddia edilmiyor):
- Parke: https://polyhaven.com/a/wood_floor
- Meşe kaplama: https://polyhaven.com/a/oak_wood_planks
- Koyu ahşap: https://polyhaven.com/a/dark_wood
- Açık duvar: https://polyhaven.com/a/beige_wall_001
- Tekstil: https://polyhaven.com/a/terlenka

Uygulama notları:
- 1K/2K dokularla başla. Albedo + normalGL + roughness ile PBR kur. 8K yüklemekten kaçın.
- UV haritası, tekrar/tiling ve tangent normal uyumluluğu kontrol edilmeli.
- Ahşap parke, sol duvar çıtaları, sağ TV duvarı ve kumaşın görsel ölçeği farklı olmalı.
- `3d/*.glb` dosyaları **renkli blok modeldir**; doku yok. Bunların malzemelerini gerçek PBR ile geliştirmek Claude Code'un görevidir.
- Hazır mobilya için CC0 model varsa bulunur, lisansı ve boyutu kontrol edilir; uygun yoksa sahne içindeki blockout meshleri iyileştirilir. Sahne ölçüleri ve kamera değişmez.
- İlgili bağlantılar indirmeden önce açık ve erişilebilir olmalı.
