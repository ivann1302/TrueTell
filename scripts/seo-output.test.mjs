import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { allArticles, isPublicArticle } from '../src/config/articles.ts';

const origin = 'https://truetell-retail.ru';
const document = async file => new JSDOM(await readFile(file, 'utf8')).window.document;

test('all sitemap routes have distinct metadata, one H1, self-canonical and matching Open Graph', async () => {
  const sitemap = new JSDOM(await readFile('dist/sitemap.xml', 'utf8'), { contentType: 'text/xml' }).window.document;
  const entries = [...sitemap.querySelectorAll('url')];
  assert.equal(sitemap.documentElement.namespaceURI, 'http://www.sitemaps.org/schemas/sitemap/0.9');
  const titles = new Set(), descriptions = new Set(), urls = new Set();
  for (const entry of entries) {
    const url = entry.querySelector('loc').textContent;
    const doc = await document(`dist${new URL(url).pathname}index.html`);
    assert(!urls.has(url)); urls.add(url);
    assert(!titles.has(doc.title), `Duplicate title: ${url}`); titles.add(doc.title);
    const description = doc.querySelector('meta[name="description"]').content;
    assert(description && !descriptions.has(description), `Duplicate/empty description: ${url}`); descriptions.add(description);
    assert.equal(doc.querySelectorAll('main h1').length, 1, url);
    assert.equal(doc.querySelector('link[rel="canonical"]').href, url);
    assert.equal(doc.querySelector('meta[property="og:url"]').content, url);
    assert(doc.querySelector('meta[property="og:title"]').content);
    assert(doc.querySelector('meta[property="og:description"]').content);
    assert.equal(entry.querySelector('lastmod')?.textContent, doc.querySelector('meta[property="article:modified_time"]')?.content);
  }
  // Historical URLs are regression expectations, not another production registry.
  for (const path of ['', 'products/', 'bitrix24-cleaner/', 'moysklad-mass-operations/', 'bi-analitika/', 'blog/', 'privacy/', 'cookies/', 'analytics-consent/', 'request-consent/', 'bitrix24-cleaner-license/', 'bitrix24-cleaner-privacy/']) {
    assert(urls.has(`${origin}/${path}`), `Lost original URL: ${path}`);
  }
});

test('article metadata and recorded dates reach HTML and the Article/BlogPosting schema', async () => {
  for (const article of allArticles.filter(isPublicArticle)) {
    const doc = await document(`dist/${article.hrefPath}index.html`);
    assert.equal(doc.title, article.seoTitle ?? article.title);
    assert.equal(doc.querySelector('meta[name="description"]').content, article.description);
    assert.equal(doc.querySelector('meta[property="article:modified_time"]')?.content, article.updatedAt);
    const nodes = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(script => JSON.parse(script.textContent)['@graph'] ?? []);
    const node = nodes.find(node => ['Article', 'BlogPosting'].includes(node['@type']));
    assert.equal(node['@type'], article.type === 'knowledge' ? 'Article' : 'BlogPosting');
    assert.equal(node.datePublished, article.publishedAt);
    assert.equal(node.dateModified, article.updatedAt ?? article.publishedAt);
    const breadcrumb = nodes.find(node => node['@type'] === 'BreadcrumbList');
    const section = article.type === 'knowledge' ? 'knowledge-base/' : 'blog/';
    assert.equal(breadcrumb.itemListElement[1].item, `${origin}/${section}`);
    assert(doc.querySelector(`main a[href="/${section}"]`));
  }
});
