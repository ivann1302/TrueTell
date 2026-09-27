// Run against dist after npm run build. Supply PUPPETEER_MODULE and CHROMIUM_PATH.
// Production-origin requests are served from dist; analytics is stubbed, never sent to Yandex.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { default: puppeteer } = await import(pathToFileURL(process.env.PUPPETEER_MODULE).href);
const output = path.resolve('docs/superpowers/plans/privacy-implemented');
await fs.mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] });
const key = 'truetell.privacy.v1';
const origin = 'https://truetell-retail.test';
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
async function pageIn(context, width=390, height=844) {
  const page = await context.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.errors = [];
  page.analyticsRequests = [];
  page.on('pageerror', e => page.errors.push(e.message));
  await page.setRequestInterception(true);
  page.on('request', async req => {
    const url = new URL(req.url());
    if (url.hostname === 'mc.yandex.ru') {
      page.analyticsRequests.push(url.pathname);
      return req.respond({ status: 200, contentType: 'application/javascript', body: 'window.counterCalls=[]; window.ym=(...args)=>window.counterCalls.push(args);' });
    }
    if (url.origin !== origin) return req.abort();
    let filename = decodeURIComponent(url.pathname);
    if (filename.endsWith('/')) filename += 'index.html';
    try { return req.respond({ status: 200, contentType: types[path.extname(filename)] ?? 'application/octet-stream', body: await fs.readFile(path.join(process.cwd(), 'dist', filename)) }); }
    catch { return req.respond({ status: 404, body: 'Not found' }); }
  });
  return page;
}
const visibleBanner = page => page.$eval('[data-cookie-banner]', el => !el.hidden);
const read = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)),key);
try {
  for (const width of [320,390,768,1440]) {
    const context = await browser.createBrowserContext();
    const page = await pageIn(context,width,width===1440?1000:844);
    await page.goto(origin+'/', {waitUntil:'networkidle0'});
    assert.equal(await visibleBanner(page),true);
    assert.equal(page.analyticsRequests.length,0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    if ([390,1440].includes(width)) await page.screenshot({path:`${output}/banner-${width}.png`});
    await page.click('[data-cookie-banner] [data-cookie-open]');
    assert.equal(await page.$eval('dialog',el=>el.open),true);
    assert.equal(await page.$eval('[data-cookie-toggle]',el=>el.checked),false);
    const size=await page.$eval('dialog',el=>({height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width}));
    assert(size.height<420,`dialog too large: ${JSON.stringify(size)}`);
    if ([390,1440].includes(width)) await page.screenshot({path:`${output}/settings-${width}.png`});
    await page.click('[data-cookie-toggle]');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('[data-cookie-banner]').hidden);
    assert.equal(await visibleBanner(page),true);
    assert.equal(page.analyticsRequests.length,0);
    await page.click('[data-cookie-reject]');
    assert.equal((await read(page)).analytics,false);
    await page.reload({waitUntil:'networkidle0'});
    assert.equal(await visibleBanner(page),false);
    assert.equal(page.analyticsRequests.length,0);
    await page.$eval('footer [data-cookie-open]',el=>el.click());
    await page.click('[data-cookie-toggle]');
    await page.click('[data-cookie-save]');
    await page.waitForFunction(()=>window.counterCalls?.some(c=>c[1]==='init'));
    assert.equal(page.analyticsRequests.length,1);
    const options=await page.evaluate(()=>window.counterCalls.find(c=>c[1]==='init')[2]);
    assert.equal(options.webvisor,false);
    assert.equal(options.clickmap,false);
    await page.$eval('footer [data-cookie-open]',el=>el.click());
    await page.click('[data-cookie-toggle]');
    await page.click('[data-cookie-save]');
    await page.waitForFunction(()=>window.counterCalls.some(c=>c[1]==='destruct'));
    assert.equal((await read(page)).analytics,false);
    await page.reload({waitUntil:'networkidle0'});
    assert.equal(page.analyticsRequests.length,1);
    assert.deepEqual(page.errors,[]);
    console.log({viewport:width,...size,checks:'consent, refusal, cancel draft, revoke, reload, network gate passed'});
    await context.close();
  }
  const context=await browser.createBrowserContext();
  const page=await pageIn(context);
  await page.goto(origin+'/',{waitUntil:'networkidle0'});
  await page.click('[data-cookie-accept]');
  await page.waitForFunction(()=>window.counterCalls?.length);
  const second=await pageIn(context);
  await second.goto(origin+'/cookies/',{waitUntil:'networkidle0'});
  assert.equal(await visibleBanner(second),false);
  await page.$eval('footer [data-cookie-open]',el=>el.click());
  await page.click('[data-cookie-toggle]');
  await page.click('[data-cookie-save]');
  await second.waitForFunction(()=>window.counterCalls?.some(c=>c[1]==='destruct'));
  console.log('Cross-tab revocation passed');
  await context.close();

  const blocked=await browser.createBrowserContext();
  const bp=await pageIn(blocked);
  await bp.evaluateOnNewDocument(()=>{Storage.prototype.setItem=function(){throw new Error('denied');};});
  await bp.goto(origin+'/',{waitUntil:'networkidle0'});
  await bp.click('[data-cookie-accept]');
  await bp.waitForFunction(()=>window.counterCalls?.length);
  await bp.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow')));
  assert.equal(await visibleBanner(bp),false);
  assert.match(await bp.$eval('[data-cookie-status]',el=>el.textContent),/не сохраняет/);
  await bp.reload({waitUntil:'networkidle0'});
  assert.equal(await visibleBanner(bp),true);
  assert.equal(bp.analyticsRequests.length,1);
  assert.deepEqual(bp.errors,[]);
  console.log('Unavailable storage: in-page choice and fail-closed reload passed');
  await blocked.close();

  const stale=await browser.createBrowserContext();
  const sp=await pageIn(stale);
  await sp.goto(origin+'/',{waitUntil:'networkidle0'});
  await sp.click('[data-cookie-accept]');
  await sp.waitForFunction(()=>window.counterCalls?.length);
  await sp.evaluate(()=>{Storage.prototype.setItem=function(){throw new Error('quota');};});
  await sp.$eval('footer [data-cookie-open]',el=>el.click());
  await sp.click('[data-cookie-toggle]');
  await sp.click('[data-cookie-save]');
  await sp.reload({waitUntil:'networkidle0'});
  assert.equal(sp.analyticsRequests.length,1,'failed storage write must not resurrect an old grant after refusal');
  await stale.close();

  const accessible=await browser.createBrowserContext();
  const ap=await pageIn(accessible,844,390);
  await ap.goto(origin+'/',{waitUntil:'networkidle0'});
  await ap.click('[data-cookie-banner] [data-cookie-open]');
  for(let i=0;i<8;i++) {
    await ap.keyboard.press('Tab');
    const focused = await ap.evaluate(()=>({inside:document.querySelector('dialog').contains(document.activeElement),tag:document.activeElement?.tagName,html:document.activeElement?.outerHTML.slice(0,200)}));
    assert.equal(focused.inside,true,JSON.stringify({i,...focused}));
  }
  await ap.click('dialog summary');
  await ap.$eval('[data-cookie-save]',el=>el.focus());
  assert.equal(await ap.$eval('[data-cookie-save]',el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),true);
  await ap.keyboard.press('Escape');
  await ap.waitForFunction(()=>document.activeElement?.hasAttribute('data-cookie-open'));
  assert.equal(await ap.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log('Landscape, expanded details, keyboard focus, Escape and focus return passed');
  await accessible.close();

  for (const width of [390,1440]) {
    const documents=await browser.createBrowserContext();
    const dp=await pageIn(documents,width,width===1440?1000:844);
    await dp.goto(origin+'/cookies/',{waitUntil:'networkidle0'});
    await dp.click('[data-cookie-reject]');
    await dp.waitForFunction(()=>!document.querySelector('[data-cookie-status]').textContent);
    for(const route of ['cookies','privacy','analytics-consent']) {
      await dp.goto(origin+'/'+route+'/',{waitUntil:'networkidle0'});
      assert.equal(await dp.$$eval('h1',els=>els.length),1);
      assert.equal(await dp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await dp.screenshot({path:`${output}/${route}-${width}.png`});
    }
    await dp.$eval('footer',el=>el.scrollIntoView({behavior:'instant',block:'end'}));
    await dp.screenshot({path:`${output}/footer-${width}.png`});
    assert.deepEqual(dp.errors,[]);
    await documents.close();
  }
  console.log('Documents and footer checked at 390/1440 px');

  const nojs=await browser.createBrowserContext();
  const np=await pageIn(nojs); await np.setJavaScriptEnabled(false);
  await np.goto(origin+'/cookies/',{waitUntil:'networkidle0'});
  assert.equal(np.analyticsRequests.length,0);
  assert.equal(await np.$eval('[data-cookie-banner]',el=>el.hidden),true);
  assert.match(await np.$eval('main',el=>el.innerText),/JavaScript отключён/);
  console.log('No-JS: document readable, no tracking pixel passed');
  await nojs.close();
} finally { await browser.close(); }
