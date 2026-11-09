# Astro Cactus adaptation

Theme: Astro Cactus v8.3.0, chrismwilliams/astro-theme-cactus commit a6f7485cf89de38cea647a1809691fd23c4dfb5c. MIT license retained in LICENSE.
Approved design source: Cactus preview commit 9a544e31a3d8f07f263486a64edaba7fdd2fe1ce.
Production content baseline: itsnikhil/blog branch src, commit 7b56af97b1c0ae4e35ccd61f906557c0bd4dce2e.

The actual theme layout, global Tailwind styles, header/cactus logo, theme provider/toggle, social icons, search, and table-of-contents components are used. The existing Markdown/TOML renderer and route generator bridge the published content to those components without renaming routes. Astro remains pinned to 7.4.7.

Production adaptation restores the /blog base everywhere, indexable pages and robots.txt, original per-archive RSS discovery and article metadata, Disqus on its existing canonical URLs, email sharing, and the unchanged Forestry editor entry point. The preview’s disabled editor and noindex settings are not deployed. Pagefind’s base-url and bundle-path are explicitly /blog-aware.

Automated checks cover the 294 historical routes, 156 heading anchors, 22 published entries, draft exclusion, all copied static assets, local media/navigation/feed targets, canonical URLs, production metadata, search configuration, and carousel interaction. The browser smoke suite covers responsive navigation, dark/light persistence, Pagefind results and modal dismissal, pagination/history, carousel controls, and local project images.

No post content or external account settings are changed. External image hosts, Disqus, MathJax, and the legacy Forestry service retain their prior dependencies. Successful page checks do not certify external sign-in or publishing through Forestry.

Release validation: npm ci, Astro check (zero errors/warnings), production build, and npm test passed. The local Playwright suite could not start Chromium because this workspace disallows its process-singleton socket; no automated browser assertions are claimed from that attempt. The approved preview had prior desktop/narrow-width interactive review. Production browser smoke checks are performed separately after deployment.

Live smoke testing verified search-to-article navigation, dark-mode persistence, pagination and carousel interaction. Disqus’s legacy embed color parser did not accept OKLCH colors, so compatible hex colors are scoped to its host container and probe links without changing the theme palette elsewhere.
