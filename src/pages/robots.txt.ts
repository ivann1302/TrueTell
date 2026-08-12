export const prerender = true;

export function GET() {
  const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
  const siteRoot = new URL(base, import.meta.env.SITE);
  const sitemapUrl = new URL('sitemap.xml', siteRoot);

  return new Response(
    `User-agent: *\nAllow: ${siteRoot.pathname}\nSitemap: ${sitemapUrl}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
