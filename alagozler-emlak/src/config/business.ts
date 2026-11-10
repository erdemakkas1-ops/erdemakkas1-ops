/**
 * Alagözler Emlak & İnşaat — business settings in one place.
 *
 * Source of the values below: the public Instagram profile bio (@alagozleremlak) and the
 * company's own public posts, as seen in November 2026. Confirm them with the client before
 * going live. Leave a value empty ("") to hide the related button everywhere on the site.
 */
export const business = {
  name: "Alagözler Emlak & İnşaat",
  shortName: "Alagözler",
  city: "Şanlıurfa",
  /** Display format. Shown in the Instagram bio and on the company's listing posts. */
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "0541 262 85 03",
  /** E.164 digits without "+", used by tel: and wa.me links. */
  phoneE164: process.env.NEXT_PUBLIC_PHONE_E164 ?? "905412628503",
  /** WhatsApp number (digits only). Falls back to the phone number when unset. */
  whatsappE164: process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? "905412628503",
  instagram: "https://www.instagram.com/alagozleremlak/",
  instagramHandle: "@alagozleremlak",
  /** Office mentioned in the Instagram bio ("Alagözler Emlak 2"). Full street address not verified. */
  office: "Şenevler Mah., Karaköprü / Şanlıurfa",
  officeNote: "Açık adres ve çalışma saatleri müşteriyle teyit edilecek.",
  services: ["Gayrimenkul danışmanlığı", "Arsa ve tarla satışı", "Konut satışı", "Gayrimenkul yatırımı", "İnşaat ve proje tanıtımı"],
} as const;

export const telHref = business.phoneE164 ? `tel:+${business.phoneE164}` : "";

/** wa.me link with an optional pre-filled message. Returns "" when no number is configured. */
export function whatsappHref(message?: string) {
  const number = business.whatsappE164 || business.phoneE164;
  if (!number) return "";
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
