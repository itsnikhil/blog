# ItsNikhil · Astro Cactus

Source for [Nikhil’s blog](https://itsnikhil.github.io/blog/), built with Astro 7.4.7 and [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) v8.3.0.

## Development

Use Node 24 and run `npm ci`.

- `npm run dev`: prepare static assets and start the development server.
- `npm run build`: build the site and index its published entries with Pagefind.
- `npm run preview`: serve the production build at `/blog/`.
- `npm run check`: check Astro templates and TypeScript.
- `npm test`: check historical routes, headings, content, assets, production metadata, local links, and carousel behavior.
- `npm run test:publishing`: build an isolated temporary copy with new posts and a draft, run the full tests across a pagination boundary, and confirm drafts stay unpublished.
- `npm run test:browser`: Playwright smoke tests against a running preview; set `CHROMIUM_PATH` if using a system Chromium.

Published Markdown/TOML is in `content/`. The existing renderer preserves published URLs, historical heading anchors, raw HTML, and custom carousels. The draft résumé is excluded. `static/` and the historical theme’s static assets are copied into generated `public/` by `scripts/prepare-assets.mjs`.

The existing GitHub Actions workflow builds/tests `src` and publishes `dist` to GitHub Pages. `migration-version.json` identifies the deployed framework, theme, and source commit. The public base path is `/blog/`; canonical URLs, RSS, sitemap, navigation, and search all use it.

Disqus is enabled only on `itsnikhil.github.io` using the existing canonical discussion URLs. The legacy Forestry editor route is retained byte-for-byte, but this theme release does not certify that external service or authenticate to it. Article images and MathJax retain their existing external dependencies.

## License

Astro Cactus is MIT licensed. Its original copyright and permission notice are retained in `LICENSE`. Existing writing and images retain their original ownership. See `CACTUS-ADAPTATION.md` for theme provenance and release checks.
