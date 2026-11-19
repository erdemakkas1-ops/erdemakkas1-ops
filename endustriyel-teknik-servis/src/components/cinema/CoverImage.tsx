import type { ReactNode } from 'react';
import type { MediaSlot } from '@/data/media';
import type { LabelSide } from '@/data/tours';
import { Photo } from '@/components/ui/Photo';

/**
 * TEK KOORDİNAT SİSTEMİ
 * Görsel, kapsayıcıyı kendi oranını koruyarak kaplar (object-fit: cover ile aynı sonuç). Kapak kutusu (`.cover-box`)
 * görselle birebir aynı boyuttadır ve yerleşimi yalnızca left/top/width/height ile yapılır (transform yok);
 * böylece offsetLeft/offsetWidth gibi DOM ölçümleri kutunun gerçek yerini verir ve kamera hesabı bunları kullanır.
 * Etiketler (children) kutunun içinde görselin yüzde koordinatlarına yerleşir; kamera dönüşümü (üst öğede)
 * görseli ve etiketleri birlikte etkiler.
 */
export function CoverImage({
  m,
  priority,
  children,
  className = '',
  clip = true,
}: {
  m: MediaSlot;
  priority?: boolean;
  children?: ReactNode;
  className?: string;
  /**
   * Çerçeve taşanı kırpsın mı. Kamera dönüşümü bu bileşenin ÜSTÜNDE uygulanıyorsa false olmalı:
   * aksi hâlde kırpma alanı da kamerayla birlikte ölçeklenip kayar ve sahnede boş bölge açılır,
   * o bölgeye düşen etiketler kaybolur. Kırpmayı kameranın dışındaki kapsayıcı yapar.
   */
  clip?: boolean;
}) {
  const [px, py] = m.position.split(' ').map((v) => parseFloat(v) / 100);
  const style = {
    '--ar': m.width / m.height,
    '--z': m.zoom ?? 1,
    '--fx': px,
    '--fy': py,
  } as React.CSSProperties;
  return (
    <div className={`cover-frame ${clip ? '' : 'cover-frame--free'} ${className}`}>
      <div className="cover-box" data-cover-box style={style}>
        <Photo m={{ ...m, position: '50% 50%' }} priority={priority} className="!object-fill" />
        {children}
      </div>
    </div>
  );
}

/**
 * Görsel üzerindeki teknik etiket: nokta + çizgi + etiket, tek parça.
 * x/y görselin yüzdesi. Dış öğe noktayı görsele bağlar; [data-hs-scale] kamera ölçeğini tersine çevirir
 * (köken = nokta, böylece ölçek konumu kaydırmaz); .hotspot__inner görünme animasyonu içindir.
 * Etiketin yönü (sağ/sol) ve görünürlüğü FocusTour tarafından ekrandaki gerçek konuma göre belirlenir.
 */
export function Hotspot({ x, y, title, note, side = 'right' }: { x: number; y: number; title: string; note?: string; side?: LabelSide }) {
  return (
    <div
      className={`hotspot ${side === 'right' ? '' : `hotspot--${side}`}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      data-hotspot
      data-x={x}
      data-y={y}
      data-prefer={side}
    >
      <div data-hs-scale className="hotspot__scale">
        <span className="hotspot__inner">
          <span className="hotspot__dot" />
          <span className="hotspot__line" />
          <span className="hotspot__tag">
            <b>{title}</b>
            {note && <small>{note}</small>}
          </span>
        </span>
      </div>
    </div>
  );
}
