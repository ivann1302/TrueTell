import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://ivann1302.github.io' : 'https://truetell-retail.ru',
  base: isGitHubPages ? '/TrueTell' : '/',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/moysklad-mass-operations/izmenenie-cen/': '/moysklad-izmenenie-cen/',
    '/moysklad-mass-operations/udalenie/': '/moysklad-udalenie/',
    '/moysklad-mass-operations/izmenenie-tovarov/': '/moysklad-izmenenie-tovarov/',
    '/moysklad-mass-operations/arhivirovanie/': '/moysklad-arhivirovanie/',
    '/moysklad-mass-operations/import/': '/moysklad-import/',
    '/moysklad-mass-operations/izmenenie-dokumentov/': '/moysklad-izmenenie-dokumentov/',
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
