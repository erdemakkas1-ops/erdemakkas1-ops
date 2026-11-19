'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, Camera, Check, Copy, ExternalLink, Mail, MessageCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { faultTypes, formBrands, urgencyOptions } from '@/data/form';
import { whatsappNumber } from '@/lib/contact';
import { business } from '@/data/site';
import {
  LIMITS,
  buildMailtoUrl,
  buildServiceMessage,
  buildWhatsappUrl,
  validateRequest,
  type FieldErrors,
  type ServiceRequest,
} from '@/lib/whatsapp';

const empty: ServiceRequest = {
  urgency: '',
  brand: '',
  otherBrand: '',
  model: '',
  faultType: '',
  description: '',
  city: '',
  district: '',
  contactName: '',
  contactPhone: '',
};

const fieldOrder: (keyof ServiceRequest)[] = ['urgency', 'brand', 'otherBrand', 'model', 'faultType', 'description', 'city', 'district', 'contactName', 'contactPhone'];

type Result = { message: string; url: string | null } | null;

export function ServiceRequestForm() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [values, setValues] = useState<ServiceRequest>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Hizmet sayfasından gelindiyse arıza türünü ön seç (?ariza=elektrik)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const match = faultTypes.find((f) => f.id === q.get('ariza'));
    const brand = formBrands.find((b) => b.id === q.get('marka'));
    const model = (q.get('model') ?? '').slice(0, LIMITS.model);
    if (match || brand || model)
      setValues((v) => ({
        ...v,
        faultType: v.faultType || match?.label || '',
        brand: v.brand || brand?.label || '',
        model: v.model || model,
      }));
  }, []);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  // Geçersiz gönderimde hata özetine odaklan (ekran okuyucu + klavye kullanıcıları için)
  useEffect(() => {
    if (failedAttempts > 0) summaryRef.current?.focus();
  }, [failedAttempts]);

  const set = <K extends keyof ServiceRequest>(key: K, value: ServiceRequest[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) setErrors(validateRequest(next));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateRequest(values);
    setErrors(errs);
    const first = fieldOrder.find((k) => errs[k]);
    if (first) {
      setFailedAttempts((n) => n + 1);
      return;
    }
    const message = buildServiceMessage(values);
    const url = whatsappNumber ? buildWhatsappUrl(whatsappNumber, message) : null;
    setCopied('idle');
    setResult({ message, url });
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('ok');
    } catch {
      // Eski tarayıcılar / izin yok: seçili textarea yöntemi
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(ok ? 'ok' : 'fail');
      } catch {
        setCopied('fail');
      }
    }
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setSubmitted(false);
    setResult(null);
    setCopied('idle');
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input')?.focus());
  };

  const errorList = fieldOrder.filter((k) => errors[k]);

  if (result) {
    return (
      <div className="border border-mist/15 bg-ink p-6 sm:p-9" aria-live="polite">
        <span className="grid h-12 w-12 place-items-center bg-accent text-ink">
          {result.url ? <MessageCircle className="h-6 w-6" aria-hidden="true" /> : <Copy className="h-6 w-6" aria-hidden="true" />}
        </span>
        <h3 ref={resultRef} tabIndex={-1} className="mt-6 font-display text-3xl font-semibold uppercase text-white outline-none">
          {result.url ? 'Mesajınız WhatsApp’ta hazır' : 'Servis metniniz hazır'}
        </h3>
        {result.url ? (
          <p className="mt-4 leading-relaxed text-mist/80">
            WhatsApp yeni sekmede açıldı ve servis talebiniz mesaj kutusuna yazıldı.{' '}
            <strong className="text-white">Talebin iletilmesi için mesajı WhatsApp’ta sizin göndermeniz gerekir.</strong>{' '}
            Arızaya ait fotoğraf ve videoları aynı konuşmaya ekleyebilirsiniz.
          </p>
        ) : (
          <p className="mt-4 leading-relaxed text-mist/80">
            WhatsApp numarası henüz tanımlanmadığı için mesaj otomatik olarak açılamıyor.{' '}
            {business.email
              ? 'Servis talebinizi e-postayla gönderebilir ya da aşağıdaki metni kopyalayabilirsiniz.'
              : 'Aşağıdaki metni kopyalayarak servis talebinizi iletebilirsiniz.'}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              WhatsApp açılmadıysa tıklayın
            </a>
          )}
          {!result.url && business.email && (
            <a href={buildMailtoUrl(business.email, result.message)} className="btn btn-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />
              E-postayla gönder
            </a>
          )}
          <button type="button" onClick={() => copy(result.message)} className={`btn ${result.url || business.email ? 'btn-ghost' : 'btn-primary'}`}>
            {copied === 'ok' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied === 'ok' ? 'Metin kopyalandı' : 'Servis metnini kopyala'}
          </button>
          <button type="button" onClick={reset} className="btn btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Yeni talep
          </button>
        </div>
        <p role="status" className="mt-3 min-h-5 text-sm text-mist/70">
          {copied === 'ok' && 'Servis metni panoya kopyalandı.'}
          {copied === 'fail' && 'Kopyalama başarısız oldu. Metni aşağıdan seçerek kopyalayabilirsiniz.'}
        </p>

        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist/50">Mesaj önizlemesi</p>
          <pre
            data-testid="message-preview"
            className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words border border-mist/10 bg-ink-2 p-5 font-mono text-[13px] leading-relaxed text-mist/90"
          >
            {result.message}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby={id('privacy')}>
      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border border-red-400/50 bg-red-500/10 p-5 outline-none">
          <p className="flex items-center gap-2 font-semibold text-white">
            <AlertCircle className="h-5 w-5 text-red-300" aria-hidden="true" />
            Lütfen {errorList.length} alanı kontrol edin
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="text-red-200 underline underline-offset-4 hover:text-white">
                  {errors[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Durum / aciliyet */}
      <fieldset data-field="urgency" aria-describedby={errors.urgency ? id('urgency-err') : undefined}>
        <legend className="mb-3 text-sm font-semibold text-white">
          Makinenin durumu <Req />
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" id={id('urgency')}>
          {urgencyOptions.map((u) => (
            <Choice
              key={u.id}
              name="urgency"
              value={u.label}
              checked={values.urgency === u.label}
              onChange={() => set('urgency', u.label)}
              invalid={Boolean(errors.urgency)}
            >
              <span className="flex flex-col leading-tight">
                <span>{u.label}</span>
                <span className="mt-1 text-xs text-mist/55">{u.hint}</span>
              </span>
            </Choice>
          ))}
        </div>
        <FieldError id={id('urgency-err')} msg={errors.urgency} />
      </fieldset>

      {/* Marka */}
      <fieldset data-field="brand" aria-describedby={errors.brand ? id('brand-err') : undefined}>
        <legend className="mb-3 text-sm font-semibold text-white">
          Makine markası <Req />
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" id={id('brand')}>
          {formBrands.map((b) => (
            <Choice
              key={b.id}
              name="brand"
              value={b.label}
              checked={values.brand === b.label}
              onChange={() => set('brand', b.label)}
              invalid={Boolean(errors.brand)}
            >
              {b.label}
            </Choice>
          ))}
        </div>
        <FieldError id={id('brand-err')} msg={errors.brand} />
      </fieldset>

      {values.brand === 'Diğer' && (
        <Field label="Makinenin markası" required id={id('otherBrand')} error={errors.otherBrand} field="otherBrand">
          <input
            id={id('otherBrand')}
            className="field"
            value={values.otherBrand}
            maxLength={LIMITS.otherBrand}
            onChange={(e) => set('otherBrand', e.target.value)}
            aria-invalid={Boolean(errors.otherBrand)}
            aria-describedby={errors.otherBrand ? id('otherBrand-err') : undefined}
            autoComplete="off"
            placeholder="Örn. makine üreticisinin adı"
          />
        </Field>
      )}

      <Field label="Makine modeli" required id={id('model')} error={errors.model} field="model" hint="Makine etiketinde yazan model adı. Bilmiyorsanız “Bilinmiyor” yazabilirsiniz.">
        <input
          id={id('model')}
          className="field"
          value={values.model}
          maxLength={LIMITS.model}
          onChange={(e) => set('model', e.target.value)}
          aria-invalid={Boolean(errors.model)}
          aria-describedby={`${id('model-hint')}${errors.model ? ` ${id('model-err')}` : ''}`}
          autoComplete="off"
        />
      </Field>

      {/* Arıza türü */}
      <fieldset data-field="faultType" aria-describedby={errors.faultType ? id('faultType-err') : undefined}>
        <legend className="mb-3 text-sm font-semibold text-white">
          Arıza türü <Req />
        </legend>
        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 lg:grid-cols-3" id={id('faultType')}>
          {faultTypes.map((f) => (
            <Choice
              key={f.id}
              name="faultType"
              value={f.label}
              checked={values.faultType === f.label}
              onChange={() => set('faultType', f.label)}
              invalid={Boolean(errors.faultType)}
            >
              {f.label}
            </Choice>
          ))}
        </div>
        <FieldError id={id('faultType-err')} msg={errors.faultType} />
      </fieldset>

      <Field
        label="Arıza açıklaması"
        required
        id={id('description')}
        error={errors.description}
        field="description"
        hint="Arıza ne zaman başladı, hangi durumda görülüyor, ekranda alarm kodu var mı?"
        counter={`${values.description.trim().length} / ${LIMITS.description.max}`}
      >
        <textarea
          id={id('description')}
          className="field min-h-40 resize-y leading-relaxed"
          value={values.description}
          maxLength={LIMITS.description.max}
          onChange={(e) => set('description', e.target.value)}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={`${id('description-hint')}${errors.description ? ` ${id('description-err')}` : ''}`}
          rows={6}
        />
      </Field>

      <div className="grid gap-8 md:grid-cols-2 md:gap-5">
        <Field label="İl" required id={id('city')} error={errors.city} field="city">
          <input
            id={id('city')}
            className="field"
            value={values.city}
            maxLength={LIMITS.city}
            onChange={(e) => set('city', e.target.value)}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? id('city-err') : undefined}
            autoComplete="address-level1"
          />
        </Field>
        <Field label="İlçe" id={id('district')} error={errors.district} field="district">
          <input
            id={id('district')}
            className="field"
            value={values.district}
            maxLength={LIMITS.district}
            onChange={(e) => set('district', e.target.value)}
            aria-invalid={Boolean(errors.district)}
            aria-describedby={errors.district ? id('district-err') : undefined}
            autoComplete="address-level2"
          />
        </Field>
      </div>

      <Field label="İletişim adı" id={id('contactName')} error={errors.contactName} field="contactName" hint="İsteğe bağlı. Ad, unvan veya firma adı yazabilirsiniz.">
        <input
          id={id('contactName')}
          className="field"
          value={values.contactName}
          maxLength={LIMITS.contactName}
          onChange={(e) => set('contactName', e.target.value)}
          aria-invalid={Boolean(errors.contactName)}
          aria-describedby={`${id('contactName-hint')}${errors.contactName ? ` ${id('contactName-err')}` : ''}`}
          autoComplete="name"
        />
      </Field>

      <Field
        label="Geri dönüş telefonu"
        id={id('contactPhone')}
        error={errors.contactPhone}
        field="contactPhone"
        hint={
          whatsappNumber
            ? 'İsteğe bağlı. Size dönüş yapılabilmesi için; WhatsApp ile gönderirseniz numaranız zaten görünür.'
            : 'İsteğe bağlı. Size dönüş yapılabilmesi için servis metnine eklenir.'
        }
      >
        <input
          id={id('contactPhone')}
          className="field"
          type="tel"
          inputMode="tel"
          value={values.contactPhone}
          maxLength={LIMITS.contactPhone}
          onChange={(e) => set('contactPhone', e.target.value)}
          aria-invalid={Boolean(errors.contactPhone)}
          aria-describedby={`${id('contactPhone-hint')}${errors.contactPhone ? ` ${id('contactPhone-err')}` : ''}`}
          autoComplete="tel"
        />
      </Field>

      <div className="flex gap-3 border-l-2 border-accent bg-ink/60 p-4 text-sm leading-relaxed text-mist/80">
        <Camera className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <p>
          Bu formda fotoğraf yükleme alanı yoktur.{' '}
          {whatsappNumber
            ? 'Arıza ekranı, etiket veya hareketin fotoğraf ve videolarını WhatsApp konuşması üzerinden paylaşabilirsiniz.'
            : 'Arıza ekranı, etiket veya hareketin fotoğraf ve videolarını talebinizi ilettikten sonra paylaşabilirsiniz.'}
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-mist/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p id={id('privacy')} className="flex max-w-md gap-2.5 text-xs leading-relaxed text-mist/60">
          <ShieldCheck className="h-4 w-4 shrink-0 text-mist/50" aria-hidden="true" />
          Bilgileriniz bu sitede saklanmaz. {whatsappNumber ? 'Gönder dediğinizde yalnızca WhatsApp mesajı hazırlanır; mesajı WhatsApp’ta siz gönderirsiniz.' : 'Form yalnızca kopyalanabilir bir servis metni hazırlar.'}
        </p>
        <button type="submit" className="btn btn-primary min-h-14 w-full shrink-0 px-8 text-base sm:w-auto">
          {whatsappNumber ? (
            <>
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp ile Gönder
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" aria-hidden="true" />
              Servis Metnini Oluştur
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Req() {
  return (
    <span className="text-accent" aria-hidden="true">
      *
      <span className="sr-only">(zorunlu)</span>
    </span>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm text-red-300">
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {msg}
    </p>
  );
}

function Field({
  label,
  required,
  id,
  error,
  hint,
  counter,
  field,
  children,
}: {
  label: string;
  required?: boolean;
  id: string;
  error?: string;
  hint?: string;
  counter?: string;
  field: string;
  children: ReactNode;
}) {
  return (
    <div data-field={field}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-white">
          {label} {required ? <Req /> : <span className="font-normal text-mist/50">(isteğe bağlı)</span>}
        </label>
        {counter && <span className="font-mono text-[11px] text-mist/65">{counter}</span>}
      </div>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-relaxed text-mist/55">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  invalid,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  invalid?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={`group relative flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 text-[0.95rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
        checked
          ? 'border-accent bg-accent/10 text-white'
          : invalid
            ? 'border-red-400/60 text-mist/85 hover:border-mist/40'
            : 'border-mist/18 bg-ink/40 text-mist/85 hover:border-mist/40'
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${checked ? 'border-accent' : 'border-mist/40'}`}
        aria-hidden="true"
      >
        {checked && <span className="h-2 w-2 rounded-full bg-accent" />}
      </span>
      {children}
    </label>
  );
}
