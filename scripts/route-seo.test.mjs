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
test('rejects noindex content pages and requires sitemap entries', () => {
  assert.throws(() => validateRouteHtml(page('/draft/', 'noindex'), `${origin}/draft/`, []), /noindex/i);
  assert.throws(() => validateRouteHtml(page('/draft/', 'noindex'), `${origin}/draft/`, [`${origin}/draft/`]));
  assert.throws(() => validateRouteHtml(page('/cleaner/'), `${origin}/cleaner/`, []));
});
test('requires root-level product scenarios with their own canonical and sitemap entry', () => {
  const path = '/moysklad-izmenenie-cen/';
  const url = `${origin}${path}`;
  assert.doesNotThrow(() => validateRouteHtml(page(path), url, [url]));
  assert.throws(() => validateRouteHtml(page('/moysklad-mass-operations/'), url, [url]));
  assert.throws(() => validateRouteHtml(page(path), url, []));
  for (const invalid of ['/blog/article/', '/products/cleaner/', '/moysklad-mass-operations/izmenenie-cen/', `${path}extra/`]) {
    assert.throws(() => validateRouteHtml(page(invalid), `${origin}${invalid}`, [`${origin}${invalid}`]));
  }
});
test('allows legacy redirect files only with matching target and noindex outside sitemap', () => {
  const html = page('/cleaner/', 'noindex', '<meta http-equiv="refresh" content="0;url=/cleaner/">');
  assert.deepEqual(validateRouteHtml(html, `${origin}/products/cleaner/`, []), { redirect: `${origin}/cleaner/` });
  assert.throws(() => validateRouteHtml(html, `${origin}/products/cleaner/`, [`${origin}/products/cleaner/`]));
  assert.throws(() => validateRouteHtml(html.replace('url=/cleaner/', 'url=/wrong/'), `${origin}/products/cleaner/`, []));
});
