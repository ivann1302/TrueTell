import { fileURLToPath } from 'node:url';
import { allArticles } from '../src/config/articles.ts';
import { buildSeoArtifacts } from './seo-build.mjs';

// One generator runs after all static HTML exists, including new routes.
export default function seoIntegration() {
  let config;
  return {
    name: 'truetell-seo',
    hooks: {
      'astro:config:done': ({ config: resolvedConfig }) => { config = resolvedConfig; },
      'astro:build:done': async ({ dir, logger }) => {
        const siteRoot = new URL(`${config.base.replace(/\/$/, '')}/`, config.site).href;
        const pages = await buildSeoArtifacts({
          directory: fileURLToPath(dir), siteRoot,
          reportPath: fileURLToPath(new URL('docs/seo/site-map.md', config.root)),
          articles: allArticles,
        });
        logger.info(`Sitemap: ${pages.filter(page => page.inSitemap).length} canonical URLs; docs/seo/site-map.md updated`);
      },
    },
  };
}
