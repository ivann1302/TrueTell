import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { buildSeoArtifacts } from './seo-build.mjs';

const origin = 'https://example.com';
const html = (path, options = {}) => `<html><head><title>${options.title ?? path}</title>
<meta name="description" content="Описание ${path}">
<link rel="canonical" href="${origin}${options.canonical ?? path}">
<meta name="robots" content="${options.robots ?? 'index, follow'}">
<meta name="truetell:type" content="${options.type ?? 'system'}">
<meta name="truetell:status" content="${options.status ?? 'published'}">
${options.extra ?? ''}</head><body><main><h1>${path}</h1>${options.body ?? ''}</main></body></html>`;

async function fixture(t, pages) {
  const root = await mkdtemp(join(tmpdir(), 'truetell-seo-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, 'dist');
  await mkdir(directory);
  for (const [path, source] of Object.entries(pages)) {
    const filename = join(directory, path === '/404.html' ? '404.html' : `${path}index.html`);
    await mkdir(join(filename, '..'), { recursive: true });
    await writeFile(filename, source);
  }
  return { directory, reportPath: join(root, 'site-map.md'), siteRoot: `${origin}/` };
}

test('discovers new published routes without a second URL list; excludes drafts, noindex and aliases', async t => {
  const options = await fixture(t, {
    '/': html('/'),
    '/new-guide/': html('/new-guide/', { type: 'knowledge' }),
    '/draft/': html('/draft/', { status: 'draft', robots: 'noindex, nofollow' }),
    '/private/': html('/private/', { robots: 'noindex, follow' }),
    '/alias/': html('/alias/', { canonical: '/new-guide/' }),
    '/old/': html('/old/', { canonical: '/new-guide/', robots: 'noindex', extra: '<meta http-equiv="refresh" content="0;url=/new-guide/">' }),
    '/404.html': '<html><head><title>404</title></head><body>404</body></html>',
  });
  const result = await buildSeoArtifacts(options);
  const xml = new JSDOM(await readFile(join(options.directory, 'sitemap.xml'), 'utf8'), { contentType: 'text/xml' }).window.document;
  assert.deepEqual([...xml.querySelectorAll('loc')].map(el => el.textContent), [`${origin}/`, `${origin}/new-guide/`]);
  assert.equal(result.filter(page => page.inSitemap).length, 2);
  assert.match(await readFile(options.reportPath, 'utf8'), /draft/);
  assert.equal(xml.querySelectorAll('lastmod').length, 0);
});

test('escapes XML and Markdown and uses only recorded significant modification dates', async t => {
  const options = await fixture(t, {
    '/a&b/': html('/a&b/', { title: 'Сравнение | A & B', extra: '<meta property="article:modified_time" content="2026-09-22T00:00:00+03:00">' }),
  });
  await buildSeoArtifacts(options);
  const source = await readFile(join(options.directory, 'sitemap.xml'), 'utf8');
  assert.match(source, /a&amp;b/);
  const doc = new JSDOM(source, { contentType: 'text/xml' }).window.document;
  assert.equal(doc.querySelector('lastmod').textContent, '2026-09-22T00:00:00+03:00');
  assert.match(await readFile(options.reportPath, 'utf8'), /Сравнение &#124; A & B/);
});

test('fails for duplicate canonicals, missing registered published routes and broken links', async t => {
  const options = await fixture(t, { '/': html('/', { body: '<a href="/missing/">Инструкция</a>' }) });
  await assert.rejects(buildSeoArtifacts(options), /Broken internal link/);
  await writeFile(join(options.directory, 'index.html'), html('/', { extra: `<link rel="canonical" href="${origin}/">` }));
  await assert.rejects(buildSeoArtifacts(options), /one canonical/);
  await writeFile(join(options.directory, 'index.html'), html('/'));
  await assert.rejects(buildSeoArtifacts({ ...options, articles: [{ hrefPath: 'missing/', status: 'published' }] }), /Missing published article/);
});

test('handles a preview base path and rejects malformed dates', async t => {
  const options = await fixture(t, { '/': html('/preview/'), '/guide/': html('/preview/guide/') });
  await buildSeoArtifacts({ ...options, siteRoot: `${origin}/preview/` });
  const xml = await readFile(join(options.directory, 'sitemap.xml'), 'utf8');
  assert.match(xml, /https:\/\/example.com\/preview\/guide\//);
  await writeFile(join(options.directory, 'index.html'), html('/preview/', { extra: '<meta property="article:modified_time" content="yesterday">' }));
  await assert.rejects(buildSeoArtifacts({ ...options, siteRoot: `${origin}/preview/` }), /Invalid content date/);
});
