import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const slugs = ['izmenenie-cen', 'udalenie', 'izmenenie-tovarov', 'arhivirovanie', 'import', 'izmenenie-dokumentov'];
const origin = 'https://truetell-retail.ru';
const productPath = '/moysklad-mass-operations/';

test('scenario pages share the application identity and keep unfinished screenshots out of search', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const titles = new Set();
  for (const slug of slugs) {
    const path = `/moysklad-${slug}/`;
    const filename = `dist${path}index.html`;
    assert(existsSync(filename), `Missing scenario: ${slug}`);
    const doc = new JSDOM(readFileSync(filename, 'utf8')).window.document;
    assert.equal(doc.querySelectorAll('main h1').length, 1);
    assert.equal(doc.querySelector('link[rel="canonical"]').href, origin + path);
    const graph = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    assert.equal(graph.find(node => node['@type'] === 'WebPage').about['@id'], `${origin}${productPath}#application`);
    assert(!graph.some(node => ['BlogPosting', 'SoftwareApplication'].includes(node['@type'])));
    const pending = doc.querySelectorAll('[data-screenshot-pending]').length;
    const images = doc.querySelectorAll('main figure img').length;
    assert(images + pending >= 2, `Missing scenario visuals: ${slug}`);
    if (pending) {
      assert.match(doc.querySelector('meta[name="robots"]').content, /noindex/);
      assert(!sitemap.includes(`<loc>${origin}${path}</loc>`), `Unfinished scenario in sitemap: ${slug}`);
    } else {
      assert.equal(doc.querySelector('meta[name="robots"]').content, 'index, follow');
      assert(sitemap.includes(`<loc>${origin}${path}</loc>`));
    }
    titles.add(doc.title);
  }
  assert.equal(titles.size, slugs.length);
});

test('old nested scenario URLs redirect to their root-level replacements', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const rewriteRules = readFileSync('dist/.htaccess', 'utf8').split('\n')
    .map(line => line.trim().match(/^RewriteRule (\S+) (\S+) \[R=301,L,NE\]$/))
    .filter(Boolean);
  for (const slug of slugs) {
    const oldPath = `${productPath}${slug}/`;
    const target = `${origin}/moysklad-${slug}/`;
    const doc = new JSDOM(readFileSync(`dist${oldPath}index.html`, 'utf8')).window.document;
    assert.equal(doc.querySelector('link[rel="canonical"]').href, target);
    assert.match(doc.querySelector('meta[name="robots"]').content, /noindex/);
    const refresh = doc.querySelector('meta[http-equiv="refresh" i]').content.match(/^0;\s*url=(.+)$/i);
    assert(refresh, `Missing immediate redirect: ${oldPath}`);
    assert.equal(new URL(refresh[1], origin + oldPath).href, target);
    assert(!sitemap.includes(`<loc>${origin}${oldPath}</loc>`));
    for (const suffix of ['', '/', '/index.html']) {
      const requestPath = `moysklad-mass-operations/${slug}${suffix}`;
      const rule = rewriteRules.find(([, pattern]) => new RegExp(pattern).test(requestPath));
      assert(rule, `Missing permanent redirect: ${requestPath}`);
      assert.equal(requestPath.replace(new RegExp(rule[1]), rule[2]), target);
    }
  }
});
