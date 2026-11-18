// Servis talebi -> WhatsApp mesajı birim testleri (Node 22.18+ TypeScript tip ayıklama ile)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  validateRequest,
  buildServiceMessage,
  buildWhatsappUrl,
  normalizeWhatsappNumber,
} from '../src/lib/whatsapp.ts';

const valid = {
  urgency: 'Makine durdu',
  brand: 'BOBST',
  otherBrand: '',
  model: 'Örnek Model 106',
  faultType: 'Servo / Sürücü',
  description: 'Ana eksen sürücüsü çalışma sırasında aşırı akım hatası veriyor.',
  city: 'İstanbul',
  district: 'Esenyurt',
  contactName: '',
};

test('boş form tüm zorunlu alanlar için hata verir', () => {
  const e = validateRequest({ ...valid, urgency: '', brand: '', model: '', faultType: '', description: '', city: '' });
  assert.deepEqual(Object.keys(e).sort(), ['brand', 'city', 'description', 'faultType', 'model', 'urgency']);
});

test('geçerli form hata vermez; ilçe ve iletişim adı isteğe bağlıdır', () => {
  assert.deepEqual(validateRequest(valid), {});
  assert.deepEqual(validateRequest({ ...valid, district: '' }), {});
});

test('"Diğer" marka seçilince marka adı zorunludur', () => {
  assert.ok(validateRequest({ ...valid, brand: 'Diğer' }).otherBrand);
  assert.deepEqual(validateRequest({ ...valid, brand: 'Diğer', otherBrand: 'Heidelberg' }), {});
});

test('kısa açıklama reddedilir', () => {
  assert.ok(validateRequest({ ...valid, description: 'çalışmıyor' }).description);
});

test('mesaj tüm alanları Türkçe karakterlerle içerir', () => {
  const m = buildServiceMessage({ ...valid, contactName: 'Üretim Şefi' });
  for (const s of ['*SERVİS TALEBİ*', '*Durum:* Makine durdu', 'BOBST', 'Örnek Model 106', 'Servo / Sürücü', 'İstanbul / Esenyurt', 'Üretim Şefi', 'aşırı akım'])
    assert.ok(m.includes(s), `eksik: ${s}`);
});

test('iletişim adı boşsa satır eklenmez, Diğer marka adı yazılır', () => {
  const m = buildServiceMessage({ ...valid, brand: 'Diğer', otherBrand: 'KBA' });
  assert.ok(!m.includes('İletişim adı'));
  assert.ok(m.includes('KBA (Diğer)'));
});

test('numara normalizasyonu', () => {
  assert.equal(normalizeWhatsappNumber('0 (532) 000 00 00'), '905320000000');
  assert.equal(normalizeWhatsappNumber('+90 532 000 00 00'), '905320000000');
  assert.equal(normalizeWhatsappNumber('0090 532 000 00 00'), '905320000000');
  assert.equal(normalizeWhatsappNumber(''), null);
  assert.equal(normalizeWhatsappNumber('123'), null);
});

test('wa.me bağlantısı doğru kodlanır ve geri çözülebilir', () => {
  const msg = buildServiceMessage(valid);
  const url = buildWhatsappUrl('905320000000', msg);
  assert.ok(url.startsWith('https://wa.me/905320000000?text='));
  assert.equal(decodeURIComponent(new URL(url).search.slice(6)), msg);
});
