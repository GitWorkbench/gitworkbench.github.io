import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { PUBLIC_PAGES } from '../data/pages';

/** Index only canonical public pages. Do not invent modification dates. */
export const GET: APIRoute = ({ site }) => {
  const base = new URL(site ?? SITE.url);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_PAGES.map((page) => `  <url><loc>${new URL(page.path, base).href}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
