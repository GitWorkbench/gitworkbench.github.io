// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assetUrl,
  findAsset,
  formatBytes,
  loadRelease,
  RELEASES_URL,
  type ReleaseAsset,
} from '../src/scripts/release';

const asset = (name: string, size = 1024): ReleaseAsset => ({
  name,
  browser_download_url: `${RELEASES_URL}/download/v1.0.0/${name}`,
  size,
});

const assets = [
  asset('git-workbench-1.0.0-x86_64.AppImage', 134_142_500),
  asset('git-workbench-1.0.0-amd64.deb', 92_700_000),
  asset('git-workbench-1.0.0-x86_64.rpm'),
  asset('git-workbench-1.0.0-1-x86_64.pkg.tar.zst'),
  asset('git-workbench-1.0.0-arm64.AppImage'),
  asset('git-workbench-1.0.0-arm64.deb'),
  asset('git-workbench-1.0.0-aarch64.rpm'),
  asset('git-workbench-1.0.0-1-aarch64.pkg.tar.zst'),
  asset('git-workbench-1.0.0-universal.dmg', 236_200_000),
  asset('git-workbench-1.0.0-universal.zip'),
  asset('git-workbench-setup-1.0.0.exe', 123_200_000),
];

const fixture = `
  <p id="release-status">Checking the latest public release…</p>
  <span id="release-version">GitHub Releases</span>
  <a id="release-notes" href="${RELEASES_URL}">Release notes</a>
  <select id="linux-arch">
    <option value="x64">Intel / AMD 64-bit</option>
    <option value="arm64">ARM 64-bit</option>
  </select>
  <a data-download="AppImage" href="${RELEASES_URL}">
    <span data-download-label>AppImage</span>
    <span data-download-size></span>
  </a>
  <a data-download="deb" href="${RELEASES_URL}">.deb</a>
  <a data-download="rpm" href="${RELEASES_URL}">.rpm</a>
  <a data-download="pacman" href="${RELEASES_URL}">.pkg.tar.zst</a>
  <a data-download="dmg" href="${RELEASES_URL}">
    <span data-download-label>Download for macOS</span>
    <span data-download-size></span>
  </a>
  <a data-download="zip" href="${RELEASES_URL}">Prefer a ZIP?</a>
  <a data-download="exe" href="${RELEASES_URL}">
    <span data-download-label>Download for Windows</span>
    <span data-download-size></span>
  </a>
`;

const mockFetch = (body: unknown, status = 200, ok = true) =>
  vi.fn(async () => ({ ok, status, json: async () => body })) as unknown as typeof fetch;

beforeEach(() => {
  document.body.innerHTML = fixture;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('release asset selection', () => {
  it('accepts only asset links belonging to this public repository', () => {
    expect(assetUrl(assets[0])).toBe(assets[0].browser_download_url);
    for (const url of [
      'javascript:alert(1)',
      'http://github.com/GitWorkbench/workbench/releases/download/v1/app.deb',
      'https://evil.invalid/app.deb',
      'https://github.com/other/repo/releases/download/v1/app.deb',
      'https://user:password@github.com/GitWorkbench/workbench/releases/download/v1/app.deb',
      `${assets[0].browser_download_url}?token=example`,
      `${assets[0].browser_download_url}#fragment`,
      'broken',
    ]) {
      expect(assetUrl({ name: 'app.deb', browser_download_url: url })).toBeNull();
    }
    for (const value of [null, undefined, {}, { name: 4 }, { name: 'app', browser_download_url: 4 }]) {
      expect(assetUrl(value as never)).toBeNull();
    }
  });

  it.each(['AppImage', 'deb', 'rpm', 'pacman'])('matches x64 and ARM names for %s', (format) => {
    expect(findAsset(assets, format, 'x64')?.name).toMatch(/x86_64|amd64/);
    expect(findAsset(assets, format, 'arm64')?.name).toMatch(/arm64|aarch64/);
  });

  it.each(['dmg', 'zip'])('selects universal macOS %s assets', (format) => {
    const all = [asset(`git-workbench-1.0.0-arm64.${format}`), ...assets];
    expect(findAsset(all, format)?.name).toBe(`git-workbench-1.0.0-universal.${format}`);
  });

  it('does not confuse Windows ARM builds or unrelated files with the x64 installer', () => {
    expect(findAsset([asset('git-workbench-setup-1.0.0-arm64.exe'), ...assets], 'exe')?.name).toBe(
      'git-workbench-setup-1.0.0.exe',
    );
    expect(
      findAsset([asset('other-1.0.0-x64.deb'), asset('git-workbench-1.0.0-x64.pacman')], 'deb'),
    ).toBeNull();
    expect(findAsset(null, 'deb')).toBeNull();
    expect(findAsset(assets, 'unknown')).toBeNull();
  });

  it('formats asset sizes for display without noisy decimals', () => {
    expect(formatBytes(134_142_500)).toBe('127.9 MB');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(0)).toBe('');
    expect(formatBytes(undefined)).toBe('');
  });
});

describe('release loading', () => {
  it('links real assets, shows sizes, and updates the architecture choice', async () => {
    const request = mockFetch({ tag_name: 'v1.0.0', assets });
    await loadRelease(document, request);

    expect(request).toHaveBeenCalledWith(
      'https://api.github.com/repos/GitWorkbench/workbench/releases/latest',
      expect.objectContaining({ credentials: 'omit' }),
    );
    expect(document.getElementById('release-version')).toHaveTextContent('v1.0.0');
    expect(document.getElementById('release-notes')).toHaveAttribute(
      'href',
      `${RELEASES_URL}/tag/v1.0.0`,
    );

    const appImage = document.querySelector<HTMLAnchorElement>('[data-download="AppImage"]')!;
    expect(appImage).toHaveAttribute('href', assets[0].browser_download_url);
    expect(appImage).toHaveAttribute('data-available', 'true');
    expect(appImage.querySelector('[data-download-size]')).toHaveTextContent('127.9 MB');
    expect(document.getElementById('release-status')).toHaveTextContent('Latest stable release');

    const architecture = document.getElementById('linux-arch') as HTMLSelectElement;
    architecture.value = 'arm64';
    architecture.dispatchEvent(new Event('change'));
    expect(document.querySelector('[data-download="pacman"]')).toHaveAttribute(
      'href',
      assets[7].browser_download_url,
    );
  });

  it('keeps missing assets on the selected release page with a helpful status', async () => {
    await loadRelease(document, mockFetch({ tag_name: 'v2.0.0', assets: [] }));
    expect(document.getElementById('release-status')).toHaveTextContent('not attached yet');
    expect(document.getElementById('release-status')).toHaveAttribute('data-state', 'fallback');
    for (const link of document.querySelectorAll('[data-download]')) {
      expect(link).toHaveAttribute('href', `${RELEASES_URL}/tag/v2.0.0`);
    }
  });

  it('explains a repository without a public stable release', async () => {
    await loadRelease(document, mockFetch({}, 404, false));
    expect(document.getElementById('release-status')).toHaveTextContent('being prepared');
    for (const link of document.querySelectorAll('[data-download]')) {
      expect(link).toHaveAttribute('href', RELEASES_URL);
    }
  });

  it.each(['offline', 'rate limit', 'draft', 'prerelease', 'invalid response', 'null body'])(
    'keeps usable release-page links on %s',
    async (mode) => {
      let request: typeof fetch;
      if (mode === 'offline') {
        request = vi.fn(async () => {
          throw new Error('offline');
        }) as unknown as typeof fetch;
      } else {
        const body =
          mode === 'null body'
            ? null
            : {
                tag_name: 'v1.0.0',
                assets: mode === 'invalid response' ? null : assets,
                draft: mode === 'draft',
                prerelease: mode === 'prerelease',
              };
        request = mockFetch(body, 200, mode !== 'rate limit');
      }

      await loadRelease(document, request);
      expect(document.getElementById('release-status')).toHaveTextContent('unavailable');
      expect(document.querySelector('[data-download="AppImage"]')).toHaveAttribute(
        'href',
        RELEASES_URL,
      );
    },
  );

  it('aborts a slow lookup and clears the timer', async () => {
    vi.useFakeTimers();
    const request = vi.fn(
      (_url: RequestInfo | URL, options?: RequestInit) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    ) as unknown as typeof fetch;

    const pending = loadRelease(document, request);
    await vi.advanceTimersByTimeAsync(8000);
    await pending;

    expect(document.getElementById('release-status')).toHaveTextContent('unavailable');
    expect(vi.getTimerCount()).toBe(0);
  });
});
