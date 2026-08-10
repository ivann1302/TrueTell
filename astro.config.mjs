import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://truetell.ru',
  output: 'static',
  integrations: [react()],
});
