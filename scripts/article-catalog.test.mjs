import test from 'node:test';
import assert from 'node:assert/strict';
import { allArticles, getCatalogArticles, groupKnowledgeArticles, getRelatedArticles, getProductArticles } from '../src/config/articles.ts';

test('six instructions and one analytical article have distinct catalog ownership', () => {
  assert.equal(getCatalogArticles('knowledge').length, 6);
  assert.equal(getCatalogArticles('blog').length, 1);
  assert.equal(new Set(allArticles.map(article => article.hrefPath)).size, allArticles.length);
});

test('new metadata automatically creates useful platform/topic groups and excludes unpublished entries', () => {
  const base = allArticles[0];
  const newArticle = { ...base, hrefPath: 'new-guide/', category: 'Новая платформа', topic: 'Настройка' };
  const input = [newArticle, { ...base, hrefPath: 'draft/', status: 'draft' }, { ...base, hrefPath: 'private/', indexable: false }];
  const groups = groupKnowledgeArticles(getCatalogArticles('knowledge', input));
  assert.equal(groups.length, 1);
  assert.equal(groups[0].title, 'Новая платформа');
  assert.deepEqual(groups[0].topics[0].items.map(article => article.hrefPath), ['new-guide/']);
});

test('related articles reuse metadata and stay relevant without commercial cards or self links', () => {
  const source = allArticles[0];
  const related = getRelatedArticles(source.hrefPath);
  assert(related.length > 0);
  for (const article of related) {
    assert.equal(article.category, source.category);
    assert.notEqual(article.hrefPath, source.hrefPath);
    assert.equal(article.status, 'published');
  }
  assert.equal(getProductArticles('/bitrix24-cleaner/').length, 4);
  assert.deepEqual(getProductArticles('/bi-analitika/').map(article => article.type), ['blog']);
});
