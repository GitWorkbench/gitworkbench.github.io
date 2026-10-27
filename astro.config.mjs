import { defineConfig } from 'astro/config';

// GitHub Pages serves this repository at https://gitworkbench.github.io/.
export default defineConfig({
  site: 'https://gitworkbench.github.io',
  trailingSlash: 'always',
  build: {
    // Share one cacheable stylesheet between the feature and guide pages.
    inlineStylesheets: 'never',
  },
  image: {
    // Screenshots are the largest assets on the page; keep generated variants small.
    responsiveStyles: true,
  },
});
