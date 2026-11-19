import type { ReactNode } from 'react';
import type { MediaSlot } from '@/data/media';
import { Photo } from '@/components/ui/Photo';

/**
 * Görseli kapsayıcıyı tamamen kaplayacak şekilde, kendi oranını koruyarak yerleştirir (object-fit: cover gibi),
 * ama içine konan etiketler (children) görselin yüzde koordinatlarında kalır.
 * Kapsayıcı: `.cover-frame` (container-type: size). Odak noktası: m.position, yakınlaşma: m.zoom.
 */
export function CoverImage({
  m,
  priority,
  children,
  className = '',
  boxProps = {},
}: {
  m: MediaSlot;
  priority?: boolean;
  children?: ReactNode;
  className?: string;
  boxProps?: Record<string, string>;
}) {
  const [px, py] = m.position.split(' ').map((v) => parseFloat(v));
  const style = {
    '--ar': m.width / m.height,
    '--z': m.zoom ?? 1,
    '--fx': `${px}%`,
    '--fy': `${py}%`,
  } as React.CSSProperties;
  return (
    <div className={`cover-frame ${className}`}>
      <div className="cover-box" style={style} {...boxProps}>
        <Photo m={{ ...m, position: '50% 50%' }} priority={priority} className="!object-fill" />
        {children}
      </div>
    </div>
  );
}

/** Görsel üzerindeki teknik etiket: nokta + çizgi + etiket. x/y görselin yüzdesi. */
export function Hotspot({ x, y, title, note, left, ...rest }: { x: number; y: number; title: string; note?: string; left?: boolean } & Record<string, unknown>) {
  return (
    <div className={`hotspot ${left ? 'hotspot--left' : ''} ${x > 60 ? 'hotspot--m-left' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} {...rest}>
      <span className="hotspot__inner">
        <span className="hotspot__dot" />
        <span className="hotspot__line" />
        <span className="hotspot__tag">
          <b>{title}</b>
          {note && <small>{note}</small>}
        </span>
      </span>
    </div>
  );
}
