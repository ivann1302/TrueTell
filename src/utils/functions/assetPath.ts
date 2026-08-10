type ImportedAsset = string | { src: string };

/**
 * Vite returns a string for imported assets in the browser, while Astro SSR
 * represents the same asset as an object with a `src` property.
 */
export const assetPath = (asset: ImportedAsset): string =>
  typeof asset === 'string' ? asset : asset.src;
