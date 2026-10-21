import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { handleInquiry, isConfigured } from '../netlify/lib/inquiry';
import { siteData } from '../src/data.js';
import type { InquiryInput } from '../src/utils/inquiry';

const env = { RESEND_API_KEY: 'mock-only-key', INQUIRY_FROM_EMAIL: 'sender@example.com', INQUIRY_TO_EMAIL: 'owner@example.com', SITE_ORIGIN: 'https://example.com', PRIVACY_APPROVED: 'true' };
const valid: InquiryInput = { name: 'Example Visitor', email: 'visitor@example.net', phone: '', serviceId: '11', contactMethod: 'email', message: 'I would like to ask about a consultation.', preferredDateTime: '2026-11-04T14:30', consent: true, website: '', requestId: '01932d26-2866-4ae6-8ec6-c6acdbe39e86' };
const originalStatus = siteData.privacy.status;
before(() => { siteData.privacy.status = 'approved'; });
after(() => { siteData.privacy.status = originalStatus; });
const request = (body: unknown = valid, headers: Record<string, string> = {}) => new Request(`${env.SITE_ORIGIN}/.netlify/functions/send-inquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: env.SITE_ORIGIN, ...headers }, body: JSON.stringify(body) });
const accepted = async () => Response.json({ id: 'mock-accepted-id' });

test('requires actual server configuration and explicit privacy approval', async () => {
  assert.equal(isConfigured(env), true);
  assert.equal(isConfigured({ ...env, PRIVACY_APPROVED: '' }), false);
  assert.equal(isConfigured({ ...env, SITE_ORIGIN: 'https://example.com/path' }), false);
  assert.equal((await handleInquiry(request(), { ...env, RESEND_API_KEY: '' }, accepted)).status, 503);
  siteData.privacy.status = 'draft';
  assert.equal(isConfigured(env), false);
  siteData.privacy.status = 'approved';
});

test('rejects unsupported methods, types, cross-origin and oversized requests', async () => {
  assert.equal((await handleInquiry(new Request(env.SITE_ORIGIN), env, accepted)).status, 405);
  assert.equal((await handleInquiry(request(valid, { 'Content-Type': 'text/plain' }), env, accepted)).status, 415);
  assert.equal((await handleInquiry(request(valid, { Origin: 'https://attacker.example' }), env, accepted)).status, 403);
  assert.equal((await handleInquiry(request(valid, { 'Sec-Fetch-Site': 'cross-site' }), env, accepted)).status, 403);
  assert.equal((await handleInquiry(request({ ...valid, message: 'x'.repeat(18000) }), env, accepted)).status, 413);
});

test('validates fields, service IDs, honeypot, recipient injection, and date requests', async () => {
  for (const invalid of [ { ...valid, email: 'a@example.com\r\nBcc: other@example.com' }, { ...valid, name: 'a' }, { ...valid, message: '' }, { ...valid, contactMethod: 'phone' }, { ...valid, consent: false }, { ...valid, serviceId: 'not-a-service' }, { ...valid, preferredDateTime: '2026-02-31T12:00' } ]) assert.equal((await handleInquiry(request(invalid), env, accepted)).status, 422);
  assert.equal((await handleInquiry(request({ ...valid, serviceId: '17' }), env, accepted)).status, 200);
  assert.equal((await handleInquiry(request({ ...valid, website: 'spam' }), env, accepted)).status, 400);
  assert.equal((await handleInquiry(request({ ...valid, to: 'attacker@example.com' }), env, accepted)).status, 400);
  assert.equal((await handleInquiry(request({ ...valid, requestId: 'bad' }), env, accepted)).status, 400);
  assert.equal((await handleInquiry(request({ ...valid, message: 123 }), env, accepted)).status, 400);
});

test('escapes HTML, uses fixed addresses, supplies plain text and stable idempotency on retry', async () => {
  const captured: RequestInit[] = [];
  const send: typeof fetch = async (url, init) => { assert.equal(url, 'https://api.resend.com/emails'); captured.push(init!); return Response.json({ id: 'mock-id' }); };
  const input = { ...valid, message: '<script>alert("x")</script> Please contact me.' };
  assert.equal((await handleInquiry(request(input), env, send)).status, 200);
  assert.equal((await handleInquiry(request(input), env, send)).status, 200);
  const mail = JSON.parse(captured[0].body as string);
  assert.equal(mail.from, env.INQUIRY_FROM_EMAIL);
  assert.deepEqual(mail.to, [env.INQUIRY_TO_EMAIL]);
  assert.equal(mail.reply_to, valid.email);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.doesNotMatch(mail.html, /<script>/);
  assert.match(mail.text, /America\/Chicago, request only/);
  assert.equal((captured[0].headers as Record<string, string>)['Idempotency-Key'], (captured[1].headers as Record<string, string>)['Idempotency-Key']);
});

test('never reports success on provider refusal, throttling, malformed acceptance or network failure', async () => {
  assert.equal((await handleInquiry(request(), env, async () => Response.json({ error: 'private-provider-error' }, { status: 500 }))).status, 502);
  assert.equal((await handleInquiry(request(), env, async () => Response.json({}, { status: 429 }))).status, 429);
  assert.equal((await handleInquiry(request(), env, async () => Response.json({}))).status, 502);
  const response = await handleInquiry(request(), env, async () => { throw new Error('secret provider error'); });
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /secret provider/);
});
