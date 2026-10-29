import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const dist = path.resolve('dist');
const origin = 'https://gitworkbench.github.io';
const tagUrl = 'https://www.googletagmanager.com/gtag/js?id=G-0T2SP16P0K';
const failures = [];
let passed = 0;
function check(label, condition) { if (condition) passed++; else failures.push(label); }
function walk(dir) { return readdirSync(dir).flatMap((name) => { const file = path.join(dir, name); return statSync(file).isDirectory() ? walk(file) : [file]; }); }
const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const pages = new Map();
const titles = new Set();
const descriptions = new Set();

for (const file of htmlFiles) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const route = relative === 'index.html' ? '/' : relative === '404.html' ? '/404.html' : `/${relative.replace(/index\.html$/, '')}`;
  const document = new JSDOM(readFileSync(file, 'utf8')).window.document;
  pages.set(route, document);
  const meta = (selector) => document.querySelector(selector)?.getAttribute('content') ?? '';
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const prefix = `${route}: `;
  check(prefix + 'one canonical URL', document.querySelectorAll('link[rel="canonical"]').length === 1 && canonical === origin + route);
  check(prefix + 'advertises the flat sitemap', document.querySelector('link[rel="sitemap"]')?.getAttribute('href') === '/sitemap.xml');
  check(prefix + 'one descriptive h1', document.querySelectorAll('main h1').length === 1 && document.querySelector('main h1').textContent.trim().length > 10);
  check(prefix + 'English document', document.documentElement.lang === 'en');
  check(prefix + 'mobile viewport', /width=device-width/.test(meta('meta[name="viewport"]')));
  check(prefix + 'unique page title', document.title.length >= 25 && document.title.length <= 75 && !titles.has(document.title));
  titles.add(document.title);
  const description = meta('meta[name="description"]');
  check(prefix + 'unique useful description', description.length >= 110 && description.length <= 175 && !descriptions.has(description));
  descriptions.add(description);
  check(prefix + 'matching social metadata', meta('meta[property="og:title"]') === document.title && meta('meta[property="og:description"]') === description && meta('meta[property="og:url"]') === canonical);
  check(prefix + 'large social card', meta('meta[name="twitter:card"]') === 'summary_large_image' && meta('meta[name="twitter:image"]') === meta('meta[property="og:image"]'));
  const socialImage = new URL(meta('meta[property="og:image"]'));
  check(prefix + 'social image exists', socialImage.origin === origin && existsSync(path.join(dist, socialImage.pathname)));
  check(prefix + 'social image has alt text', meta('meta[property="og:image:alt"]').length > 30);
  const scripts = [...document.querySelectorAll('script[src]')];
  check(prefix + 'Google tag loads exactly once', scripts.filter((script) => script.getAttribute('src') === tagUrl && script.hasAttribute('async')).length === 1);
  check(prefix + 'Google property is initialized once', [...document.scripts].filter((script) => script.textContent.includes("gtag('config', 'G-0T2SP16P0K')")).length === 1);
  check(prefix + 'no unexpected third-party scripts', scripts.every((script) => !/^https?:/.test(script.getAttribute('src')) || script.getAttribute('src') === tagUrl));
  check(prefix + 'cacheable shared styles', document.querySelector('link[rel="stylesheet"][href^="/_astro/"]') !== null);
  check(prefix + 'font preload', document.querySelector('link[rel="preload"][as="font"][crossorigin]') !== null);
  const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
  check(prefix + 'unique IDs', new Set(ids).size === ids.length);
  for (const image of document.querySelectorAll('img')) {
    check(prefix + 'image has alt and dimensions', image.hasAttribute('alt') && image.hasAttribute('width') && image.hasAttribute('height'));
  }
  if (route === '/404.html') {
    check(prefix + 'not indexed', meta('meta[name="robots"]').startsWith('noindex'));
    continue;
  }
  check(prefix + 'indexable', meta('meta[name="robots"]').startsWith('index, follow'));
  const structured = [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent));
  check(prefix + 'structured data present', structured.length > 0);
  check(prefix + 'no invented review ratings', !structured.some((item) => 'aggregateRating' in item));
  if (route !== '/') {
    const breadcrumbs = structured.find((item) => item['@type'] === 'BreadcrumbList');
    const visibleCrumbs = [...document.querySelectorAll('.breadcrumbs li')];
    check(prefix + 'breadcrumbs match visible navigation', breadcrumbs?.itemListElement?.length === visibleCrumbs.length && breadcrumbs.itemListElement.every((item, index) => item.name === visibleCrumbs[index].textContent.trim()));
    check(prefix + 'breadcrumbs end at canonical URL', breadcrumbs?.itemListElement?.at(-1)?.item === canonical);
  }
  if (route.startsWith('/guides/') && route !== '/guides/') check(prefix + 'guide has article schema', structured.some((item) => item['@type'] === 'TechArticle'));
  if (route.startsWith('/compare/') && route !== '/compare/') {
    const table = document.querySelector('.comparison-table table');
    check(prefix + 'accessible detailed comparison table', table?.querySelector('caption') && table.querySelectorAll('thead th[scope="col"]').length === 3 && table.querySelectorAll('tbody th[scope="row"]').length >= 9);
    const tableRows = [...(table?.querySelectorAll('tbody tr') ?? [])];
    const mobileCards = [...document.querySelectorAll('.comparison-mobile-card')];
    check(prefix + 'mobile comparison uses stacked cards rather than horizontal scrolling', mobileCards.length >= 9 && mobileCards.every((card) => card.querySelector('h3') && card.querySelectorAll('dl > div').length === 2 && card.querySelectorAll('dt').length === 2));
    check(prefix + 'comparison table has no forced scroll region or scroll hint', !document.querySelector('.comparison-table[role="region"]') && !document.querySelector('.comparison-scroll-hint'));
    check(prefix + 'each comparison criterion has a unique label and official competitor citation', tableRows.length >= 9 && new Set(tableRows.map((row) => row.querySelector('th[scope="row"]')?.textContent.trim())).size === tableRows.length && tableRows.every((row) => {
      const citation = row.querySelector('td:last-child .comparison-citation[href^="#source-"]');
      return Boolean(citation && document.querySelector(citation.getAttribute('href')));
    }));
    const fitCards = [...document.querySelectorAll('#quick-fit .comparison-fit-card')];
    check(prefix + 'quick-fit summary gives both products a sourced perspective', fitCards.length === 2 && fitCards.every((card) => card.querySelectorAll('li').length >= 2 && card.querySelector('.comparison-fit-source a[href^="#source-"]')));
    check(prefix + 'comparison table links product claims to cited sources', table?.querySelectorAll('thead .comparison-citation[href^="#source-"]').length === 2 && table.querySelectorAll('tbody .comparison-citation[href^="#source-"]').length >= 4);
    check(prefix + 'specific Workbench advantage is stated and sourced', document.querySelector('#consider-workbench .comparison-edge')?.textContent.trim().length > 100 && document.querySelector('#consider-workbench .comparison-edge a[href^="#source-"]'));
    const sources = [...document.querySelectorAll('.document-sources li[id] a[href]')];
    check(prefix + 'official sources and Workbench documentation', sources.length >= 2 && sources.every((source) => source.href.startsWith('https://')) && sources.some((source) => source.href === 'https://github.com/GitWorkbench/workbench/blob/main/README.md'));
    const reviewed = [...document.querySelectorAll('time[datetime]')].map((node) => node.getAttribute('datetime'));
    check(prefix + 'consistent source review date', reviewed.length >= 2 && reviewed.every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date === reviewed[0] && Number.isFinite(Date.parse(date))));
    check(prefix + 'balanced fit and switching context', document.querySelector('#other-fit p')?.textContent.length > 100 && document.querySelectorAll('#before-switching li').length >= 2);
  }
  if (route === '/compare/') {
    const cards = [...document.querySelectorAll('.client-comparison-card')];
    const list = structured.find((item) => item['@type'] === 'ItemList');
    check(prefix + 'comparison index lists nine distinct clients', cards.length === 9 && new Set(cards.map((card) => card.querySelector('h2')?.textContent.trim())).size === 9);
    check(prefix + 'comparison cards show a direct Git Workbench versus competitor matchup', cards.every((card) => {
      const competitor = card.querySelector('.client-comparison-competitor')?.textContent.trim();
      const heading = card.querySelector('h2')?.textContent.replace(/\s+/g, ' ').trim();
      return card.querySelector('.client-comparison-workbench')?.textContent === 'Git Workbench'
        && card.querySelector('.client-comparison-vs')?.textContent.trim().toLowerCase() === 'vs'
        && heading === `Git Workbench vs ${competitor}`;
    }));
    check(prefix + 'each comparison card is one accessible full-card link with a clear action', cards.every((card) => card.matches('a.client-comparison-card[href^="/compare/"]') && !card.querySelector('a') && card.querySelector('.client-comparison-link[aria-hidden="true"]')));
    check(prefix + 'each comparison card states one Workbench edge', cards.every((card) => (card.querySelector('.client-comparison-advantage')?.textContent.trim().length ?? 0) > 50));
    check(prefix + 'comparison collection schema matches visible comparison pages', list?.itemListElement?.length === cards.length && list.itemListElement.every((item) => item.url.startsWith(origin + '/compare/')));
    check(prefix + 'comparison page explains there is no overall score', /no overall score/i.test(document.body.textContent));
  }
  const faq = structured.find((item) => item['@type'] === 'FAQPage');
  if (faq) {
    const questions = [...document.querySelectorAll('.faq summary')].map((item) => item.textContent.trim().replace(/\s+/g, ' '));
    const answers = [...document.querySelectorAll('.faq-answer p')].map((item) => item.textContent.trim());
    check(prefix + 'FAQ schema matches visible content', faq.mainEntity.length === questions.length && faq.mainEntity.every((item, index) => item.name === questions[index] && item.acceptedAnswer.text === answers[index]));
  }
}

// Resolve every internal link against the built target, including cross-page fragments.
const inbound = new Map([...pages.keys()].map((route) => [route, 0]));
for (const [route, document] of pages) {
  for (const element of document.querySelectorAll('a[href], img[src], script[src], link[href], source[srcset]')) {
    const value = element.getAttribute('href') ?? element.getAttribute('src') ?? element.getAttribute('srcset');
    const values = element.hasAttribute('srcset') ? value.split(',').map((part) => part.trim().split(/\s+/)[0]) : [value];
    for (const value of values) {
      if (!value || /^(?:mailto:|tel:|data:)/.test(value)) continue;
      const url = new URL(value, origin + route);
      if (url.origin !== origin) continue;
      const target = pages.get(url.pathname);
      if (target) {
        check(`${route}: internal page ${url.pathname} exists`, true);
        if (url.pathname !== route) inbound.set(url.pathname, (inbound.get(url.pathname) ?? 0) + 1);
        if (url.hash) check(`${route}: fragment ${url.pathname}${url.hash} exists`, target.getElementById(decodeURIComponent(url.hash.slice(1))) !== null);
      } else {
        check(`${route}: local asset ${url.pathname} exists`, existsSync(path.join(dist, decodeURIComponent(url.pathname))));
      }
    }
  }
}
const indexXml = readFileSync(path.join(dist, 'sitemap-index.xml'), 'utf8');
const flatXml = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapIndex = new JSDOM(indexXml, {contentType: 'application/xml'}).window.document;
const sitemapLocations = [...sitemapIndex.querySelectorAll('sitemap > loc')].map((node) => node.textContent);
check('official sitemap index is valid and nonempty', sitemapIndex.documentElement.localName === 'sitemapindex' && sitemapIndex.documentElement.namespaceURI === 'http://www.sitemaps.org/schemas/sitemap/0.9' && sitemapLocations.length > 0 && new Set(sitemapLocations).size === sitemapLocations.length);
const urls = sitemapLocations.flatMap((location) => {
  const url = new URL(location);
  const file = path.join(dist, url.pathname);
  const valid = url.origin === origin && /^\/sitemap-\d+\.xml$/.test(url.pathname) && existsSync(file);
  check(`generated sitemap ${location} is published on the production domain`, valid);
  if (!valid) return [];
  const document = new JSDOM(readFileSync(file, 'utf8'), {contentType: 'application/xml'}).window.document;
  check(`${url.pathname} contains a standard sitemap urlset`, document.documentElement.localName === 'urlset' && document.documentElement.namespaceURI === 'http://www.sitemaps.org/schemas/sitemap/0.9');
  return [...document.querySelectorAll('url > loc')].map((node) => node.textContent);
});
const flatDocument = new JSDOM(flatXml, {contentType: 'application/xml'}).window.document;
const flatUrls = flatDocument.documentElement.localName === 'urlset'
  ? [...flatDocument.querySelectorAll('url > loc')].map((node) => node.textContent)
  : urls;
if (sitemapLocations.length === 1) {
  check('conventional sitemap is a single standard urlset', flatDocument.documentElement.localName === 'urlset' && flatDocument.documentElement.namespaceURI === 'http://www.sitemaps.org/schemas/sitemap/0.9');
  check('conventional sitemap is the exact Astro-generated URL set', flatXml === readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8'));
} else {
  check('conventional sitemap preserves the official index when URLs are split', flatDocument.documentElement.localName === 'sitemapindex' && flatXml === indexXml);
}
const publicRoutes = [...pages.keys()].filter((route) => route !== '/404.html');
check('sitemap contains every indexable page exactly once', urls.length === publicRoutes.length && new Set(urls).size === urls.length && publicRoutes.every((route) => urls.includes(origin + route)));
check('flat sitemap contains every indexable page exactly once', flatUrls.length === publicRoutes.length && new Set(flatUrls).size === flatUrls.length && publicRoutes.every((route) => flatUrls.includes(origin + route)));
check('404 is absent from sitemap', !urls.includes(origin + '/404.html'));
check('all content pages have incoming links', publicRoutes.every((route) => route === '/' || inbound.get(route) > 0));
check('ten substantive feature and guide detail pages exist', publicRoutes.filter((route) => /^\/(features|guides)\/.+\/$/.test(route)).length === 10);
check('nine sourced client comparison pages exist', publicRoutes.filter((route) => /^\/compare\/.+\/$/.test(route)).length === 9);
check('only three variable font files are shipped', files.filter((file) => file.endsWith('.woff2')).length === 3);
check('robots advertises flat sitemap', readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`));

if (failures.length) {
  console.error(`SEO verification failed (${failures.length} checks):\n${failures.map((item) => `  ✗ ${item}`).join('\n')}`);
  process.exit(1);
}
console.log(`SEO verified: ${passed} checks across ${publicRoutes.length} indexable pages; all internal links, metadata, sitemap entries, and Google tags passed.`);
