// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWebsite } from '../src/scripts/ui';

const fixture = `
  <header class="site-header wrap">
    <a class="brand" href="/">Git Workbench</a>
    <button class="mobile-menu-toggle" type="button" data-menu-toggle aria-controls="site-navigation" aria-expanded="false">Menu</button>
    <nav id="site-navigation" aria-label="Main navigation">
      <a href="/#workspace">Screenshots</a>
      <a href="/#how-it-works">How to use</a>
    </nav>
  </header>
  <div class="preview-tabs" role="tablist" aria-label="App screenshots">
    <button id="tab-history" type="button" role="tab" data-preview aria-selected="true" aria-controls="panel-history" tabindex="0">Commit graph</button>
    <button id="tab-diff" type="button" role="tab" data-preview aria-selected="false" aria-controls="panel-diff" tabindex="-1">Diff &amp; staging</button>
    <button id="tab-merge" type="button" role="tab" data-preview aria-selected="false" aria-controls="panel-merge" tabindex="-1">Merge editor</button>
  </div>
  <div id="panel-history" role="tabpanel"></div>
  <div id="panel-diff" role="tabpanel" hidden></div>
  <div id="panel-merge" role="tabpanel" hidden></div>
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

describe('screenshot tablist', () => {
  it('switches panels with clicks and complete keyboard navigation', () => {
    mountWebsite();
    const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-preview]')];

    tabs[1].click();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    expect(document.getElementById('panel-diff')).not.toHaveAttribute('hidden');
    expect(document.getElementById('panel-history')).toHaveAttribute('hidden');

    for (const [source, key, next] of [
      [1, 'ArrowRight', 2],
      [2, 'ArrowRight', 0],
      [0, 'ArrowLeft', 2],
      [2, 'Home', 0],
      [0, 'End', 2],
    ] as const) {
      tabs[source].dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      );
      expect(tabs[next]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[next]).toHaveFocus();
    }
  });

  it('does nothing when a page has no interactive tabs', () => {
    document.body.innerHTML = '<p>Static page</p>';
    expect(() => mountWebsite()).not.toThrow();
  });
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

    navigation.querySelector<HTMLAnchorElement>('a[href="/#how-it-works"]')!.click();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(navigation).toHaveAttribute('data-open', 'false');

    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});

describe('platform detection', () => {
  it.each([
    ['MacIntel', 'mac'],
    ['Win32', 'windows'],
    ['Linux x86_64', 'linux'],
    ['iPhone', null],
  ])('highlights %s without hiding other platforms', (platform, expected) => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
    mountWebsite();
    expect(document.querySelectorAll('[data-platform]')).toHaveLength(3);
    expect(document.querySelector('[data-detected="true"]')?.getAttribute('data-platform') ?? null).toBe(
      expected,
    );
  });
});
