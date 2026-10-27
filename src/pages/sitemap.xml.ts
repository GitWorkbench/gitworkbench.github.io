import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

/** A single-page site keeps a stable /sitemap.xml instead of a sitemap index. */
export const GET: APIRoute = ({ site }) => {
  const base = new URL(site ?? SITE.url);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL('/', base).href}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
