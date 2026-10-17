const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out =
  process.env.LABCAST_QA_OUTPUT || path.resolve(__dirname, '../preview');
const base = process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.LABCAST_CHROME || undefined,
  });
  const results = { checks: [], frames: [], errors: [] };
  try {
    for (const [width, height] of [
      [1440, 1000],
      [390, 844],
    ]) {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('pageerror', (e) => results.errors.push(e.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      const geometry = await page.locator('[data-story]').evaluate((el) => ({
        top: el.getBoundingClientRect().top + scrollY,
        range: el.scrollHeight - el.querySelector('.story-sticky').offsetHeight,
        header: document.querySelector('.header').getBoundingClientRect()
          .height,
      }));
      assert.ok(
        geometry.range > 2000,
        'Scroll scene has allocated reading space',
      );
      for (let i = 0; i < 7; i++) {
        await page.evaluate(
          ({ g, i }) =>
            scrollTo({
              top: g.top - g.header + g.range * ((i + 0.48) / 7),
              behavior: 'instant',
            }),
          { g: geometry, i },
        );
        await page.waitForTimeout(1000);
        assert.equal(
          await page.locator('[data-story]').getAttribute('data-active-scene'),
          String(i),
        );
        assert.equal(
          await page.locator('[data-scene][aria-hidden=false]').count(),
          1,
        );
        const box = await page.locator('.story-sticky').boundingBox();
        assert.ok(
          Math.abs(box.y - geometry.header) < 3,
          `Scene stays pinned at ${width}/${i}`,
        );
        const visible = await page
          .locator(`[data-scene="${i}"] .scene-art`)
          .evaluate((el) => Number(getComputedStyle(el).opacity));
        assert.ok(visible > 0.95, `Scene artwork visible ${width}/${i}`);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        assert.equal(overflow, false);
        await page.screenshot({ path: `${out}/scene-${width}-${i}.png` });
        results.frames.push({
          width,
          scene: i,
          pinnedTop: box.y,
          artOpacity: visible,
          overflow,
        });
      }
      await page.evaluate(
        (g) =>
          scrollTo({
            top: g.top - g.header + g.range * (2.48 / 7),
            behavior: 'instant',
          }),
        geometry,
      );
      await page.waitForTimeout(1000);
      assert.equal(
        await page.locator('[data-story]').getAttribute('data-active-scene'),
        '2',
      );
      const still = await page
        .locator('.scene-2 .scene-picture')
        .getAttribute('style');
      await page.waitForTimeout(500);
      assert.equal(
        await page.locator('.scene-2 .scene-picture').getAttribute('style'),
        still,
      );
      results.checks.push(
        `All seven scenes, reverse scrolling, stationary hold, and pinning at ${width}px`,
      );
      // Stop just before and after every chapter boundary. Previously these
      // positions could leave two scrubbed crossfades permanently transparent.
      for (let boundary = 1; boundary < 7; boundary++) {
        for (const offset of [-0.12, 0.02]) {
          const chapter = boundary + offset;
          await page.evaluate(
            ({ g, chapter }) =>
              scrollTo({
                top: g.top - g.header + g.range * (chapter / 7),
                behavior: 'instant',
              }),
            { g: geometry, chapter },
          );
          await page.waitForTimeout(900);
          const held = await page.locator('[data-story]').evaluate((root) => {
            const visible = [...root.querySelectorAll('[data-scene]')].filter(
              (el) => getComputedStyle(el).visibility === 'visible',
            );
            return {
              active: root.dataset.activeScene,
              visible: visible.length,
              opaque: visible.every(
                (el) =>
                  Number(getComputedStyle(el).opacity) === 1 &&
                  [...el.querySelectorAll('.scene-copy, .scene-art')].every(
                    (part) => Number(getComputedStyle(part).opacity) === 1,
                  ),
              ),
              unclipped: visible.every(
                (el) => getComputedStyle(el).clipPath === 'none',
              ),
            };
          });
          assert.equal(held.active, String(Math.floor(chapter)));
          assert.equal(held.visible, 1);
          assert.equal(held.opaque, true);
          assert.equal(held.unclipped, true);
        }
      }
      for (const chapter of [1.02, 2.02, 1.98, 5.01, 4.99]) {
        await page.evaluate(
          ({ g, chapter }) =>
            scrollTo({
              top: g.top - g.header + g.range * (chapter / 7),
              behavior: 'instant',
            }),
          { g: geometry, chapter },
        );
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(900);
      assert.equal(
        await page.locator('[data-story]').getAttribute('data-active-scene'),
        '4',
      );
      assert.equal(await page.locator('[data-scene]:visible').count(), 1);
      assert.equal(
        await page
          .locator('.scene-4')
          .evaluate((el) => getComputedStyle(el).clipPath),
        'none',
      );
      await page.screenshot({ path: `${out}/transition-hold-${width}.png` });
      results.checks.push(
        `Stopped boundary transitions and rapid direction changes settle to one opaque scene at ${width}px`,
      );
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(200);
      assert.equal(await page.locator('[data-story].is-enhanced').count(), 0);
      assert.equal(await page.locator('[data-scene][aria-hidden]').count(), 0);
      assert.equal(await page.locator('[data-scene][inert]').count(), 0);
      results.checks.push(
        `Changing reduced-motion preference restores every scene at ${width}px`,
      );
      await page.close();
    }
    const small = await browser.newPage({
      viewport: { width: 900, height: 600 },
    });
    await small.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await small.locator('[data-story].is-enhanced').count(), 0);
    assert.equal(
      await small.locator('[data-scene]:not([aria-hidden])').count(),
      7,
    );
    results.checks.push(
      'Short landscape viewport receives all seven static scenes',
    );
    assert.deepEqual(results.errors, []);
    results.complete = true;
    console.log(JSON.stringify(results, null, 2));
  } finally {
    fs.writeFileSync(`${out}/story.json`, JSON.stringify(results, null, 2));
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
