import { test, expect } from '@playwright/test';

test('all routes, local service images and responsive layouts', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['dark', 'light']) {
      await page.goto('/');
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('button', { name: theme === 'light' ? 'Switch to light mode' : 'Switch to dark mode' }).click();
      for (const route of ['/', '/services', '/about', '/before-and-after', '/faq', '/contact', '/booking', '/inquiry', '/privacy', '/not-a-page']) {
        await page.goto(route);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('.brand img')).toHaveAttribute('src', '/images/remedy-logo.jpg');
        await expect(page.locator('.footer-brand img')).toHaveAttribute('src', '/images/remedy-logo.jpg');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
  }
  await page.goto('/services');
  await expect(page.locator('.service-card')).toHaveCount(28);
  expect(new Set(await page.locator('.service-card img').evaluateAll(elements => elements.map(element => (element as HTMLImageElement).getAttribute('src')))).size).toBe(28);
  const pictures = page.locator('.service-card img');
  for (const picture of await pictures.all()) { await picture.scrollIntoViewIfNeeded(); await expect(picture).toHaveJSProperty('complete', true); expect(await picture.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0); }
  expect(errors).toEqual([]);
});

test('catalog filters, inquiry selections, empty states and real Square fallback', async ({ page }) => {
  await page.goto('/services');
  await page.getByRole('button', { name: 'Rebooking', exact: true }).click();
  await expect(page.locator('.service-card')).toHaveCount(3);
  await expect(page.locator('.service-price').first()).toHaveText('Free');
  await page.locator('.service-inquiry').last().click();
  await expect(page.getByLabel('Service of interest')).toHaveValue('28');
  await page.goto('/inquiry?service=unknown');
  await expect(page.getByLabel('Service of interest')).toHaveValue('');
  await page.goto('/services?q=definitely-not-a-treatment');
  await expect(page.getByRole('heading', { name: 'Let’s try a different search.' })).toBeVisible();
  await page.locator('.empty-state').getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.service-card')).toHaveCount(28);
  await page.goto('/booking');
  await expect(page.getByRole('link', { name: 'Open booking in Square' })).toHaveAttribute('href', 'https://remedy956.square.site/');
  await page.goto('/booking/');
  await expect(page).toHaveTitle('Book an Appointment | Remedy Harlingen');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await page.goto('/before-and-after');
  await expect(page.getByText('Our before-and-after gallery is being prepared.', { exact: false })).toBeVisible();
});

test('compact header, mobile navigation and keyboard-operable slide indicators', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Before & After' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await expect(page.locator('.topline')).toHaveCount(0);
  await expect(page.locator('.slide-indicator')).toHaveCount(7);
  await expect(page.getByRole('button', { name: /Pause slideshow|Play slideshow|Previous treatment image|Next treatment image/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore body contouring', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Explore body contouring', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.hero-image.is-active')).toHaveAttribute('src', '/images/body.jpg');
  await page.getByRole('button', { name: 'Your next moment of care', exact: true }).click();
  await expect(page.locator('.hero-image.is-active')).toHaveAttribute('src', '/images/return-care.jpg');
  await page.getByRole('button', { name: 'A moment for your skin', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.hero-image.is-active')).toHaveAttribute('src', '/images/skin.jpg');
  expect(await page.locator('.hero').evaluate(element => element.getBoundingClientRect().height)).toBe(850);
  expect(await page.locator('.hero-content').evaluate(element => parseFloat(getComputedStyle(element).paddingTop))).toBe(250);
  expect(await page.locator('.introduction').evaluate(element => parseFloat(getComputedStyle(element).paddingTop))).toBe(44);
});

test('slide progress fills continuously, pauses without jumping, and advances its image', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('.site-header').hover({ position: { x: 12, y: 20 } });
  const activeLine = page.locator('.slide-indicator[aria-pressed="true"] span');
  const readProgress = () => activeLine.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element, '::after').transform).a);
  const samples = await activeLine.evaluate(async element => {
    const values: number[] = [];
    for (let frame = 0; frame < 20; frame++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      values.push(new DOMMatrixReadOnly(getComputedStyle(element, '::after').transform).a);
    }
    return values;
  });
  expect(samples.at(-1)! - samples[0]).toBeGreaterThan(0);
  expect(samples.filter((value, index) => index > 0 && value > samples[index - 1]).length).toBeGreaterThan(samples.length / 2);
  expect(samples.every((value, index) => index === 0 || value >= samples[index - 1])).toBe(true);
  await page.locator('.hero').hover({ position: { x: 80, y: 180 } });
  await expect(page.locator('.slide-indicators')).toHaveClass(/is-auto-paused/);
  const pausedProgress = await readProgress();
  await page.waitForTimeout(350);
  expect(await readProgress()).toBeCloseTo(pausedProgress, 4);
  await page.locator('.site-header').hover({ position: { x: 12, y: 20 } });
  await page.waitForTimeout(350);
  expect(await readProgress()).toBeGreaterThan(pausedProgress + .025);
  const nextSlide = page.getByRole('button', { name: 'Explore body contouring', exact: true });
  await expect(nextSlide).toHaveAttribute('aria-pressed', 'true', { timeout: 4000 });
  expect(await readProgress()).toBeLessThan(.15);
  await page.waitForTimeout(350);
  expect(await readProgress()).toBeGreaterThan(.025);
  await nextSlide.click();
  await expect(page.locator('.slide-indicators')).not.toHaveClass(/is-auto-advancing/);
  const imageTransition = await page.locator('.hero-image.is-active').evaluate(element => getComputedStyle(element).transition);
  expect(imageTransition).toContain('0.35s');
});

test('theme toggle follows the system, preserves input, and remembers an explicit choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/services');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto('/inquiry');
  await page.getByLabel('Full name').fill('Theme Test');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.getByLabel('Full name')).toHaveValue('Theme Test');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.evaluate(() => localStorage.setItem('remedy-theme', 'invalid-mode'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('inquiry validation, pending duplicates, retry idempotency and honest success using mocks only', async ({ page }) => {
  await page.route('**/.netlify/functions/inquiry-status', route => route.fulfill({ json: { available: true } }));
  let attempts = 0;
  const requestIds: string[] = [];
  await page.route('**/.netlify/functions/send-inquiry', async route => {
    attempts++;
    requestIds.push(route.request().postDataJSON().requestId);
    if (attempts === 1) await route.fulfill({ status: 502, json: {} });
    else { await new Promise(resolve => setTimeout(resolve, 350)); await route.fulfill({ json: { message: 'accepted' } }); }
  });
  await page.goto('/inquiry?service=11');
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByText('Enter your name (2–100 characters).')).toBeVisible();
  await page.getByLabel('Full name').fill('Test Visitor');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('What would you like to ask?').fill('This is a local test of a consultation inquiry.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('alert')).toContainText('Your inquiry could not be sent.');
  await expect(page.getByLabel('Full name')).toHaveValue('Test Visitor');
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('button', { name: 'Sending your inquiry…' })).toBeDisabled();
  await expect(page.locator('.inquiry-success')).toContainText('This is not an appointment confirmation.');
  expect(attempts).toBe(2);
  expect(requestIds[0]).toBe(requestIds[1]);
});

test('capture desktop and mobile review evidence with loaded media', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['dark', 'light']) {
    await page.goto('/');
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('button', { name: theme === 'light' ? 'Switch to light mode' : 'Switch to dark mode' }).click();
    for (const [name, width] of [['desktop', 1440], ['mobile', 390]] as const) {
      await page.setViewportSize({ width, height: 960 });
      await page.goto('/');
      await page.evaluate(async () => { await document.fonts.ready; const images = [...document.images]; images.forEach(img => img.loading = 'eager'); await Promise.all(images.map(img => img.decode().catch(() => {}))); });
      const suffix = theme === 'dark' ? '' : '-light';
      await page.screenshot({ path: `.impeccable/review/${name}${suffix}.png`, fullPage: true, animations: 'disabled' });
      await page.goto('/services');
      await page.evaluate(async () => { await document.fonts.ready; const images = [...document.images]; images.forEach(img => img.loading = 'eager'); await Promise.all(images.map(img => img.decode().catch(() => {}))); });
      await page.screenshot({ path: `.impeccable/review/services-${name}${suffix}.png`, fullPage: true, animations: 'disabled' });
    }
  }
});

test('chatbot accepts typed questions and waits three seconds before answering', async ({ page }) => {
  test.setTimeout(15000);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Remedy chat' }).click();
  await page.screenshot({ path: '.impeccable/review/chatbot-mobile.png', animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const panelBox = await page.locator('#remedy-chat-panel').boundingBox();
  expect(panelBox).not.toBeNull();
  expect(panelBox!.x).toBeGreaterThanOrEqual(0);
  expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(320);
  await expect(page.locator('.chat-question-browser')).toHaveCount(0);
  await expect(page.getByText('Common questions')).toHaveCount(0);
  const started = Date.now();
  await page.locator('#remedy-chat-input').fill('What services does Remedy offer?');
  await page.getByRole('button', { name: 'Send question' }).click();
  await expect(page.getByRole('status')).toContainText('Preparing an answer');
  await page.waitForTimeout(2600);
  await expect(page.locator('.remedy-chat-message.chat-assistant')).toHaveCount(1);
  await expect(page.getByText('Remedy lists facial and skin care', { exact: false })).toBeVisible();
  expect(Date.now() - started).toBeGreaterThanOrEqual(2900);
  await page.getByLabel('Type your question…').fill('Can Remedy arrange a helicopter ride?');
  const unknownStarted = Date.now();
  await page.getByRole('button', { name: 'Send question' }).click();
  await expect(page.getByRole('status')).toContainText('Preparing an answer');
  await page.waitForTimeout(2600);
  await expect(page.locator('.remedy-chat-message.chat-assistant').last()).toContainText('Please contact Remedy.');
  expect(Date.now() - unknownStarted).toBeGreaterThanOrEqual(2900);
  const contactButton = page.locator('.remedy-chat-message.chat-assistant').last().getByRole('link', { name: 'Contact Remedy' });
  await expect(contactButton).toBeVisible();
  await expect(contactButton).toHaveAttribute('href', 'tel:+19562260328');
  expect((await contactButton.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await contactButton.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.impeccable/review/chatbot-contact-mobile.png', animations: 'disabled' });
  await page.getByRole('button', { name: 'Close Remedy chat', exact: true }).first().click();
  await page.getByRole('button', { name: /Switch to .* mode/ }).click();
  await page.getByRole('button', { name: 'Open Remedy chat' }).click();
  await expect(contactButton).toBeVisible();
  await contactButton.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.impeccable/review/chatbot-contact-mobile-alternate-theme.png', animations: 'disabled' });
});
