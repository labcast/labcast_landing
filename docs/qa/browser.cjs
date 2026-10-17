const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321';
const out =
  process.env.LABCAST_QA_OUTPUT ||
  require('node:path').resolve(__dirname, '../preview');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.LABCAST_CHROME || undefined,
  });
  const results = {
    date: new Date().toISOString(),
    checks: [],
    layouts: [],
    accessibility: [],
    errors: [],
    requests: [],
    failures: [],
  };
  const check = (name) => results.checks.push(name);
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => results.errors.push(e.message));
    page.on('request', (r) => results.requests.push(r.url()));
    await page.goto(`${base}/?utm_source=club&utm_campaign=launch`, {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(
      await page.locator('link[rel=canonical]').getAttribute('href'),
      'https://labcast.ai/',
    );
    assert.equal(await page.locator('form[data-netlify]').count(), 1);
    assert.equal(await page.locator('[name=source]').inputValue(), 'club');
    check('Metadata, static Netlify form definition, and attribution');
    // Local previews may not report a saved signup.
    await page.locator('#waitlist-email').fill('review@example.com');
    await page.locator('form button[type=submit]').click();
    assert.match(
      await page.locator('#signup-error').textContent(),
      /preview cannot save/,
    );
    assert.equal(
      await page.locator('[data-signup-success]').isVisible(),
      false,
    );
    check('Unprocessed local preview refuses false signup success');
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('form button[type=submit]').click();
    assert.equal(
      await page.locator('#waitlist-email').getAttribute('aria-invalid'),
      'true',
    );
    await page.locator('#waitlist-email').fill('review@example.com');
    assert.equal(
      await page.locator('#waitlist-email').getAttribute('aria-invalid'),
      null,
    );
    check('Invalid email has an accessible error and recovers on input');
    assert.equal(await page.locator('[data-story].is-enhanced').count(), 1);
    assert.equal(await page.locator('[data-scene]').count(), 7);
    assert.equal(
      await page.locator('[data-play], [data-progress], [data-time]').count(),
      0,
    );
    check('Seven-feature scroll story is initialized without player controls');
    assert.doesNotMatch(
      await page.locator('body').innerText(),
      /prototype|pilot|play the concept|built at a hackathon/i,
    );
    check(
      'Public homepage omits development history and repeated concept labels',
    );
    await page.locator('summary').first().click();
    assert.equal(
      await page.locator('details').first().getAttribute('open'),
      '',
    );
    await page.locator('summary').first().click();
    check('FAQ disclosure');
    for (const width of [320, 375, 390, 600, 768, 850, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(350);
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      results.layouts.push({ width, ...dimensions });
      assert.ok(dimensions.document <= width, `overflow at ${width}`);
    }
    check('No horizontal overflow at nine widths from 320 to 1920');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Menu', exact: false }).click();
    assert.equal(
      await page.locator('.menu-toggle').getAttribute('aria-expanded'),
      'true',
    );
    await page.keyboard.press('Escape');
    assert.equal(
      await page.locator('.menu-toggle').getAttribute('aria-expanded'),
      'false',
    );
    assert.equal(
      await page
        .locator('.menu-toggle')
        .evaluate((el) => document.activeElement === el),
      true,
    );
    await page.locator('.menu-toggle').click();
    await page.locator('#navigation a[href="/#people"]').click();
    assert.equal(
      await page.locator('.menu-toggle').getAttribute('aria-expanded'),
      'false',
    );
    check(
      'Mobile menu opens, closes on navigation, and restores focus on Escape',
    );
    for (const [route, width] of [
      ['/', 1440],
      ['/', 390],
      ['/thanks/', 390],
      ['/privacy/', 390],
      ['/credits/', 1440],
      ['/404.html', 390],
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      const violations = scan.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      }));
      results.accessibility.push({ route, width, violations });
    }
    // Simulate only Netlify's build transformation and HTTP responses; not live delivery.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}/?utm_source=club&utm_campaign=launch`, {
      waitUntil: 'networkidle',
    });
    await page.locator('[data-audience=club]').click();
    await page.locator('#waitlist-email').fill('review+club@example.com');
    await page
      .locator('form')
      .evaluate((f) => f.removeAttribute('data-netlify'));
    let posts = [];
    let responseStatus = 500;
    let hold = false;
    let release;
    await page.route(`${base}/thanks/`, async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      posts.push(route.request().postData());
      if (hold) await new Promise((r) => (release = r));
      await route.fulfill({
        status: responseStatus,
        contentType: 'text/html',
        body: '<p>Simulated response</p>',
      });
    });
    await page.locator('form button[type=submit]').click();
    await page
      .locator('#signup-error')
      .filter({ hasText: 'couldn’t confirm' })
      .waitFor();
    assert.equal(
      await page.locator('#waitlist-email').inputValue(),
      'review+club@example.com',
    );
    assert.equal(
      await page.locator('form button[type=submit]').isEnabled(),
      true,
    );
    check('HTTP failure preserves email and permits retry');
    responseStatus = 200;
    hold = true;
    await page.locator('form button[type=submit]').click();
    await page.waitForTimeout(100);
    assert.equal(
      await page.locator('form button[type=submit]').isDisabled(),
      true,
    );
    assert.equal(posts.length, 2);
    await page
      .locator('form')
      .evaluate((f) =>
        f.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true }),
        ),
      );
    await page.waitForTimeout(100);
    assert.equal(posts.length, 2);
    await page
      .locator('#waitlist-email')
      .fill('changed-during-request@example.com');
    release();
    hold = false;
    await page.locator('[data-signup-success]').waitFor({ state: 'visible' });
    assert.equal(await page.locator('form').isVisible(), false);
    const data = new URLSearchParams(posts[1]);
    for (const [key, value] of [
      ['form-name', 'waitlist'],
      ['source', 'club'],
      ['campaign', 'launch'],
      ['audience', 'club'],
      ['email', 'review+club@example.com'],
    ])
      assert.equal(data.get(key), value);
    assert.ok(!page.url().includes('review'));
    check(
      'Accepted response, duplicate-submit protection, correct encoded fields, private email handoff',
    );
    await page.screenshot({ path: `${out}/signup.png` });
    await page.locator('[data-signup-success] a').click();
    await page.waitForFunction(
      () =>
        document.querySelector('[data-thanks-title]')?.textContent ===
        'You’re on the list.',
    );
    assert.equal(
      await page.locator('[data-thanks-title]').textContent(),
      'You’re on the list.',
    );
    assert.equal(
      await page.locator('#details-email').inputValue(),
      'review+club@example.com',
    );
    assert.equal(
      await page.locator('[name="role[]"][value=club]').isChecked(),
      true,
    );
    assert.equal(
      await page.evaluate(() => sessionStorage.getItem('labcast-signup')),
      null,
    );
    await page
      .locator('form')
      .evaluate((f) => f.removeAttribute('data-netlify'));
    await page.locator('#details-event').fill('Baseball club, spring season');
    responseStatus = 500;
    await page.locator('form button[type=submit]').click();
    await page
      .locator('#details-error')
      .filter({ hasText: 'earlier waitlist signup is unchanged' })
      .waitFor();
    assert.equal(
      await page.locator('#details-event').inputValue(),
      'Baseball club, spring season',
    );
    responseStatus = 200;
    await page.locator('form button[type=submit]').click();
    await page.locator('[data-details-success]').waitFor({ state: 'visible' });
    assert.match(
      await page.locator('[data-details-success]').textContent(),
      /help us understand/,
    );
    const details = new URLSearchParams(posts.at(-1));
    assert.equal(details.get('form-name'), 'details');
    assert.deepEqual(details.getAll('role[]'), ['club']);
    assert.equal(details.has('access-contact'), false);
    check(
      'Optional details associate by email, preserve input on failure, and respect access-contact opt-in',
    );
    await page.reload({ waitUntil: 'networkidle' });
    assert.notEqual(
      await page.locator('[data-thanks-title]').textContent(),
      'You’re on the list.',
    );
    assert.equal(await page.locator('#details-email').inputValue(), '');
    check(
      'Direct or refreshed thanks page does not fabricate signup confirmation',
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async () => {
            throw new Error('Denied');
          },
        },
        configurable: true,
      }),
    );
    await page.locator('[data-share]').click();
    assert.match(
      await page.locator('[data-share-status]').textContent(),
      /link below/,
    );
    check('Sharing offers a usable fallback when clipboard access fails');
    const reduced = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 390, height: 844 },
    });
    const rp = await reduced.newPage();
    await rp.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await rp.locator('[data-story].is-enhanced').count(), 0);
    assert.equal(
      await rp.locator('[data-scene]:not([aria-hidden])').count(),
      7,
    );
    check(
      'Reduced motion retains all seven illustrated feature scenes without pinning',
    );
    await reduced.close();
    const nojs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const np = await nojs.newPage();
    await np.goto(base);
    assert.equal(await np.locator('#navigation').isVisible(), true);
    assert.equal(await np.locator('form').getAttribute('method'), 'POST');
    assert.equal(await np.locator('form').getAttribute('action'), '/thanks/');
    assert.equal(await np.locator('[data-story].is-enhanced').count(), 0);
    assert.equal(
      await np.locator('[data-scene]:not([aria-hidden])').count(),
      7,
    );
    check(
      'No-JavaScript navigation, native POST form, and static broadcast remain available',
    );
    await nojs.close();
    for (const route of ['/', '/thanks/', '/privacy/', '/credits/']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('h1').count(), 1);
      assert.doesNotMatch(
        await page.locator('body').innerText(),
        /prototype|pilot|built at a hackathon/i,
      );
      await page.locator('img').evaluateAll((imgs) =>
        Promise.all(
          imgs.map((img) => {
            img.loading = 'eager';
            return img.decode().catch(() => {});
          }),
        ),
      );
      const broken = await page
        .locator('img')
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
        );
      assert.deepEqual(broken, []);
    }
    check('All public pages render with one main heading and loaded images');
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/hero.png` });
    await page.screenshot({ path: `${out}/desktop.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/mobile-hero.png` });
    await page.screenshot({ path: `${out}/mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: `${out}/tablet.png`, fullPage: true });
    await page.goto(base + '/thanks/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/thanks.png`, fullPage: true });
    results.complete = true;
    results.externalRequests = [
      ...new Set(results.requests.filter((x) => !x.startsWith(base))),
    ];
    delete results.requests;
    assert.equal(results.errors.length, 0);
    assert.equal(results.externalRequests.length, 0);
    check('No JavaScript errors or third-party browser requests');
    fs.writeFileSync(`${out}/checks.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
    assert.ok(
      results.accessibility.every((x) => !x.violations.length),
      'Accessibility violations',
    );
  } finally {
    await browser.close();
    fs.writeFileSync(`${out}/checks.json`, JSON.stringify(results, null, 2));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
