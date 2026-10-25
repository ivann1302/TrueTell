import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const rootIndex = args.indexOf('--root');
const fingerprintIndex = args.indexOf('--fingerprint');
const requestedSlug = fingerprintIndex === -1 ? null : args[fingerprintIndex + 1];

if ((rootIndex !== -1 && !args[rootIndex + 1]) || (fingerprintIndex !== -1 && !requestedSlug)) {
  throw new Error('Usage: check-article-humanizer.mjs [--root path] [--fingerprint slug/]');
}
const root = resolve(rootIndex === -1 ? process.cwd() : args[rootIndex + 1]);

const { allArticles } = await import(pathToFileURL(join(root, 'src/config/articles.ts')).href);

async function fingerprint(article) {
  if (!/^[a-z0-9-]+\/$/.test(article.hrefPath)) throw new Error(`Invalid article path: ${article.hrefPath}`);
  const source = await readFile(join(root, 'src/pages', article.hrefPath, 'index.astro'), 'utf8');
  const payload = JSON.stringify({
    source,
    title: article.title,
    seoTitle: article.seoTitle ?? null,
    description: article.description,
    summaryDescription: article.summaryDescription ?? null,
  });
  return createHash('sha256').update(payload).digest('hex');
}

if (requestedSlug) {
  const article = allArticles.find(item => item.hrefPath === requestedSlug);
  if (!article) throw new Error(`Unknown article: ${requestedSlug}`);
  console.log(await fingerprint(article));
} else {
  const manifest = JSON.parse(await readFile(join(root, 'docs/seo/humanizer-reviews.json'), 'utf8'));
  const errors = [];
  for (const article of allArticles.filter(item => item.status === 'published')) {
    const review = manifest.articles?.[article.hrefPath];
    if (!review) {
      errors.push(`${article.hrefPath}: нет проверки humanizer`);
      continue;
    }
    if (review.skill !== 'humanizer' || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt ?? '') ||
        !/^docs\/seo\/publications\/[a-z0-9-]+\.(md|json)$/.test(review.report ?? '')) {
      errors.push(`${article.hrefPath}: неполная отметка humanizer`);
      continue;
    }
    try {
      if (!(await stat(join(root, review.report))).isFile()) throw new Error('not a file');
    } catch {
      errors.push(`${article.hrefPath}: отчёт проверки не найден`);
      continue;
    }
    if (review.fingerprint !== await fingerprint(article)) errors.push(`${article.hrefPath}: проверка humanizer устарела`);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Humanizer: подтверждены ${allArticles.filter(item => item.status === 'published').length} опубликованных статей`);
  }
}
