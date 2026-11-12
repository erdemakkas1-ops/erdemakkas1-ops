/**
 * Content below the scroll film. Nothing here is invented: services, projects and contact details are
 * clearly marked placeholders until Ahima confirms them (see paket/docs/MUSTERI_ICERIK_KONTROL.md).
 */

const DEMO_AREAS = [
  {
    no: '01',
    title: 'Zemin & duvar kaplamaları',
    text: 'Parke, ahşap çıtalı duvar paneli, doğal taş görünümlü TV duvarı ve asma tavan detayları.',
  },
  {
    no: '02',
    title: 'Mobilya seçimi & yerleşim',
    text: 'Mekânın ölçüsüne göre oturma grubu, sehpa, berjer ve TV ünitesi yerleşimi.',
  },
  {
    no: '03',
    title: 'Aydınlatma & son dokunuş',
    text: 'Gizli LED, sarkıt aydınlatma, tekstil, halı, bitki ve aksesuar seçimi.',
  },
];

export function Services() {
  return (
    <section id="hizmetler" className="section">
      <div className="section__head">
        <p className="eyebrow">
          <span className="eyebrow__rule" /> Hizmetler
        </p>
        <h2>Boş bir alandan, size ait bir yaşam alanına.</h2>
        <p className="section__lead">
          Yukarıdaki dönüşümde gösterilen uygulama alanları. Kesin hizmet listesi firma tarafından onaylandıktan sonra
          güncellenecektir.
        </p>
      </div>
      <ol className="areas">
        {DEMO_AREAS.map((a) => (
          <li key={a.no} className="area">
            <span className="area__no">{a.no}</span>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </li>
        ))}
      </ol>
      <p className="placeholder-note">Yer tutucu · Hizmet kapsamı müşteri onayı bekliyor</p>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projeler" className="section section--alt">
      <div className="section__head">
        <p className="eyebrow">
          <span className="eyebrow__rule" /> Projeler
        </p>
        <h2>Gerçek projeler burada yer alacak.</h2>
        <p className="section__lead">
          Bu alanda yalnızca Ahima Dekorasyon&apos;un kendi uyguladığı, hak sahipliği teyit edilmiş proje fotoğrafları
          gösterilecek. Yapay zekâ konsept görselleri gerçek proje olarak kullanılmaz.
        </p>
      </div>
      <div className="projects">
        {[1, 2, 3].map((n) => (
          <figure key={n} className="project-slot">
            <div className="project-slot__frame">
              <span>Proje fotoğrafı {String(n).padStart(2, '0')}</span>
            </div>
            <figcaption>Firma tarafından sağlanacak</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="iletisim" className="section contact">
      <div className="contact__inner">
        <p className="eyebrow">
          <span className="eyebrow__rule" /> İletişim
        </p>
        <h2>Projenizi birlikte konuşalım.</h2>
        <p className="section__lead">
          Telefon, WhatsApp, e-posta ve adres bilgileri firma tarafından doğrulandıktan sonra eklenecektir. Bu demoda
          hiçbir iletişim bilgisi uydurulmamıştır.
        </p>
        <dl className="contact__list">
          <div>
            <dt>Telefon / WhatsApp</dt>
            <dd className="is-placeholder">Doğrulandıktan sonra eklenecek</dd>
          </div>
          <div>
            <dt>E-posta</dt>
            <dd className="is-placeholder">Doğrulandıktan sonra eklenecek</dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd className="is-placeholder">Doğrulandıktan sonra eklenecek</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wordmark wordmark--static">
        <span className="wordmark__main">AHIMA</span>
        <span className="wordmark__sub">DEKORASYON</span>
      </div>
      <p>
        Demo tasarım. Dönüşüm filmi yapay zekâ ile üretilmiş örnek bir yaşam alanıdır; gerçek bir Ahima projesi değildir.
        Logo ve kurumsal bilgiler geçicidir.
      </p>
    </footer>
  );
}
