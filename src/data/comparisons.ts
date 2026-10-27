import { URLS } from './site';

export interface Comparison {
  slug: string;
  competitor: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  context: string;
  contextSource: number;
  rows: { topic: string; workbench: string; other: string; source: number }[];
  reasons: { title: string; text: string; href: string }[];
  otherFit: string;
  otherFitSource: number;
  limits: string[];
  sources: { label: string; href: string }[];
  reviewedOn: string;
}

const workbenchSource = { label: 'Git Workbench application README', href: URLS.docs };
const reviewDate = '2026-10-27';

export const COMPARISONS: Comparison[] = [
  {
    slug: 'gitkraken-alternative', competitor: 'GitKraken',
    title: 'GitKraken Alternative for Linux, Mac & Windows | Git Workbench',
    description: 'Compare Git Workbench with GitKraken Desktop: platforms, licensing, visual history, and team workflows. Explore a free, open-source Git client for your desktop.',
    heading: 'An open-source GitKraken alternative.',
    lead: 'Looking for a visual Git client with an MIT license and your existing system Git? Compare Git Workbench and GitKraken Desktop around the work you actually need to do.',
    context: 'Both tools offer visual Git workflows across Linux, macOS, and Windows. GitKraken also describes agent sessions and collaboration features; choosing between them involves licensing and team requirements as well as the graph.',
    contextSource: 0,
    rows: [
      { topic: 'Desktop platforms', workbench: 'Linux, macOS, and Windows; current Linux binaries are x86_64.', other: 'Linux, macOS, and Windows.', source: 0 },
      { topic: 'License and access', workbench: 'MIT licensed; free for personal and commercial use, including work with private repositories.', other: 'Free for local and public cloud repositories; paid plans add private repository access and other features.', source: 0 },
      { topic: 'Visual Git tools', workbench: 'Commit graph, unified and side-by-side diffs, hunk staging, and a three-pane merge editor.', other: 'Visual commit graph, diff view, merge tools, and AI capabilities.', source: 0 },
      { topic: 'Team workflow', workbench: 'Hosted reviews for GitHub, GitLab, Bitbucket Cloud, and Gitea; optional AI providers including local Ollama.', other: 'Agent sessions, collaboration tools, and enterprise integrations, depending on the plan.', source: 0 },
    ],
    reasons: [
      { title: 'Use an open-source client for private work', text: 'Git Workbench applies its MIT license to personal and commercial use. Opening a local repository needs no hosting account; remote fetches and pushes use your normal Git authentication.', href: '/features/commit-graph/' },
      { title: 'Choose your own model', text: 'Optional AI can draft messages or explain a branch through the provider you select, including a local Ollama server. You review a draft before applying a supported history rewrite.', href: '/features/ai-assistance/' },
      { title: 'Keep a recovery path visible', text: 'Supported in-app destructive actions create restore points that include the staged/unstaged split. Use them alongside the reflog and before/after rewrite comparisons.', href: '/features/restore-points/' },
    ],
    otherFit: 'GitKraken may be the better fit if your team wants its agent-session management, shared collaboration tooling, or the enterprise integrations in its paid plans. Those workflows deserve a separate evaluation rather than an assumption of feature parity.',
    otherFitSource: 0,
    limits: ['Evaluate GitKraken’s agent-session management and enterprise administration separately; this comparison does not establish equivalent Workbench features.', 'GitHub Enterprise and Bitbucket Data Center review integrations are not currently supported by Git Workbench.', 'Git Workbench macOS builds are unsigned and use manual updates.'],
    sources: [{ label: 'GitKraken Desktop features and free-use FAQ', href: 'https://gitkraken.com/git-client' }, { label: 'GitKraken plans and current pricing', href: 'https://gitkraken.com/pricing' }, workbenchSource],
    reviewedOn: reviewDate,
  },
  {
    slug: 'sourcetree-alternative', competitor: 'Sourcetree',
    title: 'Sourcetree Alternative for Linux | Git Workbench',
    description: 'Looking for a Sourcetree alternative on Linux? Compare desktop platforms, Git workflows, and Mercurial support with Git Workbench, a free open-source Git GUI.',
    heading: 'A Sourcetree alternative that includes Linux.',
    lead: 'If you like working visually but need a Linux Git GUI, Git Workbench offers a commit graph, precise staging, and conflict resolution alongside its macOS and Windows builds.',
    context: 'Sourcetree is a free desktop client with official Windows and macOS downloads. Its documented tools include branching diagrams, Git LFS, submodules, interactive rebase, and Git-flow. Linux availability is a practical reason to evaluate another client.',
    contextSource: 0,
    rows: [
      { topic: 'Official desktop downloads', workbench: 'Linux AppImage, DEB, RPM, and Arch packages; macOS and Windows builds.', other: 'Windows and macOS downloads.', source: 0 },
      { topic: 'Price and source', workbench: 'Free, MIT-licensed source for personal and commercial use.', other: 'Free download from Atlassian.', source: 0 },
      { topic: 'Version control scope', workbench: 'Git repositories through the installed system Git command.', other: 'Git and Mercurial workflows.', source: 0 },
      { topic: 'Repository tools', workbench: 'Graph and diffs, restore points, visual commit splitting, stacked branches, LFS, and sparse checkout.', other: 'Branching diagrams, interactive rebase, Git LFS, submodules, and Git-flow.', source: 0 },
    ],
    reasons: [
      { title: 'Use a package that fits your Linux system', text: 'Choose an x86_64 AppImage or a Debian, RPM, or Arch package. The optional installer selects the format and verifies SHA-512 checksums before handing off to the package manager.', href: '/guides/linux-installation/' },
      { title: 'Work through a conflict in context', text: 'Current and Incoming stay beside an editable Merge result. Preview a remembered text resolution, review it, and explicitly apply the file before continuing the operation.', href: '/features/merge-conflicts/' },
      { title: 'Build more focused commits', text: 'Stage individual hunks while preparing a commit, or preview splitting an existing linear commit into smaller ones. A split verifies the final file tree before applying.', href: '/features/staging-and-diffs/' },
    ],
    otherFit: 'Sourcetree can remain a good fit for a Windows or macOS workflow that already uses its branching diagrams, Git-flow, or Mercurial support. Moving a working team workflow has a cost; Linux support alone is not a reason to change every teammate’s client.',
    otherFitSource: 0,
    limits: ['Git Workbench is a Git client and does not offer Mercurial support.', 'The official Linux release assets currently target x86_64 rather than ARM.', 'Do not assume a Sourcetree preference or account setup is imported into Git Workbench. Configure app-specific settings during first run.'],
    sources: [{ label: 'Sourcetree official downloads and feature overview', href: 'https://www.sourcetreeapp.com/' }, workbenchSource],
    reviewedOn: reviewDate,
  },
  {
    slug: 'github-desktop-alternative', competitor: 'GitHub Desktop',
    title: 'GitHub Desktop Alternative for Linux & GitLab | Git Workbench',
    description: 'Compare Git Workbench and GitHub Desktop for Linux availability, open-source licensing, visual history, and hosted reviews across GitHub, GitLab, and other hosts.',
    heading: 'A GitHub Desktop alternative for a wider workflow.',
    lead: 'Evaluate Git Workbench if you want official Linux packages, a branch graph, or review workflows across several hosts. GitHub Desktop is also open source, so the choice is about your workflow.',
    context: 'GitHub Desktop emphasizes a straightforward GitHub-oriented workflow, with diff review and visual commit management. Compare that approach with the branch visualization and hosted review tools you need from a Git client.',
    contextSource: 0,
    rows: [
      { topic: 'Official desktop platforms', workbench: 'Linux, macOS, and Windows; Linux packages are published by this project.', other: 'Officially supported on Windows and macOS.', source: 1 },
      { topic: 'Open-source license', workbench: 'MIT licensed.', other: 'MIT-licensed application source.', source: 2 },
      { topic: 'Documented daily workflow', workbench: 'Branch-lane history graph, hunk staging, merge editing, and workspace restore points.', other: 'Diff review and visual commit actions, including cherry-picking, squashing, and reordering.', source: 0 },
      { topic: 'Hosted account scope', workbench: 'Request and review integrations for GitHub.com, GitLab, Bitbucket Cloud, and Gitea.', other: 'Can connect a GitHub or GitHub Enterprise account.', source: 3 },
    ],
    reasons: [
      { title: 'Choose a project-published Linux build', text: 'Git Workbench ships its own Linux packages and AppImage. Compare their installation and update flow with the community Desktop build you currently use before switching.', href: '/guides/linux-installation/' },
      { title: 'Follow parallel branch history', text: 'Colored lanes, branch and tag badges, and parent navigation make branch relationships visible. Select a commit to inspect its files and patch in the same workspace.', href: '/features/commit-graph/' },
      { title: 'Bring several review providers together', text: 'Read and submit hosted reviews through GitHub.com, GitLab, Bitbucket Cloud, or Gitea connections. A separate review worktree lets you inspect a request without replacing your active checkout.', href: '/features/pull-request-reviews/' },
    ],
    otherFit: 'GitHub Desktop may be preferable if its focused interface already fits your GitHub or GitHub Enterprise workflow. Account compatibility can be more important than switching clients, particularly when an organization requires GitHub Enterprise.',
    otherFitSource: 3,
    limits: ['Git Workbench currently does not support GitHub Enterprise review integration, which may be decisive for an organization.', 'Community Linux builds of GitHub Desktop exist; official support and community availability are different choices.', 'Git Workbench uses your system Git and separate app settings. Existing GitHub Desktop account sessions are not automatically transferred.'],
    sources: [{ label: 'GitHub Desktop feature overview', href: 'https://github.com/apps/desktop' }, { label: 'GitHub Desktop supported operating systems', href: 'https://docs.github.com/en/desktop/overview/supported-operating-systems-for-github-desktop' }, { label: 'GitHub Desktop source, license, and community releases', href: 'https://github.com/desktop/desktop' }, { label: 'Installing GitHub Desktop and connecting accounts', href: 'https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop' }, workbenchSource],
    reviewedOn: reviewDate,
  },
  {
    slug: 'fork-alternative', competitor: 'Fork',
    title: 'Fork Git Client Alternative for Linux | Git Workbench',
    description: 'Compare Fork and Git Workbench for Linux support, licensing, diff review, and history tools. Explore a free, MIT-licensed alternative to the Fork Git client.',
    heading: 'A Fork alternative for Linux and open-source workflows.',
    lead: 'Fork offers a focused Git client for Mac and Windows. Consider Git Workbench when you also need Linux packages or want an MIT-licensed application you can inspect and build.',
    context: 'Fork’s feature overview includes line-by-line staging, interactive rebase, image diffs, blame, and reflog recovery. Its website lists Mac and Windows downloads and a paid license with a free evaluation.',
    contextSource: 0,
    rows: [
      { topic: 'Desktop platforms', workbench: 'Linux, macOS, and Windows.', other: 'Mac and Windows downloads.', source: 0 },
      { topic: 'License model', workbench: 'Free, MIT-licensed source for personal and commercial use.', other: 'Paid license with a free evaluation; see current purchase terms.', source: 0 },
      { topic: 'Changes and history', workbench: 'Commit graph, hunk staging, three-pane merge editing, and before/after rewrite comparison.', other: 'Line-by-line staging, interactive rebase, file history, and blame.', source: 0 },
      { topic: 'Recovery and specialized views', workbench: 'Workspace restore points and reflog recovery; explicit LFS and sparse-checkout tools.', other: 'Reflog recovery, image diffs, and Git LFS support.', source: 0 },
    ],
    reasons: [
      { title: 'Use one client across your desktops', text: 'The project publishes Linux packages as well as macOS and Windows builds. Your repository remains ordinary Git data, with local operations using the installed Git command.', href: '/guides/getting-started/' },
      { title: 'Inspect the implementation', text: 'The MIT-licensed app source includes the renderer, Git engine, and packaging workflow. Build it yourself when you want to contribute or understand an operation in detail.', href: '/guides/build-from-source/' },
      { title: 'Save more than a branch tip', text: 'A supported workspace restore point records HEAD, the index/working-tree split, and non-ignored untracked files. Recover into a new branch while retaining the saved point.', href: '/features/restore-points/' },
    ],
    otherFit: 'Fork may be preferable on Mac or Windows if its image diffs, file history, blame view, or familiar interaction model are central to your day. Evaluate those views directly rather than treating every diff viewer as interchangeable.',
    otherFitSource: 0,
    limits: ['This comparison does not establish feature parity for Fork’s specialized image-diff and blame views.', 'Git Workbench macOS packages are unsigned and updated manually.', 'History rewrites in Git Workbench can change hashes and signatures. Review the operation’s prerequisites before trying it on shared history.'],
    sources: [{ label: 'Fork official platforms, licensing, and feature overview', href: 'https://www.git-fork.com/' }, workbenchSource],
    reviewedOn: reviewDate,
  },
  {
    slug: 'smartgit-alternative', competitor: 'SmartGit',
    title: 'Open-Source SmartGit Alternative | Git Workbench',
    description: 'Compare SmartGit and Git Workbench across desktop platforms, licensing, repository tools, and enterprise needs. Explore an MIT-licensed visual Git client.',
    heading: 'An open-source SmartGit alternative.',
    lead: 'Both clients cover Linux, macOS, and Windows. The useful question is whether you want SmartGit’s licensed workflow and administration options or Git Workbench’s MIT-licensed approach.',
    context: 'SmartGit documents several workflow views, visual history, conflict resolution, pull requests, and LFS. It also presents branching workflows and tools for individuals and organizations. Compare the workflow as well as the license that fits your work.',
    contextSource: 0,
    rows: [
      { topic: 'Desktop platforms', workbench: 'Linux, macOS, and Windows.', other: 'Windows, macOS, and Linux.', source: 0 },
      { topic: 'Licensing', workbench: 'MIT licensed; free for personal and commercial use.', other: 'Commercial licenses and eligibility-based free non-commercial licenses.', source: 1 },
      { topic: 'Repository workflows', workbench: 'Graph, merge editor, commit splitting, stacked restack previews, LFS, and sparse checkout.', other: 'Visual history, branching workflows, conflict resolution, pull requests, and LFS.', source: 0 },
      { topic: 'Organization requirements', workbench: 'Open-source project with setup and review tools documented in its repository.', other: 'Enterprise licensing and centralized license management options.', source: 1 },
    ],
    reasons: [
      { title: 'Use the same license for personal and paid work', text: 'Git Workbench’s MIT license permits personal and commercial use. Local repository work does not need an app account; provider connections are optional for hosted reviews.', href: '/guides/getting-started/' },
      { title: 'Preview advanced operations', text: 'The visual splitter verifies a replacement commit sequence before applying. Stacked-branch previews run in an isolated worktree, and sparse checkout previews show the intended layout change.', href: '/guides/advanced-git-workflows/' },
      { title: 'Keep model selection explicit', text: 'Use your chosen hosted model or local Ollama server for optional AI requests. Review messages before applying them, with restore points for supported rewrite operations.', href: '/features/ai-assistance/' },
    ],
    otherFit: 'SmartGit may fit better when an organization needs its centralized license management, enterprise licensing, or established branching and review workflow. Free non-commercial options also exist; check eligibility instead of assuming that every SmartGit user needs a paid license.',
    otherFitSource: 1,
    limits: ['Git Workbench does not claim equivalent centralized license administration or enterprise support arrangements.', 'GitHub Enterprise and Bitbucket Data Center review integrations are not currently supported.', 'Some advanced Workbench tools need newer Git versions, including Git 2.38+ for stacked restacks and 2.37+ for sparse-checkout editing.'],
    sources: [{ label: 'SmartGit official platforms and features', href: 'https://www.smartgit.dev/' }, { label: 'SmartGit licensing and eligibility', href: 'https://www.smartgit.dev/pricing/' }, workbenchSource],
    reviewedOn: reviewDate,
  },
];
