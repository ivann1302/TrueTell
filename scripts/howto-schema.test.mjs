import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const expected = new Map([
  ['bitrix24-udalenie-lidov-za-period', 1],
  ['udalenie-proigrannyh-sdelok-bitrix24', 1],
  ['kak-snyat-rezervy-moysklad', 1],
  ['udalennye-lidy-bitrix24', 1],
  ['kak-vosstanovit-udalennye-zakazy-tovary-moysklad', 2],
]);
const normalize = text => text.replace(/\s+/g, ' ').trim();

for (const [slug, count] of expected) {
  test(`HowTo matches visible instructions and valid anchors: ${slug}`, () => {
    const document = new JSDOM(fs.readFileSync(path.join('dist', slug, 'index.html'), 'utf8')).window.document;
    const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(script => { const data = JSON.parse(script.textContent); return data['@graph'] ?? [data]; });
    const instructions = nodes.filter(node => node['@type'] === 'HowTo');
    assert.equal(instructions.length, count);
    const canonical = document.querySelector('link[rel="canonical"]').href;
    const ids = new Set();
    for (const instruction of instructions) {
      assert(instruction.name);
      assert(!ids.has(instruction['@id']));
      ids.add(instruction['@id']);
      assert.equal(instruction.inLanguage, 'ru-RU');
      assert(instruction.step.length >= 2);
      for (const [index, step] of instruction.step.entries()) {
        assert.equal(step['@type'], 'HowToStep');
        assert.equal(step.position, index + 1);
        assert(step.name && step.text);
        const url = new URL(step.url);
        assert.equal(step.url.split('#')[0], canonical);
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        assert(target, `Missing step anchor: ${step.url}`);
        // A visible CTA may sit between instruction paragraphs. All step words
        // must still occur in order in the linked section, not only in JSON-LD.
        const visible = normalize(target.closest('section').textContent);
        let cursor = 0;
        for (const word of normalize(step.text).split(' ')) {
          const found = visible.indexOf(word, cursor);
          assert(found >= 0, `Step text differs from visible section: ${step.name} (${word})`);
          cursor = found + word.length;
        }
      }
      assert(!('totalTime' in instruction), 'Do not invent completion times');
      assert(!('estimatedCost' in instruction), 'Do not invent costs');
    }
    const articleType = 'Article';
    assert(nodes.some(node => node['@type'] === articleType));
    assert(nodes.some(node => node['@type'] === 'BreadcrumbList'));
  });
}

test('Product pages do not turn marketing summaries into HowTo', () => {
  for (const slug of ['bitrix24-cleaner', 'moysklad-mass-operations']) {
    const document = new JSDOM(fs.readFileSync(path.join('dist', slug, 'index.html'), 'utf8')).window.document;
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      const data = JSON.parse(script.textContent);
      assert(!(data['@graph'] ?? [data]).some(node => node['@type'] === 'HowTo'));
    }
  }
});
