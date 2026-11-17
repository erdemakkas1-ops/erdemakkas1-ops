/** Servis talep formu seçenekleri */

export const formBrands = [
  { id: 'bobst', label: 'BOBST' },
  { id: 'manroland', label: 'manroland' },
  { id: 'diger', label: 'Diğer' },
] as const;

export type MachineBrandId = (typeof formBrands)[number]['id'];

export const faultTypes = [
  { id: 'elektrik', label: 'Elektrik' },
  { id: 'mekanik', label: 'Mekanik' },
  { id: 'plc', label: 'PLC / Otomasyon' },
  { id: 'servo', label: 'Servo / Sürücü' },
  { id: 'bakim', label: 'Periyodik Bakım / Revizyon' },
  { id: 'diger', label: 'Diğer' },
] as const;

export type FaultTypeId = (typeof faultTypes)[number]['id'];
