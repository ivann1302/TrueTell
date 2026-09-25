import { blogArticles } from '../config/articles';

export const prerender = true;

export function GET() {
  const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
  const siteRoot = new URL(base, import.meta.env.SITE);
  const pageUrl = (path = '') => new URL(path, siteRoot).toString();

  const entries = [
    { path: '', changefreq: 'weekly', priority: '1.0' },
    { path: 'products/', changefreq: 'monthly', priority: '0.8' },
    { path: 'bitrix24-cleaner/', changefreq: 'monthly', priority: '0.8' },
    { path: 'bi-analitika/', changefreq: 'monthly', priority: '0.8' },
    { path: 'blog/', changefreq: 'weekly', priority: '0.7' },
    ...blogArticles
      .filter((article) => article.hrefPath)
      .map((article) => ({
        path: article.hrefPath!,
        changefreq: 'monthly',
        priority: '0.8',
      })),
  ];

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${pageUrl(entry.path)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
