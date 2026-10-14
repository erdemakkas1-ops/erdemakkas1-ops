// Firma bilgileri — kamuya açık kaynaklardan (Instagram / Facebook / harita kayıtları).
export const FIRMA = {
  ad: 'Keşan Ünalanlar Prefabrik',
  kisa: 'ÜNALANLAR',
  yetkili: 'İsmail Yolcu',
  telefon: '0538 677 70 42',
  telefonLink: 'tel:+905386777042',
  whatsapp: '905386777042',
  adres: 'Aşağı Zaferiye Mah. Anafartalar Cd. No:46/B, Keşan / Edirne',
  instagram: 'https://www.instagram.com/kesanunalanlarprefabrik/',
  harita: 'https://www.google.com/maps/search/?api=1&query=Ke%C5%9Fan+%C3%9Cnalanlar+Prefabrik',
};

// Oda tipleri → plan renkleri
export const ODA_RENK = {
  yasam: '#d9c3a0',
  yatak: '#cdb48c',
  islak: '#9fb8c4',
  hol: '#e6d8bf',
  dis: '#8fa68a',
};

// Planlar metre cinsinden. Dikdörtgenler [x, y, genişlik, derinlik]; y=0 arka cephe, y=d ön cephe.
export const MODELLER = [
  {
    id: 'bag',
    ad: 'Bağ Evi',
    tip: '1+1',
    brut: 45,
    w: 9,
    d: 5,
    cati: 'tek',
    aciklama: 'Hafta sonu, bağ ve bahçe için kompakt, ekonomik yapı.',
    odalar: [
      { key: 'salon', ad: 'Salon + Mutfak', tur: 'yasam', r: [[0, 0, 5, 5]] },
      { key: 'yatak1', ad: 'Yatak Odası', tur: 'yatak', r: [[5, 0, 4, 3]] },
      { key: 'banyo', ad: 'Banyo', tur: 'islak', r: [[5, 3, 2, 2]] },
      { key: 'antre', ad: 'Antre / Kiler', tur: 'hol', r: [[7, 3, 2, 2]] },
      { key: 'veranda', ad: 'Veranda', tur: 'dis', disari: true, r: [[0, 5, 5, 2]] },
    ],
  },
  {
    id: 'aile',
    ad: 'Aile',
    tip: '2+1',
    brut: 80,
    w: 10,
    d: 8,
    cati: 'kirma',
    aciklama: 'Genç aileler için ferah salon, iki yatak odası.',
    odalar: [
      { key: 'salon', ad: 'Salon', tur: 'yasam', r: [[0, 0, 5.5, 4.5]] },
      { key: 'ebeveyn', ad: 'Ebeveyn Yatak Odası', tur: 'yatak', r: [[5.5, 0, 4.5, 4]] },
      { key: 'mutfak', ad: 'Mutfak', tur: 'yasam', r: [[0, 4.5, 3.5, 3.5]] },
      { key: 'hol', ad: 'Antre / Hol', tur: 'hol', r: [[3.5, 4.5, 2, 3.5]] },
      { key: 'banyo', ad: 'Banyo', tur: 'islak', r: [[5.5, 4, 1.5, 4]] },
      { key: 'yatak2', ad: 'Yatak Odası 2', tur: 'yatak', r: [[7, 4, 3, 4]] },
      { key: 'veranda', ad: 'Veranda', tur: 'dis', disari: true, r: [[0, 8, 5.5, 2]] },
    ],
  },
  {
    id: 'konfor',
    ad: 'Konfor',
    tip: '3+1',
    brut: 108,
    w: 12,
    d: 9,
    cati: 'kirma',
    aciklama: 'En çok tercih edilen tip: açık mutfak, üç yatak odası.',
    odalar: [
      { key: 'yatak2', ad: 'Yatak Odası 2', tur: 'yatak', r: [[0, 0, 3.5, 4]] },
      { key: 'banyo', ad: 'Banyo', tur: 'islak', r: [[3.5, 0, 2.5, 2.5]] },
      { key: 'yatak3', ad: 'Yatak Odası 3', tur: 'yatak', r: [[6, 0, 3, 4]] },
      { key: 'ebeveyn', ad: 'Ebeveyn Yatak Odası', tur: 'yatak', r: [[9, 0, 3, 5]] },
      { key: 'hol', ad: 'Hol', tur: 'hol', r: [[3.5, 2.5, 2.5, 1.5], [0, 4, 9, 1]] },
      { key: 'salon', ad: 'Salon', tur: 'yasam', r: [[0, 5, 7, 4]] },
      { key: 'mutfak', ad: 'Mutfak', tur: 'yasam', r: [[7, 5, 5, 4]] },
      { key: 'veranda', ad: 'Veranda', tur: 'dis', disari: true, r: [[0, 9, 7, 2.2]] },
    ],
  },
  {
    id: 'villa',
    ad: 'Villa',
    tip: '4+1',
    brut: 140,
    w: 14,
    d: 10,
    cati: 'kirma',
    aciklama: 'Kalabalık aileler için ebeveyn banyolu, geniş villa.',
    odalar: [
      { key: 'ebeveyn', ad: 'Ebeveyn Yatak Odası', tur: 'yatak', r: [[0, 0, 4.5, 4.5]] },
      { key: 'ebanyo', ad: 'Ebeveyn Banyo', tur: 'islak', r: [[4.5, 0, 2, 2.5]] },
      { key: 'yatak2', ad: 'Yatak Odası 2', tur: 'yatak', r: [[6.5, 0, 3.5, 4.5]] },
      { key: 'yatak3', ad: 'Yatak Odası 3', tur: 'yatak', r: [[10, 0, 4, 4.5]] },
      { key: 'hol', ad: 'Hol', tur: 'hol', r: [[4.5, 2.5, 2, 2], [0, 4.5, 10, 1.5]] },
      { key: 'banyo', ad: 'Banyo', tur: 'islak', r: [[10, 4.5, 4, 2]] },
      { key: 'yatak4', ad: 'Yatak Odası 4', tur: 'yatak', r: [[10, 6.5, 4, 3.5]] },
      { key: 'salon', ad: 'Salon', tur: 'yasam', r: [[0, 6, 6.5, 4]] },
      { key: 'mutfak', ad: 'Mutfak', tur: 'yasam', r: [[6.5, 6, 3.5, 4]] },
      { key: 'veranda', ad: 'Veranda', tur: 'dis', disari: true, r: [[0, 10, 6.5, 2.2]] },
    ],
  },
];

export const odaAlani = (oda) => oda.r.reduce((t, [, , w, h]) => t + w * h, 0);

// Yapım aşamaları (hero 3D sahnesi)
export const ASAMALAR = [
  { ad: 'Zemin betonu', not: 'Radye temel, 30–40 cm' },
  { ad: 'Çelik iskelet', not: 'Galvaniz konstrüksiyon' },
  { ad: 'Panel duvarlar', not: 'Yalıtımlı sandviç panel' },
  { ad: 'Çatı', not: 'Kiremit görünümlü panel' },
  { ad: 'Anahtar teslim', not: 'Doğrama, tesisat, boya' },
];

// Fiyat hesaplama — ÖRNEK birim fiyatlar (demo). Gerçek fiyatlar firmadan alınmalı.
export const FIYAT = {
  teslim: [
    { key: 'kaba', ad: 'Kaba yapı', m2: 9500, not: 'İskelet + panel + çatı' },
    { key: 'yari', ad: 'Yarı teslim', m2: 14500, not: '+ doğrama, sıva, tesisat altyapısı' },
    { key: 'anahtar', ad: 'Anahtar teslim', m2: 19500, not: '+ banyo, mutfak, zemin, boya' },
  ],
  beton: [
    { key: '30', ad: '30 cm', m2: 0 },
    { key: '40', ad: '40 cm', m2: 650 },
  ],
  yukseklik: [
    { key: '250', ad: '250 cm', oran: 0 },
    { key: '280', ad: '280 cm', oran: 0.04 },
  ],
  icDuvar: [
    { key: '6', ad: '6 cm', m2: 0 },
    { key: '10', ad: '10 cm', m2: 420 },
  ],
  disDuvar: [
    { key: '10', ad: '10 cm', m2: 0 },
    { key: '15', ad: '15 cm', m2: 560 },
  ],
  ekstra: [
    { key: 'veranda', ad: 'Veranda (ahşap deck)', tutar: 85000 },
    { key: 'yalitim', ad: 'Ek çatı yalıtımı', tutar: 38000 },
    { key: 'kombi', ad: 'Kombi + petek tesisatı', tutar: 72000 },
  ],
};

// Hizmet bölgesi — Keşan merkezli. Mesafeler yaklaşık karayolu km.
export const MERKEZ = { ad: 'KEŞAN', lon: 26.63, lat: 40.86 };
export const ILCELER = [
  { key: 'malkara', ad: 'Malkara', lon: 26.9, lat: 40.89, km: 27 },
  { key: 'ipsala', ad: 'İpsala', lon: 26.38, lat: 40.92, km: 30 },
  { key: 'uzunkopru', ad: 'Uzunköprü', lon: 26.69, lat: 41.27, km: 47 },
  { key: 'hayrabolu', ad: 'Hayrabolu', lon: 27.1, lat: 41.21, km: 56 },
  { key: 'enez', ad: 'Enez', lon: 26.08, lat: 40.72, km: 58 },
  { key: 'sarkoy', ad: 'Şarköy', lon: 27.11, lat: 40.61, km: 62 },
  { key: 'gelibolu', ad: 'Gelibolu', lon: 26.67, lat: 40.41, km: 75 },
  { key: 'tekirdag', ad: 'Tekirdağ', lon: 27.51, lat: 40.98, km: 82 },
  { key: 'edirne', ad: 'Edirne', lon: 26.56, lat: 41.68, km: 112 },
  { key: 'luleburgaz', ad: 'Lüleburgaz', lon: 27.36, lat: 41.4, km: 102 },
];
