/**
 * TEKNİK REHBER
 * ------------------------------------------------------------------
 * Fabrika yetkilileri ve bakım ekipleri için kısa, genel teknik yazılar.
 * Yazılar genel bilgilendirme amaçlıdır; makineye özel talimatların yerine geçmez.
 * Yeni yazı eklerken: özgün, doğrulanabilir, güvenliği öne alan ve süre/sonuç vaadi içermeyen içerik.
 */

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'note'; text: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO tarih */
  date: string;
  readingMinutes: number;
  intro: string;
  sections: { heading: string; blocks: GuideBlock[] }[];
  relatedServices: string[];
};

const SAFETY =
  'Bu yazı genel bilgilendirme amaçlıdır. Pano içi ölçüm, söküm ve ayar işlemleri yalnızca yetkili ve eğitimli kişilerce, makine üreticisinin talimatlarına uygun şekilde ve enerji izolasyonu (kilitleme-etiketleme) yapılarak gerçekleştirilmelidir.';

export const guides: Guide[] = [
  {
    slug: 'ariza-bildirmeden-once',
    title: 'Arıza bildirmeden önce: ön teşhisi hızlandıran 7 bilgi',
    description:
      'Baskı ve ambalaj makinesinde arıza olduğunda teknik servise hangi bilgileri iletmeniz gerektiği: makine etiketi, alarm kodu, koşullar, son değişiklikler ve video.',
    category: 'Servis talebi',
    date: '2026-11-18',
    readingMinutes: 4,
    intro:
      'Makine durduğunda ilk telefon görüşmesinde paylaşılan bilgiler, teşhisin ne kadar hızlı ilerleyeceğini belirler. Aşağıdaki yedi bilgi, çoğu zaman ilk ziyaretten önce olası nedenleri daraltmaya yeter.',
    sections: [
      {
        heading: '1. Makine etiketi',
        blocks: [
          {
            type: 'p',
            text: 'Marka, model, seri numarası ve üretim yılı makinenin tip etiketinde yazar. Aynı model adının farklı yıllarda farklı kumanda ve sürücü donanımlarıyla üretilmiş olabileceğini düşünürsek, etiketin net bir fotoğrafı yazılı model adından daha değerlidir.',
          },
        ],
      },
      {
        heading: '2. Alarm kodu ve mesajı',
        blocks: [
          {
            type: 'p',
            text: 'Operatör panelinde veya sürücü ekranında görünen kodu, metniyle birlikte fotoğraflayın. Alarm geçmişi sayfası varsa, arızadan önceki birkaç kaydı da ekleyin: asıl neden çoğu zaman ilk alarmda saklıdır, sonrakiler onun sonuçlarıdır.',
          },
        ],
      },
      {
        heading: '3. Arızanın görüldüğü an',
        blocks: [
          {
            type: 'list',
            items: [
              'Makine çalışırken mi, ilk açılışta mı, yoksa belirli bir hıza çıkınca mı?',
              'Sürekli mi, yoksa aralıklı mı? Aralıklıysa belirli bir saatte veya ısınınca mı?',
              'Belirli bir iş, malzeme veya ayar değişikliğinden sonra mı?',
            ],
          },
        ],
      },
      {
        heading: '4. Son değişiklikler',
        blocks: [
          {
            type: 'p',
            text: 'Son haftalarda yapılan parça değişimi, bakım, taşıma, elektrik tesisatı çalışması veya yazılım/parametre değişikliği varsa belirtin. Yeni başlayan arızaların önemli bir kısmı yakın zamanda dokunulan bir noktayla ilişkilidir.',
          },
        ],
      },
      {
        heading: '5. Kısa bir video',
        blocks: [
          {
            type: 'p',
            text: 'Ses, titreşim, hareketin takıldığı nokta veya yanıp sönen bir gösterge için 10–30 saniyelik bir video, uzun bir yazılı açıklamadan daha fazlasını anlatır. Videoyu güvenli bir mesafeden ve koruyucuları açmadan çekin.',
          },
        ],
      },
      {
        heading: '6. Şimdiye kadar yapılanlar',
        blocks: [
          {
            type: 'p',
            text: 'Resetleme, sigorta değişimi, sensör temizliği gibi denenmiş adımları ve sonuçlarını yazın. Hiçbir şey yapılmadıysa bunu da belirtin; bu da teşhis için bir bilgidir.',
          },
        ],
      },
      {
        heading: '7. Dokümantasyon',
        blocks: [
          {
            type: 'p',
            text: 'Elektrik şeması, kullanım kılavuzu, PLC programı yedeği veya önceki servis raporları mevcutsa bunların varlığını belirtin. Yerinde çalışmada şema ve program yedeği zaman kazandırır.',
          },
          { type: 'note', text: 'Bu bilgilerin hepsi zorunlu değildir; bilmediğiniz alanları boş bırakabilirsiniz.' },
        ],
      },
    ],
    relatedServices: ['elektrik-arizalari', 'plc-otomasyon'],
  },
  {
    slug: 'surucu-hata-koduna-ilk-bakis',
    title: 'Sürücü hata koduna ilk bakış: ne yapmalı, ne yapmamalı?',
    description:
      'Servo ve frekans sürücülerinde aşırı akım, aşırı gerilim veya enkoder hatası görüldüğünde ilk adımlar ve kaçınılması gereken müdahaleler.',
    category: 'Sürücü ve servo',
    date: '2026-11-18',
    readingMinutes: 5,
    intro:
      'Sürücü ekranındaki bir hata kodu, arızanın yerini değil yönünü gösterir. “Aşırı akım” hatası sürücünün kendisinden kaynaklanabileceği gibi motor kablosu, motor sargısı veya sıkışan bir mekanizma da aynı kodu üretebilir. İlk dakikalarda yapılanlar, sonraki teşhisi kolaylaştırabilir ya da zorlaştırabilir.',
    sections: [
      {
        heading: 'İlk yapılması gerekenler',
        blocks: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Hata kodunu ve varsa alt kodunu fotoğraflayın; sürücünün hata geçmişi kaydını silmeyin.',
              'Hatanın hangi hareket sırasında, hangi hızda veya hangi yük altında oluştuğunu not edin.',
              'Sürücü kabininde fan ve filtrelerin çalışır ve temiz olup olmadığına dışarıdan bakın; kabin içi sıcaklığın normalden yüksek olup olmadığını not edin.',
              'Makine enerjisizken ve emniyete alınmışken, ilgili eksenin elle (üretici talimatına uygun şekilde) zorlanmadan hareket edip etmediğini yetkili kişiye kontrol ettirin.',
            ],
          },
        ],
      },
      {
        heading: 'Kaçınılması gerekenler',
        blocks: [
          {
            type: 'list',
            items: [
              'Hatayı art arda resetleyerek makineyi zorlamak: tekrarlayan aşırı akım, hasarı büyütebilir.',
              'Yedeği alınmadan parametre değiştirmek veya sürücüyü fabrika ayarlarına döndürmek.',
              'Aynı tip olsa bile sürücüleri eksenler arasında parametre aktarmadan yer değiştirmek.',
              'Konnektör ve kabloları enerji altında söküp takmak.',
            ],
          },
        ],
      },
      {
        heading: 'Sık görülen hata gruplarının olası yönleri',
        blocks: [
          {
            type: 'list',
            items: [
              'Aşırı akım: motor kablosunda veya sargıda yalıtım sorunu, mekanik zorlanma, hatalı parametre ya da sürücü güç katı.',
              'Aşırı gerilim: frenleme enerjisinin boşaltılamaması (fren direnci/modülü), çok kısa yavaşlama süresi, şebeke dalgalanması.',
              'Enkoder / geri besleme: kablo veya konnektör teması, ekranlama ve topraklama, enkoderin kendisi.',
              'Aşırı sıcaklık: kabin havalandırması, fan arızası, sürekli aşırı yük.',
            ],
          },
          {
            type: 'note',
            text: 'Bu liste yalnızca olası yönleri gösterir; kesin neden ölçüm ve kontrolle belirlenir. Hata kodlarının anlamı sürücü üreticisine göre değişir; makinenizin dokümantasyonuna bakın.',
          },
        ],
      },
    ],
    relatedServices: ['surucu-servo-sistemleri', 'elektrik-arizalari'],
  },
  {
    slug: 'planli-bakimin-temel-basliklari',
    title: 'Platin kesim ve ofset makinelerinde planlı bakımın temel başlıkları',
    description:
      'Baskı ve ambalaj makinelerinde periyodik bakım listesine girmesi gereken elektrik, mekanik ve otomasyon başlıkları; kayıt tutmanın önemi.',
    category: 'Periyodik bakım',
    date: '2026-11-18',
    readingMinutes: 5,
    intro:
      'Plansız duruşların bir kısmı, önceden fark edilebilecek küçük işaretlerle başlar: ısınan bir klemens, tıkanan bir filtre, gerginliği azalmış bir zincir. Planlı bakım, bu işaretleri üretim takviminize uygun bir zamanda ele almayı sağlar. Aşağıdaki başlıklar bir başlangıç listesidir; makinenizin üretici bakım talimatlarının yerini almaz.',
    sections: [
      {
        heading: 'Mekanik başlıklar',
        blocks: [
          {
            type: 'list',
            items: [
              'Yağlama: merkezi yağlama sisteminin çalışması, yağ seviyesi, uç noktalara yağın ulaşması.',
              'Zincir ve kayışlar: gerginlik, aşınma ve hizalama (platin kesimde pense zinciri, ofsette çıkış zinciri).',
              'Yataklar ve rulmanlar: ses, ısınma ve boşluk.',
              'Emiş ve vakum sistemi: filtreler, hortumlar, vakum değerleri (besleme grupları).',
            ],
          },
        ],
      },
      {
        heading: 'Elektrik başlıkları',
        blocks: [
          {
            type: 'list',
            items: [
              'Pano havalandırması: fan çalışması, filtre temizliği, pano içi sıcaklık.',
              'Bağlantılar: güç klemenslerinde ısınma izi veya renk değişimi (termal kamera ile enerji altında gözlem, sıkma işlemi ise enerjisiz).',
              'Kablo ve konnektörler: hareketli kablo kanallarında aşınma, konnektör kilitleri.',
              'Topraklama ve ekranlama: özellikle sürücü ve enkoder hatlarında.',
            ],
          },
        ],
      },
      {
        heading: 'Otomasyon ve emniyet',
        blocks: [
          {
            type: 'list',
            items: [
              'Sensörler: temizlik, montaj sağlamlığı, algılama mesafesi.',
              'Emniyet fonksiyonları: kapı kilitleri, acil stop ve ışık bariyerlerinin düzenli fonksiyon testi.',
              'Yedekler: PLC programı, operatör paneli ve sürücü parametrelerinin güncel yedeği.',
              'Alarm geçmişi: tekrar eden alarmların listesi, bir sonraki bakımın gündemidir.',
            ],
          },
        ],
      },
      {
        heading: 'Kayıt tutmak',
        blocks: [
          {
            type: 'p',
            text: 'Her bakımda yapılanı, ölçülen değeri ve bir sonraki sefere bırakılan notları kaydetmek; arızaların tekrarlayıp tekrarlamadığını görmenin ve bakım aralığını makinenin gerçek kullanımına göre ayarlamanın en basit yoludur.',
          },
        ],
      },
    ],
    relatedServices: ['makine-revizyonu', 'mekanik-bakim'],
  },
];

export const guideSafetyNote = SAFETY;
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
