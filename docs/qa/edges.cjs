const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const out =
  process.env.LABCAST_QA_OUTPUT ||
  require('node:path').resolve(__dirname, '../preview');
fs.mkdirSync(out, { recursive: true });
const base = process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321';
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.LABCAST_CHROME || undefined,
  });
  const results = { checks: [], httpErrors: [], layouts: [] };
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    page.on('response', (r) => {
      if (r.request().method() === 'GET' && r.status() >= 400)
        results.httpErrors.push([r.status(), r.url()]);
    });
    for (const route of ['/', '/thanks/', '/privacy/', '/credits/']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(350);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        results.layouts.push({ route, width, overflow });
        assert.equal(overflow, false);
      }
    }
    results.checks.push(
      'All four public routes fit 320, 390, 768, and 1440 pixels',
    );
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(
      () => (document.documentElement.style.fontSize = '200%'),
    );
    const textOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    results.textZoom = {
      width: 1440,
      rootFont: '200%',
      overflow: textOverflow,
    };
    assert.equal(textOverflow, false);
    results.checks.push('Homepage supports doubled base text at desktop width');
    await page.goto(base, { waitUntil: 'networkidle' });
    // Deliberately retain an unfulfilled request, then advance the browser clock.
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.clock.install();
    await page
      .locator('form')
      .evaluate((f) => f.removeAttribute('data-netlify'));
    await page.locator('#waitlist-email').fill('timeout@example.com');
    let pending;
    await page.route(base + '/thanks/', (route) => {
      pending = route;
    });
    await page.locator('form button[type=submit]').click();
    await page.clock.runFor(16000);
    await page
      .locator('#signup-error')
      .filter({ hasText: 'couldn’t confirm' })
      .waitFor();
    assert.equal(
      await page.locator('form button[type=submit]').isEnabled(),
      true,
    );
    assert.equal(
      await page.locator('#waitlist-email').inputValue(),
      'timeout@example.com',
    );
    if (pending) await pending.abort().catch(() => {});
    results.checks.push(
      'Timeout restores submission controls and retains the email',
    );
    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await page.clock.resume();
    await page.goto(base, { waitUntil: 'networkidle' });
    await page
      .locator('form')
      .evaluate((f) => f.removeAttribute('data-netlify'));
    await page.locator('#waitlist-email').fill('offline@example.com');
    await page.route(base + '/thanks/', (route) =>
      route.abort('internetdisconnected'),
    );
    await page.locator('form button[type=submit]').click();
    await page
      .locator('#signup-error')
      .filter({ hasText: 'couldn’t confirm' })
      .waitFor();
    results.checks.push('Network failure never displays signup success');
    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.querySelector('form').removeAttribute('data-netlify');
      Storage.prototype.setItem = () => {
        throw new Error('Storage denied');
      };
    });
    await page.locator('#waitlist-email').fill('storage@example.com');
    await page.route(base + '/thanks/', async (route) => {
      if (route.request().method() === 'POST')
        await route.fulfill({ status: 200, body: 'accepted simulation' });
      else await route.continue();
    });
    await page.locator('form button[type=submit]').click();
    await page.locator('[data-signup-success]').waitFor({ state: 'visible' });
    await page.locator('[data-signup-success] a').click();
    assert.equal(await page.locator('#details-email').inputValue(), '');
    results.checks.push(
      'Blocked browser storage does not lose signup and allows email re-entry',
    );
    assert.equal(results.httpErrors.length, 0);
    results.checks.push(
      'No failed GET resources while reviewing all public routes',
    );
    results.complete = true;
    console.log(JSON.stringify(results, null, 2));
  } finally {
    fs.writeFileSync(`${out}/edges.json`, JSON.stringify(results, null, 2));
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
