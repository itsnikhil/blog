import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
await rm('public', { recursive: true, force: true });
await mkdir('public', { recursive: true });
await cp('themes/hugo-theme-cactus/static', 'public', { recursive: true });
await cp('static', 'public', { recursive: true });
await cp('src/assets/carousel.css', 'public/css/carousel.css');
await cp('src/assets/carousel.js', 'public/js/carousel.js');
await cp('src/assets/refinements.css', 'public/css/refinements.css');
await writeFile('public/migration-version.json', JSON.stringify({ framework: 'Astro', version: '7.4.7', commit: process.env.GITHUB_SHA || null }) + '\n');
