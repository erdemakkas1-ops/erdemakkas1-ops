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
  /** Kamuya açık, genel makine tanımı – deneyim/uzmanlık iddiası değildir. */
  summary?: string;
  notes?: string;
  image?: SiteImage;
};

/** Makinenin ana grupları: arıza bildiriminde hangi bölümün belirtileceğini kolaylaştırır. */
export type MachineSection = {
  name: string;
  parts: string;
  disciplines: ('Elektrik' | 'Mekanik' | 'Otomasyon')[];
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
  seo: { title: string; description: string };
  lead: string;
  sections: MachineSection[];
  relatedServices: string[];
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
      { name: 'Novacut', type: 'Platin kesim', summary: 'Tabaka beslemeli otomatik platin kesim makinesi.' },
      {
        name: 'Expertcut',
        type: 'Platin kesim',
        summary: 'Otomatik platin kesim makinesi; sıyırma (stripping) ve ayırma (blanking) istasyonlu versiyonları bulunur.',
      },
      { name: 'Mastercut', type: 'Platin kesim', summary: 'Farklı format seçenekleri olan otomatik platin kesim serisi.' },
    ],
    seo: {
      title: 'BOBST Platin Kesim Makinesi Teknik Servisi – Novacut, Expertcut, Mastercut',
      description:
        'BOBST Novacut, Expertcut ve Mastercut platin kesim makinelerinde elektrik, mekanik, PLC ve servo arızaları için bağımsız teknik servis. Arızanızı bildirin.',
    },
    lead: 'Besleme, pense zinciri, platin, sıyırma ve çıkış istasyonlarından oluşan platin kesim hatlarında; elektrik, mekanik ve otomasyon kaynaklı duruşlar için bağımsız teknik servis.',
    sections: [
      { name: 'Besleme (feeder)', parts: 'Emiş kafası, vakum sistemi, tabaka ayırma, çift tabaka algılama, yığın kaldırma', disciplines: ['Mekanik', 'Elektrik', 'Otomasyon'] },
      { name: 'Giriş ve register', parts: 'Ön ve yan dayamalar, register sensörleri, tabaka kontrolü', disciplines: ['Otomasyon', 'Mekanik'] },
      { name: 'Pense barları ve zincir', parts: 'Pense barları, zincir gerginliği, indeksleme, zincir yağlaması', disciplines: ['Mekanik'] },
      { name: 'Kesim istasyonu (platin)', parts: 'Ana tahrik, kavrama-fren, diz mekanizması, kesim basıncı', disciplines: ['Mekanik', 'Elektrik'] },
      { name: 'Sıyırma ve ayırma', parts: 'Stripping ve blanking istasyonları, takım yerleşimi, ilgili tahrikler', disciplines: ['Mekanik', 'Otomasyon'] },
      { name: 'Çıkış (delivery)', parts: 'İstif masası, yığın kaldırma, ara tabaka sistemi', disciplines: ['Mekanik', 'Elektrik'] },
      { name: 'Kumanda ve emniyet', parts: 'PLC, operatör paneli, servo eksenler, sürücüler, kapı ve emniyet devreleri, merkezi yağlama', disciplines: ['Elektrik', 'Otomasyon'] },
    ],
    relatedServices: ['surucu-servo-sistemleri', 'plc-otomasyon', 'mekanik-bakim'],
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
      { name: 'ROLAND 700', type: 'Tabaka ofset', summary: '3B (70×100 sınıfı) formatta tabaka ofset baskı makinesi.' },
      { name: 'ROLAND 900', type: 'Tabaka ofset · büyük format', summary: 'Büyük format tabaka ofset baskı makinesi.' },
    ],
    seo: {
      title: 'manroland Ofset Baskı Makinesi Teknik Servisi – ROLAND 700, ROLAND 900',
      description:
        'manroland ROLAND 700 ve ROLAND 900 tabaka ofset baskı makinelerinde elektrik, mekanik, PLC ve sürücü arızaları için bağımsız teknik servis. Arızanızı bildirin.',
    },
    lead: 'Besleme, tabaka transferi, baskı üniteleri, mürekkep-ıslatma grupları ve çıkıştan oluşan tabaka ofset makinelerinde; elektrik, mekanik ve otomasyon kaynaklı duruşlar için bağımsız teknik servis.',
    sections: [
      { name: 'Besleme (feeder)', parts: 'Emiş kafası, vakum sistemi, çift tabaka kontrolü, yığın kaldırma', disciplines: ['Mekanik', 'Elektrik', 'Otomasyon'] },
      { name: 'Tabaka transferi', parts: 'Ön ve yan dayamalar, tabaka kontrol sensörleri, pense sistemleri', disciplines: ['Mekanik', 'Otomasyon'] },
      { name: 'Baskı üniteleri', parts: 'Kalıp, kauçuk ve baskı silindirleri, silindir yatakları, dişli dizisi', disciplines: ['Mekanik'] },
      { name: 'Mürekkep ve ıslatma', parts: 'Merdane grupları, mürekkep hazneleri, ıslatma ünitesi ve tahrikleri', disciplines: ['Mekanik', 'Elektrik'] },
      { name: 'Çıkış (delivery)', parts: 'Çıkış zinciri, kurutucu, istif ve yığın indirme', disciplines: ['Mekanik', 'Elektrik'] },
      { name: 'Kumanda ve tahrik', parts: 'Konsol, ana motor ve sürücüler, PLC ve kumanda devreleri, emniyet devreleri, merkezi yağlama', disciplines: ['Elektrik', 'Otomasyon'] },
    ],
    relatedServices: ['elektrik-arizalari', 'mekanik-bakim', 'makine-revizyonu'],
  },
];

export const otherMachinesNote =
  'Listede yer almayan marka ve modeller için de arıza bildirebilirsiniz. Makinenin teknik yapısına göre müdahalenin uygun olup olmadığı ön değerlendirmede açıkça belirtilir.';

export const getMachineBrand = (id: string) => machineBrands.find((b) => b.id === id);
