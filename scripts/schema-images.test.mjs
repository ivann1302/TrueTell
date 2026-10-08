import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import { allArticles, isPublicArticle } from '../src/config/articles.ts';

const origin = 'https://truetell-retail.ru';
const document = async pathname => new JSDOM(await readFile(`dist${pathname}index.html`, 'utf8')).window.document;

function* schemaObjects(value) {
  if (!value || typeof value !== 'object') return;
  if (!Array.isArray(value)) yield value;
  for (const child of Object.values(value)) yield* schemaObjects(child);
}

async function imageMetadata(value) {
  const url = new URL(value);
  assert.equal(url.origin, origin);
  return sharp(path.join('dist', decodeURIComponent(url.pathname))).metadata();
}

test('published articles expose their existing editorial image in structured data', async () => {
  for (const article of allArticles.filter(isPublicArticle)) {
    const doc = await document(`/${article.hrefPath}`);
    const nodes = [...doc.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(script => [...schemaObjects(JSON.parse(script.textContent))]);
    const node = nodes.find(node => ['Article', 'BlogPosting'].includes(node['@type']));
    assert(node?.image, `Missing Article.image: ${article.hrefPath}`);
    assert.equal(node.image, doc.querySelector('meta[property="og:image"]').content, article.hrefPath);
    const metadata = await imageMetadata(node.image);
    assert(metadata.width > 0 && metadata.height > 0, article.hrefPath);
  }
});

test('organizations use crawlable logo assets with accurate dimensions of at least 112px', async () => {
  const sitemap = new JSDOM(await readFile('dist/sitemap.xml', 'utf8'), { contentType: 'text/xml' }).window.document;
  for (const loc of sitemap.querySelectorAll('loc')) {
    const doc = await document(new URL(loc.textContent).pathname);
    const nodes = [...doc.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(script => [...schemaObjects(JSON.parse(script.textContent))]);
    for (const node of nodes.filter(node => node['@type'] === 'Organization')) {
      assert(node.logo?.url, `Missing Organization.logo: ${loc.textContent}`);
      const metadata = await imageMetadata(node.logo.url);
      assert(metadata.width >= 112 && metadata.height >= 112, `Undersized logo: ${loc.textContent}`);
      assert.equal(node.logo.width, metadata.width);
      assert.equal(node.logo.height, metadata.height);
    }
  }
});
