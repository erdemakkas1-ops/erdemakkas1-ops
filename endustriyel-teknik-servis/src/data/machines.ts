/**
 * MAKİNE GRUPLARI
 * ------------------------------------------------------------------
 * Marka isimleri yalnızca çalışılan makine türünü tarif etmek için kullanılır.
 * Resmî logo kullanılmaz; yetkili servis / temsilci / iş ortağı ilişkisi ima edilmez.
 *
 * `models` dizisine yalnızca işletme sahibinin gerçekten çalıştığı modelleri ekleyin.
 * Örnek kayıt:
 *   { name: 'Model adı', type: 'Platin kesim', notes: 'Elektrik ve servo arızaları', image: undefined }
 */

import type { SiteImage, VisualKind } from './visuals';

export type MachineModel = {
  name: string;
  type: string;
  notes?: string;
  image?: SiteImage;
};

export type MachineBrand = {
  id: 'bobst' | 'manroland';
  name: string;
  category: string;
  description: string;
  /** Markanın genel ürün gruplarını tarif eder – uzmanlık iddiası değildir. */
  machineTypes: string[];
  visual: VisualKind;
  image?: SiteImage;
  models: MachineModel[];
};

export const machineBrands: MachineBrand[] = [
  {
    id: 'bobst',
    name: 'BOBST',
    category: 'Baskı ve ambalaj makineleri',
    description:
      'Karton ambalaj üretiminde kullanılan platin kesim makineleri. Bu makinelerde elektrik, mekanik ve otomasyon kaynaklı arızalar için teknik servis.',
    machineTypes: ['Platin kesim makineleri'],
    visual: 'diecutter',
    // İşletme sahibi tarafından teyit edildi
    models: [
      { name: 'Novacut', type: 'Platin kesim' },
      { name: 'Expertcut', type: 'Platin kesim' },
      { name: 'Mastercut', type: 'Platin kesim' },
    ],
  },
  {
    id: 'manroland',
    name: 'manroland',
    category: 'Endüstriyel ofset baskı makineleri',
    description:
      'Tabaka ofset baskı makineleri. Baskı üniteleri, besleme ve çıkış grupları ile kumanda sistemlerinde elektrik, mekanik ve otomasyon arızaları için teknik servis.',
    machineTypes: ['Tabaka ofset baskı makineleri'],
    visual: 'offset',
    // İşletme sahibi tarafından teyit edildi
    models: [
      { name: 'ROLAND 700', type: 'Tabaka ofset' },
      { name: 'ROLAND 900', type: 'Tabaka ofset · büyük format' },
    ],
  },
];

export const otherMachinesNote =
  'Listede yer almayan marka ve modeller için de arıza bildirebilirsiniz. Makinenin teknik yapısına göre müdahalenin uygun olup olmadığı ön değerlendirmede açıkça belirtilir.';
