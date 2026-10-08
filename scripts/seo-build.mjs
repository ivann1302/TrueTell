import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep, dirname } from 'node:path';
import { JSDOM } from 'jsdom';
import { hasNoindex } from './page-indexing.mjs';

const escapeXml = value => String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
const markdownCell = value => String(value ?? '—').replace(/\|/g, '&#124;').replace(/[\r\n]/g, ' ');
const types = ['knowledge', 'blog', 'commercial', 'legal', 'system'];

export function validateContentDate(value, url) {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Invalid content date: ${url}: ${value}`);
  }
  return value;
}

export async function collectPages(directory, siteRoot) {
  const root = new URL(siteRoot);
  const pages = [];
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith('.html')) {
        const path = relative(directory, file).split(sep).join('/').replace(/index\.html$/, '');
        const url = new URL(path, root).href;
        const dom = new JSDOM(await readFile(file, 'utf8'));
        const document = dom.window.document;
        const meta = name => document.querySelector(`meta[name="${name}"]`)?.content;
        const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];
        if (path !== '404.html' && canonicals.length !== 1) throw new Error(`Expected one canonical: ${url}`);
        const canonical = canonicals[0]?.href;
        if (canonical) {
          const target = new URL(canonical);
          if (target.protocol !== 'https:' || target.search || target.hash || target.username || target.password || !target.pathname.endsWith('/')) {
            throw new Error(`Invalid canonical: ${url}`);
          }
        }
        const type = meta('truetell:type') ?? 'system';
        const status = meta('truetell:status') ?? 'published';
        if (!types.includes(type) || !['published', 'draft'].includes(status)) throw new Error(`Invalid content classification: ${url}`);
        const noindex = hasNoindex(document);
        const redirect = !!document.querySelector('meta[http-equiv="refresh" i]');
        const reason = path === '404.html' ? '404' : status === 'draft' ? 'draft' : redirect ? 'redirect' : noindex ? 'noindex' : canonical !== url ? 'non-canonical' : undefined;
        const modifiedAt = validateContentDate(document.querySelector('meta[property="article:modified_time"]')?.content, url);
        const publishedAt = validateContentDate(document.querySelector('meta[property="article:published_time"]')?.content, url);
        if (!reason && (!document.title || !meta('description') || document.querySelectorAll('main h1').length !== 1)) {
          throw new Error(`Missing title, description or single H1: ${url}`);
        }
        pages.push({ url, canonical, title: document.title, description: meta('description'), type,
          category: meta('truetell:category'), relatedProduct: meta('truetell:related-product'), status,
          modifiedAt, publishedAt, inSitemap: !reason, reason,
          links: [...document.querySelectorAll('a[href]')].map(link => link.getAttribute('href')) });
        dom.window.close();
      }
    }
  }
  await walk(directory);
  return pages.sort((a, b) => a.url < b.url ? -1 : a.url > b.url ? 1 : 0);
}

export function renderSitemap(pages) {
  const included = pages.filter(page => page.inSitemap);
  const urls = included.map(page => page.canonical);
  if (new Set(urls).size !== urls.length) throw new Error('Duplicate sitemap URLs');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${included.map(page => `  <url>\n    <loc>${escapeXml(page.canonical)}</loc>${page.modifiedAt ? `\n    <lastmod>${escapeXml(page.modifiedAt)}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>\n`;
}

export function renderSiteMap(pages, articles, siteRoot) {
  const missingDrafts = articles.filter(article => article.status === 'draft' && !pages.some(page => page.url === new URL(article.hrefPath, siteRoot).href))
    .map(article => ({ url: new URL(article.hrefPath, siteRoot).href, title: article.title, type: article.type, category: `${article.category} / ${article.topic}`, relatedProduct: article.relatedProduct,
      status: 'draft', inSitemap: false, reason: 'route not built', modifiedAt: article.updatedAt }));
  return `# Внутренняя SEO-карта TrueTell\n\nАвтоматически создаётся при production build из HTML страниц и существующего реестра статей. Не редактировать таблицу вручную. Документ не публикуется в dist.\n\nИндексируемых канонических URL: **${pages.filter(page => page.inSitemap).length}**. Даты — только записанные изменения содержания; время сборки не используется. Статус означает наличие в локальной сборке, а не индексацию в поиске.\n\n| URL | Название | Тип | Категория | Связанный продукт | Статус | Sitemap | Последнее изменение |\n|---|---|---|---|---|---|---|---|\n${[...pages, ...missingDrafts].map(page => `| ${[page.url, page.title, page.type, page.category, page.relatedProduct, page.status, page.inSitemap ? 'Включена' : `Исключена: ${page.reason}`, page.modifiedAt].map(markdownCell).join(' | ')} |`).join('\n')}\n`;
}

export async function buildSeoArtifacts({ directory, siteRoot, reportPath, articles = [] }) {
  const pages = await collectPages(directory, siteRoot);
  for (const article of articles) {
    const url = new URL(article.hrefPath, siteRoot).href;
    const page = pages.find(page => page.url === url);
    if (!page && article.status === 'published') throw new Error(`Missing published article: ${url}`);
    if (page && (page.type !== article.type || page.status !== article.status)) throw new Error(`Article metadata mismatch: ${url}`);
  }
  const root = new URL(siteRoot);
  for (const page of pages.filter(page => page.inSitemap)) {
    for (const href of page.links) {
      const target = new URL(href, page.url);
      if (target.origin !== root.origin) continue;
      target.search = ''; target.hash = '';
      const match = pages.find(page => page.url === target.href);
      if (match?.reason === 'redirect' || match?.reason === 'non-canonical') throw new Error(`Internal link uses old URL: ${page.url} -> ${target.href}`);
      if (match) continue;
      if (!target.pathname.startsWith(root.pathname)) throw new Error(`Broken internal link: ${page.url} -> ${target.href}`);
      const local = decodeURIComponent(target.pathname.slice(root.pathname.length));
      if (local === 'sitemap.xml') continue;
      const file = join(directory, local.endsWith('/') ? `${local}index.html` : local);
      if (!(await stat(file).catch(() => undefined))?.isFile()) throw new Error(`Broken internal link: ${page.url} -> ${target.href}`);
    }
  }
  const xml = renderSitemap(pages);
  // Parsing catches malformed XML before it can be published.
  const document = new JSDOM(xml, { contentType: 'text/xml' });
  document.window.close();
  await writeFile(join(directory, 'sitemap.xml'), xml);
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, renderSiteMap(pages, articles, siteRoot));
  return pages;
}
