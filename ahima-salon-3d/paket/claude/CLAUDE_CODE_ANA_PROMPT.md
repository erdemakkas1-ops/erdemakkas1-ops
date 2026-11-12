# CLAUDE CODE — AHIMA DEKORASYON / TEK SEFERLİK ANA ÜRETİM PROMPTU

Bu mesajdaki talimatlar benim kesin tasarım kararımdır. Sen ana geliştirme ajanısın. **Bu klasördeki dosyaları oku; sıfırdan rastgele başka bir konsept tasarlama.** Başlamadan önce README_ILK_BUNU_OKU.md, `claude/CLAUDE.md`, `docs/SAHNE_VE_ANIMASYON.md`, `docs/TASARIM_SISTEMI.md`, `docs/MALZEME_KAYNAKLARI.md`, `3d/scene_manifest.json` ve ilgili `.glb` dosyalarının varlığını kontrol et. Daha sonra `claude/CLAUDE.md` içeriğini proje kökündeki `CLAUDE.md` olarak kullan.

## Kapsam — nihai hedef

Ahima Dekorasyon için birinci sınıf, yüksek gerçekçilikte sinematik **3D scroll web sitesi** yap. Açılışta içi tamamen boş modern salon görünür. Kullanıcı scroll ettikçe aynı odada sırasıyla parke ve duvar kaplamaları oluşur; koltuk, sehpa, TV ünitesi, koltuklar yerleşir; halı, aksesuar ve aydınlatma tamamlanır; kullanıcı scroll'u geri sardığında her şey düzgünce ilk boş durumuna döner. Bu animasyon tam ekran sabit 3D Canvas üzerinde kesintisiz çalışır. **Bina gösterme, kat planı, başka odaya uçuş, video, GIF, sıradan bir fotoğraf slayt geçişi kullanma.** Referans Reel'deki kalite hissini, kamera disiplinini ve mekân atmosferini yakala; Reel'in Instagram arayüzünü ve eski siteyi kopyalama.

## İşe hazır varlıklar

Aynı dünya koordinatlarında doğrulanmış, açılabilen 3D `.glb` modelleri `3d/` klasöründe. Bunların geometrileri basitleştirilmiş blockout. Bunları atlama ve farklı mekân olarak yeniden üretme; sahneyi bunların üzerine kur. `00_shell` sürekli görünür. `01_surfaces`, `02_furniture`, `03_details` adlandırılmış GLB node'larından animasyonlanır. `all_stages_for_inspection` sadece kontrol için.

AI görselleri `konsept/` klasöründe görsel kalite/moodboard hedefleridir; bu görseller birbirine bağlı 3D model değildir ve `.glb` yerine geçmez. İyi sonuç için PBR materyal, global ortam ışığı, alan ışıkları, contact shadows ve yüksek kaliteli materyallerle bu blockout'u iyileştir. Lisans uygun ve gerçek model gerekirse CC0 kaynakları `docs/MALZEME_KAYNAKLARI.md` içinde. Kullanıcı Blender bilmiyor; modelleme işlemine elle Blender açmasını gerektirme. Yapabildiğin işleri terminal ve kodla yap.

## Teknoloji

Next.js App Router, TypeScript, React, Three.js, @react-three/fiber, @react-three/drei, GSAP, ScrollTrigger. Package sürümlerinde proje ortamıyla uyumluluğu kontrol et. Tek Canvas, controlled camera, GSAP scroll progress; gerektiğinde drei Environment, ContactShadows. Scroll 3D hikâyesi için 400–500svh pinli bir section düşün; scroll normalize `0..1`. Canvas'ın kendisi `100svh` ve sayfa kaydırılırken sabit. DOM overlay CTA/navigasyon gerçek tıklanabilir HTML. WebGL canvas SSR güvenliği için client boundary kur.

## Zaman çizelgesi

- progress 0–0.12: sadece `00_shell`; BOŞ EV.
- 0.12–0.36: parkeler ve duvarlar `01_surfaces`, sırayla.
- 0.30–0.76: `02_furniture` içinde mobilyaların doğal düşük mesafeli yerleşmesi.
- 0.70–0.94: `03_details` halı, yastık, bitki, kitaplar, sarkıt, led. Işıklar açılır.
- 0.94–1: tamamlanmış salon, küçük kamera düzeltmesi, final CTA.

Aşamalar kısa overlap'lerle örtüşür. **Tek mekân, tek animasyon akışı.** Obje son transformlarını bozmadan başlangıç transformları oluştur. `useRef`, GSAP context ve cleanup doğru kullan. Tweenler yeniden tetiklenirken karışıklık olmasın. Koltukları gökten düşürme; gerçekçi easing ve metre ölçekli kısa hareketler kullan. `ScrollTrigger` seek geri doğru çalışmalı, çünkü kullanıcı en çok dönüşümü geri sarıp kıyaslamak isteyecek.

## Kamera

Başlangıç pos `(0,2.15,7.7)` lookAt `(0,1.4,-.35)`, tam oda görünür. Çok yavaş ±0.4m kamera dolanması; agresif zoom/rotasyon yok. Kamera durağan iken aynı oda sürekli kadrajda. Mobilde pozisyonu ve FOV'u responsively uyarlayabilirsin. Ref dosyası `docs/SAHNE_VE_ANIMASYON.md` ayrıntıları kapsar.

## Görsel tasarım

Warm Minimal Luxury. Koyu espresso `#231E1A`, altın `#CDA66E`, fildişi `#EEE8DF`, ceviz/meşe/traverten/krem kumaş. Açılış başlığı **'Mekân, sizinle anlam kazanır.'** Alt metin **'Boş bir alandan kendinize ait bir dünyaya.'** Logo metni geçici `AHIMA DEKORASYON`. Header minimal, CTA üstte, küçük scrolldown indicator, sağda dört aşama progress. Sitenin 3D dışı bölümünde gerçek içerik gelene kadar placeholder kullan. Ana öykü 3D'nin kendisi olmalı; gereksiz yüzlerce dekoratif kart yok.

## Kalite ve dürüstlük

- İlk aşamada işleyen, aynı koordinattaki 3D dönüşümü göster; ardından gerçek PBR/ışık kalitesini yükselt.
- Geometri kalitesinin daha ileri mobilya modellemesi gerektirdiğini açıkça belirt; düşük poligon blockout'u bitmiş fotogerçekçilik diye sunma.
- Poly Haven gibi kanıtlanabilir CC0 kaynakları öncele; lisansı doğrulanmayan görselleri iş sahibinin projesi diye kullanma.
- Higgsfield/imagegen konseptlerini yalnızca atmosfer rehberi olarak kullan. Tek tek resimleri kesip otomatik geçiş gibi gösterme.
- Performans hedefleri cihazla test edilir: masaüstünde 60 fps hedef, mobilde 30 fps hedef, kesin garanti değil. DPR 1–2 aralığında dinamik ayarla, doku sıkıştırması ve asset lazy load düşün.
- Prefers-reduced-motion ve WebGL fallback hazırla.
- SEO/metadata ve WhatsApp linki gerçek bilgi gelmeden uydurma.

## Uygulama sırası (soru sormadan devam et)

1. Proje dosyalarını incele; GLB'lerin adlandırılmış node'larını kontrol et; kurulum.
2. Çalışır Next.js site iskeleti + Canvas, orijinde 4 stage GLB.
3. Scroll timeline + ters yön animasyonları + kamera.
4. PBR dokular/ışık/gölge/temel model iyileştirmesi; görsel referans atmosferine yaklaş.
5. Kurumsal tipografi, minimal navbar, progress ve CTA.
6. Responsive/fallback/performance ve kalite kontrolleri.
7. `npm run build` doğrulaması, gerekiyorsa `npm run lint`; hata varsa çöz.
8. Tam kaynak proje, proje README, deneme görüntüsü ve mümkünse kullanıcı onayından sonra Vercel preview.

## Teslim kriterleri

- Boş salon ilk karede açıkça görünür.
- Model tüm aşamalarda aynı pencereli tek odadır.
- Yukarı/aşağı scroll görsel olarak bire bir geri/ileri işliyor.
- Mobilyalar gerçek WebGL 3D mesh, video/katmanlı görsel değil.
- Dolu hal gece/gündüz gösterimi opsiyonel; ana hikâye boş→dolu.
- Telefon, ürün, hizmet, tecrübe, portföy gibi müşteri verileri doğrulanmamışsa placeholder etiketli.
- Klasör yapısı, kod, kurulum açıklaması, mobil optimizasyon ve çalışır build var.

**Başla. İlk döngüde işleyen 3D akışı kur ve derleme hatalarını bitir; ekran görüntülerinden bağımsız, gerçek dönüşümlü sahne oluştur.**
