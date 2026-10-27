/**
 * Small, dependency-free progressive enhancements: the navigation menu, the
 * screenshot tablist, and highlighting the visitor's platform. Everything
 * remains usable without JavaScript.
 */
export function mountWebsite(root: Document = document): void {
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

  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-preview]')];
  if (tabs.length) {
    const showPanel = (tab: HTMLButtonElement) => {
      for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = root.getElementById(item.getAttribute('aria-controls') ?? '');
        if (panel) panel.hidden = !selected;
      }
    };

    for (const [index, tab] of tabs.entries()) {
      tab.addEventListener('click', () => showPanel(tab));
      tab.addEventListener('keydown', (event) => {
        let next: HTMLButtonElement | undefined;
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          showPanel(next);
          next.focus();
        }
      });
    }
  }

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
}
