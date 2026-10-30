import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allArticles } from '../src/config/articles.ts';
import { selectDzenArticles } from './dzen-policy.mjs';

const siteRoot = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = join(siteRoot, 'dist');
const editorRoot = join(siteRoot, '.generated', 'dzen-editor-html');
const editorialRoot = join(siteRoot, 'docs', 'seo', 'dzen');
const require = createRequire(join(siteRoot, 'package.json'));
const { JSDOM } = require('jsdom');
const sharp = require('sharp');
const origin = 'https://truetell-retail.ru';
const adaptations = JSON.parse(readFileSync(join(editorialRoot, 'adaptations.json'), 'utf8'));
const sectionAdaptations = JSON.parse(readFileSync(join(editorialRoot, 'sections.json'), 'utf8'));
const legacyExclusions = JSON.parse(readFileSync(join(editorialRoot, 'legacy-exclusions.json'), 'utf8'));

function escapeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function absoluteUrl(value) {
  return new URL(value, origin).href;
}

function imageUrl(value) {
  for (const name of ['crm-ai-access-scope', 'crm-ai-access-pilot']) {
    if (value?.includes(`${name}.`)) return `${origin}/dzen-images/${name}-800.png`;
  }
  return absoluteUrl(value);
}

async function localImage(url, articlePath) {
  const parsed = new URL(url);
  if (parsed.origin !== origin) throw new Error(`External Dzen image: ${articlePath} ${url}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const file = join(outputRoot, pathname.slice(1));
  const metadata = await sharp(file).metadata();
  if (!['jpeg', 'png', 'gif'].includes(metadata.format) || (metadata.width ?? 0) < 700) {
    throw new Error(`Dzen image must be JPEG, PNG or GIF and at least 700 px wide: ${articlePath} ${url}`);
  }
  return { file, format: metadata.format };
}

function cleanText(node) {
  return node?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function renderTable(table) {
  const headings = [...table.querySelectorAll('thead th')].map(cleanText);
  const rows = [...table.querySelectorAll('tbody tr')];
  return rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > th, :scope > td')].map(cleanText);
    const values = cells.map((value, index) => {
      const heading = headings[index];
      return heading ? `<b>${escapeText(heading)}:</b> ${escapeText(value)}` : escapeText(value);
    });
    return `<p>${values.join('; ')}</p>`;
  }).join('\n');
}

function renderFigure(figure) {
  const img = figure.querySelector('img');
  if (!img) return '';
  const original = figure.querySelector('a[href]')?.getAttribute('href');
  const source = original && /\.(jpe?g|png|gif)$/i.test(original)
    ? original
    : img.getAttribute('src');
  const caption = cleanText(figure.querySelector('figcaption'));
  return `<figure><img src="${escapeText(imageUrl(source))}">${caption ? `<figcaption>${escapeText(caption)}</figcaption>` : ''}</figure>`;
}

function renderList(list, sourceUrl) {
  const ordered = list.tagName.toLowerCase() === 'ol';
  return [...list.children].filter((child) => child.tagName.toLowerCase() === 'li').map((item, index) => {
    const content = [...item.childNodes].map((child) => render(child, sourceUrl)).join('')
      .replaceAll('<p>', ' ').replaceAll('</p>', ' ')
      .replace(/\s+/g, ' ').trim();
    const prefix = ordered
      ? (/^\d+[.)\s]/.test(content) ? '' : `${index + 1}. `)
      : '• ';
    return `<p>${prefix}${content}</p>`;
  }).join('\n');
}

function render(node, sourceUrl) {
  if (node.nodeType === 3) return escapeText(node.nodeValue);
  if (node.nodeType !== 1) return '';
  const tag = node.tagName.toLowerCase();
  if (['script', 'style', 'svg', 'path', 'button', 'form'].includes(tag)) return '';
  if (tag === 'figure') return renderFigure(node);
  if (tag === 'table') return renderTable(node);
  if (tag === 'ul' || tag === 'ol') return renderList(node, sourceUrl);
  if (tag === 'img') {
    const src = node.getAttribute('src');
    return src ? `<img src="${escapeText(imageUrl(src))}">` : '';
  }
  const children = [...node.childNodes].map((child) => render(child, sourceUrl)).join('');
  if (tag === 'a') {
    const href = node.getAttribute('href');
    if (!href) return children;
    const destination = href === '#contact-request' ? `${sourceUrl}${href}` : href.startsWith('#') ? href : absoluteUrl(href);
    return `<a href="${escapeText(destination)}">${children}</a>`;
  }
  const mapped = {
    strong: 'b', em: 'i', summary: 'h3',
    p: 'p', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4',
    b: 'b', i: 'i', u: 'u', s: 's',
    blockquote: 'blockquote', ul: 'ul', ol: 'ol', li: 'li',
    figcaption: 'figcaption',
  }[tag];
  if (!mapped) return children;
  const id = ['h2', 'h3', 'h4'].includes(mapped) && node.id ? ` id="${escapeText(node.id)}"` : '';
  return `<${mapped}${id}>${children}</${mapped}>`;
}

const items = [];
const manifest = [];
rmSync(editorRoot, { recursive: true, force: true });
for (const article of selectDzenArticles(allArticles, adaptations, sectionAdaptations, legacyExclusions)) {
  const sourcePath = join(siteRoot, 'dist', article.hrefPath, 'index.html');
  const document = new JSDOM(readFileSync(sourcePath, 'utf8')).window.document;
  const header = document.querySelector('main > article > header');
  const body = document.querySelector('main > article > div > div');
  if (!header || !body) throw new Error(`Article structure changed: ${article.hrefPath}`);
  const url = `${origin}/${article.hrefPath}`;
  const adaptation = adaptations[article.hrefPath];
  if (!adaptation || !adaptation.title?.trim() || !adaptation.description?.trim()
      || adaptation.lead?.length !== 3 || !adaptation.lead.every(paragraph => paragraph?.trim())
      || !adaptation.opening?.trim()) {
    throw new Error(`Missing Dzen adaptation: ${article.hrefPath}`);
  }
  const delivery = adaptation.delivery ?? 'rss';
  if (!['rss', 'manual'].includes(delivery)) throw new Error(`Invalid Dzen delivery: ${article.hrefPath}`);
  const opening = body.querySelector('p');
  if (!opening) throw new Error(`Missing opening paragraph: ${article.hrefPath}`);
  opening.textContent = adaptation.opening;
  const replacements = sectionAdaptations[article.hrefPath];
  if (!replacements || Object.keys(replacements).length !== 2) {
    throw new Error(`Missing section adaptations: ${article.hrefPath}`);
  }
  const replaced = new Set();
  for (const section of body.querySelectorAll(':scope > section')) {
    const heading = cleanText(section.querySelector('h2'));
    const replacement = replacements[heading];
    if (!replacement) continue;
    const paragraph = section.querySelector('p');
    if (!paragraph || paragraph.querySelector('a')) {
      throw new Error(`Cannot safely adapt linked paragraph: ${article.hrefPath} ${heading}`);
    }
    paragraph.textContent = replacement;
    replaced.add(heading);
  }
  if (replaced.size !== 2) throw new Error(`Unmatched section adaptation: ${article.hrefPath}`);
  const lead = adaptation.lead.map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join('\n');
  const productCta = document.querySelector('main > article > aside');
  const productHtml = productCta ? render(productCta, url) : '';
  const html = `${lead}\n${render(body, url)}\n${productHtml}\n<p>Источник: <a href="${url}">${url}</a></p>`;
  const figures = [...body.querySelectorAll('figure')];
  if (figures.some(figure => !cleanText(figure.querySelector('figcaption')))) {
    throw new Error(`Dzen image caption is missing: ${article.hrefPath}`);
  }
  const images = figures.map((figure) => imageUrl(figure.querySelector('a[href]')?.getAttribute('href') ?? figure.querySelector('img')?.getAttribute('src')));
  if (images.length < 2) throw new Error(`Dzen article needs two images: ${article.hrefPath}`);
  const imageAssets = await Promise.all(images.map((image) => localImage(image, article.hrefPath)));
  const editorDirectory = join(editorRoot, article.hrefPath.replace(/\/$/, ''));
  mkdirSync(editorDirectory, { recursive: true });
  writeFileSync(join(editorDirectory, 'article.html'), `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeText(adaptation.title)}</title>
<style>body{max-width:760px;margin:32px auto;padding:0 20px;color:#20242a;font:18px/1.65 system-ui,sans-serif}img{max-width:100%;height:auto}figure{margin:32px 0}figcaption{font-size:14px;color:#626971}</style>
</head><body><h1>${escapeText(adaptation.title)}</h1>${html}</body></html>
`);
  for (const asset of imageAssets) copyFileSync(asset.file, join(editorDirectory, basename(asset.file)));
  const published = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ?? article.publishedAt;
  if (!published) throw new Error(`Missing publication date: ${article.hrefPath}`);
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(published) ? `${published}T00:00:00+03:00` : published;
  const item = [
    '<item>',
    `<title>${escapeText(adaptation.title)}</title>`,
    `<link>${escapeText(url)}</link>`,
    `<guid isPermaLink="true">${escapeText(url)}</guid>`,
    `<pubDate>${new Date(normalizedDate).toUTCString()}</pubDate>`,
    '<category>format-article</category>',
    `<description>${escapeText(adaptation.description)}</description>`,
    `<enclosure url="${escapeText(images[0])}" type="image/${imageAssets[0].format}"/>`,
    `<content:encoded><![CDATA[${html.replaceAll(']]>', ']]]]><![CDATA[>')}]]></content:encoded>`,
    '</item>',
  ].join('\n');
  if (delivery === 'rss') items.push(item);
  manifest.push({ title: adaptation.title, url, delivery, publishedAt: published, characters: body.textContent.trim().length, images });
}

if (items.length < 10) throw new Error(`Dzen requires at least 10 items on first submission; found ${items.length}`);
const rss = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
  '<channel>',
  '<title>Блог TrueTell</title>',
  `<link>${origin}/</link>`,
  '<description>Статьи TrueTell об аналитике, Битрикс24 и МойСклад</description>',
  '<language>ru</language>',
  ...items,
  '</channel>',
  '</rss>',
].join('\n');
mkdirSync(outputRoot, { recursive: true });
writeFileSync(join(outputRoot, 'dzen.xml'), rss);
writeFileSync(join(editorRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ rssCount: items.length, editorCount: manifest.length, bytes: Buffer.byteLength(rss), output: join(outputRoot, 'dzen.xml') }));
