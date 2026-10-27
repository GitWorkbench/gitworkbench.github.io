import { INSTALL_COMMAND, URLS } from './site';

export interface ContentSection {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  ordered?: boolean;
  code?: string;
  note?: string;
}

export interface ContentPage {
  slug: string;
  label: string;
  title: string;
  heading: string;
  description: string;
  lead: string;
  sections: ContentSection[];
  sources: { label: string; href: string }[];
  screenshot?: 'history' | 'diff' | 'merge';
  related: string[];
}

const readme = { label: 'Application README', href: URLS.docs };
const advanced = { label: 'Advanced workflow documentation', href: URLS.advanced };
const setup = { label: 'First-run setup documentation', href: URLS.firstRun };

export const FEATURE_PAGES: ContentPage[] = [
  {
    slug: 'commit-graph', label: 'Visual commit graph',
    title: 'Visual Git Commit Graph & Branch History | Git Workbench',
    heading: 'Read your repository like a story.',
    description: 'Explore Git history with colored branch lanes, inline tags, commit details, and parent navigation. A free visual Git client for Linux, macOS, and Windows.',
    lead: 'Parallel branches make more sense when you can see how they connect. Git Workbench turns repository history into colored commit strata, with the context beside every commit.',
    screenshot: 'history', related: ['staging-and-diffs', 'restore-points'], sources: [readme],
    sections: [
      { id: 'follow-branches', title: 'Follow branches through the graph', paragraphs: ['Dedicated color lanes trace parallel branches and their merge points. HEAD, local branches, remote-tracking branches, and tags appear inline with the commit summaries, so you can connect a branch name to its place in history.', 'Use the branch list and commit filter to narrow the view when a repository grows. Graph density is adjustable in Settings → Typography & Density: choose more breathing room or fit more history on screen.'] },
      { id: 'inspect-commits', title: 'Move from a commit to its changes', paragraphs: ['Select a commit node to inspect its author, parent hashes, and changed files. Follow a parent hash to move through the history rather than reconstructing the relationship from names alone.', 'The file list offers both flat paths and an expandable folder hierarchy. Added, modified, deleted, and renamed badges, together with line counts, help you decide which patch to open next.'] },
      { id: 'multiple-repositories', title: 'Keep more than one repository in view', paragraphs: ['Repository tabs let you switch projects without opening another app window. Home keeps recent projects and pinned repository cards together, including changed files, conflicts, and ahead/behind information.', 'A local status refresh reads your workspace; it does not fetch from the remote. Ahead/behind counts reflect the last fetched upstream, so fetch explicitly when you need current remote history.'] },
      { id: 'native-git', title: 'Use the Git setup you already trust', paragraphs: ['Git Workbench reads the repository through your installed system Git. Existing SSH keys, credential helpers, Git hooks, GPG configuration, and .gitconfig remain part of the workflow.', 'Local history browsing needs no hosting account. Connect a provider when you want pull request or merge request features, and use the integrated terminal whenever a task calls for the command line.'] },
    ],
  },
  {
    slug: 'staging-and-diffs', label: 'Diffs & hunk staging',
    title: 'Git Diff Viewer & Hunk-Level Staging | Git Workbench',
    heading: 'Make every commit say one thing.',
    description: 'Review unified and side-by-side Git diffs, stage individual hunks, and inspect changed files before committing with the free Git Workbench desktop app.',
    lead: 'A working tree can contain several ideas at once. Review the patch, choose the hunks that belong together, and build a focused commit without leaving your repository.',
    screenshot: 'diff', related: ['commit-graph', 'merge-conflicts'], sources: [readme, advanced],
    sections: [
      { id: 'review-the-patch', title: 'Choose the diff view that fits the change', paragraphs: ['Unified diffs put additions and deletions in one reading flow. Side-by-side diffs separate the old and new versions when comparing a larger edit. Syntax highlighting helps preserve the structure of the code in either view.', 'Open a historical commit to inspect its patch, or review staged and unstaged files in the active workspace. The file hierarchy and change badges keep the path and change type visible as you move between files.'] },
      { id: 'stage-hunks', title: 'Stage the right pieces', paragraphs: ['Stage or unstage individual hunks instead of committing an entire file just because part of it is ready. This is useful when a bug fix and a separate cleanup touched the same source file.', 'Review the staged patch before committing. Your normal repository configuration remains in use, and you can open a file in your system editor or reveal it in the file manager when you need more context.'], items: ['Inspect the changed file and choose a diff layout.', 'Stage the hunks that belong to one logical change.', 'Check the staged patch and write a commit message.', 'Leave unrelated edits unstaged for the next commit.'], ordered: true },
      { id: 'discard-and-recover', title: 'Discard with a recovery path', paragraphs: ['In-app discard actions create a workspace restore point before removing supported file, hunk, or line changes. If the snapshot fails, the destructive operation stops.', 'Restore points preserve the staged/unstaged split and non-ignored untracked files, but do not include ignored files or unsaved editor buffers. Commands run directly in the terminal do not receive these app safeguards.'] },
      { id: 'split-existing-commit', title: 'Already committed too much?', paragraphs: ['The visual commit splitter can divide a commit on the current local branch into 2–20 smaller commits by file or text hunk. Preview builds the replacement commits separately and verifies the same final file tree before applying.', 'Applying a split requires a clean, unchanged branch and creates a restore point. Rewriting changes commit hashes and does not preserve signatures; no push runs automatically. See the advanced workflow guide before changing shared history.'] },
    ],
  },
  {
    slug: 'merge-conflicts', label: 'Three-pane merge editor',
    title: 'Resolve Git Merge Conflicts Visually | Git Workbench',
    heading: 'Resolve conflicts with both sides in view.',
    description: 'Compare Current and Incoming changes beside an editable merge result. Resolve Git conflicts visually, inspect the base, and preview remembered resolutions.',
    lead: 'See what each side intended, edit the result you actually want, and apply it when you are ready. The merge editor keeps the full file context alongside the conflict.',
    screenshot: 'merge', related: ['restore-points', 'staging-and-diffs'], sources: [readme, advanced],
    sections: [
      { id: 'three-panes', title: 'Current, Incoming, and your result', paragraphs: ['Open a conflicted file from the operation banner or its Resolve action in the changes list. Current and Incoming remain read-only beside an editable Merge result, with a common ancestor available through Show base.', 'Resize the panes or link scrolling to keep a section aligned. Git’s non-conflicting changes remain in the working result while you decide how to resolve the conflicting blocks.'] },
      { id: 'review-and-apply', title: 'Work through conflicts deliberately', paragraphs: ['Gutter arrows and toolbar actions can accept either side, keep both in either order, or restore a diff3 base block. You can also edit the result directly with search, syntax highlighting, and undo/redo.', 'Use Alt+Up or Alt+Down to move between conflict blocks. Mark resolved confirms manual edits. Apply & Next File saves and stages the reviewed file; on the last file, Apply & Continue explicitly resumes the paused merge, rebase, or cherry-pick.'] },
      { id: 'conflict-memory', title: 'Review a remembered resolution', paragraphs: ['Actions → Conflict Resolution Memory enables repository-local suggestions backed by Git rerere. A repeated text conflict can offer a preview generated in a temporary worktree and index, leaving your working file untouched during the preview.', 'Use reviewed result loads an undoable editor draft; Apply still controls saving and staging. You can forget a matching result or disable suggestions while retaining the cache. Git’s automatic rerere application is disabled when this feature is enabled.'] },
      { id: 'special-files', title: 'Know when a text merge is not enough', paragraphs: ['Binary files and symbolic links use complete-side choices. Delete/modify conflicts let you keep the deletion, while submodule conflicts display guidance for resolving the submodule through Git.', 'Line endings are preserved. If a file or index entry changes during saving, the editor requires a reload; switching files or closing with unapplied edits asks you to review that choice.'] },
    ],
  },
  {
    slug: 'pull-request-reviews', label: 'Pull & merge request reviews',
    title: 'Review GitHub & GitLab Pull Requests | Git Workbench',
    heading: 'Keep the review close to the code.',
    description: 'Review pull and merge requests from GitHub, GitLab, Bitbucket Cloud, and Gitea. Read diffs, discuss changes, inspect CI, and open a separate review worktree.',
    lead: 'Read the patch, follow the conversation, and inspect checks from the same workspace you use for your local Git work.',
    related: ['commit-graph', 'restore-points'], sources: [readme, advanced],
    sections: [
      { id: 'connect-provider', title: 'Connect the host your team uses', paragraphs: ['Settings → Pull Request Providers supports GitHub.com, GitLab.com, self-hosted GitLab, Bitbucket Cloud, and Gitea servers. Self-hosted GitLab connections support separate instances, nested groups, HTTPS ports, and base paths.', 'GitHub offers device-code sign-in and repository selection, with manual tokens also available. Provider access reads request metadata; normal Git authentication through SSH or your credential helper handles Git fetches and pushes. GitHub Enterprise and Bitbucket Data Center are not currently supported.'] },
      { id: 'review-revision', title: 'Review a specific revision', paragraphs: ['Choose Requests beside List in the sidebar, select the remote, and open a request. Review changes, conversation & CI brings file diffs, comments, replies, and checks together for the loaded source revision.', 'Comment, Approve, and Request changes require explicit submission. If the source revision changes while you review, submission is rejected and your draft is kept. Missing permissions, unavailable patches, and pagination limits are shown in the workspace.'], note: 'On older GitLab hosts without native GraphQL change requests, Request changes is explicitly presented as a discussion and approval withdrawal rather than a native blocking review.' },
      { id: 'review-worktree', title: 'Check out the review without disturbing your work', paragraphs: ['Open in worktree… creates a separate checkout at the exact reviewed commit. Choose a parent folder outside the active repository and a new local branch name, then open the review workspace in its own tab.', 'The original checkout, index, and dirty files stay in place. Creating the worktree does not install dependencies or run project scripts, and automatic LFS downloads are skipped. Install and run the project yourself after reviewing its instructions.'] },
      { id: 'publish-request', title: 'Publish when the branch is ready', paragraphs: ['Prepare a request from the checked-out branch using the + action or commit context menu. The creation workspace uses the selected host’s request type and target branches.', 'Nothing is pushed until the explicit creation action. Only commits on the branch are included; uncommitted working files remain local. CI results may require additional provider permissions, including Checks and Commit statuses read access on GitHub.'] },
    ],
  },
  {
    slug: 'restore-points', label: 'Restore points & recovery',
    title: 'Git Restore Points, Reflog & Recovery | Git Workbench',
    heading: 'A way back, before the next move.',
    description: 'Save Git workspace restore points, recover staged and unstaged changes into a new branch, browse the reflog, and compare history before and after a rewrite.',
    lead: 'History tools are easier to use when the recovery path is visible. Git Workbench pairs supported destructive actions with restore points and keeps recovery separate from your original branch.',
    related: ['merge-conflicts', 'ai-assistance'], sources: [readme, advanced],
    sections: [
      { id: 'save-workspace', title: 'Save the workspace, including its staging state', paragraphs: ['Actions → Restore Points → Save point records HEAD, the staged/unstaged split, and non-ignored untracked files. A manual save leaves your changes in place and does not add a stash entry.', 'The app also creates points before supported resets, discards, pulls, and history rewrites. A failed snapshot prevents the destructive action. Saved points remain available until you delete them explicitly.'] },
      { id: 'recover-branch', title: 'Restore into a new branch', paragraphs: ['Inspect a point’s label, branch, timestamp, and saved file status. Commit or stash current work until the workspace is clean, then choose Restore into new branch and review the confirmation.', 'Recovery checks out a branch at the saved HEAD and reapplies the recorded index and working files. The original branch and saved point remain available. If recovery stops, inspect the recovery branch before retrying.'] },
      { id: 'limits', title: 'Understand what a point includes', paragraphs: ['Ignored files, unsaved editor buffers, and files inside submodule working directories are excluded. Submodule revisions are recorded, but recovery does not recursively update their workspaces. A conflicted index cannot be snapshotted.', 'Points use local private Git refs and are excluded from the normal graph. Ordinary branch pushes do not publish them; a mirror push can include custom refs. Keep separate backups for files that Git does not track.'] },
      { id: 'reflog-and-comparison', title: 'Find lost commits and inspect rewrites', paragraphs: ['The reflog shows local HEAD and reference movements, helping you find commits hidden by a reset, rebase, or deleted branch. Create a recovery branch at an entry to keep that commit reachable.', 'Rebase & Rewrite Comparison uses git range-diff to inspect old and new commit ranges. Git 2.19+ is required, merge commits are excluded, and matching is heuristic. A comparison explains what changed; a restore point provides a separate recovery path.'] },
    ],
  },
  {
    slug: 'ai-assistance', label: 'Optional AI assistance',
    title: 'Optional AI Commit Messages & Branch Explanations | Git Workbench',
    heading: 'A second perspective. You keep control.',
    description: 'Draft commit messages and explain branch changes with optional hosted AI or local Ollama. Review before applying, with encrypted keys and local rewrites.',
    lead: 'Configure a model when it helps your workflow. Keep reviewing, staging, and committing normally when it does not. Hosted AI is optional, and local model servers are supported.',
    related: ['staging-and-diffs', 'restore-points'], sources: [readme, setup],
    sections: [
      { id: 'choose-provider', title: 'Choose how assistance runs', paragraphs: ['First-run setup and Settings → AI Assistant let you choose a provider, model, endpoint, and commit style. Options include hosted providers, a local Ollama server, and offline rule-based commit drafts.', 'Save & test saves the settings and sends a built-in example to the configured model, without reading repository content. Normal AI features send selected change content only when you explicitly request assistance.'] },
      { id: 'draft-and-apply', title: 'Review a message before applying it', paragraphs: ['Recompose commit message with AI… generates a draft for a selected commit. Edit it and choose explicitly whether to apply it; generation does not automatically publish or push anything.', 'Recomposition requires a clean local branch with at most 500 linear commits. A restore point protects the old history. File trees and author metadata are preserved, while rewritten hashes and cryptographic signatures change.'] },
      { id: 'branch-explanations', title: 'Explain a branch from its base', paragraphs: ['Explain branch changes… compares selected base and tip revisions from their common ancestor. The result reports the resolved revisions, commit and file counts, and any large-diff truncation.', 'Use an explanation as context alongside the actual patch and your own review. The configured provider receives the requested input; a local Ollama endpoint keeps that model request on your machine.'] },
      { id: 'saved-credentials', title: 'Keep credentials separate from interface preferences', paragraphs: ['API keys are encrypted through Electron’s operating-system keychain or keyring integration. Model and provider preferences are stored separately in the stable app data directory and survive normal updates under the same OS account.', 'A blank key field keeps a saved key. Removing a key is explicit, and switching providers preserves other saved credentials. Resetting interface preferences does not delete AI keys or restart onboarding.'] },
    ],
  },
];

export const GUIDE_PAGES: ContentPage[] = [
  {
    slug: 'getting-started', label: 'Getting started',
    title: 'Get Started with Git Workbench | Setup & First Commit',
    heading: 'From first launch to your first commit.',
    description: 'Install Git Workbench, choose a commit profile, open a repository, and make your first commit. Learn which setup steps are optional and when to connect a host.',
    lead: 'Bring an existing repository and your system Git. A short setup gets the workspace ready, while provider connections and AI stay optional.',
    related: ['linux-installation', 'advanced-git-workflows'], sources: [readme, setup],
    sections: [
      { id: 'install', title: '1. Install the app and check Git', paragraphs: ['Download the package for your desktop: Linux AppImage, Debian, RPM, or Arch; a universal macOS DMG or ZIP; or the Windows installer. Released packages do not require Node.js or a source-build toolchain.', 'Have the system git command installed and available on PATH. macOS builds are unsigned and use manual installation and updates. For Linux, the dedicated installation guide explains package selection and the one-line installer.'], code: 'git --version' },
      { id: 'first-run', title: '2. Choose a commit profile and appearance', paragraphs: ['On first launch, enter a profile name, author name, and email. An existing global Git identity is prefilled when available. The app supplies the selected identity for its commit command; writing it to global Git configuration is a separate opt-in, off by default.', 'Preview a theme, then configure AI or skip it. Skipping setup makes no model request and does not change global Git identity. These settings remain available later. The optional Gravatar preview makes an external image request; turn it off if you prefer initials.'] },
      { id: 'open-repository', title: '3. Open and inspect your repository', paragraphs: ['Use Home to open an existing repository or create one. Pin frequently used projects and switch between them in tabs. Select a commit in the graph to inspect its parents, file changes, and patch.', 'Start with a repository you know. Local Git work needs no hosting account. Connect a provider in Settings → Pull Request Providers when you want to read, review, or create hosted requests.'] },
      { id: 'first-commit', title: '4. Review, stage, commit, and push', paragraphs: ['Review staged and unstaged changes in the diff viewer. Stage the files or hunks that belong together, read the staged patch, and write a commit message. Unrelated working edits can stay unstaged.', 'Fetch, pull, and push using your existing SSH key or Git credential helper. A commit is local until you push. Supported in-app destructive actions create restore points; direct terminal commands do not receive those safeguards.'], items: ['Ctrl/Cmd + , opens Settings.', 'Ctrl/Cmd + F filters commits and branches.', 'Ctrl/Cmd + R refreshes repository status.', 'Ctrl/Cmd + T opens Home.', 'Escape dismisses a viewer or dialog.'] },
    ],
  },
  {
    slug: 'linux-installation', label: 'Linux installation',
    title: 'Install Git Workbench on Linux | Ubuntu, Fedora & Arch',
    heading: 'The right package for your Linux desktop.',
    description: 'Install Git Workbench on Debian, Ubuntu, Fedora, openSUSE, or Arch Linux. Use the checksum-verifying installer or download an AppImage, DEB, RPM, or Arch package.',
    lead: 'Use your distribution’s package format, or let the installer select it. Current official Linux releases target Intel and AMD 64-bit systems (x86_64).',
    related: ['getting-started', 'build-from-source'], sources: [readme, {label: 'Linux installer source', href: URLS.installerSource}],
    sections: [
      { id: 'one-line-installer', title: 'Install with one command', paragraphs: ['The installer detects Debian-based, RPM-based, and Arch-based distributions. It downloads the matching package from the public GitHub release, verifies its SHA-512 checksum, and invokes the system package manager with its normal confirmation prompt.', 'On other distributions, it installs an AppImage for the current user under ~/.local/opt/git-workbench and adds a desktop entry. Review the installer source before running it if you want to inspect the script.'], code: INSTALL_COMMAND },
      { id: 'choose-package', title: 'Choose a download manually', paragraphs: ['The downloads page lists the stable release, file sizes, and direct GitHub asset links. Choose a package that matches the distribution rather than an extension that merely looks familiar.'], items: ['Debian and Ubuntu: choose the .deb package.', 'Fedora, RHEL-family systems, and openSUSE: choose the .rpm package.', 'Arch and CachyOS: choose the .pkg.tar.zst package.', 'Other distributions: use the x86_64 AppImage.'], note: 'The source build accepts additional architecture targets, but current official Linux release assets are x86_64. Do not select an x86_64 installer for an ARM machine.' },
      { id: 'updates', title: 'Update using the app or your package format', paragraphs: ['Packaged builds can check for updates in About → Software updates. AppImage, Debian, RPM, and Pacman builds support downloads and installation; package-manager installs may request system authorization.', 'For older installations with incorrect updater package markers, download the current package and upgrade manually. On Arch, install the downloaded Arch package using pacman -U. A failed authorization dialog is separate from an update check or download failure.'], code: 'sudo pacman -U ./git-workbench-<version>-<pkgrel>-x86_64.pkg.tar.zst' },
      { id: 'requirements', title: 'Keep installation and source builds separate', paragraphs: ['The released desktop package needs system Git. Node.js, Python, make, and a C++ compiler are prerequisites for building the source, not for installing a released Linux package.', 'If a release will not start, include the distribution, architecture, app version, package format, and the visible error when opening an issue. Check the current release notes for fixes before attempting a source build.'] },
    ],
  },
  {
    slug: 'advanced-git-workflows', label: 'Advanced Git workflows',
    title: 'Commit Splitting, Stacked Branches, LFS & Sparse Checkout',
    heading: 'More control over a growing repository.',
    description: 'Learn Git Workbench workflows for visual commit splitting, stacked branch restacks, Git LFS, and sparse checkout, including prerequisites and preview behavior.',
    lead: 'The Actions menu brings advanced repository tools into the workspace. Start with a preview, check the prerequisites, and understand which part of the repository each operation changes.',
    related: ['getting-started', 'build-from-source'], sources: [advanced],
    sections: [
      { id: 'split-commit', title: 'Split one commit into a focused series', paragraphs: ['Actions → Split Commit… assigns a local commit’s files or text hunks to 2–20 commits. Binary files, adds/deletes, submodules, and mode changes stay as whole-file pieces. Preview uses a temporary index and verifies the original final tree.', 'Apply requires a clean branch and unchanged HEAD, saves a restore point, and guards the branch update against concurrent changes. Up to 200 later commits are supported; selected merges and later merge commits are rejected. Signatures are not preserved, and nothing is pushed.'] },
      { id: 'stacked-branches', title: 'Preview a stacked branch restack', paragraphs: ['Actions → Stacked Branches & Requests… links local children to parents. Links and saved boundaries do not move branches by themselves. With Git 2.38+, a restack preview rebases up to 10 linked descendants, each with up to 100 linear commits, in a separate worktree.', 'Resolve paused conflicts in the preview workspace and resume the preview from an original workspace. Applying requires a clean unaffected checkout and no affected branches checked out in any worktree. Request retargeting is explicit; merge detection, publishing, and force-pushing are not automatic.'] },
      { id: 'git-lfs', title: 'Track and transfer large files deliberately', paragraphs: ['Actions → Git LFS Manager… uses a separately installed recent Git LFS command. Add tracking rules, inspect object hashes and sizes, and review whether a working file is a full asset or a pointer.', 'Fetch to cache, Pull assets, Checkout cached, and Upload current revision are separate actions. Tracking changes update .gitattributes for you to review and commit; they do not migrate existing history. Transfers can be cancelled, with partial objects retained for a retry.'] },
      { id: 'sparse-checkout', title: 'Keep only the folders you need', paragraphs: ['Actions → Sparse Checkout… requires Git 2.37+. Select directories, then preview included and excluded entries and the paths that will be populated or removed. Cone mode also includes root files and immediate files in ancestor directories.', 'Apply requires a clean checkout, saves both a workspace restore point and a separate layout backup, and rejects stale previews or blocking files. Excluded files remain in Git history. Sparse checkout reduces populated working files; it does not remove objects already downloaded to the repository database.'], note: 'These workflows have operation-specific limits. Read the complete advanced documentation before rewriting published history or changing a checkout layout.' },
    ],
  },
  {
    slug: 'build-from-source', label: 'Build from source',
    title: 'Build Git Workbench from Source | Developer Setup',
    heading: 'Open source, all the way to your desktop.',
    description: 'Set up the Git Workbench desktop source with Node.js 22, npm, and system Git. Learn Linux build prerequisites, Electron startup, tests, and packaging commands.',
    lead: 'Build the desktop application when you want to contribute or inspect the implementation. To use a released version, the downloads page is the shorter path.',
    related: ['getting-started', 'linux-installation'], sources: [readme, {label: 'Contributor and agent conventions', href: URLS.contributing}],
    sections: [
      { id: 'prerequisites', title: 'Prepare the desktop build environment', paragraphs: ['The application README specifies Node.js 22, npm with the committed package-lock.json, and system Git on PATH. Linux also compiles the native terminal dependency and needs Python 3, GNU Make, and a C++ compiler.', 'On Debian and Ubuntu, build-essential supplies make and g++. CMake alone does not replace these tools. These prerequisites belong to the desktop application source; this Astro website has its own setup instructions.'], code: 'sudo apt update\nsudo apt install -y build-essential python3' },
      { id: 'clone-and-run', title: 'Clone, install, and start', paragraphs: ['Clone the desktop repository and install its locked dependency set with npm ci. Starting the development app automatically runs electron:install if the Electron runtime is missing.', 'Fetching Electron requires access to its release downloads. You can run npm run electron:install explicitly ahead of time. If npm reports skipped scripts for esbuild or node-pty, follow the package-specific approval and rebuild instructions in the upstream README.'], code: 'git clone https://github.com/GitWorkbench/workbench.git git-workbench\ncd git-workbench\nnpm ci\nnpm run dev' },
      { id: 'validate', title: 'Check a contribution against real Git', paragraphs: ['Run the TypeScript check and automated tests before submitting an application change. The suite covers UI behavior, typed IPC, hosting adapters, and Git workflows in temporary repositories.', 'npm run demo:create builds disposable repositories with branches, staged edits, stashes, worktrees, and prepared conflicts for manual exploration. Read the generated GUIDE.md for the matching fixture, and keep personal repositories separate from these experiments.'], code: 'npm run typecheck\nnpm test\nnpm run test:coverage\nnpm run demo:create' },
      { id: 'package', title: 'Package and contribute', paragraphs: ['Use npm run dist:linux for AppImage, Debian, RPM, and Arch packages, npm run dist:win for the NSIS installer, or npm run dist:mac for a DMG and ZIP. macOS release builds are unsigned and use manual updates.', 'Read the contributor conventions before making development changes. Open a focused pull request explaining the behavior and validation. Local packaging commands produce files; release publication and upload are handled separately by the application’s release workflow.'] },
    ],
  },
];
