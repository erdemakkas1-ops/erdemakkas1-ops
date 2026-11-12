# AHIMA DEKORASYON — Claude Code öncesi hazırlanmış proje paketi

**Hazırlık durumu:** Tasarım stratejisi + referans çözümleme + özgün konsept görselleri + Blender gerektirmeyen, programatik üretilmiş, doğrulanmış GLB sahneleri + teknik şartname + Claude Code ana promptu hazır.

**Önemli:** Bu paket, bitmiş web sitesi veya son kalite mimari 3D model değildir. `3d/*.glb` dosyaları aynı mekâna oturan gerçek üç boyutlu *blockout/prototip* modellerdir. Malzeme/ışık iyileştirmesi ve web kodlaması Claude Code aşamasındadır. `konsept/*.png` görselleri yapay zekâ ile oluşturulmuş konsepttir; gerçek müşteri portföyü değildir. Otomatik görsel üretimi birebir geometrik tutarlılık garantilemez; sitenin gerçek dönüşümü GLB sahnelerine dayanmalıdır.

## Karar verilen ana deneyim

Web sitesi **boş bir salonla** başlar; bina cephesi, 3D kat seçme, dışarıdan eve uçuş, video, slayt geçişi, oyunlaştırılmış menü yok. Scroll tek bir odanın fiziksel dönüşümünü kontrol eder: **boş oda → parke/duvar/kaplama → mobilya → dekoratif detay/aydınlatma → tamamlanmış salon**. Kullanıcı yukarı scroll yaptığında aynı öğeler geriye doğru çözülür. Tamamlanan sahnenin altından Ahima'nın gerçek hizmet ve projeleri ile iletişim bölümü gelir.

## Klasör yapısı

- `referans/`: kullanıcının gönderdiği 15,8 saniyelik Reels ekran kaydından çıkarılmış dahili referans kareleri ve özet.
- `konsept/`: AI ile üretilmiş üç özgün görsel (hedef salon, site arayüzü, görsel tasarım paftası).
- `3d/`: dört aşamalı `.glb` gerçek 3D model seti; `all_stages_for_inspection.glb` ve `build_room.py` kaynak dosyası.
- `preview/3d_mekan_plani.png`: odanın gerçek sahne koordinatlarına dayalı üstten yerleşim diyagramı.
- `docs/`: storyboard, marka dili, malzeme, güvenilir kaynaklar, animasyon, test ve teslim koşulları.
- `claude/CLAUDE_CODE_ANA_PROMPT.md`: Claude Code'a doğrudan verilecek ana görev.
- `claude/CLAUDE.md`: Claude'un projede referans alacağı kalıcı çalışma ilkeleri.

## Başlatma — yapman gereken tek şey

1. ZIP'i bilgisayarına çıkar.
2. İçindeki **`claude/CLAUDE_CODE_ANA_PROMPT.md`** dosyasının TAMAMINI Claude Code'a gönder. Aynı mesajda bu klasörün yolunu belirt ve dosyaları okuyarak çalışmasını iste.
3. Claude Code'u bu ZIP'ten çıkarılmış klasörde açarsan var olan `3d/*.glb` ve `konsept/*.png` dosyalarını okuyabilir. `claude/CLAUDE.md` dosyası proje kökündeki `CLAUDE.md` olarak kopyalanmalıdır.
4. Müşteriden gelen gerçek logo, telefon, hizmet listesi ve proje fotoğrafları mevcutsa sonra paylaş. Şimdi herhangi birini uydurma.

## Kullanım sınırları

- Videodaki IG overlay'i, 'Client Paid $4,650' yazısı ve orijinal site görselleri müşteriye hazırlanan üründe gösterilmez.
- Ahima Dekorasyon'un resmi logosu, sektörüyle ilgili kesin hizmet listesi ve iletişim bilgileri doğrulanmadı. Konseptteki logotype ve slogan **taslak**tır.
- Başka firmaların proje fotoğrafları 'Ahima'nın yaptığı işler' diye paylaşılmaz.
- Üretilen 3D GLB'ler elle Blender açılmasını gerektirmez.
- Gerçekçi sonuç için kaliteli, ticari lisansı uygun PBR kaplamalar ve mümkünse mobilya modelleriyle iyileştirme gerekir. Kaynak seçimi `docs/MALZEME_KAYNAKLARI.md` dosyasındadır.

## 3D sahne koordinatları

- glTF/Three.js yön sistemi **+Y yukarı**; birimler metre.
- Oda: 8.4m (X) × 3.15m (Y) × 6.4m (Z).
- Başlangıç kamera: `[0, 2.15, 7.7]`, hedef `[0, 1.4, -0.35]`.
- Kamera önden (-Z yönünde), panoramik cam arka duvarda `z≈-3.1`.
- Tüm 4 GLB aynı orijinden `position={[0,0,0]}` eklenmeli.
- `00_shell.glb`: ham boş oda. `01_surfaces.glb`: parke ve duvar kaplaması. `02_furniture.glb`: koltuk/sehpa/TV/koltuklar. `03_details.glb`: tekstil, bitki, lambalar, dekorasyon.
- Her GLB içindeki düğüm adları, animasyon için özel olarak verilmiştir.

## Tanımlar

'Gerçek 3D blockout': kamerayla dolaşılabilen, metrik ölçülü fakat sade geometrili sahne. 'Fotogerçekçi görsel': AI görsel örneği. Bu iki dosya türü birbirinin yerini tutmaz. Claude Code nihai deneyimi geliştirecektir.
