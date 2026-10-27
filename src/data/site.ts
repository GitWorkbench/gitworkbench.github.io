export const SITE = {
  name: 'Git Workbench',
  url: 'https://gitworkbench.github.io',
  title: 'Git Workbench: Visual Git Client for Linux, macOS & Windows',
  description:
    'A free, open-source desktop Git client with a visual commit graph, line-by-line staging, a three-pane merge editor, worktrees, and pull request reviews.',
  tagline: 'See the whole story. Work from one Git workspace.',
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
  docs: `https://github.com/${SITE.repository}#readme`,
  firstRun: `https://github.com/${SITE.repository}/blob/main/docs/first-run-setup.md`,
  installerSource: `https://github.com/${SITE.repository}/blob/main/scripts/install-linux.sh`,
  socialImage: '/assets/screenshots/history.jpg',
} as const;

export const NAVIGATION = [
  { label: 'Screenshots', href: '/#workspace' },
  { label: 'Features', href: '/#features' },
  { label: 'How to use', href: '/#how-it-works' },
  { label: 'Downloads', href: '/#download' },
] as const;

export const FEATURES = [
  {
    icon: '⑂',
    title: 'A graph-first Git workspace',
    description:
      'Read branches, tags, and commit history together. Select a commit to see its files, author, date, and patch in context.',
    detail: 'Resizable columns · Search · Blame',
  },
  {
    icon: '±',
    title: 'Focused staging and review',
    description:
      'Inspect unified or split diffs, then stage only the files, hunks, or lines that belong in the next commit.',
    detail: 'Working tree · Line staging · File history',
  },
  {
    icon: '⋈',
    title: 'Conflicts with room to think',
    description:
      'Compare Current and Incoming beside an editable result. Review each conflict block and apply only when you are satisfied.',
    detail: 'Three-pane editor · Base view · rerere memory',
  },
  {
    icon: '↗',
    title: 'Pull requests and merge requests',
    description:
      'Browse requests, inspect conversations and CI checks, review diffs, and create requests from the checked-out branch.',
    detail: 'GitHub · GitLab · Bitbucket Cloud · Gitea',
  },
  {
    icon: '↶',
    title: 'Parallel work and safer recovery',
    description:
      'Open worktrees, use reflog and restore points, and compare rebases before choosing to apply a history rewrite.',
    detail: 'Worktrees · Restore points · Range-diff',
  },
  {
    icon: '⌘',
    title: 'Tools that fit your workflow',
    description:
      'Keep an interactive terminal, optional AI assistance, multiple repository tabs, and repository tools close to your work.',
    detail: 'Terminal · AI drafts · Themes · LFS',
  },
] as const;

export const WHY_POINTS = [
  {
    title: 'Understand before acting',
    description:
      'Keep branch relationships and commit details visible while you inspect a patch or plan a history change.',
  },
  {
    title: 'Build precise commits',
    description:
      'Choose individual lines and hunks, then see exactly what is staged before creating a commit.',
  },
  {
    title: 'Choose your own services',
    description:
      'Use local Git without signing in. Connect a hosted provider or AI model only when you want those features.',
  },
] as const;

export const STEPS = [
  {
    title: 'Set up your workspace',
    description:
      'Choose the commit profile and theme you want. AI setup is optional, and every choice can be changed later.',
  },
  {
    title: 'Open a local repository',
    description:
      'Open an existing project or create a repository. Git Workbench uses system Git and your configured SSH keys or credential helper.',
  },
  {
    title: 'Read the graph and changes',
    description:
      'Follow branches, select a commit, inspect its files, and compare the working tree with the history around it.',
  },
  {
    title: 'Stage, commit, and sync',
    description:
      'Stage a file, hunk, or line; review the staged patch; write a commit; then fetch, pull, or push when ready.',
  },
  {
    title: 'Review with your team',
    description:
      'Connect a provider to browse or create pull requests and merge requests. Provider access stays optional for local Git work.',
  },
] as const;

export const PLATFORMS = ['Linux', 'macOS', 'Windows'] as const;
export const PROVIDERS = ['GitHub', 'GitLab', 'Bitbucket Cloud', 'Gitea'] as const;

export const FAQ = [
  {
    question: 'Is Git Workbench free?',
    answer:
      'Yes. Git Workbench is open source under the MIT license. You can inspect the code, report issues, and contribute on GitHub.',
  },
  {
    question: 'Does it replace my Git setup?',
    answer:
      'Git Workbench uses your installed system Git and standard repositories. Pushes and pulls use your configured SSH keys or Git credential helper. Provider sign-in separately authorizes hosted pull request APIs.',
  },
  {
    question: 'Which hosting providers can I connect?',
    answer:
      'GitHub, GitLab.com, self-hosted GitLab, Bitbucket Cloud, and Gitea are supported for pull request and merge request workflows. GitHub Enterprise and Bitbucket Data Center are not supported yet.',
  },
  {
    question: 'What happens to my code with AI features?',
    answer:
      'AI assistance is optional. Local Git features do not need an AI account. When you request AI help, the relevant prompt or selected code is sent to the model provider you configured, including a local Ollama instance if you choose one. Keys are stored encrypted outside renderer preferences.',
  },
  {
    question: 'What do I need before installing?',
    answer:
      'Install system Git and make sure it is available on your PATH. Git Workbench uses your usual SSH keys and credential helper for Git operations. Provider login and AI configuration are optional.',
  },
  {
    question: 'How do updates work on each platform?',
    answer:
      'Linux AppImage, deb, rpm, and Pacman packages and the Windows installer support explicit in-app updates. Unsigned macOS builds are downloaded and installed manually from the release page.',
  },
  {
    question: 'Is macOS supported even though builds are unsigned?',
    answer:
      'Yes. Git Workbench provides a universal DMG and ZIP for Intel and Apple silicon. macOS warns that the app is unsigned; installation and updates are manual. Review the current release notes for platform-specific instructions.',
  },
] as const;

export const DOWNLOAD_FORMATS = [
  { format: 'AppImage', label: 'AppImage' },
  { format: 'deb', label: '.deb' },
  { format: 'rpm', label: '.rpm' },
  { format: 'pacman', label: '.pkg.tar.zst' },
  { format: 'dmg', label: 'Download for macOS' },
  { format: 'zip', label: 'Prefer a ZIP?' },
  { format: 'exe', label: 'Download for Windows' },
] as const;
