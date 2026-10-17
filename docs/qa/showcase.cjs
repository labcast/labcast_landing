const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out =
  process.env.LABCAST_QA_OUTPUT || path.resolve(__dirname, '../preview');
const base = process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321';
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.LABCAST_CHROME || undefined,
  });
  const result = { checks: [], errors: [] };
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.on('pageerror', (error) => result.errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);
    const layout = await page.evaluate(() => {
      const show = document.querySelector('.showcase');
      return {
        gap:
          document.querySelector('.waitlist').getBoundingClientRect().top -
          document.querySelector('.hero-description').getBoundingClientRect()
            .bottom,
        x: show.getBoundingClientRect().x,
        width: show.getBoundingClientRect().width,
        insideHero: Boolean(show.closest('.hero')),
        belowHero:
          show.getBoundingClientRect().top >=
          document.querySelector('.hero').getBoundingClientRect().bottom,
        background: getComputedStyle(show).backgroundColor,
      };
    });
    assert.ok(layout.gap >= 18 && layout.gap <= 24);
    assert.ok(layout.x === 0 && layout.width === 1440);
    assert.equal(layout.insideHero, false);
    assert.equal(layout.belowHero, true);
    assert.equal(await page.locator('.audience-strip').count(), 0);
    await page.locator('.showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    result.checks.push(
      'Compact signup and a separate full-width event section replacing the green audience strip',
    );
    const x = () =>
      page
        .locator('.showcase-track')
        .evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
        );
    const first = await x();
    await page.waitForTimeout(600);
    assert.ok((await x()) < first - 5);
    assert.equal(await page.locator('.showcase button').count(), 0);
    result.checks.push(
      'Marquee starts automatically with no playback controls',
    );
    await page.locator('.showcase-window').hover();
    const hovered = await x();
    await page.waitForTimeout(400);
    assert.equal(await x(), hovered);
    await page.mouse.move(10, 10);
    await page.locator('.showcase-window').focus();
    const focused = await x();
    await page.waitForTimeout(400);
    assert.equal(await x(), focused);
    await page.locator('.showcase-window').evaluate((el) => el.blur());
    result.checks.push('Hover and keyboard focus pause the event cards');
    const bubbles = new Set();
    let wrapped = false;
    let previous = await x();
    for (let i = 0; i < 26; i++) {
      await page.waitForTimeout(1500);
      const state = await page.evaluate(() => {
        const frame = document
          .querySelector('.showcase-window')
          .getBoundingClientRect();
        const track = document.querySelector('.showcase-track');
        const visible = document.querySelector('.event-card.is-featured');
        return {
          x: new DOMMatrixReadOnly(getComputedStyle(track).transform).m41,
          covered: track.getBoundingClientRect().right >= frame.right,
          label: visible.querySelector('.event-bubble').textContent,
          bubbleTop: visible
            .querySelector('.event-bubble')
            .getBoundingClientRect().top,
          windowTop: frame.top,
          opacity: Number(
            getComputedStyle(visible.querySelector('.event-bubble')).opacity,
          ),
        };
      });
      assert.ok(state.covered, 'No blank gap at the marquee loop seam');
      assert.ok(
        state.bubbleTop >= state.windowTop + 8,
        'Bubble stays inside the unclipped upper space',
      );
      if (state.opacity > 0.9) bubbles.add(state.label);
      if (state.x > previous + 500) wrapped = true;
      previous = state.x;
      if (i === 8) await page.screenshot({ path: `${out}/marquee-demo.png` });
    }
    assert.equal(bubbles.size, 5);
    assert.ok(wrapped);
    result.bubbles = [...bubbles];
    result.checks.push(
      'All five event bubbles appear and the complete 35-second loop has no empty seam',
    );
    await page.evaluate(() =>
      scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
    );
    await page.waitForTimeout(400);
    const outside = await x();
    await page.waitForTimeout(400);
    assert.equal(await x(), outside);
    result.checks.push('Offscreen marquee stops animating');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(600);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(200);
    assert.equal(await page.locator('.showcase.is-moving').count(), 0);
    assert.equal(await page.locator('.event-card:visible').count(), 5);
    const accessibleList = await page
      .locator('.showcase-window')
      .evaluate((el) => ({
        overflow: getComputedStyle(el).overflowX,
        width: el.scrollWidth,
        viewport: el.clientWidth,
      }));
    assert.equal(accessibleList.overflow, 'auto');
    assert.ok(accessibleList.width > accessibleList.viewport);
    result.checks.push(
      'Reduced motion leaves five readable event cards in a native horizontal list',
    );
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const nojs = await context.newPage();
    await nojs.goto(base);
    assert.equal(await nojs.locator('.event-card:visible').count(), 5);
    assert.equal(await nojs.locator('#waitlist-email').isVisible(), true);
    result.checks.push(
      'No-JavaScript event list and waitlist remain available',
    );
    await context.close();
    assert.deepEqual(result.errors, []);
    result.complete = true;
    console.log(JSON.stringify(result, null, 2));
  } finally {
    fs.writeFileSync(`${out}/showcase.json`, JSON.stringify(result, null, 2));
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
