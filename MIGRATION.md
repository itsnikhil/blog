# Hugo → Astro 7.4 migration

## Status

Prepared on `feat/astro-7.4-migration`. Nothing has been pushed or deployed.
The existing GitHub Pages site remains unchanged until this branch is reviewed and merged to `src`.

## Run locally

Use Node 24 (or Node >=22.23.4):

```sh
npm ci
npm run build
npm test
npm run preview
```

Open the preview URL with `/blog/`. Set `ASTRO_TELEMETRY_DISABLED=1` in environments without a writable home directory. For editing, run `node scripts/prepare-assets.mjs` once before `npm run dev`.

## What is preserved

- All original Markdown files, YAML and TOML frontmatter, dates, images and raw HTML remain unchanged under `content/`.
- All 22 published entries; the draft résumé stays unpublished.
- All 294 historical HTML/XML output paths from Hugo 0.128.0, including RSS feeds, taxonomy terms, pagination aliases and the standalone static snapshot/admin pages.
- Historic heading fragments, including duplicate-heading suffixes and the unusual trailing-hyphen tag slug.
- Cactus white CSS, fonts, logo, project cover images, descriptions, year/category groupings, navigation and featured projects.
- Interactive carousel next/previous/indicators/keyboard/touch/autoplay behavior. Added keyboard focusability.
- Disqus shortname and production canonical URLs; comments intentionally do not load in local previews.
- MathJax for the original math-enabled post, RSS discovery, sitemap, Open Graph and Twitter metadata.

## Improvements / deliberate implementation differences

- Canonical links and page-specific descriptions added; CSS/font paths now include `/blog/` correctly.
- Hugo templates are replaced by Astro layouts with a build-time Markdown renderer. Heading anchors follow the original Hugo output.
- Navigation is simplified and keyboard-accessible, rather than retaining the old JS-powered overlay. Archive/back-to-top/email-share controls remain. This is not a pixel-identical theme port.
- Syntax highlighting uses highlight.js rather than Hugo Chroma; token colors/spacing and smart punctuation can differ.
- Project links on the home page now correctly point to this blog’s project archive rather than the legacy malformed external URL.

## Deployment and legacy files

The existing `.github/workflows/hugo.yml` filename is retained but now builds Astro with Node 24. Pull requests build/test only. Deploy runs only after an authorized merge/push to `src` or manual workflow dispatch on `src`. Do not merge or dispatch until deployment is approved.

`config.toml`, legacy Hugo templates, Forestry files, `.travis.yml` and `deploy.sh` remain for reference and rollback. The new build does not invoke Travis/deploy.sh. If legacy Travis integration remains enabled externally, disable that integration before merging so it cannot compete with GitHub Pages. This migration does not change external CI settings. Existing Forestry editing compatibility is not certified; authoring via Markdown remains supported.

## Verification

`npm test` checks the original route manifest, all published entries, draft exclusion, base paths, canonical URLs, historical heading IDs, taxonomy RSS semantics and carousel DOM interactions.

`npm run test:browser` contains Playwright checks for mobile overflow, navigation/pagination, actual carousel interaction and project images. Install Playwright Chromium first with `npx playwright install chromium`; alternatively set `CHROMIUM_PATH` to a compatible installed browser. Run preview in a separate terminal before these tests.

Full browser/visual QA could not run in the current execution sandbox: Chromium exits because its process-singleton socket is not permitted. No browser assertions were executed successfully. DOM interaction and static-build checks pass; review desktop/mobile appearance in a normal browser before merging.

Remote image availability and third-party Disqus/MathJax services were not independently verified. No production comments were created, no credentials modified and no external settings changed.

## Council improvement pass

Added semantic page/section headings, skip navigation, current-section markers, consistent 44px controls/topic chips, a 12-topic homepage overview with full archive access, stronger text contrast, 16–17px reading typography, responsive carousel sizing, reduced-motion support, autoplay pause, selected indicator state, inactive-slide exclusion and polite announcements. Descriptions and carousel image alternatives are rendered to plain text rather than exposing Markdown.

Only two source-copy corrections were made: “Journal Fitit App” → “Journal Fitbit App” and Aquarex’s unrelated IEEE webapp description → the total-internal-reflection experiment actually documented on that page. Personal biography and article prose remain unchanged.

Static/DOM quality tests pass. The supported Sites/cloud-browser route was subsequently available: desktop home, projects and carousel were visually inspected and carousel Next was exercised successfully. Mobile viewport, keyboard-only end-to-end and screen-reader speech testing remain unverified. These limitations supersede the earlier blanket browser-QA limitation. No 95% score is claimed without an independent re-review against the council rubric.

## Second review pass

Fixed actual desktop regressions inherited from Cactus: inline project descriptions, absolutely positioned footer and cramped article metadata. Added archive excerpts/topic links and page location, an optional article table of contents, and a clear comments-disabled notice on non-production hosts. Corrected obvious project-page spelling and removed the unsupported promise that scheduling an Office form means never missing a deadline. Personal biography and personal-post prose remain unchanged. Static tests cover these additions and all prior legacy-route/anchor checks.

## Evidence-based technical review

Composer claims were checked against its linked repository at commit d6163e3bec1a2c9b0234471ca128c7a5bd608ac5: the preview has CDN dependencies, mocks selected host APIs, and exports starter MCP scaffolding. The article now states those limits and shows supported widget-state usage. JWT guidance was corrected against OWASP and RFC 7519/8725/6749/9700, including authentication/authorization, CSRF, XSS, validation, revocation and refresh handling. Both articles keep original publication dates and add explicit dated correction notes; historical heading anchors remain available. An independent technical reader reviewed the edits. No runtime security audit or production feature test is claimed.

Additional browser verification: archive Older navigation reached page 2 with correct location text; the 404 recovery link returned home. Native browser DevTools access is explicitly organization-blocked, so mobile/device emulation was not bypassed or claimed. Current biography remains unchanged pending the user's confirmation.

## Composer build verification

In a separate checkout at the pinned Composer commit, `npm install --ignore-scripts` and `npm run build` completed successfully on Node 24.22.1. The build ran TypeScript and Vite 5.4.21, processing 150 modules. Deprecated dependency and stale browser-data warnings remain; no automatic upgrades or repository changes were made. Browser interactions and ChatGPT integration were not tested. The article now distinguishes this verified build from untested runtime behavior.

## Narrow-viewport verification

A separate reviewer found an allowed native-window resize plus normal browser-zoom route. This is desktop Chromium at measured narrow CSS viewports, not iOS/device emulation. At 388px and 323px, home/archive/article had no document-level horizontal overflow; article TOC and carousel controls worked. The review found inherited 70px mobile-nav indentation, now reset and visually verified as a single row at both widths. Navigation targets now have minimum width and height of 44px. The earlier DevTools restriction remains; no policy was bypassed. A suspected carousel crop was withdrawn after image geometry matched the source aspect ratio.

## Official deployment preparation

The user authorized making this the official version. Travis now excludes the source branch and its old force-push deploy script is retired; GitHub Actions is the sole configured publisher. Build output includes `migration-version.json` with the framework version and GitHub commit SHA for deployment verification. The existing source branch remains `src` and the public base remains `/blog/`.
