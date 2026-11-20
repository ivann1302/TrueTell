import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const mcpPath = '/moysklad-mcp/';

test('home and the product catalog show MoySklad MCP first', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const section = doc.querySelector('#product-showcase-title')?.closest('section');
  assert(section, 'Product showcase missing');

  const appCards = [...section.querySelectorAll(`a[href="${mcpPath}"], a[href="/bitrix24-cleaner/"], a[href="/moysklad-mass-operations/"]`)];
  assert.equal(appCards.length, 3);
  for (const card of appCards) {
    assert(card.querySelector('h3'), 'App title missing');
    assert(card.querySelector('img[src]'), 'App icon missing');
  }

  const biCard = section.querySelector('a[href="/bi-analitika/"]');
  assert(biCard, 'BI card missing');
  assert.equal(biCard.parentElement, appCards[0].parentElement, 'BI is outside the product card grid');
  assert.equal(biCard.parentElement.children.length, 4);
  assert.equal(biCard.parentElement.lastElementChild, biCard);
  assert(!/бизнес[ -]?иде|проверить идею|проверки идеи/i.test(doc.body.textContent));
  const choice = doc.querySelector('[data-product-choice]');
  assert.deepEqual([...choice.querySelectorAll('[data-product-option]')].map(option => option.dataset.productOption), ['moysklad-mcp', 'bi', 'crm', 'marketplaces']);
  assert.equal(choice.querySelector('[data-product-option][aria-pressed="true"]')?.dataset.productOption, 'moysklad-mcp');
  assert.equal(choice.querySelectorAll('[data-product-panel]').length, 4);
  assert(choice.querySelector(`[data-product-panel]:not([hidden]) a[href="${mcpPath}"]`));
  const mobileOptions = doc.querySelectorAll('details[name="product-solutions"]');
  assert.equal(mobileOptions.length, 4);
  assert(mobileOptions[0].querySelector(`a[href="${mcpPath}"]`));
  const catalog = new JSDOM(readFileSync('dist/products/index.html', 'utf8')).window.document;
  assert.equal(catalog.querySelectorAll('main h2').length, 6);
  assert.equal(catalog.querySelector('main ul li:first-child a')?.getAttribute('href'), mcpPath);
  assert(catalog.querySelector('a[href="/bitrix24-field-directory/"] h2'), 'Field directory product missing from catalog');
  assert(!doc.querySelector('#cases'), 'Old generic cases block remains on home');
  assert(doc.querySelector('footer a[href="/knowledge-base/"]'), 'Footer knowledge-base link missing');
});

test('each home product card is one link to its product page', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const grid = doc.querySelector('#product-showcase-title')?.closest('section')?.querySelector('[aria-label="Приложения TrueTell для бизнес-систем"]');
  assert(grid, 'Product card grid missing');

  const cards = [...grid.children];
  assert.deepEqual(cards.map((card) => card.getAttribute('href')), [
    mcpPath,
    '/bitrix24-cleaner/',
    '/moysklad-mass-operations/',
    '/bi-analitika/',
  ]);

  for (const card of cards) {
    assert.equal(card.tagName, 'A', 'Entire card must be the link');
    assert(card.querySelector('h3'), 'Product title must be inside the link');
    assert(card.querySelector('p'), 'Product description must be inside the link');
    assert(card.querySelector('span'), 'Visible action must be inside the link');
    assert.equal(card.querySelectorAll('a').length, 0, 'Card must not contain a nested link');
  }
});

test('MoySklad MCP has direct navigation and contextual links in both directions', () => {
  const product = new JSDOM(readFileSync('dist/moysklad-mcp/index.html', 'utf8')).window.document;
  assert.equal(product.querySelector('link[rel="canonical"]')?.getAttribute('href'), 'https://truetell-retail.ru/moysklad-mcp/');
  assert.equal(product.querySelector('meta[name="robots"]')?.content, 'index, follow');
  assert(product.querySelector('main header a[href="#contact-request"]'), 'Connection CTA must open the contact form');
  assert(!product.querySelector('main button:disabled'), 'Product should not show a disabled installation CTA');
  const sources = ['mcp-moysklad-dannye', 'ii-voprosy-moysklad', 'api-moysklad', 'vebhuki-moysklad'];
  for (const slug of sources) {
    const article = new JSDOM(readFileSync(`dist/${slug}/index.html`, 'utf8')).window.document;
    assert(article.querySelector(`main article p a[href="${mcpPath}"]`), `Missing body link on /${slug}/`);
    assert(product.querySelector(`main a[href="/${slug}/"]`), `Missing return link to /${slug}/`);
  }

  const unrelatedArticle = new JSDOM(readFileSync('dist/uvolilsya-menedzher-bitrix24-crm/index.html', 'utf8')).window.document;
  assert(unrelatedArticle.querySelector(`[data-site-header] nav a[href="${mcpPath}"]`), 'Desktop menu link missing');
  assert(unrelatedArticle.querySelector(`#mobile-navigation a[href="${mcpPath}"]`), 'Mobile menu link missing');
  assert(!unrelatedArticle.querySelector(`main article a[href="${mcpPath}"]`), 'Bitrix24 article received an unrelated product link');
});
