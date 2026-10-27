export type DesktopPlatform = 'linux' | 'mac' | 'windows';

/** A suggestion only: keep every platform available, including on mobile. */
export function detectPlatform(source: Navigator = navigator): DesktopPlatform | null {
  if (/android|iphone|ipad|ipod/i.test(source.userAgent)) return null;
  const platform =
    (source as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ||
    (source as { platform?: string }).platform ||
    source.userAgent;
  // iPadOS may identify itself as a Mac.
  if (/mac/i.test(platform) && source.maxTouchPoints > 1) return null;
  return /mac/i.test(platform) ? 'mac' : /win/i.test(platform) ? 'windows' : /linux/i.test(platform) ? 'linux' : null;
}
