import Image from 'next/image';
import { assetPath, type SiteImage, type VisualKind } from '@/data/visuals';
import {
  DieCutterIllustration,
  DriveIllustration,
  MaintenanceIllustration,
  MechanicalIllustration,
  PanelIllustration,
  PhotoPlaceholder,
  PlcIllustration,
  PressIllustration,
} from './illustrations';

const titles: Record<VisualKind, string> = {
  press: 'Tabaka ofset baskı makinesinin teknik yan görünüş çizimi',
  offset: 'Çok üniteli ofset baskı makinesinin teknik çizimi',
  panel: 'Endüstriyel elektrik panosu ve ölçüm cihazı teknik çizimi',
  mechanical: 'Dişli, rulman ve kayış aktarma organlarının teknik çizimi',
  plc: 'PLC rafı, giriş/çıkış modülleri ve sensör hatlarının teknik çizimi',
  drive: 'Servo sürücüler ve servo motorun teknik çizimi',
  maintenance: 'Periyodik bakım göstergesi ve kontrol listesinin teknik çizimi',
  diecutter: 'Ambalaj platin kesim hattının teknik yan görünüş çizimi',
  photo: 'Fotoğraf alanı',
};

type Props = {
  kind: VisualKind;
  image?: SiteImage;
  className?: string;
  /** Sadece LCP görseli için */
  priority?: boolean;
  sizes?: string;
  /** Sol üst köşede küçük teknik etiket */
  caption?: string;
  tone?: 'dark' | 'steel';
  /** Temsilî fotoğraflarda küçük not (varsayılan: açık) */
  note?: boolean;
  imgClassName?: string;
};

/**
 * Gerçek fotoğraf varsa next/image ile gösterir; yoksa teknik çizim yer tutucusu.
 * Kapsayıcı boyutu dışarıdan (aspect / h-*) verilmelidir – CLS oluşmaz.
 */
export function Visual({ kind, image, className = '', priority, sizes = '100vw', caption, tone = 'dark', note = true, imgClassName = '' }: Props) {
  if (image) {
    return (
      <div className={`relative overflow-hidden bg-steel ${className}`}>
        <Image
          src={assetPath(image.src)}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imgClassName}`}
          style={{ objectPosition: image.position ?? '50% 50%' }}
        />
        {note && image.representative && <RepresentativeNote />}
      </div>
    );
  }

  const Ill = {
    press: PressIllustration,
    offset: PressIllustration,
    panel: PanelIllustration,
    mechanical: MechanicalIllustration,
    plc: PlcIllustration,
    drive: DriveIllustration,
    maintenance: MaintenanceIllustration,
    diecutter: DieCutterIllustration,
    photo: PhotoPlaceholder,
  }[kind];

  return (
    <div className={`visual-frame relative overflow-hidden ${tone === 'steel' ? 'visual-steel' : ''} ${className}`}>
      <div className="tech-grid absolute inset-0" aria-hidden="true" />
      <div className="visual-glow absolute inset-0" aria-hidden="true" />
      {kind === 'offset' ? (
        <PressIllustration className="absolute inset-0 h-full w-full text-mist" title={titles[kind]} units={5} labels={false} />
      ) : (
        <Ill className="absolute inset-0 h-full w-full text-mist" title={titles[kind]} />
      )}
      <span className="corner corner-tl" aria-hidden="true" />
      <span className="corner corner-tr" aria-hidden="true" />
      <span className="corner corner-bl" aria-hidden="true" />
      <span className="corner corner-br" aria-hidden="true" />
      {caption && (
        <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/60 sm:left-5 sm:top-5">
          {caption}
        </span>
      )}
    </div>
  );
}

export function RepresentativeNote({ className = 'bottom-3 right-3' }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute z-10 bg-ink/70 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist/75 backdrop-blur-sm ${className}`}>
      Temsilî görsel
    </span>
  );
}
