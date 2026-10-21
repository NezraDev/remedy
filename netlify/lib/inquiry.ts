import { createHash } from 'node:crypto';
import { siteData } from '../../src/data.js';
import { emailPattern, validateInquiry, type InquiryInput } from '../../src/utils/inquiry';

export type Environment = Record<string, string | undefined>;
export function isConfigured(env: Environment) {
  try {
    const origin = new URL(env.SITE_ORIGIN || '');
    return !!env.RESEND_API_KEY && !!env.INQUIRY_FROM_EMAIL && emailPattern.test(env.INQUIRY_FROM_EMAIL) && !!env.INQUIRY_TO_EMAIL && emailPattern.test(env.INQUIRY_TO_EMAIL) && (origin.protocol === 'https:' || (origin.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(origin.hostname))) && origin.origin === env.SITE_ORIGIN && env.PRIVACY_APPROVED === 'true' && siteData.privacy.status === 'approved';
  } catch { return false; }
}

export function json(status: number, payload: object, headers: Record<string, string> = {}) {
  return Response.json(payload, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

async function readBounded(request: Request) {
  const limit = 16384;
  if (Number(request.headers.get('content-length')) > limit) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new RangeError(); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handleInquiry(request: Request, env: Environment, send: typeof fetch = fetch) {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) return json(415, { error: 'Use application/json.' });
  if (!env.SITE_ORIGIN || request.headers.get('origin') !== env.SITE_ORIGIN || (request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')) return json(403, { error: 'Request origin not allowed.' });
  let body: unknown;
  try { body = await readBounded(request); } catch (error) { return json(error instanceof RangeError ? 413 : 400, { error: 'Invalid request.' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json(400, { error: siteData.inquiry.invalid });
  const raw = body as Record<string, unknown>;
  const stringFields = ['name', 'email', 'phone', 'serviceId', 'contactMethod', 'message', 'preferredDateTime', 'website', 'requestId'] as const;
  const allowed = new Set<string>([...stringFields, 'consent']);
  if (Object.keys(raw).some(key => !allowed.has(key)) || stringFields.some(key => typeof raw[key] !== 'string') || typeof raw.consent !== 'boolean') return json(400, { error: siteData.inquiry.invalid });
  const input = raw as unknown as InquiryInput;
  if (input.website || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) return json(400, { error: siteData.inquiry.invalid });
  const errors = validateInquiry(input);
  if (Object.keys(errors).length) return json(422, { error: siteData.inquiry.invalid, fields: errors });
  if (!isConfigured(env)) return json(503, { error: siteData.inquiry.unavailable });
  const service = siteData.services.find(item => item.id === input.serviceId)?.displayName || siteData.inquiry.general;
  const lines = [
    `${siteData.inquiry.labels.name}: ${input.name.trim()}`,
    `${siteData.inquiry.labels.email}: ${input.email.trim()}`,
    `${siteData.inquiry.labels.phone}: ${input.phone || '—'}`,
    `${siteData.inquiry.labels.serviceId}: ${service}`,
    `${siteData.inquiry.labels.contactMethod}: ${input.contactMethod}`,
    `${siteData.inquiry.labels.preferredDateTime}: ${input.preferredDateTime || '—'} (${siteData.business.timezone}, request only)`,
    `${siteData.inquiry.labels.message}:\n${input.message.trim()}`,
    'Consent: acknowledged. This is an inquiry, not an appointment confirmation.',
  ];
  const text = lines.join('\n\n');
  const digest = createHash('sha256').update(text).digest('hex');
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `remedy-inquiry/${input.requestId}/${digest}` },
      body: JSON.stringify({ from: env.INQUIRY_FROM_EMAIL, to: [env.INQUIRY_TO_EMAIL], reply_to: input.email.trim(), subject: `${siteData.business.name} service inquiry`, text, html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h1>${escapeHtml(siteData.business.name)} inquiry</h1>${lines.map(line => `<p>${escapeHtml(line).replace(/\n/g, '<br />')}</p>`).join('')}</div>` }),
      signal: AbortSignal.timeout(12000),
    });
    if (response.status === 429) return json(429, { error: siteData.inquiry.throttled }, { 'Retry-After': '60' });
    if (!response.ok) return json(502, { error: siteData.inquiry.error });
    const accepted = await response.json() as { id?: string };
    if (!accepted.id) return json(502, { error: siteData.inquiry.error });
    return json(200, { message: siteData.inquiry.success, requestId: input.requestId });
  } catch { return json(502, { error: siteData.inquiry.error }); }
}
