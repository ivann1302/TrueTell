import { allArticles } from '../config/articles';

export const prerender = true;

export function GET() {
  const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
  const siteRoot = new URL(base, import.meta.env.SITE);
  const pageUrl = (path = '') => new URL(path, siteRoot).toString();

  const entries = [
    { path: '', changefreq: 'weekly', priority: '1.0' },
    { path: 'products/', changefreq: 'monthly', priority: '0.8' },
    { path: 'bitrix24-cleaner/', changefreq: 'monthly', priority: '0.8' },
    { path: 'bitrix24-product-rating/', changefreq: 'monthly', priority: '0.8' },
    { path: 'moysklad-mass-operations/', changefreq: 'monthly', priority: '0.8' },
    { path: 'moysklad-izmenenie-cen/', changefreq: 'monthly', priority: '0.8' },
    { path: 'moysklad-import/', changefreq: 'monthly', priority: '0.8' },
    ...['backup-moysklad/', 'upravlenie-rezervami-moysklad/', 'moysklad-udalenie/', 'moysklad-arhivirovanie/', 'moysklad-izmenenie-tovarov/', 'moysklad-izmenenie-dokumentov/'].map((path) => ({ path, changefreq: 'monthly', priority: '0.8' })),
    { path: 'bi-analitika/', changefreq: 'monthly', priority: '0.8' },
    { path: 'blog/', changefreq: 'weekly', priority: '0.7' },
    { path: 'knowledge-base/', changefreq: 'monthly', priority: '0.8' },
    ...['privacy/', 'cookies/', 'analytics-consent/', 'request-consent/', 'bitrix24-cleaner-license/', 'bitrix24-cleaner-privacy/'].map((path) => ({ path, changefreq: 'yearly', priority: '0.3' })),
    ...allArticles
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
