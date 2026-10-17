const { webkit, devices } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321';
const results = { checks: [], errors: [] };
(async () => {
  const browser = await webkit.launch();
  try {
    for (const height of process.env.LABCAST_SAFARI_HEIGHTS
      ? process.env.LABCAST_SAFARI_HEIGHTS.split(',').map(Number)
      : [739, 699, 659, 580]) {
      const page = await browser.newPage({
        ...devices['iPhone 15 Pro Max'],
        viewport: { width: 430, height },
      });
      page.on('pageerror', (e) => results.errors.push(e.message));
      if (height === 659)
        await page.route('**/*.css*', async (route) => {
          const response = await route.fetch();
          let css = await response.text();
          css = css.replace(
            /env\(safe-area-inset-(top|left|right|bottom)(?:,\s*0px)?\)/g,
            (_, edge) =>
              ({ top: 59, left: 0, right: 0, bottom: 34 })[edge] + 'px',
          );
          await route.fulfill({ response, body: css });
        });
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.equal(
        await page.locator('[data-story].is-enhanced').count(),
        1,
        `Animated story at ${height}px`,
      );
      const root = page.locator('html');
      assert.equal(await page.locator('[data-scroll-root]').count(), 0);
      assert.equal(
        await page
          .locator('.header')
          .evaluate((e) => getComputedStyle(e).position),
        'fixed',
      );
      const geometry = await page.locator('[data-story]').evaluate((el) => {
        const header = document
          .querySelector('.header')
          .getBoundingClientRect().height;
        return {
          start: el.getBoundingClientRect().top + window.scrollY + 3 - header,
          range: innerHeight * 7,
        };
      });
      for (const index of [0, 1, 2, 3, 4, 5, 6, 3, 0]) {
        await root.evaluate(
          (el, { g, index }) =>
            el.scrollTo({
              top: g.start + (g.range * (index + 0.4)) / 7,
              behavior: 'instant',
            }),
          { g: geometry, index },
        );
        await page.waitForTimeout(850);
        assert.equal(
          await page.locator('[data-story]').getAttribute('data-active-scene'),
          String(index),
          `Scene ${index} at ${height}px`,
        );
        assert.equal(await page.locator('[data-scene]:visible').count(), 1);
        const boxes = await page
          .locator(`[data-scene="${index}"]`)
          .evaluate((scene) => {
            const bounds = (e) => {
              const r = e.getBoundingClientRect();
              return { top: r.top, bottom: r.bottom, height: r.height };
            };
            return {
              header: bounds(document.querySelector('.header')),
              copy: bounds(scene.querySelector('.scene-copy')),
              art: bounds(scene.querySelector('.scene-art')),
              caption: bounds(document.querySelector('.story-caption')),
              overflow: document.documentElement.scrollWidth > innerWidth,
              outer: window.scrollY,
            };
          });
        assert.ok(boxes.outer > 0);
        assert.equal(boxes.header.top, 0);
        assert.equal(boxes.overflow, false);
        assert.ok(
          boxes.copy.top >= boxes.header.bottom - 1,
          JSON.stringify({ height, index, ...boxes }),
        );
        assert.ok(
          boxes.copy.bottom <= boxes.art.top + 1,
          JSON.stringify({ height, index, ...boxes }),
        );
        assert.ok(
          boxes.art.bottom <= boxes.caption.top + 1,
          JSON.stringify({ height, index, ...boxes }),
        );
        if (index === 6)
          await page.screenshot({
            path: `/tmp/labcast-safari-scene-${height}.png`,
          });
      }
      await page.locator('.menu-toggle').click();
      await page
        .locator('.navigation a')
        .filter({ hasText: 'Questions' })
        .click();
      await page.waitForTimeout(900);
      assert.equal(
        await page.locator('.menu-toggle').getAttribute('aria-expanded'),
        'false',
      );
      const questions = await page.locator('#questions').boundingBox();
      const header = await page.locator('.header').boundingBox();
      assert.ok(questions.y >= header.height - 1);
      await page
        .locator('html')
        .evaluate((e) => e.scrollTo({ top: 300, behavior: 'instant' }));
      await page.waitForTimeout(200);
      assert.ok((await root.evaluate((e) => e.scrollTop)) > 0);
      assert.ok((await page.evaluate(() => scrollY)) > 0);
      await page.screenshot({ path: `/tmp/labcast-safari-${height}.png` });
      results.checks.push(
        `430x${height}: all scenes forward/reverse, no overlap/cutoff, fixed header, native document scroll, menu anchors`,
      );
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(200);
      assert.equal(await page.locator('[data-story].is-enhanced').count(), 0);
      assert.equal(await page.locator('[data-scene][inert]').count(), 0);
      results.checks.push(
        `Reduced motion restores complete static story at ${height}px`,
      );
      await page.close();
    }
    const nojs = await browser.newPage({
      ...devices['iPhone 15 Pro Max'],
      javaScriptEnabled: false,
    });
    await nojs.goto(base, { waitUntil: 'networkidle' });
    assert.equal(
      await nojs
        .locator('.header')
        .evaluate((e) => getComputedStyle(e).position),
      'sticky',
    );
    assert.equal(await nojs.locator('[data-scene]').count(), 7);
    await nojs.close();
    results.checks.push(
      'No-JavaScript phone remains a native document with every scene',
    );
    assert.deepEqual(results.errors, []);
    results.complete = true;
    console.log(JSON.stringify(results, null, 2));
  } finally {
    fs.writeFileSync(
      '/tmp/labcast-safari-checks.json',
      JSON.stringify(results, null, 2),
    );
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
