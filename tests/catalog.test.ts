import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { siteData } from '../src/data.js';
import { formatPrice, isVisible, type Service } from '../src/utils/catalog';

test('preserves all supplied catalog variants, zero prices, durations and IDs', () => {
  assert.equal(siteData.services.length, 28);
  assert.equal(new Set(siteData.services.map(item => item.id)).size, 28);
  assert.equal(new Set(siteData.services.map(item => item.slug)).size, 28);
  for (const id of ['01', '15', '16', '28']) {
    const service = siteData.services.find(item => item.id === id)!;
    assert.equal(service.priceAmountCents, 0); assert.equal(service.priceLabel, 'Free'); assert.equal(formatPrice(service), 'Free');
  }
  assert.equal(siteData.services.find(item => item.id === '28')!.listedDurationMinutes, 55);
  assert.equal(siteData.services.filter(item => item.sourceName === 'Plasma pen').length, 2);
  assert.equal(siteData.services.find(item => item.id === '08')!.priceAmountCents, 10000);
  assert.equal(siteData.services.find(item => item.id === '03')!.listedDurationMinutes, 60);
  assert.equal(siteData.services.find(item => item.id === '23')!.listedDurationMinutes, 60);
  assert.equal(siteData.services.find(item => item.id === '17')!.publishStatus, 'published');
});

test('every service has local photography and resolves its category and featured references', () => {
  assert.equal(new Set(siteData.services.map(service => service.image.src)).size, 28);
  assert.equal(siteData.hero.slides.length, 7);
  assert.equal(new Set(siteData.hero.slides.map(slide => slide.image.src)).size, 7);
  for (const service of siteData.services) {
    assert.ok(service.image.alt); assert.ok(service.image.width > 0 && service.image.height > 0);
    assert.ok(service.image.src.startsWith('/images/'));
    assert.ok(existsSync(`public${service.image.src}`));
    assert.ok(existsSync(`public${service.image.srcSmall}`));
    assert.ok(siteData.serviceCategories.some(category => category.id === service.categoryId));
  }
  for (const id of siteData.featuredServiceIds) assert.ok(siteData.services.some(item => item.id === id && isVisible(item)));
  assert.deepEqual(siteData.results, []);
});

test('promotion expiration is evaluated against the business date in Chicago', () => {
  const service: Service = { ...siteData.services[0], promotionEndDate: '2026-10-21' };
  assert.equal(isVisible(service, new Date('2026-10-22T03:00:00Z')), true);
  assert.equal(isVisible(service, new Date('2026-10-22T06:00:00Z')), false);
});
