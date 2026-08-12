import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://ivann1302.github.io' : 'https://truetell.ru',
  base: isGitHubPages ? '/TrueTell' : '/',
  output: 'static',
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
