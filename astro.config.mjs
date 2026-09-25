import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://ivann1302.github.io' : 'https://truetell-retail.ru',
  base: isGitHubPages ? '/TrueTell' : '/',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/products/bitrix24-cleaner/': '/bitrix24-cleaner/',
    '/products/backup-moysklad/': '/backup-moysklad/',
    '/products/upravlenie-rezervami-moysklad/': '/upravlenie-rezervami-moysklad/',
  },
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    preview: {
      strictPort: true,
    },
  },
  integrations: [react()],
});
