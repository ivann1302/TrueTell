// Local visual review. External requests are blocked; no analytics or deployment.
// Set PUPPETEER_MODULE, CHROMIUM_PATH and optionally SEO_REVIEW_OUTPUT.
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE).href);
const output = process.env.SEO_REVIEW_OUTPUT ?? '/private/tmp/truetell-seo-review';
await mkdir(output, { recursive: true });
const origin = 'https://truetell-retail.test';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true,
  args: ['--no-sandbox'], userDataDir: '/private/tmp/truetell-seo-chrome' });
const routes = ['/knowledge-base/', '/blog/', '/bitrix24-cleaner/', '/backup-moysklad/', '/upravlenie-rezervami-moysklad/', '/bi-analitika/', '/kak-snyat-rezervy-moysklad/', '/udalennye-lidy-bitrix24/'];
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: width === 1440 ? 1000 : 844, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => localStorage.setItem('truetell.privacy.v1', JSON.stringify({ version: 1, analytics: false, savedAt: Date.now(), expiresAt: Date.now() + 180 * 86400000 })));
    await page.setRequestInterception(true);
    page.on('request', async request => {
      const url = new URL(request.url());
      if (url.origin !== origin) return request.abort();
      const name = decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : '');
      try { await request.respond({ status: 200, contentType: mime[path.extname(name)] ?? 'application/octet-stream', body: await readFile(path.join(process.cwd(), 'dist', name)) }); }
      catch { await request.respond({ status: 404, body: 'Not found' }); }
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(origin + route, { waitUntil: 'networkidle0' });
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll('main h1').length,
        alignment: getComputedStyle(document.querySelector('main h1')).textAlign,
        islands: document.querySelectorAll('main astro-island').length,
      }));
      assert.equal(layout.overflow, false, `Horizontal overflow ${route} at ${width}`);
      assert.equal(layout.h1, 1, `H1 ${route}`);
      if (width <= 768) assert.equal(layout.alignment, 'center', `Mobile hero alignment ${route}`);
      if (['/knowledge-base/', '/blog/'].includes(route)) assert.equal(layout.islands, 0);
      if (route === '/knowledge-base/') {
        await page.click('main a[href="#moysklad"]');
        assert.equal(await page.$eval('section#moysklad', el => el.querySelectorAll('li a').length), 2);
        await page.keyboard.press('Tab');
        await page.$eval('section#moysklad a', el => el.focus());
        assert.notEqual(await page.$eval('section#moysklad a', el => getComputedStyle(el).outlineStyle), 'none');
      }
      const scrollableMaterials = await page.evaluate(() => {
        const track = document.querySelector('[aria-labelledby="related-articles-title"] [data-carousel-track]');
        return !!track && track.scrollWidth - track.clientWidth > 2;
      });
      if (scrollableMaterials) {
        await page.click('[aria-labelledby="related-articles-title"] [data-carousel-next]');
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert(await page.$eval('[aria-labelledby="related-articles-title"] [data-carousel-track]', el => el.scrollLeft > 0));
        await page.$eval('[aria-labelledby="related-articles-title"] [data-carousel-track]', el => el.focus());
        await page.keyboard.press('ArrowLeft');
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await page.$eval('[aria-labelledby="related-articles-title"] [data-carousel-track]', el => el.scrollLeft), 0);
      }
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: path.join(output, `${route.split('/')[1]}-${width}.png`), fullPage: true });
        const materials = await page.$('[aria-labelledby="related-articles-title"]');
        if (materials) {
          await page.$eval('[aria-labelledby="related-articles-title"]', element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
          await page.evaluate(() => window.scrollBy(0, -120));
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          await page.screenshot({ path: path.join(output, `${route.split('/')[1]}-materials-${width}.png`) });
        }
      }
      results.push({ route, width, ...layout });
    }
    assert.deepEqual(errors, [], `Browser script errors at ${width}`);
    await page.close();
  }
  console.log(JSON.stringify({ views: results.length, widths: [320, 390, 768, 1440], results, output }, null, 2));
} finally { await browser.close(); }
