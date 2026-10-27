import { copyFile } from 'node:fs/promises';

// Keep existing links and Search Console submissions usable while the official
// integration owns all sitemap generation, splitting, and URL discovery.
await copyFile(
  new URL('../dist/sitemap-index.xml', import.meta.url),
  new URL('../dist/sitemap.xml', import.meta.url),
);
