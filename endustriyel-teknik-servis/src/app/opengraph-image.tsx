import { ImageResponse } from 'next/og';
import { displayName } from '@/data/site';

export const dynamic = 'force-static';
export const alt = 'Endüstriyel baskı ve ambalaj makinelerinde teknik servis';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const lines = Array.from({ length: 13 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f1112',
          padding: 72,
          position: 'relative',
          color: '#FFFFFF',
        }}
      >
        {lines.map((i) => (
          <div key={i} style={{ position: 'absolute', left: i * 100, top: 0, width: 1, height: 630, background: 'rgba(154,167,179,0.08)' }} />
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 24, color: '#e39b2d', letterSpacing: 4 }}>
          <div style={{ width: 48, height: 2, background: '#e39b2d' }} />
          BASKI &amp; AMBALAJ MAKİNELERİ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 104, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
          <span>ÜRETİMİNİZ</span>
          <span style={{ color: '#e39b2d' }}>DURMASIN.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#d3d8dc' }}>
          <span>Elektrik · Mekanik · PLC / Otomasyon · Servo</span>
          <span>{displayName}</span>
        </div>
      </div>
    ),
    size,
  );
}
