import test from 'node:test';
import assert from 'node:assert/strict';
import { sitemapUrls, request } from './indexnow.mjs';
const xml = (urls) => `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;
test('reads and deduplicates production URLs', () => {
  assert.deepEqual(sitemapUrls(xml(['https://truetell-retail.ru/', 'https://truetell-retail.ru/']), 'https://truetell-retail.ru'), ['https://truetell-retail.ru/']);
});
test('rejects empty, malformed and foreign sitemaps', () => {
  for (const value of ['<urlset/>', '<broken', xml(['https://example.com/']), xml(['http://truetell-retail.ru/'])]) {
    assert.throws(() => sitemapUrls(value, 'https://truetell-retail.ru'));
  }
});
test('retries rate limiting and accepts pending validation', async () => {
  let calls = 0;
  const response = await request('https://example.com', {}, async () => ({ status: ++calls === 1 ? 429 : 202 }), async () => {});
  assert.equal(response.status, 202);
  assert.equal(calls, 2);
});
test('fails on rejected keys without retrying', async () => {
  let calls = 0;
  await assert.rejects(request('https://example.com', {}, async () => { calls++; return { status: 403 }; }, async () => {}), /403/);
  assert.equal(calls, 1);
});
test('fails after bounded server retries', async () => {
  let calls = 0;
  await assert.rejects(request('https://example.com', {}, async () => { calls++; return { status: 503 }; }, async () => {}), /503/);
  assert.equal(calls, 4);
});
