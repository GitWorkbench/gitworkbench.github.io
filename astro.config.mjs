import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves this repository at https://gitworkbench.github.io/.
export default defineConfig({
  site: 'https://gitworkbench.github.io',
  trailingSlash: 'always',
  integrations: [sitemap({
    // The custom error page is noindex and must stay out of discovery files.
    filter: (page) => !['/404', '/404/', '/404.html'].includes(new URL(page).pathname),
  })],
  build: {
    // Share one cacheable stylesheet between the feature and guide pages.
    inlineStylesheets: 'never',
  },
  image: {
    // Screenshots are the largest assets on the page; keep generated variants small.
    responsiveStyles: true,
  },
});
