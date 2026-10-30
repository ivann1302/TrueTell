import test from 'node:test';
import assert from 'node:assert/strict';
import { allArticles, getCatalogArticles, groupKnowledgeArticles, getRelatedArticles, getProductArticles } from '../src/config/articles.ts';

test('instructions and analytical articles have distinct catalog ownership', () => {
  const knowledge = getCatalogArticles('knowledge');
  const blog = getCatalogArticles('blog');
  assert(knowledge.length > 0);
  assert(blog.length > 0);
  assert(knowledge.every(article => article.type === 'knowledge' && article.status === 'published' && article.indexable));
  assert(blog.every(article => article.type === 'blog' && article.status === 'published' && article.indexable));
  assert(knowledge.some(article => article.hrefPath === 'api-bitrix24/'));
  assert(blog.some(article => article.hrefPath === 'abc-xyz-analiz-tovarov/'));
  assert.equal(new Set(allArticles.map(article => article.hrefPath)).size, allArticles.length);
});

test('new metadata automatically creates useful platform/topic groups and excludes unpublished entries', () => {
  const base = { ...allArticles[0], type: 'knowledge', status: 'published', indexable: true };
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
  const cleanerArticles = getProductArticles('/bitrix24-cleaner/');
  assert(cleanerArticles.length > 0);
  assert(cleanerArticles.every(article => article.relatedProduct === '/bitrix24-cleaner/' && article.status === 'published'));
  const biArticles = getProductArticles('/bi-analitika/');
  assert(biArticles.some(article => article.type === 'blog'));
  assert(biArticles.some(article => article.type === 'knowledge'));
  assert(biArticles.every(article => article.relatedProduct === '/bi-analitika/' && article.status === 'published'));
});
