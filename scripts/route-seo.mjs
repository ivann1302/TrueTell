import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { JSDOM } from 'jsdom';
import { hasNoindex } from './page-indexing.mjs';

export function validateRouteHtml(html, url, sitemapUrls) {
  const document = new JSDOM(html).window.document;
  const canonical = [...document.querySelectorAll('link[rel="canonical"]')];
  const noindex = hasNoindex(document) || document.querySelector('meta[name="truetell:status"]')?.content === 'draft';
  const listed = sitemapUrls.includes(url);
  const refresh = document.querySelector('meta[http-equiv="refresh" i]');
  if (canonical.length !== 1) throw new Error(`Expected one canonical: ${url}`);
  const target = new URL(canonical[0].href);
  const contentPath = /^\/(?:[^/]+\/)?$/.test(target.pathname);
  if (target.protocol !== 'https:' || target.search || target.hash || !contentPath) {
    throw new Error(`Invalid canonical or nested URL: ${url}`);
  }
  if (refresh) {
    const destination = refresh.content.match(/^0;\s*url=(.+)$/i)?.[1];
    if (!noindex || listed || !destination || new URL(destination, url).href !== target.href || target.href === url) {
      throw new Error(`Invalid redirect page: ${url}`);
    }
    return { redirect: target.href };
  }
  if (target.href !== url) {
    if (listed) throw new Error(`Canonical mismatch: ${url}`);
    return { alias: target.href, document };
  }
  if (listed === noindex) throw new Error(`Sitemap/indexability mismatch: ${url}`);
  return { document };
}

export async function validateRouteTree(directory, site, urls) {
  if (new Set(urls).size !== urls.length) throw new Error('Duplicate sitemap URLs');
  const pages = new Map();
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = join(path, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith('.html') && relative(directory, file) !== '404.html') {
        const route = '/' + relative(directory, file).split(sep).join('/').replace(/index\.html$/, '');
        pages.set(new URL(route, site).href, await readFile(file, 'utf8'));
      }
    }
  }
  await walk(directory);
  const redirects = new Set();
  const documents = [];
  for (const [url, html] of pages) {
    const result = validateRouteHtml(html, url, urls);
    if (result.redirect) {
      if (!pages.has(result.redirect)) throw new Error(`Missing redirect target: ${url}`);
      redirects.add(url);
    } else {
      if (result.alias) {
        if (new URL(result.alias).origin === new URL(site).origin && !pages.has(result.alias)) throw new Error(`Missing canonical target: ${url}`);
        redirects.add(url);
      }
      documents.push([url, result.document]);
    }
  }
  for (const [url, document] of documents) {
    for (const link of document.querySelectorAll('a[href]')) {
      const target = new URL(link.getAttribute('href'), url);
      if (target.origin !== new URL(site).origin) continue;
      target.hash = ''; target.search = '';
      if (redirects.has(target.href)) throw new Error(`Internal link uses old URL: ${url} -> ${target.href}`);
    }
  }
  for (const url of urls) if (!pages.has(url)) throw new Error(`Missing sitemap page: ${url}`);
}
