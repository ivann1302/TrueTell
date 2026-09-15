export const prerender = true;

const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Bingbot',
];

export function GET() {
  const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
  const siteRoot = new URL(base, import.meta.env.SITE);
  const sitemapUrl = new URL('sitemap.xml', siteRoot);

  const aiPolicy = aiCrawlers
    .map((crawler) => `User-agent: ${crawler}\nAllow: ${siteRoot.pathname}`)
    .join('\n\n');
  const robots = `${aiPolicy}\n\nUser-agent: *\nAllow: ${siteRoot.pathname}\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
