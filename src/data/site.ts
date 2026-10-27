export const SITE = {
  name: 'Git Workbench',
  url: 'https://gitworkbench.github.io',
  title: 'Git Workbench — Free Git GUI for Linux, macOS & Windows',
  description:
    'An open-source desktop Git client that renders history as commit strata, with hunk-level staging, a three-pane merge editor, PR reviews, and safe recovery.',
  tagline: 'Complex Git history, rendered as clear strata.',
  repository: 'GitWorkbench/workbench',
  author: {
    name: 'Naowas Morshed Eimon',
    url: 'https://github.com/naowas',
  },
} as const;

export const URLS = {
  home: '/',
  repository: `https://github.com/${SITE.repository}`,
  releases: `https://github.com/${SITE.repository}/releases`,
  latestRelease: `https://github.com/${SITE.repository}/releases/latest`,
  issues: `https://github.com/${SITE.repository}/issues`,
  license: `https://github.com/${SITE.repository}/blob/main/LICENSE`,
  docs: `https://github.com/${SITE.repository}/blob/main/README.md`,
  source: `https://github.com/${SITE.repository}/tree/main/src`,
  contributing: `https://github.com/${SITE.repository}/blob/main/AGENTS.md`,
  advanced: `https://github.com/${SITE.repository}/blob/main/docs/advanced-features.md`,
  firstRun: `https://github.com/${SITE.repository}/blob/main/docs/first-run-setup.md`,
  branding: `https://github.com/${SITE.repository}/blob/main/docs/branding.md`,
  installerSource: `https://github.com/${SITE.repository}/blob/main/scripts/install-linux.sh`,
  socialImage: '/assets/screenshots/history.jpg',
} as const;

export const INSTALL_COMMAND = 'curl -fsSL https://gitworkbench.github.io/install.sh | bash';

export const TRADEMARK_NOTICE = {
  nameUsage:
    'The “Git” in “Git Workbench” refers to the Git version control system.',
  independence:
    'Git Workbench is an independent client and is not affiliated with, sponsored by, or endorsed by the Git Project or Software Freedom Conservancy.',
  ownership:
    'Third-party product names, logos, and trademarks belong to their respective owners.',
  git:
    'Git and the Git logo are trademarks of Software Freedom Conservancy, Inc.',
} as const;

export const NAVIGATION = [
  { label: 'Features', href: '/features/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'Compare', href: '/compare/' },
  { label: 'Themes', href: '/#themes' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Download', href: '/download/' },
] as const;

export const HERO = {
  eyebrow: 'Free and open source · MIT licensed',
  lead:
    'See the whole story of your code. Follow every branch, stage the right changes, and resolve conflicts in a workspace that feels like your own. Your Git setup comes with you.',
} as const;

export interface Feature {
  title: string;
  description: string;
  detail: string;
}

export const FEATURES: Feature[] = [
  {
    title: 'Interactive commit strata',
    description:
      'Every branch travels its own color lane, curves drawn by hand in the graph. Select a node to open its files, parent hashes, and patch. HEAD, local and remote branches, and tags sit inline beside each summary.',
    detail: 'Cubic Bézier lanes · Parent links · Adjustable row density',
  },
  {
    title: 'Hunk-level staging',
    description:
      'Read unified or side-by-side diffs with syntax highlighting, then stage, unstage, or discard individual hunks. Flat path lists and expandable folder trees both mark added, modified, deleted, and renamed files.',
    detail: 'A/M/D/R badges · Line counts · Zip through the tree',
  },
  {
    title: 'Three-pane conflict editor',
    description:
      'Current and Incoming flank an editable result, with the read-only common ancestor on demand. Repeated conflicts offer remembered resolutions backed by git rerere – preview first, apply explicitly.',
    detail: 'Gutter arrows · keep both · Alt+↑/↓ between blocks',
  },
  {
    title: 'Pull & merge requests',
    description:
      'Browse open requests for any remote, read conversations and CI checks, post line comments, and approve or request changes. Create a request straight from the checked-out branch.',
    detail: 'Conversations · CI checks · Approvals',
  },
  {
    title: 'Connected to four providers',
    description:
      'Sign in to GitHub, GitLab.com, self-hosted GitLab with nested groups and HTTPS ports, Bitbucket Cloud, or Gitea — the request and review features work over each one the same way.',
    detail: 'GitHub · GitLab · Bitbucket Cloud · Gitea',
  },
  {
    title: 'Nine themes, live previewed',
    description:
      'Built-in palettes from the onyx Git Workbench Dark to Clean Studio Light, repainted live as you choose — with per-area typography and text-size presets and graph-density controls.',
    detail: 'git-workbench-dark default · Individual resets',
  },
  {
    title: 'A real terminal',
    description:
      'Ctrl+` opens xterm.js over a native pseudoterminal: full login shell, tab completion, ANSI color. Each repository keeps its own session and recent output, even while the drawer stays closed.',
    detail: 'Per-repo sessions · Resize or maximize · Restart on demand',
  },
  {
    title: 'History that can be undone',
    description:
      'Restore points snapshot HEAD, the staged and unstaged split, and untracked files before resets, discards, and rewrites. Browse the reflog and branch off any entry to pull lost work back.',
    detail: 'Private refs · Safety branches · Range-diff comparison',
  },
  {
    title: 'Optional AI, on your terms',
    description:
      'Recompose a commit message or explain a whole branch from its base. Choose any provider — including a local Ollama model — and nothing is ever pushed: drafts apply to local commits behind a restore point.',
    detail: 'Explicit apply · Encrypted keys · Local-first',
  },
  {
    title: 'Native git, zero relearning',
    description:
      'Workbench shells out to the git binary you already installed and reads your .git folder directly. No proprietary database, no second login, no surprise rewrite of your settings.',
    detail: 'Async, non-blocking · Your config, untouched',
  },
  {
    title: 'A built-in guide, 28 topics deep',
    description:
      'An interactive guide on board walks from first-run setup through rebases, worktrees, rerere memory, and sparse checkout — read the topic and apply it in the same window.',
    detail: 'First-run setup · Advanced workflows · In-app',
  },
  {
    title: 'Tools for bigger repositories',
    description:
      'Split commits by file or hunk with a preview, retarget stacked branches with isolated restack previews, manage Git LFS rules and transfers, and pick sparse-checkout folders you can save as layouts.',
    detail: 'Git 2.37–2.38+ features · Clearly listed limits',
  },
] as const;

export const WORKFLOWS = [
  {
    step: '01',
    title: 'A short first run',
    description:
      'Pick a commit profile, preview your theme, and configure AI only if you want it. Skipping the setup changes nothing — every choice lives in Settings and can be redone later.',
  },
  {
    step: '02',
    title: 'Open a repository',
    description:
      'Open an existing project or create one from the Home dashboard, pin it, and switch tabs between projects. Workbench reads .git through the system git, not a hidden index of its own.',
  },
  {
    step: '03',
    title: 'Read, stage, and commit',
    description:
      'Follow the lanes to the commit you need, inspect its files, stage lines, hunks, or whole files, and write the commit message with or without an AI draft.',
  },
  {
    step: '04',
    title: 'Push, review, and recover',
    description:
      'Fetch, pull, and push through your existing SSH keys or credential helper. Review requests with checks and approvals, and lean on restore points before any history rewrite — rewrites stay local until you push.',
  },
] as const;

export const SHORTCUTS = [
  { keys: ['Ctrl', ','], label: 'Open settings' },
  { keys: ['Ctrl', 'F'], label: 'Filter commits & branches' },
  { keys: ['Ctrl', 'R'], label: 'Refresh repository status' },
  { keys: ['Ctrl', 'T'], label: 'Jump to Home & dashboard' },
  { keys: ['Ctrl', 'Space'], label: 'Toggle the terminal' },
  { keys: ['Esc'], label: 'Close viewer or dialog' },
] as const;

export const THEMES = [
  { id: 'git-workbench-dark', name: 'Git Workbench Dark', bg: '#14171d', panel: '#1a1d24', fg: '#e2e8f0', accent: '#38bdf8', mood: 'Default · sleek onyx with electric cyan' },
  { id: 'github-dark-dimmed', name: 'GitHub Dark Dimmed', bg: '#2d333b', panel: '#373e47', fg: '#adbac7', accent: '#539bf5', mood: 'Low-contrast calm' },
  { id: 'dracula', name: 'Dracula', bg: '#282a36', panel: '#343746', fg: '#f8f8f2', accent: '#bd93f9', mood: 'Vivid purples' },
  { id: 'nord', name: 'Nord', bg: '#2e3440', panel: '#3b4252', fg: '#eceff4', accent: '#88c0d0', mood: 'Frost blue' },
  { id: 'cyberpunk', name: 'Cyberpunk', bg: '#0d0221', panel: '#1b0a3a', fg: '#f3e9ff', accent: '#ff2a6d', mood: 'Neon nights' },
  { id: 'monokai-pro', name: 'Monokai Pro', bg: '#272822', panel: '#34352f', fg: '#f8f8f2', accent: '#a9dc76', mood: 'Classic warm dark' },
  { id: 'one-dark-pro', name: 'One Dark Pro', bg: '#282c34', panel: '#3e4451', fg: '#abb2bf', accent: '#61afef', mood: 'Editor favourite' },
  { id: 'solarized-dark', name: 'Solarized Dark', bg: '#002b36', panel: '#073642', fg: '#eee8d5', accent: '#268bd2', mood: 'Muted desert' },
  { id: 'clean-studio-light', name: 'Clean Studio Light', bg: '#fafbfc', panel: '#eef1f4', fg: '#24292f', accent: '#0969da', mood: 'A true daylight mode' },
] as const;

export const FAQ = [
  {
    question: 'Is Git Workbench free?',
    answer:
      'Yes. Git Workbench is open source under the MIT license: free for personal and commercial use. The source lives on GitHub, where you can file issues and contribute.',
  },
  {
    question: 'Do I have to sign in to anything?',
    answer:
      'No. Local Git work needs no account at all. Provider sign-in is only needed for pull and merge request features, and AI assistance is configured separately if you want it.',
  },
  {
    question: 'Does it interfere with my Git setup?',
    answer:
      'Git Workbench shells out to your installed system git and reads the repository directly. Your hooks, SSH keys, GPG signing, credential helper, and .gitconfig all keep working as they do on the command line.',
  },
  {
    question: 'Which hosting providers can I connect?',
    answer:
      'GitHub, GitLab.com, self-hosted GitLab (including nested groups and HTTPS ports), Bitbucket Cloud, and Gitea are supported for request and review workflows. GitHub Enterprise and Bitbucket Data Center are not supported yet.',
  },
  {
    question: 'Are there minimum Git versions?',
    answer:
      'The basics work with any recent git. Optional tools have floors: stacked-branch restacks need Git 2.38+, sparse-checkout editing needs 2.37+, and range-diff comparisons need 2.19+. The tools tell you when a prerequisite is missing.',
  },
  {
    question: 'What does the one-line installer do?',
    answer:
      'It detects Debian-based, RPM-based, and Arch-based distributions, downloads the matching package from the public GitHub release, verifies its SHA-512 checksum, and hands off to your package manager, which keeps its usual confirmation prompt. Other distributions get a per-user AppImage with a desktop entry. Current Linux builds are x86_64.',
  },
  {
    question: 'How do updates work on each platform?',
    answer:
      'The Windows installer and the Linux AppImage, deb, rpm, and Pacman builds can download and install updates from About → Software updates; package formats may ask for system authorization. Unsigned macOS builds are always updated manually from the release page.',
  },
  {
    question: 'What happens to my code with AI features?',
    answer:
      'AI help is optional and configured per provider you choose — including a local Ollama instance, which keeps prompts on your machine. Requested prompts or selected code are sent only to that provider. Keys are stored encrypted outside renderer preferences and are never attached to commits.',
  },
] as const;

export const DOWNLOAD_FORMATS = [
  { format: 'AppImage', label: 'AppImage' },
  { format: 'deb', label: '.deb package' },
  { format: 'rpm', label: '.rpm package' },
  { format: 'pacman', label: '.pkg.tar.zst (Arch)' },
  { format: 'dmg', label: 'macOS .dmg' },
  { format: 'zip', label: 'macOS .zip' },
  { format: 'exe', label: 'Windows installer' },
] as const;
