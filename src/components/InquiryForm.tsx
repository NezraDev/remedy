import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { siteData } from '../data.js';
import { isVisible } from '../utils/catalog';
import { validateInquiry, type FieldErrors, type InquiryInput } from '../utils/inquiry';
import { Action } from './Shared';

export function InquiryForm() {
  const [params] = useSearchParams();
  const selected = siteData.services.find(item => item.id === params.get('service') && isVisible(item));
  const copy = siteData.inquiry;
  const [input, setInput] = useState<InquiryInput>({ name: '', email: '', phone: '', serviceId: selected?.id || '', contactMethod: 'email', message: '', preferredDateTime: '', consent: false, website: '', requestId: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [availability, setAvailability] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const retry = useRef({ payload: '', id: '' });
  const pending = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(copy.statusEndpoint, { signal: controller.signal }).then(async response => { if (!response.ok) throw new Error(); const data = await response.json(); setAvailability(data.available === true ? 'available' : 'unavailable'); }).catch(() => { if (!controller.signal.aborted) setAvailability('unavailable'); });
    return () => controller.abort();
  }, [copy.statusEndpoint]);
  function update<K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) { setInput(previous => ({ ...previous, [key]: value })); setErrors(previous => ({ ...previous, [key]: undefined })); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current || availability !== 'available') return;
    const found = validateInquiry(input);
    setErrors(found);
    if (Object.keys(found).length) { setMessage(copy.invalid); setStatus('error'); requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return; }
    pending.current = true;
    setStatus('submitting'); setMessage('');
    const payload = JSON.stringify({ ...input, requestId: '' });
    if (retry.current.payload !== payload) retry.current = { payload, id: crypto.randomUUID() };
    try {
      const response = await fetch(copy.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...input, requestId: retry.current.id }), signal: AbortSignal.timeout(20000) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (body.fields) setErrors(body.fields);
        if (response.status === 503) setAvailability('unavailable');
        throw new Error(response.status === 429 ? copy.throttled : response.status === 503 ? copy.unavailable : copy.error);
      }
      setStatus('success'); setMessage(copy.success);
      requestAnimationFrame(() => result.current?.focus());
    } catch (error) { setStatus('error'); setMessage(error instanceof Error && [copy.throttled, copy.unavailable, copy.error].includes(error.message) ? error.message : copy.error); }
    finally { pending.current = false; }
  }
  function errorFor(key: keyof InquiryInput) { return errors[key] ? <span className="field-error" id={`${key}-error`}>{errors[key]}</span> : null; }
  const described = (key: keyof InquiryInput, help = '') => [errors[key] ? `${key}-error` : '', help].filter(Boolean).join(' ') || undefined;
  if (status === 'success') return <div className="inquiry-success" ref={result} tabIndex={-1} role="status"><CheckCircle2 size={36} aria-hidden="true" /><h2>{copy.successHeading}</h2><p>{message}</p><Action href={siteData.actions.book.href}>{siteData.actions.book.label}</Action></div>;
  return <form className="inquiry-form" ref={form} onSubmit={submit} noValidate aria-busy={status === 'submitting'}>
    {availability !== 'available' && <div className="availability-note" role="status"><AlertCircle size={20} aria-hidden="true" /><div><p>{availability === 'checking' ? copy.checking : copy.unavailable}</p>{availability === 'unavailable' && <a href={siteData.business.phoneHref}>{siteData.actions.call} {siteData.business.phone}</a>}</div></div>}
    <div className="form-row"><div className="field"><label htmlFor="name">{copy.labels.name}<span>{copy.required}</span></label><input id="name" name="name" autoComplete="name" required maxLength={100} placeholder={copy.placeholders.name} value={input.name} onChange={event => update('name', event.target.value)} aria-invalid={!!errors.name} aria-describedby={described('name')} />{errorFor('name')}</div><div className="field"><label htmlFor="email">{copy.labels.email}<span>{copy.required}</span></label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder={copy.placeholders.email} value={input.email} onChange={event => update('email', event.target.value)} aria-invalid={!!errors.email} aria-describedby={described('email')} />{errorFor('email')}</div></div>
    <div className="form-row"><div className="field"><label htmlFor="phone">{copy.labels.phone}<span>{input.contactMethod === 'phone' ? copy.required : copy.optional}</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" required={input.contactMethod === 'phone'} maxLength={32} placeholder={copy.placeholders.phone} value={input.phone} onChange={event => update('phone', event.target.value)} aria-invalid={!!errors.phone} aria-describedby={described('phone')} />{errorFor('phone')}</div><div className="field"><label htmlFor="contactMethod">{copy.labels.contactMethod}</label><select id="contactMethod" name="contactMethod" value={input.contactMethod} onChange={event => update('contactMethod', event.target.value)} aria-invalid={!!errors.contactMethod} aria-describedby={described('contactMethod')}><option value="email">{copy.emailOption}</option><option value="phone">{copy.phoneOption}</option></select>{errorFor('contactMethod')}</div></div>
    <div className="field"><label htmlFor="serviceId">{copy.labels.serviceId}<span>{copy.optional}</span></label><select id="serviceId" name="serviceId" value={input.serviceId} onChange={event => update('serviceId', event.target.value)} aria-invalid={!!errors.serviceId} aria-describedby={described('serviceId')}><option value="">{copy.general}</option>{siteData.services.filter(item => isVisible(item)).map(service => <option key={service.id} value={service.id}>{service.displayName}</option>)}</select>{errorFor('serviceId')}</div>
    <div className="field"><label htmlFor="message">{copy.labels.message}<span>{copy.required}</span></label><textarea id="message" name="message" rows={5} minLength={10} maxLength={3000} required placeholder={copy.placeholders.message} value={input.message} onChange={event => update('message', event.target.value)} aria-invalid={!!errors.message} aria-describedby={described('message', 'message-help')} /><p className="field-help" id="message-help">{copy.messageHelp}</p>{errorFor('message')}</div>
    <div className="field"><label htmlFor="preferredDateTime">{copy.labels.preferredDateTime}<span>{copy.optional}</span></label><input id="preferredDateTime" name="preferredDateTime" type="datetime-local" value={input.preferredDateTime} onChange={event => update('preferredDateTime', event.target.value)} aria-invalid={!!errors.preferredDateTime} aria-describedby={described('preferredDateTime', 'time-help')} /><p className="field-help" id="time-help">{copy.timeHelp}</p>{errorFor('preferredDateTime')}</div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">{copy.honeypotLabel}</label><input id="website" name="website" value={input.website} onChange={event => update('website', event.target.value)} tabIndex={-1} autoComplete="off" /></div>
    <div className="consent-field"><label><input id="consent" type="checkbox" checked={input.consent} onChange={event => update('consent', event.target.checked)} required aria-invalid={!!errors.consent} aria-describedby={described('consent')} /><span>{copy.labels.consent} <Link to={siteData.footer.legal.href}>{copy.privacyLabel}</Link></span></label>{errorFor('consent')}</div>
    {message && <div className="form-message" role="alert"><AlertCircle size={20} aria-hidden="true" />{message}</div>}
    <button className="button button-primary form-submit" type="submit" disabled={availability !== 'available' || status === 'submitting'}>{status === 'submitting' ? <><LoaderCircle className="spinner" size={18} aria-hidden="true" />{copy.submitting}</> : <>{copy.submit}<ArrowUpRight size={18} aria-hidden="true" /></>}</button>
  </form>;
}
