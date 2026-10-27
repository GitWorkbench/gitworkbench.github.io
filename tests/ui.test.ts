// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWebsite } from '../src/scripts/ui';

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
});
