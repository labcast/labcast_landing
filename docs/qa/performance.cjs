const { chromium } = require('playwright');
const fs = require('node:fs');
const out =
  process.env.LABCAST_QA_OUTPUT ||
  require('node:path').resolve(__dirname, '../preview');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.LABCAST_CHROME || undefined,
  });
  const results = [];
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 75000,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.measurements = { lcp: 0, cls: 0, events: [] };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          window.measurements.lcp = e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.measurements.cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (e.interactionId)
            window.measurements.events.push({
              name: e.name,
              duration: e.duration,
            });
      }).observe({ type: 'event', durationThreshold: 16, buffered: true });
    });
    await page.goto(
      (process.env.LABCAST_BASE_URL || 'http://127.0.0.1:4321') + '/',
      { waitUntil: 'networkidle' },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const initial = await page.evaluate(() => ({
      ...window.measurements,
      resources: performance.getEntriesByType('resource').map((r) => ({
        name: new URL(r.name).pathname,
        bytes: r.transferSize,
        decoded: r.decodedBodySize,
      })),
      navigationBytes:
        performance.getEntriesByType('navigation')[0].transferSize,
    }));
    await page.locator('summary').first().click();
    await page.waitForTimeout(700);
    await page.locator('summary').first().click();
    await page.waitForTimeout(700);
    const events = await page.evaluate(() => window.measurements.events);
    results.push({
      device: name,
      viewport: { width, height },
      conditions:
        'Cold browser cache; 150 ms simulated latency; 1.6 Mbps download; 4× CPU slowdown; local Astro preview, responses as served',
      lcpMs: initial.lcp,
      cls: initial.cls,
      totalInitialTransferBytes:
        initial.navigationBytes +
        initial.resources.reduce((a, x) => a + x.bytes, 0),
      resources: initial.resources,
      scriptedInteractionEvents: events,
      note: 'Laboratory sample only. Event durations are not field INP; no production percentile is established.',
    });
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(`${out}/performance.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
