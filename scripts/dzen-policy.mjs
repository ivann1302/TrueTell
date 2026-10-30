export function selectDzenArticles(allArticles, adaptations, sectionAdaptations, legacyExclusions) {
  const published = allArticles.filter(article => article.type === 'blog' && article.status === 'published' && article.indexable);
  const excluded = new Set(legacyExclusions.paths);
  if (excluded.size !== legacyExclusions.paths.length) throw new Error('Duplicate legacy Dzen exclusion');
  for (const path of excluded) {
    const article = published.find(item => item.hrefPath === path);
    if (!article || !article.publishedAt || article.publishedAt.slice(0, 10) >= legacyExclusions.cutoff || adaptations[path]) {
      throw new Error(`Invalid legacy Dzen exclusion: ${path}`);
    }
  }
  const required = published.filter(article => !excluded.has(article.hrefPath));
  for (const article of required) {
    if (!adaptations[article.hrefPath] || !sectionAdaptations[article.hrefPath]) {
      throw new Error(`Missing Dzen adaptation: ${article.hrefPath}`);
    }
  }
  return required;
}
