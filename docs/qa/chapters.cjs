const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321';
const out =
  process.env.LABCAST_QA_OUTPUT || path.resolve(__dirname, '../preview');
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.LABCAST_CHROME || undefined,
  });
  const result = { checks: [], errors: [] };
  try {
    for (const [width, height] of [
      [1440, 1000],
      [390, 844],
    ]) {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('pageerror', (e) => result.errors.push(e.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      const g = await page.locator('[data-story]').evaluate((root) => ({
        start:
          root.getBoundingClientRect().top +
          scrollY +
          parseFloat(getComputedStyle(root).borderTopWidth) -
          document.querySelector('.header').getBoundingClientRect().height,
        range:
          root.scrollHeight - root.querySelector('.story-sticky').offsetHeight,
      }));
      const go = async (chapter) => {
        await page.evaluate(
          ({ g, chapter }) =>
            scrollTo({
              top: g.start + (g.range * chapter) / 7,
              behavior: 'instant',
            }),
          { g, chapter },
        );
        await page.waitForTimeout(700);
      };
      await go(1.3);
      await page.evaluate(() => {
        window.blockedWheels = [];
        window.addEventListener('wheel', (e) =>
          window.blockedWheels.push(e.defaultPrevented),
        );
      });
      const before = await page.evaluate(() => scrollY);
      for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 80);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(150);
      assert.ok(
        (await page.evaluate(() => scrollY)) - before > 350,
        'Every small wheel movement reaches the page',
      );
      assert.deepEqual(await page.evaluate(() => window.blockedWheels), [
        false,
        false,
        false,
        false,
        false,
      ]);
      result.checks.push(
        `Native wheel scrolling is never blocked at ${width}px`,
      );
      await go(1.7);
      // The same image node must remain opaque and stationary during all
      // middle feature transitions, including when a gesture stops mid-fade.
      const initial = await page.locator('[data-broadcast="1"]').boundingBox();
      for (const chapter of [2.02, 3.02, 4.02, 3.98, 2.98]) {
        await page.evaluate(
          ({ g, chapter }) =>
            scrollTo({
              top: g.start + (g.range * chapter) / 7,
              behavior: 'instant',
            }),
          { g, chapter },
        );
        for (let sample = 0; sample < 8; sample++) {
          await page.waitForTimeout(60);
          const state = await page.evaluate(() => ({
            imageOpacity: getComputedStyle(
              document.querySelector('[data-broadcast="1"]'),
            ).opacity,
            copies: [...document.querySelectorAll('[data-scene]')]
              .filter((s) => getComputedStyle(s).visibility === 'visible')
              .map(
                (s) =>
                  +getComputedStyle(s.querySelector('.scene-copy')).opacity,
              )
              .filter((o) => o > 0.01).length,
          }));
          assert.equal(state.imageOpacity, '1');
          assert.ok(state.copies <= 1, 'Headlines never overlap during fades');
          const box = await page.locator('[data-broadcast="1"]').boundingBox();
          assert.ok(
            Math.abs(box.y - initial.y) < 1 &&
              Math.abs(box.height - initial.height) < 1,
            'Persistent picture stays in place',
          );
        }
      }
      result.checks.push(
        `Broadcast persists through forward/reverse fades, with no overlapping headlines at ${width}px`,
      );
      await page.mouse.wheel(0, 20000);
      await page.waitForTimeout(500);
      assert.ok(
        await page.evaluate((g) => scrollY > g.start + g.range, g),
        'Large swipe exits story freely',
      );
      await page.mouse.wheel(0, -20000);
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(() => scrollY), 0);
      result.checks.push(
        `Large wheel movement freely exits both ends at ${width}px`,
      );
      await go(6.5);
      assert.equal(await page.locator('.destinations li svg').count(), 4);
      await page.screenshot({ path: `${out}/platforms-${width}.png` });
      await page.locator('.closing').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/closing-${width}.png` });
      await page.locator('.footer').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/footer-${width}.png` });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.close();
    }
    const phone = await browser.newPage({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    await phone.goto(base, { waitUntil: 'networkidle' });
    await phone.locator('[data-story]').evaluate((r) =>
      scrollTo({
        top: r.getBoundingClientRect().top + scrollY + 1000,
        behavior: 'instant',
      }),
    );
    await phone.waitForTimeout(300);
    const before = await phone.evaluate(() => scrollY);
    const client = await phone.context().newCDPSession(phone);
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 190, y: 600 }],
    });
    for (const y of [560, 500, 420, 340, 260]) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 190, y }],
      });
      await phone.waitForTimeout(60);
    }
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await phone.waitForTimeout(400);
    assert.ok((await phone.evaluate(() => scrollY)) - before > 200);
    result.checks.push('Phone swipes scroll natively through the story');
    assert.deepEqual(result.errors, []);
    result.complete = true;
    console.log(JSON.stringify(result, null, 2));
  } finally {
    fs.writeFileSync(`${out}/chapters.json`, JSON.stringify(result, null, 2));
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
