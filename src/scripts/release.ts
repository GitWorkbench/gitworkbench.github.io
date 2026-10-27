export const REPOSITORY = 'GitWorkbench/workbench';
export const RELEASES_URL = `https://github.com/${REPOSITORY}/releases`;

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size?: number;
}

const SUFFIXES = {
  AppImage: '.AppImage',
  deb: '.deb',
  rpm: '.rpm',
  pacman: '.pkg.tar.zst',
  dmg: '.dmg',
  zip: '.zip',
  exe: '.exe',
} as const;

export type DownloadFormat = keyof typeof SUFFIXES;

/**
 * Accept only the public repository's release assets. API-supplied URLs are
 * never trusted, so a compromised or unexpected response cannot redirect a
 * download somewhere else.
 */
export function assetUrl(asset: Partial<ReleaseAsset> | null | undefined): string | null {
  if (!asset || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') {
    return null;
  }
  try {
    const url = new URL(asset.browser_download_url);
    if (
      url.protocol !== 'https:' ||
      url.origin !== 'https://github.com' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !url.pathname.startsWith(`/${REPOSITORY}/releases/download/`)
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function findAsset(
  assets: ReleaseAsset[] | null | undefined,
  format: string,
  architecture = 'x64',
): ReleaseAsset | null {
  const suffix = SUFFIXES[format as DownloadFormat];
  if (!suffix || !Array.isArray(assets)) return null;

  return (
    assets.find((asset) => {
      if (
        !assetUrl(asset) ||
        !asset.name.toLowerCase().startsWith('git-workbench-') ||
        !asset.name.endsWith(suffix)
      ) {
        return false;
      }

      if (format === 'dmg' || format === 'zip') {
        return /(?:^|[-_.])universal(?:[-_.]|$)/i.test(asset.name);
      }

      if (format === 'exe') {
        return !/(?:^|[-_.])(?:arm64|aarch64|ia32|i386|i686)(?:[-_.]|$)/i.test(asset.name);
      }

      const names = architecture === 'arm64' ? '(?:arm64|aarch64)' : '(?:x64|x86_64|amd64)';
      return new RegExp(`(?:^|[-_.])${names}(?:[-_.]|$)`, 'i').test(asset.name);
    }) ?? null
  );
}

export function formatBytes(bytes: number | undefined): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const precision = unit >= 2 ? 1 : 0;
  return `${value.toFixed(precision)} ${units[unit]}`;
}

interface ReleaseResponse {
  tag_name?: unknown;
  assets?: unknown;
  draft?: unknown;
  prerelease?: unknown;
}

/**
 * Progressive enhancement: without JavaScript every download link already
 * points at the release page, and this only upgrades those links to direct
 * assets once a valid public release has been confirmed.
 */
export async function loadRelease(
  root: Document = document,
  request: typeof fetch = fetch,
): Promise<void> {
  const status = root.getElementById('release-status');
  const badge = root.getElementById('release-version');
  const releaseNotes = root.getElementById('release-notes');
  if (!status || !badge) return;

  const architecture = root.getElementById('linux-arch') as HTMLSelectElement | null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  if (!status.dataset.releaseSnapshot) {
    status.textContent = 'Checking the latest public release…';
    status.dataset.state = 'loading';
  }

  try {
    const response = await request(
      `https://api.github.com/repos/${REPOSITORY}/releases/latest`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
        credentials: 'omit',
      },
    );

    if (response.status === 404) {
      if (!status.dataset.releaseSnapshot) {
        status.textContent = 'Public release assets are being prepared. Check GitHub for availability.';
        status.dataset.state = 'fallback';
      }
      return;
    }
    if (!response.ok) throw new Error('Release lookup unavailable');

    const release = (await response.json()) as ReleaseResponse;
    if (
      release.draft ||
      release.prerelease ||
      typeof release.tag_name !== 'string' ||
      !Array.isArray(release.assets)
    ) {
      throw new Error('Unexpected release');
    }

    const assets = release.assets as ReleaseAsset[];
    const tag = release.tag_name;
    const releaseUrl = `${RELEASES_URL}/tag/${encodeURIComponent(tag)}`;

    badge.textContent = tag.slice(0, 40);
    releaseNotes?.setAttribute('href', releaseUrl);

    const updateDownloads = () => {
      let available = 0;

      for (const link of root.querySelectorAll<HTMLAnchorElement>('[data-download]')) {
        const format = link.dataset.download ?? '';
        const asset = findAsset(assets, format, architecture?.value);
        const url = asset ? assetUrl(asset) : null;

        link.href = url ?? releaseUrl;
        link.dataset.available = String(Boolean(url));
        link.title = asset
          ? `Download ${asset.name}${asset.size ? ` (${formatBytes(asset.size)})` : ''}`
          : 'View this release for available builds';

        const size = link.querySelector<HTMLElement>('[data-download-size]');
        if (size) size.textContent = asset ? formatBytes(asset.size) : '';

        if (url) available += 1;
      }

      status.textContent = available
        ? 'Latest stable release · downloads link directly to GitHub.'
        : 'Builds for this selection are not attached yet. View the release for availability.';
      status.dataset.state = available ? 'ready' : 'fallback';
    };

    updateDownloads();
    architecture?.addEventListener('change', updateDownloads);
  } catch {
    // The static build already carries direct links to the latest stable
    // release (snapshot baked at build time). Never degrade those to the
    // generic releases page just because the live API is rate-limited.
    if (status.dataset.releaseSnapshot) {
      status.textContent = `Showing the stable release known at build time (${status.dataset.releaseSnapshot}); the live refresh is unavailable just now.`;
    } else {
      status.textContent = 'Live release details are unavailable. Open GitHub Releases to download.';
      status.dataset.state = 'fallback';
    }
  } finally {
    clearTimeout(timeout);
  }
}
