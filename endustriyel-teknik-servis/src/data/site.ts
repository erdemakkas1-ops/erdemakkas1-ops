/**
 * MERKEZİ İŞLETME AYARLARI
 * ------------------------------------------------------------------
 * Ustanın / işletmenin tüm kimlik ve iletişim bilgileri buradan yönetilir.
 * `null` bırakılan alanlar sitede GÖSTERİLMEZ ya da açıkça "eklenecek" olarak
 * işaretlenir. Doğrulanmamış bilgi girmeyin.
 *
 * Telefon / WhatsApp numaraları ortam değişkeniyle de verilebilir
 * (Vercel → Project → Settings → Environment Variables):
 *   NEXT_PUBLIC_PHONE            örn. +90 5xx xxx xx xx
 *   NEXT_PUBLIC_WHATSAPP_NUMBER  örn. 905xxxxxxxxx  (ülke kodu ile, + ve boşluk olmadan)
 *   NEXT_PUBLIC_EMAIL
 *   NEXT_PUBLIC_SITE_URL         örn. https://www.alanadiniz.com
 */

export type BusinessConfig = {
  /** Ticari unvan / marka adı. Null ise genel tanım kullanılır. */
  name: string | null;
  /** Ustanın adı soyadı. */
  ownerName: string | null;
  /** Logo yanında görünen kısa ad (örn. baş harfler). */
  shortMark: string;
  /** Kısa unvan satırı */
  tagline: string;
  phone: string | null;
  /** Yalnızca rakam, ülke koduyla: 905xxxxxxxxx */
  whatsapp: string | null;
  email: string | null;
  /** Doğrulanmış hizmet bölgesi açıklaması (örn. "İstanbul ve çevresi"). */
  serviceArea: string | null;
  /** Açık adres yalnızca müşteri kabulü yapılıyorsa girilmeli. */
  address: string | null;
  /** Çalışma saatleri – doğrulanmadan girmeyin. */
  workingHours: string | null;
  /** Vergi / ticari bilgiler (yasal bilgilendirme satırı) */
  legal: {
    taxOffice: string | null;
    taxNumber: string | null;
    mersisNumber: string | null;
  };
  social: { label: string; href: string }[];
};

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const business: BusinessConfig = {
  name: null,
  ownerName: null,
  shortMark: 'TS',
  tagline: 'Elektrik · Mekanik · Otomasyon',
  phone: env(process.env.NEXT_PUBLIC_PHONE),
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  email: env(process.env.NEXT_PUBLIC_EMAIL),
  serviceArea: null,
  address: null,
  workingHours: null,
  legal: { taxOffice: null, taxNumber: null, mersisNumber: null },
  social: [],
};

/** Site genelinde görünen ad – işletme adı girilene kadar genel tanım. */
export const displayName = business.name ?? 'Endüstriyel Teknik Servis';

export const site = {
  url: (
    env(process.env.NEXT_PUBLIC_SITE_URL) ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  ).replace(/\/$/, ''),
  locale: 'tr_TR',
  defaultTitle: `${displayName} | Baskı ve Ambalaj Makinelerinde Teknik Servis`,
  description:
    'Endüstriyel baskı ve ambalaj makinelerinde elektrik, mekanik, PLC/otomasyon ve servo sürücü sistemleri için bağımsız teknik servis. Arızanızı bildirin, ön teknik değerlendirme alın.',
  /**
   * Eksik işletme bilgileri ve örnek içerik yer tutucularını açıkça etiketleyerek
   * gösterir. Gerçek veriler girildikten sonra `false` yapın.
   */
  showContentPlaceholders: true,
};

/** JSON-LD yalnızca doğrulanmış temel işletme verileri varken üretilir. */
export const hasVerifiedBusinessData = Boolean(business.name && (business.phone || business.email));

/**
 * USTA PROFİLİ – ŞABLON DEĞERLER
 * ------------------------------------------------------------------
 * Usta onay verene kadar site bu bilgiler "varmış gibi" kurgulanır; değerler açıkça şablondur
 * (Usta Adı Soyadı, XX yıl, 0 5XX…). Sitede kesik çizgili altçizgi ve ipucuyla işaretlenir.
 * Gerçek bilgi girildiğinde ilgili `value` doldurulur, işaret kendiliğinden kalkar.
 * Uydurma isim, yorum veya rakam girmeyin.
 */
export type ProfileField = { value: string | null; template: string };

const field = (value: string | null, template: string): ProfileField => ({ value, template });

export const profile = {
  /** Ustanın adı soyadı */
  name: field(business.ownerName, 'Usta Adı Soyadı'),
  /** Ünvan satırı */
  role: field('Elektrik · Mekanik · Otomasyon', ''),
  /** Sahadaki deneyim süresi, örn. "22 yıl" */
  experience: field(null, 'XX yıl'),
  /** Önceki çalışılan servis / firma geçmişi, örn. "12 yıl bir ambalaj fabrikasında bakım şefi" */
  background: field(null, 'Önceki servis / fabrika geçmişi'),
  /** Merkez şehir */
  base: field(null, 'Şehir'),
  /** Gidilen bölgeler */
  region: field(business.serviceArea, 'Hizmet verilen bölgeler'),
  /** Çalışma saatleri */
  hours: field(business.workingHours, 'Çalışma saatleri'),
  /** Görünen telefon */
  phone: field(business.phone, 'Telefon numarası eklenecek'),
};

export const fieldText = (f: ProfileField) => f.value ?? f.template;
export const isTemplate = (f: ProfileField) => !f.value;
