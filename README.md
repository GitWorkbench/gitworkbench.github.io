# Git Workbench website

The official website at **https://gitworkbench.github.io/**.

This repository owns the complete website source, screenshots, tests, and GitHub Pages deployment. The desktop application is maintained separately in [GitWorkbench/workbench](https://github.com/GitWorkbench/workbench).

## Develop and publish

Use Node 22 and npm:

```bash
npm ci
npm test
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Edit `index.html`, `styles.css`, and `site.js` directly here. Use relative asset paths and review the desktop and narrow layouts before publishing. Push reviewed changes to `main`; the Pages workflow runs the tests, then publishes only the allowlisted page files (`index.html`, `styles.css`, `site.js`, `install.sh`, `robots.txt`, and `sitemap.xml`) and `assets/`. Settings → Pages must use GitHub Actions as Source.

App releases and downloads remain at [GitWorkbench/workbench](https://github.com/GitWorkbench/workbench/releases). The site selects actual public stable release assets and keeps release-page fallbacks for missing builds, API failures, and unpublished releases. Linux quick install:

    curl -fsSL https://gitworkbench.github.io/install.sh | bash

The published install.sh wrapper downloads the canonical installer from the desktop repository, verifies package SHA-512 against the release feed, then uses the system package manager's normal confirmation flow. Current official Linux release builds are x86_64. The Pages workflow also publishes this small installer wrapper.

Screenshots are captured directly from the desktop app using disposable demo repositories and fictional identities. Review every new capture for secrets and personal data, preserve its aspect ratio, and update the HTML dimensions and Open Graph metadata when replacing it. The homepage includes SoftwareApplication and FAQ structured data; `robots.txt` and `sitemap.xml` are published with the page. No desktop source or credentials belong in the Pages artifact.
