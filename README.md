# Git Workbench website

The official website at **https://gitworkbench.github.io/**.

Source is maintained in [`GitWorkbench/workbench/website`](https://github.com/GitWorkbench/workbench/tree/main/website). This repository contains the published static snapshot and its GitHub Pages workflow. Update the source there, then copy the reviewed page files, screenshots, logo, and `website/pages.yml` here as documented in the [publishing guide](https://github.com/GitWorkbench/workbench/blob/main/docs/website.md).

Every push to `main` deploys automatically with GitHub Actions. The workflow uploads only `index.html`, `styles.css`, `site.js`, and `assets/`; no desktop source or credentials enter the Pages artifact.

App releases and downloads remain at [GitWorkbench/workbench](https://github.com/GitWorkbench/workbench/releases). Screenshots show the actual renderer with disposable demonstration repository data, as labeled on the site.
