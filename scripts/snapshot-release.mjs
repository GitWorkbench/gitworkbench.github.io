#!/usr/bin/env node
/**
 * Snapshot the latest public release of the desktop app into
 * src/data/release-snapshot.json so the built site carries real,
 * direct asset URLs by default — no JavaScript, no API needed by the
 * visitor. GitHub Actions runs this with GITHUB_TOKEN (no rate-limit
 * issues); a failed lookup (rate limit, offline) keeps the previous
 * snapshot and exits cleanly so local builds never break.
 */
import { writeFile } from 'node:fs/promises';

const REPOSITORY = 'GitWorkbench/workbench';
const TARGET = new URL('../src/data/release-snapshot.json', import.meta.url);
const endpoint = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const pathPrefix = `/${REPOSITORY}/releases/download/`;

/** Same contract as assetUrl() in src/scripts/release.ts. */
function validAsset(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      parsed.origin === 'https://github.com' &&
      !parsed.username &&
      !parsed.password &&
      !parsed.search &&
      !parsed.hash &&
      parsed.pathname.startsWith(pathPrefix)
    );
  } catch {
    return false;
  }
}

const headers = { Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

try {
  const response = await fetch(endpoint, { headers, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    console.log(`Release snapshot: GitHub answered ${response.status} — keeping the existing snapshot.`);
    process.exit(0);
  }

  const release = await response.json();
  const tag = typeof release.tag_name === 'string' ? release.tag_name : '';
  const assets = Array.isArray(release.assets)
    ? release.assets
        .map((entry) => ({
          name: typeof entry?.name === 'string' ? entry.name : '',
          browser_download_url: typeof entry?.browser_download_url === 'string' ? entry.browser_download_url : '',
          size: typeof entry?.size === 'number' && Number.isFinite(entry.size) ? entry.size : undefined,
        }))
        .filter((entry) => entry.name && validAsset(entry.browser_download_url))
    : [];

  if (release.draft || release.prerelease || !tag.startsWith('v') || assets.length === 0) {
    console.log('Release snapshot: response unusable (no stable tag or assets) — keeping the existing snapshot.');
    process.exit(0);
  }

  const snapshot = {
    tag,
    url: `https://github.com/${REPOSITORY}/releases/tag/${encodeURIComponent(tag)}`,
    generatedAt: new Date().toISOString(),
    assets,
  };

  await writeFile(TARGET.pathname, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Release snapshot: baked ${tag} with ${assets.length} assets.`);
} catch (error) {
  console.log(`Release snapshot: lookup failed (${error?.message ?? 'unknown'}) — keeping the existing snapshot.`);
}
