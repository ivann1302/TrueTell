import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const mcpPath = '/moysklad-mcp/';
const mcpCardTitle = 'MCP-сервер для МоегоСклада';
const biPath = '/bi-analitika/';

test('home features MoySklad MCP and BI in their assigned slots', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const section = doc.querySelector('#product-showcase-title')?.closest('section');
  assert(section, 'Product showcase missing');

  const featuredCards = [...section.querySelectorAll('[aria-label="Приложения TrueTell для бизнес-систем"] > a')];
  const disclosure = section.querySelector('details[data-product-disclosure]');
  assert.equal(featuredCards.length, 3);
  assert.equal(featuredCards[0].querySelector('h3')?.textContent.trim(), mcpCardTitle);
  assert.equal(featuredCards[2].getAttribute('href'), biPath);
  assert(disclosure && !disclosure.open, 'Additional products must start collapsed');
  const summary = disclosure.querySelector('summary');
  assert.match(summary.textContent, /Посмотреть все продукты/);
  assert(disclosure.querySelector('button[data-hide-product-list]'), 'Close control missing');
  const additionalCards = [...disclosure.querySelectorAll('[data-additional-product-grid] > a')];
  const homeCards = [...featuredCards, ...additionalCards];
  assert.equal(homeCards.length, 7);
  for (const card of homeCards.filter(card => card.getAttribute('href') !== biPath)) {
    assert(card.querySelector('h3'), 'App title missing');
    assert(card.querySelector('img[src]'), 'App icon missing');
  }

  assert(!/бизнес[ -]?иде|проверить идею|проверки идеи/i.test(doc.body.textContent));
  const choice = doc.querySelector('[data-product-choice]');
  assert.deepEqual([...choice.querySelectorAll('[data-product-option]')].map(option => option.dataset.productOption), ['moysklad-mcp', 'bi', 'crm', 'marketplaces']);
  assert.equal(choice.querySelector('[data-product-option][aria-pressed="true"]')?.dataset.productOption, 'moysklad-mcp');
  assert.equal(choice.querySelectorAll('[data-product-panel]').length, 4);
  const activeProduct = choice.querySelector('[data-product-panel]:not([hidden])');
  assert(activeProduct?.querySelector(`a[href="${mcpPath}"]`));
  assert.equal(activeProduct.querySelector('h3')?.textContent.trim(), mcpCardTitle);
  const mobileOptions = doc.querySelectorAll('details[name="product-solutions"]');
  assert.equal(mobileOptions.length, 4);
  assert(mobileOptions[0].querySelector(`a[href="${mcpPath}"]`));
  const catalog = new JSDOM(readFileSync('dist/products/index.html', 'utf8')).window.document;
  const catalogCards = [...catalog.querySelectorAll('main ul > li > a')];
  assert.deepEqual(catalogCards.map(card => card.getAttribute('href')), [
    mcpPath,
    'https://online.moysklad.ru/app/#apps?id=9f7dc391-cce2-4c10-8129-8e41c82b48e5',
    'https://online.moysklad.ru/app/#apps?id=4a76f099-5c24-439c-a924-8e674da0c215',
    '/bitrix24-cleaner/',
    '/bitrix24-field-directory/',
    '/bitrix24-product-rating/',
    biPath,
  ]);
  assert.deepEqual(
    homeCards.map(card => card.querySelector('h3').textContent.trim()),
    [catalogCards[0], catalogCards[1], catalogCards.at(-1), ...catalogCards.slice(2, -1)]
      .map(card => card.querySelector('h2').textContent.trim()),
  );
  assert.equal(catalogCards[1].querySelector('h2')?.textContent.trim(), 'Массовые операции и удаление');
  assert.equal(catalogCards[2].querySelector('h2')?.textContent.trim(), 'Прогнозирование продаж');
  for (const card of catalogCards.slice(1, 3)) {
    assert.equal(card.getAttribute('target'), '_blank');
    assert(card.relList.contains('noopener'));
  }
  for (const [index, card] of catalogCards.slice(0, 6).entries()) {
    const icon = card.querySelector('img');
    const iconAsset = index < 3 ? 'moysklad-app-icon' : 'bitrix24-app-icon';
    assert(icon, 'Platform icon missing: ' + card.href);
    assert.match(icon.getAttribute('src'), new RegExp('/' + iconAsset + '(?:\\.[^/]+)?\\.svg$'));
    assert.equal(icon.alt, '');
    const homeCard = homeCards.find(item => item.querySelector('h3').textContent.trim() === card.querySelector('h2').textContent.trim());
    assert.equal(homeCard?.querySelector('img')?.getAttribute('src'), icon.getAttribute('src'));
  }
  assert(!catalogCards[6].querySelector('img'), 'BI card has no associated platform');
  assert(!doc.querySelector('#cases'), 'Old generic cases block remains on home');
  assert(doc.querySelector('footer a[href="/knowledge-base/"]'), 'Footer knowledge-base link missing');
});

test('each home product card is one link to its product page', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const section = doc.querySelector('#product-showcase-title')?.closest('section');
  assert(section, 'Product showcase missing');
  const cards = [...section.querySelectorAll('[aria-label="Приложения TrueTell для бизнес-систем"] > a, [data-additional-product-grid] > a')];
  assert.deepEqual(cards.map((card) => card.getAttribute('href')), [
    mcpPath,
    '/moysklad-mass-operations/',
    biPath,
    'https://online.moysklad.ru/app/#apps?id=4a76f099-5c24-439c-a924-8e674da0c215',
    '/bitrix24-cleaner/',
    '/bitrix24-field-directory/',
    '/bitrix24-product-rating/',
  ]);
  assert.equal(cards[3].target, '_blank');
  assert(cards[3].relList.contains('noopener'));

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
