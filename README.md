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

Open http://127.0.0.1:4173. Edit `index.html`, `styles.css`, and `site.js` directly here. Use relative asset paths and review the desktop and narrow layouts before publishing. Push reviewed changes to `main`; the Pages workflow runs the tests, then publishes only the allowlisted page files and `assets/`. Settings → Pages must use GitHub Actions as Source.

App releases and downloads remain at [GitWorkbench/workbench](https://github.com/GitWorkbench/workbench/releases). The site selects actual public stable release assets and keeps release-page fallbacks for missing builds, API failures, and unpublished releases.

Screenshots show the actual renderer with disposable demo repository data, as labeled on the site. Review new captures for secrets and personal data, preserve their aspect ratio, and update the HTML dimensions when replacing them. No desktop source or credentials belong in the Pages artifact.
