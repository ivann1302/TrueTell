import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

// A missing publisher logo or a URL that does not resolve to a built asset
// must fail, including on other consumers of the shared article generator.
for (const slug of ['udalennye-lidy-bitrix24', 'ne-udalyaetsya-lid-bitrix24', 'kak-snyat-rezervy-moysklad']) {
  test(`Article publisher exposes an existing logo asset: ${slug}`, () => {
    const document = new JSDOM(fs.readFileSync(path.join('dist', slug, 'index.html'), 'utf8')).window.document;
    const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(script => JSON.parse(script.textContent)['@graph']);
    const article = nodes.find(node => ['Article', 'BlogPosting'].includes(node['@type']));
    assert.equal(article.publisher['@type'], 'Organization');
    assert.equal(article.publisher.logo?.['@type'], 'ImageObject');
    const logo = new URL(article.publisher.logo.url);
    assert.equal(logo.origin, new URL(article.publisher.url).origin);
    assert(fs.statSync(path.join('dist', decodeURIComponent(logo.pathname))).isFile());
    assert(article.publisher.logo.width > 0);
    assert(article.publisher.logo.height > 0);
  });
}
