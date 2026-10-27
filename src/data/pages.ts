import { FEATURE_PAGES, GUIDE_PAGES } from './content';
import { SITE } from './site';

export const PAGE_META = {
  features: { path: '/features/', label: 'Features', title: 'Git GUI Features — Graph, Diffs & Reviews | Git Workbench', description: 'Explore Git Workbench features: visual commit history, hunk staging, merge conflict resolution, hosted reviews, restore points, and optional local AI assistance.' },
  guides: { path: '/guides/', label: 'Guides', title: 'Git Workbench Guides — Setup, Installation & Workflows', description: 'Learn to install and use Git Workbench, make your first commit, work with advanced Git tools, or build the open-source desktop application from source.' },
  download: { path: '/download/', label: 'Download', title: 'Download Git Workbench for Linux, macOS & Windows', description: 'Download the latest stable Git Workbench release for Linux, macOS, or Windows. Get AppImage, DEB, RPM, Arch, universal DMG, ZIP, and Windows installer builds.' },
  faq: { path: '/faq/', label: 'FAQ', title: 'Git Workbench FAQ — Accounts, Updates, Git & AI', description: 'Find answers about Git Workbench pricing, supported hosts, system Git requirements, Linux installation, platform updates, accounts, and optional AI features.' },
  about: { path: '/about/', label: 'About', title: 'About Git Workbench — An Open-Source Git Desktop Client', description: 'Meet Git Workbench, the MIT-licensed desktop Git client built around visual history, your existing Git setup, and open development. Find source and contribution links.' },
  privacy: { path: '/privacy/', label: 'Website privacy', title: 'Website Privacy & Analytics | Git Workbench', description: 'Learn how the Git Workbench website uses Google Analytics, GitHub Pages, and public release metadata, and how website analytics differs from the desktop app.' },
} as const;

export const PUBLIC_PAGES = [
  { path: '/', label: 'Home', title: SITE.title, description: SITE.description },
  ...Object.values(PAGE_META),
  ...FEATURE_PAGES.map((page) => ({ path: `/features/${page.slug}/`, label: page.label, title: page.title, description: page.description })),
  ...GUIDE_PAGES.map((page) => ({ path: `/guides/${page.slug}/`, label: page.label, title: page.title, description: page.description })),
];
