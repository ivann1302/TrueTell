import test from 'node:test';
import assert from 'node:assert/strict';
import * as deployment from './indexnow.mjs';

const { sitemapUrls, request } = deployment;
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

test('requires a non-indexable 404 without a misleading canonical URL', () => {
  assert.equal(typeof deployment.validateNotFoundHtml, 'function');
  const valid = '<meta name="robots" content="noindex, follow"><title>404</title>';

  assert.doesNotThrow(() => deployment.validateNotFoundHtml(valid));
  assert.throws(
    () => deployment.validateNotFoundHtml('<meta name="robots" content="index, follow"><title>404</title>'),
    /noindex/i,
  );
  assert.throws(
    () => deployment.validateNotFoundHtml(`${valid}<link rel="canonical" href="https://truetell-retail.ru/">`),
    /canonical/i,
  );
});

test('requires an explicit allow policy for supported AI crawlers', () => {
  assert.equal(typeof deployment.validateRobots, 'function');
  const bots = ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'Bingbot'];
  const valid = `${bots.map((bot) => `User-agent: ${bot}\nAllow: /`).join('\n\n')}\n\nUser-agent: *\nAllow: /\n\nSitemap: https://truetell-retail.ru/sitemap.xml\n`;

  assert.doesNotThrow(() => deployment.validateRobots(valid, 'https://truetell-retail.ru'));
  assert.throws(
    () => deployment.validateRobots(valid.replace('User-agent: ClaudeBot\nAllow: /\n\n', ''), 'https://truetell-retail.ru'),
    /ClaudeBot/,
  );
});

test('rejects synthetic sitemap freshness dates', () => {
  assert.equal(typeof deployment.validateSitemapXml, 'function');
  const valid = xml(['https://truetell-retail.ru/']);

  assert.deepEqual(deployment.validateSitemapXml(valid, 'https://truetell-retail.ru'), ['https://truetell-retail.ru/']);
  assert.throws(
    () => deployment.validateSitemapXml(valid.replace('</url>', '<lastmod>2026-09-15</lastmod></url>'), 'https://truetell-retail.ru'),
    /lastmod/i,
  );
});

test('requires canonical redirects and a custom 404 in the deployment artifact', () => {
  assert.equal(typeof deployment.validateHtaccess, 'function');
  const valid = `<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_HOST} !^truetell-retail\\.ru$ [NC]
RewriteRule ^ https://truetell-retail.ru%{REQUEST_URI} [R=301,L,NE]
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://truetell-retail.ru%{REQUEST_URI} [R=301,L,NE]
</IfModule>
ErrorDocument 404 /404.html`;

  assert.doesNotThrow(() => deployment.validateHtaccess(valid, 'https://truetell-retail.ru'));
  assert.throws(() => deployment.validateHtaccess(valid.replace('ErrorDocument 404 /404.html', ''), 'https://truetell-retail.ru'), /404/);
  assert.throws(() => deployment.validateHtaccess(valid.replace('!^truetell-retail\\.ru$', '^truetell-retail\\.ru$'), 'https://truetell-retail.ru'), /host/i);
});
