import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const origin = 'https://truetell-retail.ru';
const scenarioSlugs = ['izmenenie-cen', 'udalenie', 'izmenenie-tovarov', 'arhivirovanie', 'import', 'izmenenie-dokumentov'];
const guideSlugs = ['udalennye-lidy-bitrix24', 'ne-udalyaetsya-lid-bitrix24', 'udalenie-proigrannyh-sdelok-bitrix24', 'bitrix24-udalenie-lidov-za-period', 'kak-vosstanovit-udalennye-zakazy-tovary-moysklad'];
const blogSlugs = ['kak-snyat-rezervy-moysklad', 'bi-analitika-chto-eto-prostymi-slovami'];

test('knowledge base groups published materials and links all six MoySklad scenarios', () => {
  const doc = new JSDOM(readFileSync('dist/knowledge-base/index.html', 'utf8')).window.document;
  const links = [...doc.querySelectorAll('main a[href]')].map((link) => link.getAttribute('href'));

  assert.equal(doc.querySelectorAll('main h1').length, 1);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `${origin}/knowledge-base/`);
  assert.equal(doc.querySelector('meta[name="robots"]').content, 'index, follow');
  for (const id of ['bitrix24', 'moysklad']) {
    assert(doc.querySelector(`section#${id} h2`), `Missing section: ${id}`);
    assert(links.includes(`#${id}`), `Missing section navigation: ${id}`);
  }
  assert(!doc.querySelector('section#other'), 'Empty other section should be removed');
  assert(doc.querySelectorAll('main h3').length >= 5, 'Expected topical groups inside sections');
  for (const slug of guideSlugs) assert(links.includes(`/${slug}/`), `Missing guide: ${slug}`);
  for (const slug of blogSlugs) assert(!links.includes(`/${slug}/`), `Blog article repeated in knowledge base: ${slug}`);
  for (const slug of scenarioSlugs) {
    assert(links.includes(`/moysklad-${slug}/`), `Missing MoySklad scenario: ${slug}`);
  }
  for (const href of links.filter((link) => link.startsWith('/'))) {
    assert.match(href, /^\/[^/]+\/$/, `Knowledge-base material is not directly below the home page: ${href}`);
    assert(existsSync(`dist${href}index.html`), `Broken knowledge-base link: ${href}`);
  }
});

test('knowledge base replaces Cases in navigation while all scenarios enter the sitemap and stay outside the blog', () => {
  const home = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const blog = new JSDOM(readFileSync('dist/blog/index.html', 'utf8')).window.document;
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');

  assert.equal(home.querySelector('nav[aria-label="Основная навигация"] a[href="/knowledge-base/"]')?.textContent.trim(), 'База знаний');
  assert(![...home.querySelectorAll('nav[aria-label="Основная навигация"] a')].some((link) => link.textContent.trim() === 'Кейсы'));
  assert(sitemap.includes(`<loc>${origin}/knowledge-base/</loc>`));
  const blogLinks = [...blog.querySelectorAll('main article a[href]')].map((link) => link.getAttribute('href'));
  assert.deepEqual([...new Set(blogLinks)].sort(), blogSlugs.map((slug) => `/${slug}/`).sort());
  const homeBlogLinks = [...home.querySelectorAll('#blog article a[href]')].map((link) => link.getAttribute('href'));
  assert.deepEqual([...new Set(homeBlogLinks)].sort(), blogSlugs.map((slug) => `/${slug}/`).sort());
  for (const slug of guideSlugs) {
    assert(!blogLinks.includes(`/${slug}/`), `Guide repeated in blog: ${slug}`);
    assert(sitemap.includes(`<loc>${origin}/${slug}/</loc>`), `Guide missing from sitemap: ${slug}`);
    const guide = new JSDOM(readFileSync(`dist/${slug}/index.html`, 'utf8')).window.document;
    assert(guide.querySelector('a[href="/knowledge-base/"]'), `Guide breadcrumb does not point to knowledge base: ${slug}`);
    const graph = JSON.parse(guide.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    assert(graph.some((node) => node['@type'] === 'Article'), `Guide still uses blog schema: ${slug}`);
  }
  for (const slug of scenarioSlugs) {
    assert(!blog.querySelector(`a[href="/moysklad-${slug}/"]`), `Scenario unexpectedly listed in blog: ${slug}`);
    assert(sitemap.includes(`<loc>${origin}/moysklad-${slug}/</loc>`), `Scenario missing from sitemap: ${slug}`);
  }
});
