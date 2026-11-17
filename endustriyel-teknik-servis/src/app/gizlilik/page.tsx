import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { business, displayName } from '@/data/site';

export const metadata = pageMetadata({
  title: 'Gizlilik ve KVKK Bilgilendirmesi',
  description: 'Servis talep formu ve web sitesi kullanımı sırasında kişisel verilerin işlenmesine ilişkin bilgilendirme.',
  path: '/gizlilik',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Gizlilik ve KVKK', path: '/gizlilik' }]}
        eyebrow="Yasal bilgilendirme"
        title="Gizlilik ve KVKK"
        lead="Bu sayfa, web sitesinin kişisel verilerle nasıl ilişki kurduğunu sade bir dille açıklar."
      />
      <section className="bg-surface py-16 text-ink sm:py-24">
        <div className="container-x">
          <div className="max-w-3xl space-y-10 text-[1.02rem] leading-relaxed text-ink-text/85">
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase text-ink">Servis talep formu</h2>
              <p className="mt-3">
                Arıza bildirim formuna girdiğiniz bilgiler (makine markası ve modeli, arıza türü ve açıklaması, il/ilçe ve
                isteğe bağlı iletişim adı) bu web sitesinin sunucularına gönderilmez ve saklanmaz. Bilgiler yalnızca
                tarayıcınızda bir mesaj metnine dönüştürülür.
              </p>
              <p className="mt-3">
                Mesaj WhatsApp üzerinden iletilecekse, WhatsApp uygulaması sizin onayınızla açılır ve mesajı göndermek
                tamamen sizin kararınızdır. Gönderilen mesajlar WhatsApp’ın kendi gizlilik koşullarına tabidir.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase text-ink">Çerezler ve takip</h2>
              <p className="mt-3">
                Bu web sitesi reklam veya takip amaçlı çerez kullanmaz. Barındırma altyapısı, güvenlik ve hizmetin
                sürekliliği amacıyla standart sunucu kayıtları (ör. IP adresi, istek zamanı) tutabilir.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase text-ink">Veri sorumlusu ve başvuru</h2>
              <p className="mt-3">
                WhatsApp, telefon veya e-posta yoluyla doğrudan paylaştığınız bilgiler; yalnızca servis talebinizin
                değerlendirilmesi ve sizinle iletişim kurulması amacıyla kullanılır.
                {business.name
                  ? ` Veri sorumlusu: ${business.name}.`
                  : ` Veri sorumlusunun unvan ve iletişim bilgileri, işletme bilgileri tanımlandığında bu sayfada yer alacaktır.`}
                {business.email ? ` KVKK kapsamındaki başvurularınızı ${business.email} adresine iletebilirsiniz.` : ''}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase text-ink">Marka bilgilendirmesi</h2>
              <p className="mt-3">
                BOBST ve manroland ilgili hak sahiplerinin markalarıdır. {displayName}, bu üreticilerin yetkili servisi,
                resmî temsilcisi, distribütörü veya iş ortağı değildir; marka isimleri yalnızca hizmet verilen makine
                türlerini tanımlamak için kullanılır.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
