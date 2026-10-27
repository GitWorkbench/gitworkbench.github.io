/**
 * Progressive enhancements for the redesigned site. Every feature degrades
 * gracefully: without JavaScript the page renders statically, downloads stay
 * on their release-page fallbacks, and the theme preview simply keeps its
 * default palette.
 */
export function mountWebsite(root: Document = document): void {
  mountNavigation(root);
  mountScrollProgress(root, root.defaultView);
  mountSectionTracking(root);
  mountReveal(root);
  mountCopyButtons(root);
  mountGalleryNavigation(root, root.defaultView);
  mountThemePreview(root);
  applyPlatform(root);
}

/* ── Mobile navigation ─────────────────────────────────────── */

function mountNavigation(root: Document): void {
  const menuToggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const navigation = root.getElementById('site-navigation');

  if (menuToggle && navigation) {
    const setMenuOpen = (open: boolean) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      navigation.dataset.open = String(open);
    };

    setMenuOpen(false);

    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) setMenuOpen(false);
    });

    root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
  }
}

/* ── Reading progress bar ──────────────────────────────────── */

function mountScrollProgress(root: Document, view: Window | null): void {
  const bar = root.querySelector<HTMLElement>('[data-progress]');
  if (!bar || !view) return;
  bar.classList.add('is-ready');
  const update = () => {
    const max = Math.max(1, view.document.body.scrollHeight - view.innerHeight);
    bar.style.setProperty('--progress', String(Math.min(1, Math.max(0, view.scrollY / max))));
  };
  update();
  view.addEventListener('scroll', update, { passive: true });
  view.addEventListener('resize', update);
}

/* ── Scrollspy: mark the section in view as current ────────── */

function mountSectionTracking(root: Document): void {
  const links = [...root.querySelectorAll('[data-nav] a[href^="/#"]')] as HTMLAnchorElement[];
  const sections: HTMLElement[] = [];
  for (const link of links) {
    const section = root.getElementById((link.getAttribute('href') ?? '').slice(2));
    if (section) sections.push(section);
  }
  if (!sections.length) return;

  const setCurrent = (id: string | null) => {
    for (const link of links) {
      const target = link.getAttribute('href')?.slice(2);
      if (target) link.setAttribute('aria-current', target === id ? 'true' : 'false');
    }
  };

  if (typeof IntersectionObserver !== 'function') return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    },
    { rootMargin: '-30% 0px -55% 0px' },
  );
  for (const section of sections) observer.observe(section);
}

/* ── Scroll reveal ─────────────────────────────────────────── */

function mountReveal(root: Document): void {
  const targets = root.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (typeof IntersectionObserver !== 'function') {
    for (const target of targets) target.classList.add('revealed');
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  for (const target of targets) observer.observe(target);
}

/* ── Copy buttons ──────────────────────────────────────────── */

function mountCopyButtons(root: Document): void {
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const text = button.dataset.copy ?? '';
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const originalLabel = label?.textContent ?? '';
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;

    button.addEventListener('click', async () => {
      let copied = false;
      try {
        if (navigator?.clipboard) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch {
        copied = false;
      }

      button.classList.toggle('is-copied', copied);
      if (label) label.textContent = copied ? 'Copied!' : originalLabel;

      if (!copied) return;
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => {
        button.classList.remove('is-copied');
        if (label) label.textContent = originalLabel;
      }, 1800);
    });
  }
}

/* ── Screenshot gallery arrows ─────────────────────────────── */

function mountGalleryNavigation(root: Document, view: Window | null): void {
  const gallery = root.querySelector<HTMLElement>('[data-gallery]');
  if (!gallery || !view) return;

  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-gallery-nav]')) {
    const direction = Number(button.dataset.galleryNav) || 0;
    button.addEventListener('click', () => {
      gallery.scrollBy({
        left: (gallery.clientWidth || 640) * 0.82 * direction,
        behavior: 'smooth',
      });
    });
  }
}

/* ── Theme previewer ───────────────────────────────────────── */

interface ThemeStyle {
  bg: string;
  panel: string;
  edge?: string;
  fg: string;
  accent: string;
}

const PREVIEW_PROPERTIES: Array<[keyof ThemeStyle, string]> = [
  ['bg', '--pv-bg'],
  ['panel', '--pv-panel'],
  ['edge', '--pv-edge'],
  ['fg', '--pv-fg'],
  ['accent', '--pv-accent'],
];

const CHANNEL_MIX = 0.22; // accent weight of the chip mix (matches the stylesheet)

function channel(hex: string, offset: number): number {
  const value = Number.parseInt(hex.slice(1 + offset * 2, 3 + offset * 2), 16);
  return Number.isNaN(value) ? 255 : value;
}

function relativeLuminance(red: number, green: number, blue: number): number {
  const linear = (value: number) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
}

function contrastRatio(a: number, b: number): number {
  const [lighter, darker] = a >= b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Mimics the application's own behaviour (readable primary text across
 * light and dark themes): compute the accent-tinted chip surface, then
 * choose white or black ink that clears 4.5:1.
 */
function chipInk(accent = '', panel = '', background = ''): string {
  const mix = (channelValue: number, surface: string, offset: number) =>
    CHANNEL_MIX * channelValue + (1 - CHANNEL_MIX) * channel(surface, offset);
  const chip = relativeLuminance(
    mix(channel(accent, 0), panel, 0),
    mix(channel(accent, 1), panel, 1),
    mix(channel(accent, 2), panel, 2),
  );
  const candidates: Array<{ ink: string; ratio: number }> = [
    { ink: '#ffffff', ratio: contrastRatio(1, chip) },
    { ink: '#0b0e13', ratio: contrastRatio(relativeLuminance(11, 14, 19), chip) },
  ];
  const passing = candidates.find((candidate) => candidate.ratio >= 4.5);
  const best = candidates.sort((a, b) => b.ratio - a.ratio)[0];
  const fallbackSurface = relativeLuminance(
    channel(background || panel, 0),
    channel(background || panel, 1),
    channel(background || panel, 2),
  );
  // If neither ink can save the chip, fall back to text kept off the tint.
  return passing?.ink ?? best.ink ?? (fallbackSurface > 0.35 ? '#0b0e13' : '#ffffff');
}

function mountThemePreview(root: Document): void {
  const preview = root.querySelector<HTMLElement>('[data-theme-preview]');
  if (!preview) return;

  const swatches = [...root.querySelectorAll<HTMLButtonElement>('[data-theme-swatch]')];
  if (!swatches.length) return;

  const apply = (style: ThemeStyle) => {
    for (const [datasetKey, property] of PREVIEW_PROPERTIES) {
      const value = style[datasetKey];
      if (value) preview.style.setProperty(property, value);
    }
    // The accent-tinted chips must stay readable in every palette: pick
    // whichever ink beats 4.5:1 against the mixed chip surface.
    preview.style.setProperty('--pv-chip', chipInk(style.accent, style.panel, style.bg));
  };

  for (const swatch of swatches) {
    swatch.addEventListener('click', () => {
      apply({
        bg: swatch.dataset.themeBg ?? '',
        panel: swatch.dataset.themePanel ?? '',
        edge: swatch.dataset.themeEdge,
        fg: swatch.dataset.themeFg ?? '',
        accent: swatch.dataset.themeAccent ?? '',
      });

      for (const other of swatches) {
        other.setAttribute('aria-pressed', String(other === swatch));
      }
    });
  }

  // Keyboard: arrow keys move between swatches like a radio group.
  const keyStep: Record<string, number> = {
    ArrowRight: 1,
    ArrowDown: 1,
    ArrowLeft: -1,
    ArrowUp: -1,
  };
  for (const swatch of swatches) {
    swatch.addEventListener('keydown', (event) => {
      const step = keyStep[event.key];
      if (!step) return;
      event.preventDefault();
      const source = swatches.indexOf(swatch);
      const next = swatches[(source + step + swatches.length) % swatches.length];
      next.focus();
      next.click();
    });
  }
}

/* ── Platform detection: downloads card + keyboard hint ────── */

function applyPlatform(root: Document): void {
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    (navigator as Navigator & { platform?: string }).platform ??
    '';
  const detected = /mac/i.test(platform)
    ? 'mac'
    : /win/i.test(platform)
      ? 'windows'
      : /linux/i.test(platform) && !/android/i.test(navigator.userAgent)
        ? 'linux'
        : null;

  if (detected) {
    root.querySelector(`[data-platform="${detected}"]`)?.setAttribute('data-detected', 'true');
  }

  if (detected === 'mac') {
    for (const key of root.querySelectorAll('[data-mod-key]')) key.textContent = '⌘';
    const note = root.querySelector('[data-shortcut-note]');
    const container = root.querySelector('[data-shortcuts]');
    if (note instanceof HTMLElement && container) note.hidden = false;
  }
}
