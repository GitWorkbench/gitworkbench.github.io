# Git Workbench website

The official website at **https://gitworkbench.github.io/**, built with Astro and deployed as static files to GitHub Pages. The desktop application lives in [GitWorkbench/workbench](https://github.com/GitWorkbench/workbench).

## Develop and validate

Use Node.js 24 (or 22.23.4+) and npm with the committed lockfile:

```bash
npm ci
npm run dev          # http://localhost:4321
npm run check        # Astro and TypeScript
npm run build        # static output in dist/
npm run preview      # preview the production build
npm test             # release loader and UI behavior
npm run test:build   # built content, links, SEO, sitemap, and analytics
npm run verify       # all of the above checks and build
```

`npm run build` first refreshes the release snapshot. Offline or rate-limited local builds keep the committed working snapshot. CI supplies `GITHUB_TOKEN` for the public lookup. No token is sent to the visitor.

## Pages and content

There are 23 indexable pages, plus a noindex 404:

- `/` — product overview, interactive app previews, feature links, themes, workflow, downloads, and FAQ.
- `/features/` — feature hub with six detailed pages: commit graph, staging and diffs, merge conflicts, hosted reviews, restore points, and optional AI.
- `/guides/` — practical guides for getting started, Linux installation, advanced Git workflows, and building the desktop app from source.
- `/compare/` — five sourced comparisons with GitKraken, Sourcetree, GitHub Desktop, Fork, and SmartGit.
- `/download/` — stable installers, file sizes, platform suggestion, and installation help.
- `/faq/`, `/about/`, `/privacy/` — product answers, project information, and website data handling.

Feature and guide copy is maintained in `src/data/content.ts`. It is based on the organization's profile README, the application README, and its first-run and advanced workflow documentation. Each detail page links to its maintained source. Keep prerequisites, supported platforms, provider limits, and recovery caveats accurate when updating copy.

Comparison copy is maintained in `src/data/comparisons.ts`. Each page includes official sources, a source-review date, practical differences, reasons another client may fit better, and Workbench limitations. Review the actual sources before changing the review date. Avoid unsupported performance claims, invented ratings, copied branding, or stale price amounts.

`src/data/pages.ts` provides collection-page metadata. The official `@astrojs/sitemap` integration discovers generated routes during the build, with the noindex 404 explicitly excluded in `astro.config.mjs`. The build checks compare all sitemap URLs with the real HTML output, so new indexable routes are included automatically.

The homepage FAQ and `/faq/` use `src/data/site.ts` as a shared source for visible answers and FAQ structured data. Navigation, release formats, shortcuts, palettes, and product URLs also live there.

## Project structure

```text
src/
  components/       Shared navigation, analytics, SEO, breadcrumbs, cards,
                    page headers, and homepage sections
  data/
    content.ts      Feature and guide documents, references, related pages
    comparisons.ts  Competitor comparisons, citations, and review dates
    pages.ts        Collection-page metadata
    schema.ts       Software, FAQ, page, article, and breadcrumb JSON-LD
    site.ts         Product facts, navigation, FAQ, themes, and URLs
    release-snapshot.json  Last saved stable release assets
  layouts/          BaseLayout, content-reading, and comparison layouts
  pages/            Static routes, robots.txt, and 404
  scripts/          Global UI, platform suggestion, and live release lookup
  styles/           Shared design system and three local variable fonts
  assets/           Screenshots processed by Astro
public/             Stable image originals, install.sh, and .nojekyll
scripts/            Release snapshot, flat sitemap alias, and output checks
tests/              Vitest interaction and release tests
```

## SEO and performance

Every public page has its own title, description, canonical trailing-slash URL, Open Graph and Twitter metadata, and semantic main heading. Inner pages have visible breadcrumbs and matching BreadcrumbList data. Guide details use TechArticle; the homepage and downloads describe the SoftwareApplication, and FAQ markup is generated from the visible answers. Ratings and modification dates are not invented. Structured data does not guarantee a search feature or ranking.

The official `@astrojs/sitemap` integration discovers pages and generates `/sitemap-index.xml` plus numbered URL sets such as `/sitemap-0.xml`. After the build, `scripts/alias-sitemap.mjs` exposes Astro's generated URL set as a flat `/sitemap.xml` while the site fits in one file; if Astro splits it, the conventional URL points to the valid index so no pages are omitted. `/sitemap.xml` is advertised in `robots.txt`, each page's head, and the footer. This reuses Astro's discovered URLs rather than maintaining a second route list. Build checks verify the index and that the flat file contains every indexable canonical page exactly once. The custom 404 is noindex and excluded. Footer links, feature links, related pages, and guide hubs keep content discoverable without client-side routing.

Competitor search targets are mapped to substantive comparison pages, not duplicate pages for every spelling or search phrase:

| Page | Main keyword targets |
| --- | --- |
| `/compare/gitkraken-alternative/` | GitKraken alternative; Git Workbench vs GitKraken; open-source GitKraken alternative |
| `/compare/sourcetree-alternative/` | Sourcetree alternative for Linux; Git Workbench vs Sourcetree |
| `/compare/github-desktop-alternative/` | GitHub Desktop alternative for Linux; GitHub Desktop alternative for GitLab |
| `/compare/fork-alternative/` | Fork Git client alternative; Fork alternative for Linux |
| `/compare/smartgit-alternative/` | open-source SmartGit alternative; Git Workbench vs SmartGit |

These targets are based on product fit, not measured search volume or proven rankings. Titles, visible headings, useful comparison content, and links from the comparison hub support discovery. Use Search Console queries, impressions, clicks, and positions after indexing to refine the pages; keep each page's claims accurate as products change.

Astro renders the content to HTML without a client framework. Shared styles are external and cacheable across pages. Only the Latin subsets of Inter, Outfit, and JetBrains Mono are shipped; the display font is preloaded and all fonts use swap. Screenshots have dimensions, AVIF/WebP variants, responsive sizes, and descriptive alt text. The initial hero screenshot is prioritized; lower screenshots load lazily. The release module is requested only on pages with download controls. Keyboard navigation, reduced motion, and JavaScript-disabled reading and navigation are supported.

`npm run test:build` checks metadata uniqueness, canonical URLs, schema/visible-content agreement, every internal page and fragment link, sitemap completeness, image assets, font files, Google tag placement, and unexpected third-party scripts. It also verifies the homepage's download fallbacks and interactions' required markup.

Before publishing, review a phone, tablet, and desktop viewport. Browser tests should include feature-card navigation, the reading page's table of contents, mobile navigation, hero tabs, and download links.

## Google Analytics and Search Console

`src/components/Analytics.astro` loads the requested asynchronous Google tag and initializes **G-0T2SP16P0K** once per page in production builds, including the 404. Development builds omit it. The standard tag sends automatic page views; this site does not add custom event handlers or a client-side router that would duplicate them. The website privacy page describes this setup.

After deploying, use Google Analytics Realtime or [Tag Assistant](https://tagassistant.google.com/) to verify actual collection. A production build verifies the markup; it cannot prove that the Analytics property received a hit.

For Google Search Console:

1. Add or open the URL-prefix property `https://gitworkbench.github.io/`.
2. If using HTML-tag verification, copy only its token into the repository's Actions variable `PUBLIC_GOOGLE_SITE_VERIFICATION`. The build workflow passes this public value to the shared metadata component. `.env.example` documents the same optional local setting.
3. Deploy the site, verify the property, then submit `https://gitworkbench.github.io/sitemap.xml`.
4. Inspect the homepage, feature hub, and a guide URL using URL Inspection. Use the live deployed URLs when checking rendered markup and structured data.

The Analytics measurement ID is not a Search Console HTML verification token. Search Console ownership, sitemap submission, and external indexing are account/deployment actions; they are not performed by the local build.

## Downloads

`scripts/snapshot-release.mjs` snapshots the latest public stable release into `src/data/release-snapshot.json` before building. Its bounded request excludes drafts and prereleases and keeps the saved snapshot on failure. The committed snapshot is seeded from the v1.3.4 installers and public update manifests.

The HTML contains direct installer links and sizes even without JavaScript. On load, the download pages request public release metadata and refresh the version, notes, sizes, availability labels, and asset URLs. Failed requests leave the saved links intact. Missing formats in a valid release link to that release page and say “View release”. Only public assets under `https://github.com/GitWorkbench/workbench/releases/download/` are accepted.

Desktop platform detection highlights a card and suggests an AppImage, universal DMG, or Windows installer in the hero. Mobile visitors retain the platform chooser. All platform cards remain available. Current official Linux binaries are x86_64.

The public installer wrapper verifies SHA-512 through the canonical Linux installer before invoking the selected package manager. macOS releases are unsigned and updated manually. Review the installer source or follow the Linux guide for details.

## Screenshots

Demo captures use fictional repositories and identities. To replace a capture, update both `src/assets/screenshots/` (optimized variants) and `public/assets/screenshots/` (stable full-size links and social images). Keep 1440×900 dimensions, and update alt text if the content changes.

## GitHub Pages deployment

Set the repository's Pages source to **GitHub Actions**, then push reviewed changes to `main`. `.github/workflows/pages.yml` validates the source, builds, runs both test suites and output checks, uploads `dist/`, and deploys to the `github-pages` environment. Build permissions are read-only; deployment receives `pages: write` and `id-token: write`.

The workflow also rebuilds daily at 03:23 UTC to refresh static release links, supports manual runs, and accepts an `app-release` repository dispatch. The separate application's release publisher must send that dispatch for an immediate static refresh; releases in another repository do not automatically trigger this website workflow. Browser release checks run independently.
