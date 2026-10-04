import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

test('home shows two app products with icons and BI as the third card', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const section = doc.querySelector('#product-showcase-title')?.closest('section');
  assert(section, 'Product showcase missing');

  const appCards = [...section.querySelectorAll('a[href="/bitrix24-cleaner/"], a[href="/moysklad-mass-operations/"]')];
  assert.equal(appCards.length, 2);
  for (const card of appCards) {
    assert(card.querySelector('h3'), 'App title missing');
    assert(card.querySelector('img[src]'), 'App icon missing');
  }

  const biCard = section.querySelector('a[href="/bi-analitika/"]');
  assert(biCard, 'BI card missing');
  assert.equal(biCard.parentElement, appCards[0].parentElement, 'BI is outside the product card grid');
  assert.equal(biCard.parentElement.children.length, 3);
  assert(biCard.compareDocumentPosition(appCards[1]) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING);
  assert(!section.textContent.includes('Проверка бизнес-идей'));
  assert(!doc.querySelector('#cases'), 'Old generic cases block remains on home');
  assert(doc.querySelector('footer a[href="/knowledge-base/"]'), 'Footer knowledge-base link missing');
});

test('each home product card is one link to its product page', () => {
  const doc = new JSDOM(readFileSync('dist/index.html', 'utf8')).window.document;
  const grid = doc.querySelector('#product-showcase-title')?.closest('section')?.querySelector('[aria-label="Приложения TrueTell для бизнес-систем"]');
  assert(grid, 'Product card grid missing');

  const cards = [...grid.children];
  assert.deepEqual(cards.map((card) => card.getAttribute('href')), [
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
