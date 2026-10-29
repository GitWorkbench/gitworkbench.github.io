import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COMPARISONS } from '../src/data/comparisons';

describe('client comparison content', () => {
  it('provides distinct, useful search metadata for every comparison', () => {
    expect(COMPARISONS).toHaveLength(9);
    expect(new Set(COMPARISONS.map((item) => item.slug)).size).toBe(COMPARISONS.length);
    expect(new Set(COMPARISONS.map((item) => item.title)).size).toBe(COMPARISONS.length);
    expect(new Set(COMPARISONS.map((item) => item.description)).size).toBe(COMPARISONS.length);

    for (const item of COMPARISONS) {
      expect(item.title.length, item.slug).toBeGreaterThanOrEqual(25);
      expect(item.title.length, item.slug).toBeLessThanOrEqual(75);
      expect(item.description.length, item.slug).toBeGreaterThanOrEqual(110);
      expect(item.description.length, item.slug).toBeLessThanOrEqual(175);
      expect(item.title).toContain(item.competitor);
      expect(item.heading.length).toBeGreaterThan(15);
      expect(item.lead.length).toBeGreaterThan(50);
      expect(item.workbenchEdge.length, item.slug).toBeGreaterThan(100);
    }
  });

  it('keeps both perspectives balanced and supports their citations', () => {
    for (const item of COMPARISONS) {
      expect(item.fit.workbench.length, item.slug).toBeGreaterThanOrEqual(2);
      expect(item.fit.competitor.length, item.slug).toBeGreaterThanOrEqual(2);
      expect(item.otherFit.length, item.slug).toBeGreaterThan(100);
      expect(item.limits.length, item.slug).toBeGreaterThanOrEqual(2);
      expect(item.fit.competitorSource, item.slug).toBeGreaterThanOrEqual(0);
      expect(item.fit.competitorSource, item.slug).toBeLessThan(item.sources.length);
      expect(item.otherFitSource, item.slug).toBeLessThan(item.sources.length);
      expect(item.contextSource, item.slug).toBeLessThan(item.sources.length);
      expect(item.rows.length, item.slug).toBeGreaterThanOrEqual(9);
      expect(new Set(item.rows.map((row) => row.topic)).size, item.slug).toBe(item.rows.length);

      for (const row of item.rows) {
        expect(row.topic.length).toBeGreaterThan(0);
        expect(row.workbench.length).toBeGreaterThan(0);
        expect(row.other.length).toBeGreaterThan(0);
        expect(row.source).toBeGreaterThanOrEqual(0);
        expect(row.source).toBeLessThan(item.sources.length);
        expect(new URL(item.sources[row.source].href).protocol).toBe('https:');
      }

      for (const source of item.sources) {
        expect(source.label.length).toBeGreaterThan(5);
        expect(new URL(source.href).protocol).toBe('https:');
      }
    }
  });
});


describe('responsive comparison presentation', () => {
  const styles = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');

  it('fits the desktop comparison inside its container without a forced minimum width', () => {
    expect(styles).toMatch(/\.comparison-table table\s*\{[^}]*width:\s*100%/);
    expect(styles).not.toMatch(/\.comparison-table table\s*\{[^}]*min-width:\s*\d+px/);
    expect(styles).not.toMatch(/\.comparison-table\s*\{[^}]*overflow-x:\s*auto/);
  });

  it('provides labeled stacked comparison cards for narrow screens', () => {
    expect(styles).toMatch(/\.comparison-mobile-cards\s*\{\s*display:\s*none;\s*\}/);
    expect(styles).toMatch(/@media\s*\(max-width:\s*720px\)\s*\{[^}]*\.comparison-table table\s*\{\s*display:\s*none;\s*\}[^}]*\.comparison-mobile-cards\s*\{\s*display:\s*block;\s*\}/);
    expect(styles).toMatch(/\.comparison-mobile-card dt\s*\{/);
    expect(styles).toMatch(/\.comparison-mobile-card dd\s*\{/);
  });
});
