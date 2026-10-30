import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import { allArticles } from '../src/config/articles.ts';
import { selectDzenArticles } from './dzen-policy.mjs';

const origin = 'https://truetell-retail.ru';
const adaptations = JSON.parse(readFileSync('docs/seo/dzen/adaptations.json', 'utf8'));
const sections = JSON.parse(readFileSync('docs/seo/dzen/sections.json', 'utf8'));
const legacy = JSON.parse(readFileSync('docs/seo/dzen/legacy-exclusions.json', 'utf8'));
const xml = new JSDOM(readFileSync('dist/dzen.xml', 'utf8'), { contentType: 'text/xml' }).window.document;

test('a new published blog article cannot bypass the Dzen adaptation gate', () => {
  const sample = allArticles.find(article => article.type === 'blog' && article.status === 'published' && article.indexable);
  const future = { ...sample, hrefPath: 'future-blog/', publishedAt: '2026-10-30T12:00:00+03:00' };
  assert.throws(
    () => selectDzenArticles([...allArticles, future], adaptations, sections, legacy),
    /Missing Dzen adaptation: future-blog\//,
  );
  assert.throws(
    () => selectDzenArticles([...allArticles, future], adaptations, sections, { ...legacy, paths: [...legacy.paths, future.hrefPath] }),
    /Invalid legacy Dzen exclusion: future-blog\//,
  );
});

test('RSS contains each prepared published blog article exactly once, except manual publications', () => {
  assert.equal(xml.querySelector('parsererror'), null);
  const published = allArticles.filter(article => article.type === 'blog' && article.status === 'published' && article.indexable);
  const required = published.filter(article => !legacy.paths.includes(article.hrefPath));
  assert(required.length >= 10);
  for (const article of required) assert(adaptations[article.hrefPath], article.hrefPath);
  const expected = required
    .filter(article => adaptations[article.hrefPath].delivery !== 'manual')
    .map(article => new URL(article.hrefPath, origin + '/').href)
    .sort();
  const actual = [...xml.querySelectorAll('item')].map(item => item.querySelector('link')?.textContent).sort();
  assert.deepEqual(actual, expected);
  assert.equal(new Set(actual).size, actual.length);
});

test('RSS preserves the product link and includes usable local images', async () => {
  const mapping = [...xml.querySelectorAll('item')].find(item => item.querySelector('link')?.textContent?.endsWith('/karta-sootvetstviya-poley-bitrix24/'));
  assert(mapping);
  assert(mapping.getElementsByTagName('content:encoded')[0].textContent.includes('https://www.bitrix24.ru/apps/app/truetell.crm_fields/'));
  for (const item of xml.querySelectorAll('item')) {
    const cover = item.querySelector('enclosure')?.getAttribute('url');
    assert(cover, item.querySelector('link')?.textContent);
    const parsed = new URL(cover);
    assert.equal(parsed.origin, origin);
    const file = join('dist', decodeURIComponent(parsed.pathname).slice(1));
    const metadata = await sharp(file).metadata();
    assert(['jpeg', 'png', 'gif'].includes(metadata.format));
    assert((metadata.width ?? 0) >= 700);
    assert.equal(item.querySelector('enclosure')?.getAttribute('type'), `image/${metadata.format}`);
  }
});

test('audit article is in RSS and its editor copy has a product CTA and two uploadable images', () => {
  const folder = '.generated/dzen-editor-html/audit-poley-crm-bitrix24';
  const document = new JSDOM(readFileSync(join(folder, 'article.html'), 'utf8')).window.document;
  assert.equal(document.querySelector('h1')?.textContent, adaptations['audit-poley-crm-bitrix24/'].title);
  assert(document.querySelector('a[href="https://www.bitrix24.ru/apps/app/truetell.crm_fields/"]'));
  const images = [...document.querySelectorAll('figure img')];
  assert.equal(images.length, 2);
  for (const image of images) assert(statSync(join(folder, basename(new URL(image.src).pathname))).isFile());
  const rssItem = [...xml.querySelectorAll('item')].find(item => item.querySelector('link')?.textContent?.endsWith('/audit-poley-crm-bitrix24/'));
  assert(rssItem);
  assert(rssItem.getElementsByTagName('content:encoded')[0].textContent.includes('https://www.bitrix24.ru/apps/app/truetell.crm_fields/'));
});
