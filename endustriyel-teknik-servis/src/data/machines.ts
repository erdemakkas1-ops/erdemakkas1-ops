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
      'Karton ve oluklu mukavva ambalaj üretiminde kullanılan kesim, katlama-yapıştırma ve baskı hatları. Bu makinelerde elektrik, mekanik ve otomasyon kaynaklı arızalar için teknik servis.',
    machineTypes: ['Platin kesim makineleri', 'Katlama-yapıştırma makineleri', 'Ambalaj baskı hatları'],
    visual: 'diecutter',
    models: [],
  },
  {
    id: 'manroland',
    name: 'manroland',
    category: 'Endüstriyel ofset baskı makineleri',
    description:
      'Tabaka ve rotatif ofset baskı makineleri. Baskı üniteleri, besleme ve çıkış grupları ile kumanda sistemlerinde elektrik, mekanik ve otomasyon arızaları için teknik servis.',
    machineTypes: ['Tabaka ofset baskı makineleri', 'Rotatif ofset baskı makineleri'],
    visual: 'offset',
    models: [],
  },
];

export const otherMachinesNote =
  'Listede yer almayan marka ve modeller için de arıza bildirebilirsiniz. Makinenin teknik yapısına göre müdahalenin uygun olup olmadığı ön değerlendirmede açıkça belirtilir.';
