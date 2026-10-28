import { readFile, writeFile } from 'node:fs/promises';

// Astro's integration generates an index plus numbered URL sets. For this
// small site, expose that generated URL set directly at the conventional URL.
// Keep the index at sitemap.xml if Astro ever splits the site, so no URLs drop.
const dist = new URL('../dist/', import.meta.url);
const index = await readFile(new URL('sitemap-index.xml', dist), 'utf8');
const locations = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => value);

if (locations.length === 1) {
  const child = new URL(locations[0]);
  if (child.origin !== 'https://gitworkbench.github.io' || !/^\/sitemap-\d+\.xml$/.test(child.pathname)) {
    throw new Error(`Unexpected generated sitemap URL: ${child.href}`);
  }

  const urlSet = await readFile(new URL(child.pathname.slice(1), dist), 'utf8');
  const entries = (urlSet.match(/<url>/g) ?? []).length;
  if (!urlSet.includes('<urlset') || entries > 50_000) {
    throw new Error('Astro generated a URL set that cannot be safely flattened.');
  }

  await writeFile(new URL('sitemap.xml', dist), urlSet);
} else {
  await writeFile(new URL('sitemap.xml', dist), index);
}
