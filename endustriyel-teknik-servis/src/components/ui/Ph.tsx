import { isTemplate, site, fieldText, type ProfileField } from '@/data/site';

/**
 * Profil alanı: gerçek değer varsa düz metin; yoksa şablon değeri kesik çizgili altçizgiyle
 * ve "usta onayından sonra doldurulacak" ipucuyla gösterir.
 */
export function Ph({ f, className = '' }: { f: ProfileField; className?: string }) {
  if (!isTemplate(f) || !site.showContentPlaceholders) return <span className={className}>{fieldText(f)}</span>;
  return (
    <span
      className={`underline decoration-dashed decoration-accent/70 decoration-1 underline-offset-[0.18em] ${className}`}
      title="Usta onayından sonra doldurulacak"
    >
      {fieldText(f)}
    </span>
  );
}
