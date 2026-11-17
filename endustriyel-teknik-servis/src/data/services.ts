/**
 * HİZMET VERİ MODELİ
 * ------------------------------------------------------------------
 * Ana sayfadaki kartlar, /hizmetler listesi, her hizmetin detay sayfası,
 * navigasyon, footer bağlantıları ve sitemap bu diziden üretilir.
 *
 * NOT: Kapsam maddeleri taslaktır. İşletme sahibi doğrulayana kadar
 * metinler kesin yetkinlik ya da garanti dili içermeyecek şekilde yazılmıştır.
 */

import type { FaultTypeId } from './form';
import { industrial, type SiteImage, type VisualKind } from './visuals';

export type ServiceIcon = 'zap' | 'cog' | 'cpu' | 'gauge' | 'wrench';

export type Service = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  icon: ServiceIcon;
  visual: VisualKind;
  /** Gerçek/temsilî fotoğraf – yoksa SVG çizim gösterilir */
  image?: SiteImage;
  /** Form ön seçimi */
  faultType: FaultTypeId;
  /** Kart açıklaması */
  summary: string;
  /** Kart ve sayfadaki kapsam maddeleri */
  scope: string[];
  seo: { title: string; description: string };
  lead: string;
  intro: string[];
  /** "Hangi durumlarda bildirim yapılır?" */
  symptoms: string[];
  /** Çalışma yaklaşımı – hizmete özgü adımlar */
  approach: { title: string; text: string }[];
  /** Ön değerlendirmeyi hızlandıran bilgiler */
  prepare: string[];
  /** Kapsam ile ilgili dürüst sınır notu */
  note: string;
  related: string[];
};

export const services: Service[] = [
  {
    slug: 'elektrik-arizalari',
    image: industrial.electricalPanel,
    index: '01',
    title: 'Endüstriyel Elektrik Arızaları',
    shortTitle: 'Elektrik Arızaları',
    icon: 'zap',
    visual: 'panel',
    faultType: 'elektrik',
    summary:
      'Pano, motor kumanda ve kontrol devrelerinde arızanın kaynağını ölçüm ve şema üzerinden adım adım izleyen teşhis çalışması.',
    scope: [
      'Elektrik panoları',
      'Motor kumanda sistemleri',
      'Elektriksel arıza teşhisi',
      'Kontrol devreleri',
    ],
    seo: {
      title: 'Endüstriyel Elektrik Arızaları – Pano ve Kumanda Devreleri',
      description:
        'Baskı ve ambalaj makinelerinde elektrik panosu, motor kumanda ve kontrol devresi arızaları için ölçüme dayalı teşhis ve onarım hizmeti.',
    },
    lead:
      'Makine enerji alıyor ama çalışmıyor, sigorta atıyor ya da bir fonksiyon zaman zaman kayboluyorsa; sorun çoğu zaman panonun içinde, bir klemens ya da kumanda hattında saklıdır.',
    intro: [
      'Baskı ve ambalaj makinelerinde elektrik sistemi; ana güç dağıtımı, motor kumandası, emniyet devreleri ve kontrol sinyallerinin birbirine bağlı olduğu katmanlı bir yapıdır. Bir katmandaki küçük bir temassızlık, başka bir noktada anlamsız bir alarm olarak görünebilir.',
      'Bu nedenle çalışma, parça değiştirerek deneme yoluyla değil; elektrik şeması, ölçüm ve makinenin davranışı birlikte okunarak yürütülür. Amaç, arızanın gerçek kaynağını bulmak ve aynı noktanın tekrar sorun çıkarmasını önleyecek şekilde müdahale etmektir.',
    ],
    symptoms: [
      'Makine enerjileniyor ancak start komutu almıyor',
      'Koruma şalteri, sigorta veya motor koruma rölesi sık sık açıyor',
      'Emniyet devresi (kapı, acil stop) sebebi belirsiz biçimde devreye giriyor',
      'Kontaktör çekmiyor, titreşiyor ya da ses yapıyor',
      'Kablo, klemens veya pano içinde ısınma, koku ya da renk değişimi',
      'Arıza belirli saatlerde, ısınınca veya titreşimle ortaya çıkıyor',
    ],
    approach: [
      {
        title: 'Şema ve semptom eşleştirme',
        text: 'Arızanın hangi fonksiyonda, hangi koşulda görüldüğü netleştirilir; ilgili devre elektrik şeması üzerinden izole edilir.',
      },
      {
        title: 'Ölçüm ile doğrulama',
        text: 'Besleme, kumanda gerilimleri, kontak geçişleri ve yalıtım durumu ölçülerek şüpheli nokta somut veriye dayandırılır.',
      },
      {
        title: 'Kalıcı müdahale',
        text: 'Gevşek bağlantı, yıpranmış kontak veya hasarlı kablo gibi kök neden giderilir; gerekiyorsa parça değişimi öncesinde bilgi verilir.',
      },
      {
        title: 'Fonksiyon testi',
        text: 'Müdahale edilen devre, makinenin ilgili fonksiyonu üzerinden operatörle birlikte test edilir.',
      },
    ],
    prepare: [
      'Arıza anında ekranda görülen alarm kodu veya mesajın fotoğrafı',
      'Elektrik şemasının mevcut olup olmadığı',
      'Arızanın sürekli mi, aralıklı mı görüldüğü',
      'Son dönemde panoda yapılan değişiklik veya müdahale',
    ],
    note: 'Müdahale kapsamı ön değerlendirme ve yerinde kontrol sonrasında netleşir. Yetki gerektiren yüksek gerilim tesis işleri bu hizmetin kapsamında değildir.',
    related: ['plc-otomasyon', 'surucu-servo-sistemleri'],
  },
  {
    slug: 'mekanik-bakim',
    image: industrial.motorGearbox,
    index: '02',
    title: 'Mekanik Arıza ve Onarım',
    shortTitle: 'Mekanik Arıza ve Onarım',
    icon: 'cog',
    visual: 'mechanical',
    faultType: 'mekanik',
    summary:
      'Rulman, yataklama ve hareket aktarma organlarında ses, titreşim ve boşluk kaynaklı arızaların tespiti ve onarımı.',
    scope: [
      'Rulman ve yataklama sistemleri',
      'Mekanik aktarma organları',
      'Hareketli makine bileşenleri',
      'Mekanik arıza tespiti',
    ],
    seo: {
      title: 'Mekanik Arıza ve Onarım – Rulman, Yataklama, Aktarma Organları',
      description:
        'Baskı ve ambalaj makinelerinde rulman, yataklama, dişli ve kayış aktarma organlarındaki ses, titreşim ve boşluk arızaları için tespit ve onarım.',
    },
    lead:
      'Yeni başlayan bir ses, artan titreşim ya da baskıda kendini gösteren küçük bir kayma; mekanik bir sorunun ilk işaretleri genellikle üretim durmadan önce gelir.',
    intro: [
      'Yüksek devirde çalışan silindirler, dişli dizileri, kam mekanizmaları ve taşıma sistemleri, birbirine hassas toleranslarla bağlıdır. Bir yataktaki boşluk ya da aşınmış bir dişli, zamanla bağlı olduğu diğer bileşenleri de etkiler.',
      'Mekanik çalışmada önce arızanın nereden geldiği dinlenir, gözlenir ve elle kontrol edilir; ardından sökme gerektiren işlemler planlanır. Gereksiz demontajdan kaçınmak, makinenin ayarlarını korumak açısından önemlidir.',
    ],
    symptoms: [
      'Çalışma sırasında yeni başlayan uğultu, vuruntu veya tıkırtı',
      'Belirli bir hızda artan titreşim',
      'Yatak veya rulman bölgesinde normalden fazla ısınma',
      'Kayış, zincir veya dişlide boşluk ve atlama',
      'Kağıt/karton taşımada kayma, register kaçıklığı gibi mekanik kökenli kusurlar',
      'Yağlama noktalarında kaçak veya yetersiz yağlanma belirtileri',
    ],
    approach: [
      {
        title: 'Gözlem ve dinleme',
        text: 'Makine mümkünse farklı hızlarda çalıştırılarak ses ve titreşimin kaynağı daraltılır.',
      },
      {
        title: 'Boşluk ve aşınma kontrolü',
        text: 'Yataklar, dişliler, kayış ve zincirler elle ve uygun ölçü aletleriyle kontrol edilir.',
      },
      {
        title: 'Planlı demontaj ve onarım',
        text: 'Sökme gereken bölümler önceden belirlenir; montajda referans ve ayar değerleri korunur.',
      },
      {
        title: 'Deneme çalıştırması',
        text: 'Onarım sonrası makine kademeli olarak devreye alınır, ses ve sıcaklık tekrar kontrol edilir.',
      },
    ],
    prepare: [
      'Sesin veya titreşimin kısa bir videosu (WhatsApp üzerinden paylaşılabilir)',
      'Sorunun hangi hızda veya hangi işlemde ortaya çıktığı',
      'Son bakım ve yağlama tarihi biliniyorsa',
      'Yedek parça (rulman, kayış vb.) stok durumunuz',
    ],
    note: 'Parça temini gerektiren onarımlarda süre, parçanın tedarikine bağlıdır; bu durum ön değerlendirmede ayrıca paylaşılır.',
    related: ['makine-revizyonu', 'surucu-servo-sistemleri'],
  },
  {
    slug: 'plc-otomasyon',
    image: industrial.electricalPanel,
    index: '03',
    title: 'PLC ve Otomasyon',
    shortTitle: 'PLC ve Otomasyon',
    icon: 'cpu',
    visual: 'plc',
    faultType: 'plc',
    summary:
      'PLC giriş/çıkışları, sensörler ve aktüatörler üzerinden makinenin “neden beklediğini” bulan otomasyon arıza analizi.',
    scope: [
      'PLC arıza teşhisi',
      'Giriş/çıkış sistemleri',
      'Sensör ve aktüatör kontrolü',
      'Otomasyon sistemleri arıza analizi',
    ],
    seo: {
      title: 'PLC ve Otomasyon Arıza Teşhisi – Giriş/Çıkış, Sensör, Aktüatör',
      description:
        'Baskı ve ambalaj makinelerinde PLC giriş/çıkış, sensör ve aktüatör kaynaklı duruşlar için otomasyon arıza analizi ve teşhisi.',
    },
    lead:
      'Otomasyon arızalarının çoğu bir “bozulma” değil, bir bekleyiştir: makine, gelmeyen bir sinyali ya da tamamlanmayan bir hareketi beklediği için durur.',
    intro: [
      'Modern baskı ve ambalaj makinelerinde PLC, yüzlerce sensörden gelen bilgiyi değerlendirerek valf, motor ve aktüatörleri yönetir. Ekranda görülen alarm çoğu zaman sonucu gösterir; asıl neden bir sensörün kirlenmesi, bir kablonun kopması veya bir valfin geç tepki vermesi olabilir.',
      'Teşhis sürecinde giriş/çıkış durumları, alarm geçmişi ve makinenin çalışma sırası birlikte incelenir. Program üzerinde değişiklik yapılması gerekiyorsa bu, yalnızca makine sahibinin onayı ve mevcut programın yedeği alındıktan sonra değerlendirilir.',
    ],
    symptoms: [
      'Makine belirli bir adımda bekliyor, sonraki harekete geçmiyor',
      'Sebebi anlaşılamayan veya sürekli tekrar eden alarmlar',
      'Sensör algılaması kararsız, zaman zaman hata veriyor',
      'Pnömatik valf veya aktüatör komut almasına rağmen hareket etmiyor',
      'Operatör panelinde (HMI) iletişim veya veri hatası',
      'Ayar değişikliği ya da parça değişimi sonrasında başlayan otomasyon sorunları',
    ],
    approach: [
      {
        title: 'Alarm ve sıra analizi',
        text: 'Alarm geçmişi ve makinenin hangi adımda durduğu incelenerek beklenen koşul tespit edilir.',
      },
      {
        title: 'Giriş/çıkış takibi',
        text: 'İlgili sensör ve çıkışların durumu canlı olarak izlenir; sinyal sahadan PLC’ye kadar takip edilir.',
      },
      {
        title: 'Saha elemanı kontrolü',
        text: 'Sensör konumu, temizliği, kablosu ve aktüatörün mekanik/pnömatik durumu kontrol edilir.',
      },
      {
        title: 'Kayıt ve bilgilendirme',
        text: 'Bulunan neden ve yapılan işlem not edilir; tekrarlama riski olan noktalar paylaşılır.',
      },
    ],
    prepare: [
      'Ekrandaki alarm numarası ve metni',
      'Makinenin hangi aşamada durduğu',
      'PLC/HMI marka bilgisi biliniyorsa',
      'Program yedeğinin bulunup bulunmadığı',
    ],
    note: 'PLC programına müdahale yalnızca makine sahibinin yazılı onayı ve mevcut programın yedeği ile değerlendirilir. Üreticiye ait kilitli yazılımlar bu kapsamın dışındadır.',
    related: ['elektrik-arizalari', 'surucu-servo-sistemleri'],
  },
  {
    slug: 'surucu-servo-sistemleri',
    index: '04',
    title: 'Sürücü ve Servo Sistemleri',
    shortTitle: 'Sürücü ve Servo Sistemleri',
    icon: 'gauge',
    visual: 'drive',
    faultType: 'servo',
    summary:
      'Motor sürücüsü, servo motor ve hareket kontrol bileşenlerinde hata kodundan başlayıp mekaniğe kadar uzanan teşhis.',
    scope: [
      'Motor sürücüsü arızaları',
      'Servo motor ve sürücü sistemleri',
      'Hareket kontrol bileşenleri',
      'Arıza teşhisi ve kontrolü',
    ],
    seo: {
      title: 'Sürücü ve Servo Sistemleri – Motor Sürücüsü ve Hareket Kontrol Arızaları',
      description:
        'Baskı ve ambalaj makinelerinde motor sürücüsü, servo motor, enkoder ve hareket kontrol bileşenleri kaynaklı arızalar için teşhis ve kontrol.',
    },
    lead:
      'Bir sürücünün verdiği hata kodu, sorunun yerini değil yalnızca yönünü gösterir. Aşırı akım hatasının kaynağı sürücü olabileceği gibi kablo, motor ya da sıkışan bir mekanizma da olabilir.',
    intro: [
      'Servo ve frekans sürücülü sistemlerde elektrik, elektronik ve mekanik birbirinden ayrılamaz. Enkoder geri beslemesi, motor kablosu, fren, yük ve sürücü parametreleri birlikte değerlendirilmeden yapılan sürücü değişimleri çoğu zaman sorunu çözmez.',
      'Çalışma; hata geçmişinin okunmasıyla başlar, ardından motor ve kablo ölçümleri, mekanik yükün kontrolü ve gerekiyorsa parametrelerin karşılaştırılmasıyla ilerler. Sürücü veya motorun atölye onarımı gerekiyorsa bu durum ayrıca bildirilir.',
    ],
    symptoms: [
      'Sürücüde aşırı akım, aşırı gerilim veya aşırı sıcaklık hatası',
      'Enkoder / geri besleme hatası, pozisyon kaybı',
      'Servo eksende titreme, sarsıntı veya gürültülü çalışma',
      'Motor çalışıyor ancak hız ya da pozisyon hedefe ulaşmıyor',
      'Fren açılmıyor veya eksen düşüyor',
      'Sürücü değişimi sonrası beklenen davranışın sağlanamaması',
    ],
    approach: [
      {
        title: 'Hata geçmişi',
        text: 'Sürücü hata kayıtları ve hatanın ortaya çıktığı çalışma koşulu incelenir.',
      },
      {
        title: 'Motor ve kablo kontrolü',
        text: 'Motor sargısı, yalıtım, güç ve geri besleme kabloları ile konnektörler kontrol edilir.',
      },
      {
        title: 'Yük tarafı',
        text: 'Eksene bağlı mekanik yükte sıkışma, boşluk veya zorlanma olup olmadığı ayrıca değerlendirilir.',
      },
      {
        title: 'Parametre karşılaştırma',
        text: 'Gerekli durumlarda mevcut parametreler kayıt altına alınır ve referans değerlerle karşılaştırılır.',
      },
    ],
    prepare: [
      'Sürücü ekranındaki hata kodunun fotoğrafı',
      'Sürücü ve motor etiket fotoğrafları',
      'Arızanın hangi hızda veya hangi harekette görüldüğü',
      'Daha önce sürücü/motor değişimi yapılıp yapılmadığı',
    ],
    note: 'Sürücü kartı veya servo motor iç onarımı atölye işlemi gerektirebilir; bu tür işlemler ön değerlendirmede ayrıca konuşulur.',
    related: ['plc-otomasyon', 'elektrik-arizalari'],
  },
  {
    slug: 'makine-revizyonu',
    image: industrial.pressRollers,
    index: '05',
    title: 'Makine Revizyonu ve Periyodik Bakım',
    shortTitle: 'Revizyon ve Periyodik Bakım',
    icon: 'wrench',
    visual: 'maintenance',
    faultType: 'bakim',
    summary:
      'Arızayı beklemeden; elektrik ve mekanik kontrollerle makinenin durumunu planlı biçimde değerlendiren bakım ve revizyon çalışmaları.',
    scope: [
      'Planlı makine bakımı',
      'Elektrik ve mekanik kontroller',
      'Revizyon çalışmaları',
      'Arızaların önleyici analizi',
    ],
    seo: {
      title: 'Makine Revizyonu ve Periyodik Bakım – Planlı Bakım ve Önleyici Analiz',
      description:
        'Baskı ve ambalaj makineleri için planlı bakım, elektrik ve mekanik kontroller, revizyon çalışmaları ve tekrarlayan arızaların önleyici analizi.',
    },
    lead:
      'Plansız duruşun maliyeti, planlı bir bakımın maliyetinden neredeyse her zaman yüksektir. Periyodik bakım, sorunları üretim takviminize göre ele almanızı sağlar.',
    intro: [
      'Periyodik bakım; makinenin kullanım yoğunluğu, yaşı ve geçmiş arızaları dikkate alınarak hazırlanan bir kontrol listesi üzerinden yürütülür. Elektrik bağlantıları, pano içi ısınma, yağlama, aşınma noktaları ve emniyet fonksiyonları aynı ziyarette birlikte ele alınır.',
      'Revizyon çalışmalarında ise belirli bir ünite veya grup ayrıntılı olarak elden geçirilir. Her iki çalışmada da bulgular kayıt altına alınır; acil olanlar ile planlanabilecek olanlar ayrıştırılarak işletmeye net bir tablo sunulur.',
    ],
    symptoms: [
      'Makinede uzun süredir planlı bakım yapılmadı',
      'Aynı arıza farklı zamanlarda tekrar ediyor',
      'Yoğun sezon öncesi makinenin durumunu görmek istiyorsunuz',
      'İkinci el devralınan veya uzun süre çalışmamış bir makine',
      'Belirli bir ünitede performans düşüşü fark ediliyor',
      'Bakım kayıtlarını düzenli tutmak istiyorsunuz',
    ],
    approach: [
      {
        title: 'Durum tespiti',
        text: 'Makinenin mevcut durumu, geçmiş arızaları ve kullanım koşulları işletmeyle birlikte değerlendirilir.',
      },
      {
        title: 'Kontrol listesi',
        text: 'Elektrik, mekanik ve otomasyon başlıklarında makineye uygun bir kontrol listesi oluşturulur.',
      },
      {
        title: 'Uygulama',
        text: 'Bakım ve kontroller üretim planına uygun bir zamanda, mümkün olan en az duruşla yapılır.',
      },
      {
        title: 'Bulgu raporu',
        text: 'Tespit edilen noktalar öncelik sırasına göre paylaşılır; sonraki bakım için öneriler not edilir.',
      },
    ],
    prepare: [
      'Makine marka, model ve üretim yılı',
      'Mevcut bakım kayıtları veya son bakım tarihi',
      'Tekrar eden arızaların kısa bir listesi',
      'Bakım için uygun olabilecek duruş zamanları',
    ],
    note: 'Bakım kapsamı ve kontrol listesi makineye göre birlikte belirlenir; standart bir paket olarak sunulmaz.',
    related: ['mekanik-bakim', 'elektrik-arizalari'],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
