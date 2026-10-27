import { defineConfig } from 'astro/config';

// GitHub Pages serves this repository at https://gitworkbench.github.io/.
export default defineConfig({
  site: 'https://gitworkbench.github.io',
  trailingSlash: 'ignore',
  build: {
    // The whole site is one page; inlining the stylesheet removes a
    // render-blocking request and lets the browser discover the self-hosted
    // fonts immediately.
    inlineStylesheets: 'always',
  },
  image: {
    // Screenshots are the largest assets on the page; keep generated variants small.
    responsiveStyles: true,
  },
});
