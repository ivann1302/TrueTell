import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { JSDOM } from 'jsdom';

export function sitemapUrls(xml, site) {
  const document = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  if (document.documentElement.localName !== 'urlset') throw new Error('Expected a sitemap urlset');
  const urls = [...new Set([...document.querySelectorAll('url > loc')].map((el) => el.textContent.trim()))];
  if (!urls.length) throw new Error('Sitemap is empty');
  for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== site || url.username || url.password || url.hash || url.search) {
      throw new Error(`Invalid production URL: ${value}`);
    }
    if (decodeURIComponent(url.pathname).split('/').some((part) => part === '..')) throw new Error('Unsafe path');
  }
  return urls;
}

export async function request(url, options = {}, fetcher = fetch, sleep = delay) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetcher(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(30000) });
      if ([200, 202].includes(response.status)) return response;
      if (response.status !== 429 && response.status < 500) throw new Error(`HTTP ${response.status} from ${url}`);
      if (attempt === 3) throw new Error(`HTTP ${response.status} from ${url}`);
    } catch (error) {
      if (attempt === 3 || /^HTTP /.test(error.message)) throw error;
    }
    await sleep(5000 * 2 ** attempt);
  }
}

async function main() {
  const { site, indexNowKey: key } = JSON.parse(await readFile(new URL('./deployment.json', import.meta.url), 'utf8'));
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('Invalid IndexNow key');
  const xml = await readFile('dist/sitemap.xml', 'utf8');
  const urls = sitemapUrls(xml, site);
  for (const url of urls) {
    const path = decodeURIComponent(new URL(url).pathname);
    const html = await readFile(resolve('dist', `.${path}`, 'index.html'), 'utf8');
    const document = new JSDOM(html).window.document;
    if (document.querySelector('link[rel="canonical"]')?.href !== url) throw new Error(`Canonical mismatch: ${url}`);
    if (/noindex/i.test(document.querySelector('meta[name="robots"]')?.content ?? '')) throw new Error(`Noindex URL: ${url}`);
  }
  if ((await readFile(`dist/${key}.txt`, 'utf8')).trim() !== key) throw new Error('Key file mismatch');
  if (!(await readFile('dist/robots.txt', 'utf8')).includes(`Sitemap: ${site}/sitemap.xml`)) throw new Error('Missing robots sitemap');
  console.log(`Validated ${urls.length} production URLs and IndexNow key`);
  if (process.argv.includes('--check')) return;

  // Check public files before submitting URLs; allow time for hosting propagation.
  let published = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const liveKey = await (await request(`${site}/${key}.txt`)).text();
      const liveXml = await (await request(`${site}/sitemap.xml`)).text();
      if (liveKey.trim() === key && liveXml === xml) { published = true; break; }
    } catch (error) {
      console.warn(`Publication check: ${error.message}`);
    }
    if (attempt < 3) await delay(10000);
  }
  if (!published) throw new Error('Published key/sitemap do not match the deployed build');
  for (let start = 0; start < urls.length; start += 10000) {
    const urlList = urls.slice(start, start + 10000);
    const response = await request('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
    });
    console.log(`IndexNow: HTTP ${response.status}, ${urlList.length} URLs${response.status === 202 ? ' (key validation pending)' : ''}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
