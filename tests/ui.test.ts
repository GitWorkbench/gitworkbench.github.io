// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWebsite } from '../src/scripts/ui';
import { mountHistoryReplay } from '../src/scripts/history-replay';

const fixture = `
  <header class="site-header">
    <a class="brand" href="/">Git Workbench</a>
    <button class="mobile-menu-toggle" type="button" data-menu-toggle aria-controls="site-navigation" aria-expanded="false">Menu</button>
    <nav id="site-navigation" aria-label="Main navigation" data-nav>
      <ul>
        <li><a href="/#features">Features</a></li>
        <li><a href="/#download">Install</a></li>
      </ul>
    </nav>
    <div class="scroll-progress" data-progress aria-hidden="true"></div>
  </header>
  <section id="features"><h2>Features</h2></section>
  <button class="copy-btn" type="button" data-copy="curl -fsSL https://gitworkbench.github.io/install.sh | bash">
    <svg></svg><span data-copy-label>Copy</span>
  </button>
  <button class="gallery-arrow" type="button" data-gallery-nav="1">→</button>
  <div class="screenshot-gallery gallery" data-gallery></div>
  <div class="app-preview" data-theme-preview style="--pv-accent:#38bdf8"></div>
  <div class="theme-grid">
    <button class="theme-swatch" type="button" data-theme-swatch data-theme-bg="#002b36" data-theme-panel="#073642" data-theme-fg="#eee8d5" data-theme-accent="#268bd2" aria-pressed="false">Solarized</button>
    <button class="theme-swatch" type="button" data-theme-swatch data-theme-bg="#2e3440" data-theme-panel="#3b4252" data-theme-fg="#eceff4" data-theme-accent="#88c0d0" aria-pressed="false">Nord</button>
  </div>
  <kbd class="key" data-mod-key>Ctrl</kbd>
  <article data-platform="linux"></article>
  <article data-platform="mac"></article>
  <article data-platform="windows"></article>
`;

beforeEach(() => {
  document.body.innerHTML = fixture;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('mobile navigation', () => {
  it('opens, closes on navigation, and dismisses with Escape', () => {
    mountWebsite();
    const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
    const navigation = document.getElementById('site-navigation')!;

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    toggle.click();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-label', 'Close navigation menu');
    expect(navigation).toHaveAttribute('data-open', 'true');

    navigation.querySelector<HTMLAnchorElement>('a[href="/#download"]')!.click();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(navigation).toHaveAttribute('data-open', 'false');

    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('does nothing on a page without navigation markup', () => {
    document.body.innerHTML = '<p>Static page</p>';
    expect(() => mountWebsite()).not.toThrow();
  });
});

describe('scroll progress', () => {
  it('preps the bar for scroll updates without breaking on tiny pages', () => {
    mountWebsite();
    expect(document.querySelector('[data-progress]')).toHaveClass('is-ready');
    const style = document.querySelector<HTMLElement>('[data-progress]')!.style;
    expect(style.getPropertyValue('--progress')).toBeTruthy();
  });
});

describe('copy buttons', () => {
  it('reports a successful copy and restores the label', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    mountWebsite();
    const button = document.querySelector<HTMLButtonElement>('[data-copy]')!;
    button.click();
    await Promise.resolve();

    expect(writeText).toHaveBeenLastCalledWith('curl -fsSL https://gitworkbench.github.io/install.sh | bash');
    expect(button).toHaveClass('is-copied');
    expect(button.querySelector('[data-copy-label]')?.textContent).toBe('Copied!');
  });

  it('leaves the label untouched when the clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });

    mountWebsite();
    const button = document.querySelector<HTMLButtonElement>('[data-copy]')!;
    button.click();
    await Promise.resolve();

    expect(button).not.toHaveClass('is-copied');
    expect(button.querySelector('[data-copy-label]')?.textContent).toBe('Copy');
  });
});

describe('theme previewer', () => {
  it('repaints the preview with the selected palette', () => {
    mountWebsite();
    const preview = document.querySelector<HTMLElement>('[data-theme-preview]')!;
    const swatches = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-swatch]')];

    swatches[0].click();
    expect(preview.style.getPropertyValue('--pv-bg')).toBe('#002b36');
    expect(preview.style.getPropertyValue('--pv-accent')).toBe('#268bd2');
    expect(swatches[0]).toHaveAttribute('aria-pressed', 'true');
    expect(swatches[1]).toHaveAttribute('aria-pressed', 'false');

    swatches[1].click();
    expect(preview.style.getPropertyValue('--pv-bg')).toBe('#2e3440');
    expect(swatches[1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('moves between swatches with arrow keys', () => {
    mountWebsite();
    const swatches = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-swatch]')];

    swatches[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(swatches[1]);
    expect(swatches[1]).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('platform detection', () => {
  it.each([
    ['MacIntel', 'mac'],
    ['Win32', 'windows'],
    ['Linux x86_64', 'linux'],
    ['iPhone', null],
  ])('marks %s without hiding other platforms', (platform, expected) => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
    mountWebsite();

    const detected = (document.querySelector('[data-detected="true"]') as HTMLElement | null) ?? null;
    expect(detected?.getAttribute('data-platform') ?? null).toBe(expected);
  });

  it('swaps Ctrl for the command key on macOS and mentions it', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    mountWebsite();
    expect(document.querySelector('[data-mod-key]')?.textContent).toBe('⌘');
  });

  it('keeps Ctrl elsewhere', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    mountWebsite();
    expect(document.querySelector('[data-mod-key]')?.textContent).toBe('Ctrl');
  });

  it('uses the baked installer for the hero suggestion before any API request', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    document.body.innerHTML += `
      <a href="/#download" data-download-recommended><span data-download-label>Download Git Workbench</span></a>
      <article data-platform="windows"><a data-download="exe" href="https://github.com/GitWorkbench/workbench/releases/download/v1.3.4/setup.exe">Installer</a></article>
    `;
    mountWebsite();
    const recommended = document.querySelector('[data-download-recommended]');
    expect(recommended).toHaveTextContent('Download for Windows');
    expect(recommended).toHaveAttribute('data-download', 'exe');
    expect(recommended).toHaveAttribute('href', 'https://github.com/GitWorkbench/workbench/releases/download/v1.3.4/setup.exe');
  });

  it.each([
    ['Linux armv8l', 'Mozilla/5.0 (Linux; Android 14)', 5],
    ['MacIntel', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', 5],
  ])('keeps mobile visitors on the platform chooser (%s)', (platform, userAgent, maxTouchPoints) => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent);
    Object.defineProperty(navigator, 'maxTouchPoints', { value: maxTouchPoints, configurable: true });
    document.body.innerHTML += '<a href="/#download" data-download-recommended>Download Git Workbench</a>';
    mountWebsite();
    expect(document.querySelector('[data-detected="true"]')).toBeNull();
    expect(document.querySelector('[data-download-recommended]')).toHaveAttribute('href', '/#download');
    Reflect.deleteProperty(navigator, 'maxTouchPoints');
  });
});

describe('hero previews', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-hero-tabs hidden role="tablist">
        <button id="preview-tab-history" data-hero-tab="history" role="tab" aria-selected="true">History</button>
        <button id="preview-tab-diff" data-hero-tab="diff" role="tab" aria-selected="false" tabindex="-1">Diff</button>
        <button id="preview-tab-merge" data-hero-tab="merge" role="tab" aria-selected="false" tabindex="-1">Merge</button>
      </div>
      <figure id="preview-history" data-hero-panel="history">Graph screenshot</figure>
      <figure id="preview-diff" data-hero-panel="diff" hidden>Diff screenshot</figure>
      <figure id="preview-merge" data-hero-panel="merge" hidden>Merge screenshot</figure>
    `;
  });

  it('exposes controls and shows only the selected screenshot', () => {
    mountWebsite();
    expect(document.querySelector('[data-hero-tabs]')).not.toHaveAttribute('hidden');
    document.querySelector<HTMLButtonElement>('[data-hero-tab="diff"]')!.click();
    expect(document.getElementById('preview-diff')).toBeVisible();
    expect(document.getElementById('preview-history')).not.toBeVisible();
    expect(document.getElementById('preview-merge')).not.toBeVisible();
    expect(document.getElementById('preview-diff')).toHaveAttribute('aria-labelledby', 'preview-tab-diff');
    expect(document.getElementById('preview-tab-diff')).toHaveAttribute('aria-selected', 'true');
  });

  it('supports arrow wrapping, Home, and End with one tab stop', () => {
    mountWebsite();
    const history = document.getElementById('preview-tab-history')!;
    history.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    const merge = document.getElementById('preview-tab-merge')!;
    expect(merge).toHaveFocus();
    expect(document.getElementById('preview-merge')).toBeVisible();
    merge.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(history).toHaveFocus();
    history.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(merge).toHaveFocus();
    expect(document.querySelectorAll('[data-hero-tab][tabindex="0"]')).toHaveLength(1);
  });
});

describe('interactive history replay', () => {
  const demoFixture = `
    <section data-history-demo>
      <input type="range" min="1" max="3" value="1" data-history-range>
      <div data-history-controls hidden>
        <button type="button" data-history-action="previous" disabled>Previous</button>
        <button type="button" data-history-action="play">Play</button>
        <button type="button" data-history-action="next">Next</button>
        <output data-history-step-output></output>
      </div>
      <p data-history-progress></p><p data-history-demo-status></p>
      <div data-history-step="1"><h3>first change</h3></div>
      <div data-history-step="2" hidden><h3>second change</h3></div>
      <div data-history-step="3" hidden><h3>third change</h3></div>
      <svg>
        <path data-history-edge="2"></path><path data-history-edge="3"></path>
        <circle data-history-node="1" cx="10" cy="20"></circle>
        <circle data-history-node="2" cx="30" cy="40"></circle>
        <circle data-history-node="3" cx="50" cy="60"></circle>
        <circle data-history-current-ring></circle>
      </svg>
    </section>
  `;

  const mountDemo = () => {
    document.body.innerHTML = demoFixture;
    mountHistoryReplay(document);
    return document.querySelector<HTMLElement>('[data-history-demo]')!;
  };

  it('reveals accessible controls and synchronizes the commit, graph, and slider', () => {
    const demo = mountDemo();
    const controls = demo.querySelector('[data-history-controls]')!;
    const range = demo.querySelector<HTMLInputElement>('[data-history-range]')!;
    const next = demo.querySelector<HTMLButtonElement>('[data-history-action="next"]')!;

    expect(controls).not.toHaveAttribute('hidden');
    expect(demo.querySelector('[data-history-step="1"]')).toBeVisible();
    expect(demo.querySelector('[data-history-step="2"]')).not.toBeVisible();
    expect(range).toHaveAttribute('aria-valuetext', 'Commit 1 of 3: first change');
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('1 / 3');
    expect(demo.querySelector('[data-history-node="1"]')).toHaveAttribute('data-current', 'true');
    expect(demo.querySelector('[data-history-node="2"]')).toHaveAttribute('data-active', 'false');
    expect(demo.querySelector('[data-history-edge="2"]')).toHaveAttribute('data-active', 'false');
    expect(demo.querySelector('[data-history-current-ring]')).toHaveAttribute('cx', '10');

    next.click();
    expect(demo.querySelector('[data-history-step="2"]')).toBeVisible();
    expect(demo.querySelector('[data-history-node="2"]')).toHaveAttribute('data-current', 'true');
    expect(demo.querySelector('[data-history-edge="2"]')).toHaveAttribute('data-active', 'true');
    expect(demo.querySelector('[data-history-current-ring]')).toHaveAttribute('cy', '40');
    expect(demo.querySelector('[data-history-progress]')).toHaveTextContent('Step 2 of 3');

    range.value = '3';
    range.dispatchEvent(new Event('input', { bubbles: true }));
    expect(demo.querySelector('[data-history-step="3"]')).toBeVisible();
    expect(demo.querySelector('[data-history-action="next"]')).toBeDisabled();
    expect(demo.querySelector('[data-history-current-ring]')).toHaveAttribute('cx', '50');
  });

  it('steps backward and stops an active replay after manual input', () => {
    vi.useFakeTimers();
    const demo = mountDemo();
    const play = demo.querySelector<HTMLButtonElement>('[data-history-action="play"]')!;
    const next = demo.querySelector<HTMLButtonElement>('[data-history-action="next"]')!;
    const previous = demo.querySelector<HTMLButtonElement>('[data-history-action="previous"]')!;

    play.click();
    expect(play).toHaveTextContent('Pause');
    vi.advanceTimersByTime(1600);
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('2 / 3');
    next.click();
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('3 / 3');
    expect(play).toHaveTextContent('Play');
    previous.click();
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('2 / 3');
    expect(demo.querySelector('[data-history-demo-status]')).toHaveTextContent('Replay paused.');
  });

  it('restarts at the first commit and pauses when playback reaches the end', () => {
    vi.useFakeTimers();
    const demo = mountDemo();
    const play = demo.querySelector<HTMLButtonElement>('[data-history-action="play"]')!;
    const next = demo.querySelector<HTMLButtonElement>('[data-history-action="next"]')!;

    next.click();
    next.click();
    play.click();
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('1 / 3');
    vi.advanceTimersByTime(3200);
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('3 / 3');
    expect(play).toHaveTextContent('Play');
    expect(demo.querySelector('[data-history-demo-status]')).toHaveTextContent('Replay complete.');
  });

  it('honors reduced motion and lets the preference change during use', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
    const listeners: ((event: MediaQueryListEvent) => void)[] = [];
    const mediaQuery = {
      matches: true,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.push(listener),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList;
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: vi.fn(() => mediaQuery) });

    try {
      const demo = mountDemo();
      const play = demo.querySelector<HTMLButtonElement>('[data-history-action="play"]')!;
      expect(play).toBeDisabled();
      expect(demo.querySelector('[data-history-demo-status]')).toHaveTextContent('Reduced motion is enabled');
      listeners[0](Object.assign(new Event('change'), { matches: false }) as MediaQueryListEvent);
      expect(play).toBeEnabled();
      expect(demo.querySelector('[data-history-demo-status]')).toHaveTextContent('Use the slider');
    } finally {
      if (descriptor) Object.defineProperty(window, 'matchMedia', descriptor);
      else Reflect.deleteProperty(window, 'matchMedia');
    }
  });

  it('supports manual stepping when no browser window is available', () => {
    document.body.innerHTML = demoFixture;
    mountHistoryReplay(document, null);
    const demo = document.querySelector<HTMLElement>('[data-history-demo]')!;
    expect(demo.querySelector('[data-history-action="play"]')).toBeDisabled();
    demo.querySelector<HTMLButtonElement>('[data-history-action="next"]')!.click();
    expect(demo.querySelector('[data-history-step-output]')).toHaveTextContent('2 / 3');
  });

  it('leaves malformed or non-contiguous demo markup safely static', () => {
    document.body.innerHTML = '<section data-history-demo><input data-history-range><div data-history-controls hidden></div></section>';
    expect(() => mountHistoryReplay(document)).not.toThrow();
    expect(document.querySelector('[data-history-controls]')).toHaveAttribute('hidden');

    document.body.innerHTML = demoFixture.replace('data-history-step="2"', 'data-history-step="4"');
    expect(() => mountHistoryReplay(document)).not.toThrow();
    expect(document.querySelector('[data-history-controls]')).toHaveAttribute('hidden');
  });
});
