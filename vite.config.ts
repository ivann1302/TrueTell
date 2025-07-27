import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Custom plugin for critical CSS extraction and inlining
const criticalCssPlugin = () => {
  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, { path: htmlPath }) {
        if (htmlPath !== '/index.html') return html;

        // Create a DOM from the HTML
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Find all CSS links
        const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

        // Create a style element for critical CSS
        const criticalStyle = document.createElement('style');
        criticalStyle.setAttribute('id', 'critical-css');

        // Add critical CSS content - this is a simplified version
        // In a real implementation, you would extract critical CSS from your actual CSS files
        criticalStyle.textContent = `
          /* Critical CSS for above-the-fold content */
          body {
            margin: 0;
            padding: 0;
            font-family: 'Manrope', sans-serif;
          }
          #root {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          /* Add more critical styles here based on your design */
          header, .hero-section {
            width: 100%;
          }
        `;

        // Insert critical CSS at the beginning of head
        document.head.insertBefore(criticalStyle, document.head.firstChild);

        // Modify CSS links to load non-blocking
        cssLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (!href) return;

          // Remove the original link
          link.parentNode.removeChild(link);

          // Create a new preload link
          const preloadLink = document.createElement('link');
          preloadLink.setAttribute('rel', 'preload');
          preloadLink.setAttribute('href', href);
          preloadLink.setAttribute('as', 'style');
          preloadLink.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");

          // Add the preload link
          document.head.appendChild(preloadLink);

          // Add a fallback for browsers that don't support preload
          const noscript = document.createElement('noscript');
          const fallbackLink = document.createElement('link');
          fallbackLink.setAttribute('rel', 'stylesheet');
          fallbackLink.setAttribute('href', href);
          noscript.appendChild(fallbackLink);
          document.head.appendChild(noscript);
        });

        return dom.serialize();
      }
    }
  };
};

// Custom plugin to generate _headers file for production
const generateHeadersFile = () => {
  return {
    name: 'generate-headers-file',
    generateBundle() {
      const headers = `
# Cache static assets for 1 year
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache HTML for 1 hour
/*.html
  Cache-Control: public, max-age=3600, must-revalidate

# Cache fonts for 1 year
/assets/*.ttf
  Cache-Control: public, max-age=31536000, immutable
/assets/*.woff
  Cache-Control: public, max-age=31536000, immutable
/assets/*.woff2
  Cache-Control: public, max-age=31536000, immutable

# Cache images for 1 week
/assets/*.png
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
/assets/*.jpg
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
/assets/*.svg
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
`;

      // Use Vite's emitFile API instead of Node.js fs module
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: headers.trim()
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateHeadersFile(),
    criticalCssPlugin(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ],
  build: {
    cssCodeSplit: true, // Split CSS into chunks
    cssMinify: true, // Minify CSS
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': [
            './src/components/header/header',
            './src/components/footer/footer'
          ],
          'chart-components': [
            './src/components/hero/chart/chart',
            './src/components/chart-section/chart-section'
          ],
          'hero-section': [
            './src/sections/hero-section/hero-section'
          ],
          'slider-section': [
            './src/sections/slider-section/slider-section'
          ],
          'results-section': [
            './src/sections/results-section/results-section'
          ],
          'utils': [
            './src/utils/functions/chartDataConverter',
            './src/hooks/useChartData'
          ]
        },
        // Optimize chunk size and naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    headers: {
      'Cache-Control': 'max-age=31536000, immutable'
    }
  }
});
