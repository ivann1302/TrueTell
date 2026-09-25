import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRouteHtml } from './route-seo.mjs';
const origin = 'https://example.com';
const page = (path, robots = 'index, follow', extra = '') => `<link rel="canonical" href="${origin}${path}"><meta name="robots" content="${robots}">${extra}`;
test('requires one self-canonical and root-level content URL', () => {
  assert.doesNotThrow(() => validateRouteHtml(page('/cleaner/'), `${origin}/cleaner/`, [`${origin}/cleaner/`]));
  for (const html of ['', page('/other/'), page('/products/cleaner/'), page('/cleaner/') + page('/cleaner/')]) {
    assert.throws(() => validateRouteHtml(html, `${origin}/cleaner/`, [`${origin}/cleaner/`]));
  }
});
test('keeps noindex placeholders out of sitemap and indexable pages in it', () => {
  assert.doesNotThrow(() => validateRouteHtml(page('/draft/', 'noindex'), `${origin}/draft/`, []));
  assert.throws(() => validateRouteHtml(page('/draft/', 'noindex'), `${origin}/draft/`, [`${origin}/draft/`]));
  assert.throws(() => validateRouteHtml(page('/cleaner/'), `${origin}/cleaner/`, []));
});
test('allows legacy redirect files only with matching target and noindex outside sitemap', () => {
  const html = page('/cleaner/', 'noindex', '<meta http-equiv="refresh" content="0;url=/cleaner/">');
  assert.deepEqual(validateRouteHtml(html, `${origin}/products/cleaner/`, []), { redirect: `${origin}/cleaner/` });
  assert.throws(() => validateRouteHtml(html, `${origin}/products/cleaner/`, [`${origin}/products/cleaner/`]));
  assert.throws(() => validateRouteHtml(html.replace('url=/cleaner/', 'url=/wrong/'), `${origin}/products/cleaner/`, []));
});
