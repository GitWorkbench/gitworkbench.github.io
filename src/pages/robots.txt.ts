import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const base = new URL(site ?? SITE.url);
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', base).href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
