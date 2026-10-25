import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const checker = resolve('scripts/check-article-humanizer.mjs');
const fingerprint = 'd6d0624e78158b11125d6272102b57273ede70b0ec9ae95171a75294aa8717ac';

test('publication requires a current humanizer review for every published article', async () => {
  const root = await mkdtemp(join(tmpdir(), 'truetell-humanizer-'));
  try {
    await mkdir(join(root, 'src/config'), { recursive: true });
    await mkdir(join(root, 'src/pages/guide'), { recursive: true });
    await mkdir(join(root, 'docs/seo/publications'), { recursive: true });
    await writeFile(join(root, 'src/config/articles.ts'),
      "export const allArticles = [{hrefPath:'guide/',status:'published',title:'Статья',description:'Описание'},{hrefPath:'draft/',status:'draft',title:'Черновик',description:'Описание'}];\n");
    await writeFile(join(root, 'src/pages/guide/index.astro'), '---\n---\n<p>Текст статьи.</p>\n');
    await writeFile(join(root, 'docs/seo/publications/review.md'), '# Проверка\n');
    const manifest = join(root, 'docs/seo/humanizer-reviews.json');
    const review = { skill: 'humanizer', reviewedAt: '2026-10-25', report: 'docs/seo/publications/review.md', fingerprint };
    await writeFile(manifest, JSON.stringify({ articles: { 'guide/': review } }));

    const run = () => spawnSync(process.execPath, [checker, '--root', root], { encoding: 'utf8' });
    assert.equal(run().status, 0, 'A reviewed published article must pass; drafts need no review');

    await writeFile(join(root, 'src/pages/guide/index.astro'), '---\n---\n<p>Новый текст статьи.</p>\n');
    const stale = run();
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /guide\/.*устарел/i);

    await writeFile(join(root, 'src/pages/guide/index.astro'), '---\n---\n<p>Текст статьи.</p>\n');
    await writeFile(manifest, JSON.stringify({ articles: {} }));
    const missing = run();
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /guide\/.*нет проверки/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
