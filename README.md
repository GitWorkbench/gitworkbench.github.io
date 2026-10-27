# Git Workbench website

The official website at **https://gitworkbench.github.io/**, built with [Astro](https://astro.build/) and deployed to GitHub Pages by GitHub Actions.

This repository owns the complete website source, screenshots, tests, and deployment. The desktop application is maintained separately in [GitWorkbench/workbench](https://github.com/GitWorkbench/workbench).

## Develop

Use Node.js 22 and npm:

```bash
npm ci
npm run dev          # http://localhost:4321
```

The production build is static, so there is no server runtime:

```bash
npm run check        # Astro + TypeScript diagnostics
npm run build        # writes dist/
npm run preview      # serves the built site
npm test             # unit tests for the release loader and UI behaviour
npm run test:build   # validates the generated HTML, SEO, assets, and sitemap
npm run verify       # check + build + both test suites
```

Run `npm run verify` before pushing. CI runs the same checks and will not publish a failing build.

## Project structure

```text
src/
  components/       Header, footer, and each homepage section
  data/site.ts      Product copy, navigation, features, FAQ, URLs
  layouts/          BaseLayout.astro (document shell and fonts)
  pages/
    index.astro     Homepage and structured data
    404.astro       Styled not-found page (noindex)
    robots.txt.ts   Generated robots.txt
    sitemap.xml.ts  Generated sitemap.xml
  scripts/
    release.ts      GitHub Releases lookup and safe asset selection
    ui.ts           Navigation menu, screenshot tabs, platform detection
  styles/global.css Design tokens, layout, and responsive rules
  assets/           Source screenshots processed by Astro
public/
  assets/           Stable icon, screenshot originals, and social image
  install.sh        Linux one-line installer wrapper
  .nojekyll         Keeps GitHub Pages from running Jekyll
scripts/
  verify-build.mjs  Post-build quality gate
tests/              Vitest suites
```

Edit product copy in `src/data/site.ts`. Section markup lives in `src/components/` and the page composition in `src/pages/index.astro`. Keep the FAQ in `src/data/site.ts` as the single source of truth: the visible accordion and the FAQPage structured data are generated from it.

## SEO and discoverability

Every page goes through `src/components/Seo.astro`, which renders:

- a unique title, meta description, canonical URL, and robots directives;
- Open Graph and Twitter/X large-image metadata with an absolute 1440×900 social image;
- JSON-LD for `SoftwareApplication`, `WebSite`, and `FAQPage`, kept in sync with visible content;
- a mobile-friendly viewport, theme color, icon, and sitemap link.

`src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts` publish crawl files from the configured `site` in `astro.config.mjs`. The 404 page is `noindex, follow`.

The social image is `public/assets/screenshots/history.jpg`, so it keeps a stable URL. Update `og:image` metadata in `Seo.astro` if its dimensions change. After changing page copy, run `npm run test:build` to catch metadata drift.

## Responsive and accessible design

The layout is mobile-first-friendly with fluid spacing and typography (`clamp()`), wrapping grids (`auto-fit` and `minmax()`), and breakpoints at 1080px, 880px, and 440px. The navigation collapses into a labelled menu button; the screenshot tabs support arrow, Home, and End keys. Reduced-motion preferences are respected, all images declare dimensions to avoid layout shift, and the page remains usable without JavaScript.

Before publishing, review the page at roughly 360px, 768px, 1024px, and 1440px wide.

## Screenshots

Screenshots are captured directly from the desktop app using disposable demo repositories and fictional identities. Review every new capture for secrets and personal data.

Replace a screenshot in both places:

1. `src/assets/screenshots/` — Astro generates AVIF, WebP, and JPEG variants at several widths.
2. `public/assets/screenshots/` — stable original used by the full-size link and social metadata.

Keep the 1440×900 aspect ratio and update the alt text or dimensions in `src/components/Showcase.astro` if it changes. The build check verifies descriptive alt text, dimensions, and modern image formats.

## Downloads

Downloads are progressive enhancement. Every link points at GitHub Releases in the HTML, and `src/scripts/release.ts` upgrades those links to the latest stable public assets after checking the GitHub API.

Asset URLs are allowlisted to `https://github.com/GitWorkbench/workbench/releases/download/`. Drafts, prereleases, missing assets, API failures, and slow requests all fall back to the release page. The Linux architecture selector only changes which asset is chosen; no API data is ever rendered as markup.

## Deployment

Push reviewed changes to `main`. The workflow in `.github/workflows/pages.yml`:

1. installs dependencies and runs `astro check`, the build, unit tests, and the build verification;
2. uploads `dist/` as the GitHub Pages artifact;
3. deploys it to the `github-pages` environment.

Repository settings must use **GitHub Actions** as the Pages source. The build job needs only read access; the deploy job receives `pages: write` and `id-token: write`.

App releases remain at [GitWorkbench/workbench/releases](https://github.com/GitWorkbench/workbench/releases). The published installer wrapper at `https://gitworkbench.github.io/install.sh` fetches the canonical Linux installer, verifies package SHA-512 against the release feed, then hands off to the system package manager.
