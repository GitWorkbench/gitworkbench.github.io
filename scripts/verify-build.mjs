import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const dist = path.resolve('dist');
const failures = [];
let passed = 0;

function check(label, condition) {
  if (condition) {
    passed += 1;
  } else {
    failures.push(label);
  }
}

function read(file) {
  return readFileSync(path.join(dist, file), 'utf8');
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const full = path.join(directory, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

for (const page of ['index.html', '404.html']) {
  check(`dist/${page} exists`, existsSync(path.join(dist, page)));
}

const html = read('index.html');
const dom = new JSDOM(html);
const { document } = dom.window;
const canonical = 'https://gitworkbench.github.io/';
const releases = 'https://github.com/GitWorkbench/workbench/releases';

const meta = (selector) => document.querySelector(selector)?.getAttribute('content') ?? '';
const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) =>
  JSON.parse(script.textContent ?? '{}'),
);

// Document basics
check('html lang is English', document.documentElement.getAttribute('lang') === 'en');
check('viewport metadata is present', /width=device-width/.test(meta('meta[name="viewport"]')));
check(
  'title is descriptive and under 70 characters',
  document.title.length > 35 && document.title.length < 70,
);
check('meta description is present', meta('meta[name="description"]').length >= 120);
check('meta description stays under 170 characters', meta('meta[name="description"]').length <= 170);
check('robots metadata allows rich previews', meta('meta[name="robots"]').startsWith('index, follow'));
check('canonical URL is absolute', document.querySelector('link[rel="canonical"]')?.href === canonical);
check('theme color matches the page surface', /^#[0-9a-f]{6}$/i.test(meta('meta[name="theme-color"]')));

// Open Graph and Twitter
check('og:type is website', meta('meta[property="og:type"]') === 'website');
check('og:title is present', meta('meta[property="og:title"]') === document.title);
check('og:url matches canonical', meta('meta[property="og:url"]') === canonical);
check(
  'og:image is an absolute URL',
  meta('meta[property="og:image"]') === `${canonical}assets/screenshots/history.jpg`,
);
check('og:image dimensions are declared', meta('meta[property="og:image:width"]') === '1440');
check('og:image alt text is present', meta('meta[property="og:image:alt"]').length > 20);
check('twitter card is a large image', meta('meta[name="twitter:card"]') === 'summary_large_image');
check('twitter image is present', meta('meta[name="twitter:image"]').length > 0);

// Structured data
const types = jsonLd.map((data) => data['@type']);
check('structured data includes SoftwareApplication', types.includes('SoftwareApplication'));
check('structured data includes WebSite', types.includes('WebSite'));
check('structured data includes FAQPage', types.includes('FAQPage'));
const software = jsonLd.find((data) => data['@type'] === 'SoftwareApplication') ?? {};
check('software is free', software.offers?.price === '0');
check('software lists every desktop platform', /Linux/.test(software.operatingSystem) && /Windows/.test(software.operatingSystem));
check('software license points at the repository', software.license?.includes('GitWorkbench/workbench'));
check('software feature list mentions the strata graph', software.featureList?.some((value) => /strata/i.test(value)));
const themeList = jsonLd.find((data) => data['@type'] === 'ItemList') ?? {};
check('theme palettes are structured data', themeList.itemListElement?.length === 9);

// Content structure
const headings = [...document.querySelectorAll('h1, h2, h3')];
check('exactly one h1', document.querySelectorAll('h1').length === 1);
check('the page starts with its h1', headings[0]?.tagName === 'H1');
check(
  'required sections are present',
  ['features', 'tour', 'themes', 'how-it-works', 'download', 'faq'].every((id) => document.getElementById(id)),
);
check('navigation is labelled', document.querySelector('nav[aria-label]') !== null);
check('skip link points at main content', document.querySelector('.skip-link')?.getAttribute('href') === '#main');
const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
check('element IDs are unique', new Set(ids).size === ids.length);
const localAnchors = [...document.querySelectorAll('a[href^="/#"]')];
check(
  'every in-page navigation target exists',
  localAnchors.every((anchor) => document.getElementById(anchor.getAttribute('href').slice(2))),
);

// Hero
check(
  'the hero explains the strata positioning',
  document.querySelector('h1')?.textContent.toLowerCase().includes('strata'),
);
check('the hero install command is advertised', document.querySelector('.hero-install .quick-install-command code')?.textContent.includes('gitworkbench.github.io/install.sh'));
check('the hero links to downloads and the repository', document.querySelector('.hero-actions [data-download-recommended]')?.getAttribute('href') === '/#download' && [...document.querySelectorAll('.hero-actions a')].some((a) => a.href.includes('GitWorkbench/workbench')));
check(
  'the hero install note names package formats',
  document.querySelector('.hero-install .install-note')?.textContent.includes('AppImage'),
);

// Real product previews are usable before client-side enhancement.
const heroPreviews = [...document.querySelectorAll('[data-hero-panel]')];
check('hero offers three real app previews', heroPreviews.length === 3);
check('one hero preview is visible without JavaScript', heroPreviews.filter((panel) => !panel.hidden).length === 1);
check('hero image is prioritized', heroPreviews[0]?.querySelector('img')?.getAttribute('fetchpriority') === 'high');
check('hero preview controls have matching panels', [...document.querySelectorAll('[data-hero-tab]')].every((tab) => document.getElementById(tab.getAttribute('aria-controls'))));

// Commit-log features
const rows = [...document.querySelectorAll('.commit-log .commit-row')];
check('features render as a commit log with fourteen rows', rows.length === 14);
const homepageFeatureText = document.querySelector('#features')?.textContent ?? '';
check('homepage describes branch replay and file archaeology', /history time machine/i.test(homepageFeatureText) && /file archaeology/i.test(homepageFeatureText));
check('homepage explains optional milestone celebrations', /optional/i.test(homepageFeatureText) && /milestone celebrations/i.test(homepageFeatureText));
const historyDemo = document.querySelector('[data-history-demo]');
check('interactive history replay is present on the homepage', historyDemo !== null);
check('history replay has eight selectable commit snapshots', historyDemo?.querySelectorAll('[data-history-step]').length === 8);
check('history replay graph contains eight commits and seven connections', historyDemo?.querySelectorAll('[data-history-node]').length === 8 && historyDemo.querySelectorAll('[data-history-edge]').length === 7);
check('history replay controls degrade to a readable static example', historyDemo?.querySelector('[data-history-controls][hidden]') !== null && historyDemo.querySelector('[data-history-step="1"]:not([hidden])') !== null);
check('history replay discloses that sample data is fictional and read-only', /fictional/.test(historyDemo?.textContent ?? '') && /does not connect to a repository or change files/i.test(historyDemo?.textContent ?? ''));
check('history replay links to the full feature guide', document.querySelector('.history-replay-section a[href="/features/commit-graph/#history-time-machine"]') !== null);
check('commit rows expose lane colors for the strata motif', rows.every((row) => row.style.getPropertyValue('--lane')));
check('commit rows carry a fake short hash', rows.every((row) => /^[0-9a-f]{7}$/.test(row.querySelector('.commit-hash')?.textContent ?? '')));
for (const row of rows) {
  check('commit row has a title, description, and detail line', (row.querySelector('h3')?.textContent ?? '').length > 5 && (row.querySelector('.commit-detail')?.textContent ?? '').length > 5);
}

// Screenshots (scroll-snap gallery)
const galleryImages = [...document.querySelectorAll('.screenshot-gallery img')];
check('three app screenshots are shown', galleryImages.length === 3);
for (const image of galleryImages) {
  check('screenshot alt text is descriptive', (image.getAttribute('alt') ?? '').length > 30);
  check('screenshot dimensions prevent layout shift', image.getAttribute('width') === '1440' && image.getAttribute('height') === '900');
  const sources = [...image.closest('picture')?.querySelectorAll('source') ?? []].map((source) => source.getAttribute('type'));
  check('screenshot offers AVIF', sources.includes('image/avif'));
  check('screenshot offers WebP', sources.includes('image/webp'));
  check(
    'screenshot full-size link opens the original image',
    image.closest('a')?.getAttribute('href')?.startsWith('/assets/screenshots/'),
  );
}
check('tour screenshots are lazy', galleryImages.every((image) => image.getAttribute('loading') === 'lazy'));
for (const image of document.querySelectorAll('img')) {
  check('every image declares alt text', image.hasAttribute('alt'));
  check('every image declares its size', image.hasAttribute('width') && image.hasAttribute('height'));
}
check(
  'demo screenshot disclosure is present',
  document.body.textContent.includes('fictional demo repositories and identities'),
);

// Themes
const swatches = [...document.querySelectorAll('[data-theme-swatch]')];
check('all nine shipped palettes are listed', swatches.length === 9);
check('every swatch exposes live preview colors', swatches.every((swatch) => swatch.dataset.themeBg && swatch.dataset.themeAccent));
check('the live theme preview exists', document.querySelector('[data-theme-preview]') !== null);
check(
  'swatches are labelled as the app palette source',
  document.body.textContent.includes('Settings → Typography'),
);

// Workflow + shortcuts (reflog)
const steps = [...document.querySelectorAll('.reflog-row')];
check('the workflow reads as a four-entry reflog', steps.length === 4);
check('reflog entries carry HEAD@{n} refs', steps.every((step) => /^HEAD@\{\d\}/.test(step.querySelector('.reflog-ref')?.textContent.trim() ?? '')));
for (const step of steps) {
  check('each reflog entry is titled and explained', step.querySelector('h3')?.textContent && step.querySelector('p')?.textContent);
}
const shortcuts = [...document.querySelectorAll('.shortcut')];
check('shortcuts are listed as chips', shortcuts.length >= 5);
check('shortcut keys use kbd elements', shortcuts.every((item) => item.querySelectorAll('.key').length >= 1));

// Downloads and progressive enhancement
const downloadLinks = [...document.querySelectorAll('[data-download]')];
check('every download format has a link', downloadLinks.length >= 7);
const snapshotTag = document.getElementById('release-status')?.getAttribute('data-release-snapshot') ?? '';
const assetLinks = [...document.querySelectorAll('.asset-list [data-download]')];
check('all seven platform formats render as rows', assetLinks.length === 7);
if (snapshotTag) {
  // A release was baked at build time: links must be direct, verified assets.
  check(
    'baked release snapshots link to real release assets',
    assetLinks.every((link) => link.dataset.available === 'true' ? link.getAttribute('href')?.startsWith(`https://github.com/GitWorkbench/workbench/releases/download/${encodeURIComponent(snapshotTag)}/`) : link.getAttribute('href') === `${releases}/tag/${encodeURIComponent(snapshotTag)}`),
  );
  check(
    'each baked platform row uses a distinct asset',
    new Set(assetLinks.filter((link) => link.dataset.available === 'true').map((link) => link.getAttribute('href'))).size === assetLinks.filter((link) => link.dataset.available === 'true').length,
  );
  check(
    'baked release assets display their size',
    assetLinks.filter((link) => link.dataset.available === 'true').every((link) => /^\d+(\.\d+)? (B|KB|MB|GB)$/.test(link.querySelector('[data-download-size]')?.textContent.trim() ?? '')),
  );
  check('baked release version drives the badge', (document.getElementById('release-version')?.textContent ?? '').startsWith(snapshotTag));
  check('baked release notes link to the tag', document.getElementById('release-notes')?.getAttribute('href')?.endsWith(`/tag/${snapshotTag}`));
} else {
  check(
    'download fallbacks point at the release page',
    assetLinks.every((link) => link.getAttribute('href') === releases),
  );
}
check('release status is announced', document.getElementById('release-status')?.getAttribute('role') === 'status');
check('release status is a live region', document.getElementById('release-status')?.getAttribute('aria-live') === 'polite');
check('release version badge exists', document.getElementById('release-version') !== null);
check(
  'release notes link never regresses below the releases page',
  (document.getElementById('release-notes')?.getAttribute('href') ?? '').startsWith(releases),
);
check('terminal install command is visible', document.querySelector('.install-terminal .quick-install-command code')?.textContent.includes('gitworkbench.github.io/install.sh'));
check('copy buttons carry the full command', [...document.querySelectorAll('[data-copy]')].every((button) => (button.dataset.copy ?? '').includes('gitworkbench.github.io/install.sh')));
check('installer source is linked for review', document.querySelector('.download-notes')?.textContent.includes('installer source'));

check('FAQ opens with an answer visible', document.querySelectorAll('.faq details[open]').length === 1);
check('FAQ works as a native exclusive accordion', [...document.querySelectorAll('.faq details')].every((item) => item.getAttribute('name') === 'workbench-faq'));

// FAQ stays in sync with structured data
const faqPage = jsonLd.find((data) => data['@type'] === 'FAQPage') ?? {};
const visibleQuestions = [...document.querySelectorAll('.faq details summary')].map((summary) =>
  summary.textContent.trim().replace(/\s+/g, ' '),
);
check('FAQ questions are rendered', visibleQuestions.length >= 6);
check(
  'FAQ structured data matches the visible questions',
  faqPage.mainEntity?.length === visibleQuestions.length &&
    faqPage.mainEntity?.every((entry, index) => entry.name === visibleQuestions[index]),
);

// 404 page
const notFound = new JSDOM(read('404.html')).window.document;
check('404 page is not indexed', notFound.querySelector('meta[name="robots"]')?.getAttribute('content') === 'noindex, follow');
check('404 page links home', notFound.querySelector('a[href="/"]') !== null);
check('404 page has a canonical URL', notFound.querySelector('link[rel="canonical"]')?.href === `${canonical}404.html`);

// Crawling files
const sitemap = read('sitemap-0.xml');
const sitemapIndex = read('sitemap-index.xml');
const flatSitemap = read('sitemap.xml');
const sitemapCount = (sitemapIndex.match(/<sitemap>/g) ?? []).length;
check('official sitemap index links to generated URLs', sitemapCount > 0 && sitemapIndex.includes('<sitemapindex') && sitemapIndex.includes(`<loc>${canonical}sitemap-0.xml</loc>`));
check('conventional sitemap is flat when Astro emits one URL set', sitemapCount !== 1 || flatSitemap === sitemap);
check('conventional sitemap preserves Astro’s index when URLs are split', sitemapCount === 1 || flatSitemap === sitemapIndex);
check('sitemap is a urlset', sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
check('sitemap lists the homepage once', (sitemap.match(new RegExp(`<loc>${canonical}</loc>`, 'g')) ?? []).length === 1);
check('sitemap includes the feature and guide pages', sitemap.includes(`${canonical}features/commit-graph/`) && sitemap.includes(`${canonical}guides/getting-started/`));
check('sitemap uses the production domain', sitemap.includes(`<loc>${canonical}</loc>`));
const robots = read('robots.txt');
check('robots allows crawling', /User-agent: \*\s+Allow: \//.test(robots));
check('robots points at the flat sitemap', robots.includes(`Sitemap: ${canonical}sitemap.xml`));
check('GitHub Pages Jekyll opt-out is published', existsSync(path.join(dist, '.nojekyll')));

// Installer wrapper
const installer = read('install.sh');
check('installer wrapper is published', installer.includes('install-linux.sh | bash -s -- "$@"'));
check('installer wrapper cannot be injected with extra URLs', !installer.includes('+  https://'));

// Local assets and styles
const files = walk(dist);
const cssFiles = files.filter((file) => file.endsWith('.css'));
const inlineStyles = [...document.querySelectorAll('style')].map((style) => style.textContent ?? '');
check('site styles are present', cssFiles.length + inlineStyles.length > 0);
const styleSheets = [
  ...cssFiles.map((file) => ({ css: readFileSync(file, 'utf8'), directory: path.dirname(file) })),
  ...inlineStyles.map((css) => ({ css, directory: dist })),
];
const css = styleSheets.map((sheet) => sheet.css).join('\n');
check('styles include a tablet-down breakpoint', /@media\s*\((?:(?:max-width:\s*880px)|(?:width\s*<=\s*880px))\)/.test(css));
check('styles include a narrow-phone breakpoint', /@media\s*\((?:(?:max-width:\s*440px)|(?:width\s*<=\s*440px))\)/.test(css));
check('styles respect reduced motion', /prefers-reduced-motion/.test(css));
check('styles use fluid typography', css.includes('clamp('));
check('styles define the site colour tokens', css.includes('--accent') && css.includes('--font-sans'));
check('the app palette drives the theme', css.includes('#38bdf8') && css.includes('--pv-'));
check('fonts are self-hosted', !html.includes('fonts.googleapis.com') && !css.includes('fonts.googleapis.com'));
check('font files are emitted', files.some((file) => file.endsWith('.woff2')));
check('installer is executable', (statSync(path.join(dist, 'install.sh')).mode & 0o111) !== 0);

const localPaths = new Set();
for (const element of document.querySelectorAll('[src], [href], [srcset]')) {
  for (const attribute of ['src', 'href', 'srcset']) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    for (const candidate of value.split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url.startsWith('/') && !url.startsWith('//')) localPaths.add(url.split(/[?#]/)[0]);
    }
  }
}
for (const asset of localPaths) {
  check(`local asset ${asset} exists`, existsSync(path.join(dist, asset.replace(/^\//, ''))));
}
for (const sheet of styleSheets) {
  for (const url of sheet.css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
    const value = url[2];
    if (value.startsWith('data:') || value.startsWith('http')) continue;
    const resolved = value.startsWith('/')
      ? path.join(dist, value.slice(1))
      : path.resolve(sheet.directory, value);
    check(`CSS asset ${value} exists`, existsSync(resolved));
  }
}

check('no insecure http:// links are published', !/http:\/\//.test(html));
check('the only remote script is the requested async Google tag', [...document.querySelectorAll('script[src]')].filter((script) => /^https?:/.test(script.getAttribute('src') ?? '')).every((script) => script.getAttribute('src') === 'https://www.googletagmanager.com/gtag/js?id=G-0T2SP16P0K' && script.hasAttribute('async')));

if (failures.length) {
  console.error(`\nWebsite build verification failed (${failures.length} check${failures.length === 1 ? '' : 's'}):\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`Website build verified: ${passed} checks passed across ${files.length} files.`);
