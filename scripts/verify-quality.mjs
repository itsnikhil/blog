import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { entries, posts } from '../src/lib/content.js';
import { routes } from '../src/lib/routes.js';
const read = file => fs.readFileSync(`dist/${file}`, 'utf8');
const doc = file => new JSDOM(read(file)).window.document;
const home = doc('index.html');
assert.equal(home.querySelectorAll('h1').length, 1);
assert.equal(home.querySelector('h1').textContent, 'Hi, I’m Nikhil.');
assert(home.querySelector('a[href="/blog/tags/"]'));
const files = ['index.html', '404.html', ...routes.filter(r => r.redirect === undefined).map(r => `${r.route}/index.html`)];
let checkedLinks = 0;
for (const file of files) {
  const document = doc(file);
  assert(document.querySelector('a[href="#main"]'), `Skip link: ${file}`);
  assert(document.querySelector('main#main[tabindex="-1"]'), `Main target: ${file}`);
  assert(document.querySelector('nav[aria-label="Main navigation"]'), `Navigation: ${file}`);
  assert(!document.querySelector('meta[name="robots"]')?.content.includes('noindex'), `Indexable page: ${file}`);
  const description = document.querySelector('meta[name="description"]').content;
  assert(!/!?\[[^\]]*\]\(|```|{{<|<[^>]+>/.test(description), `Plain-text description: ${file}`);
  const canonical = document.querySelector('link[rel="canonical"]').href;
  assert(canonical.startsWith('https://itsnikhil.github.io/blog/'), `Canonical base: ${file}`);
  assert(!canonical.includes('/blog/blog/'), `Doubled base: ${file}`);
  const config = document.querySelector('pagefind-config');
  assert.equal(config.getAttribute('base-url'), '/blog/');
  assert.equal(config.getAttribute('bundle-path'), '/blog/pagefind/');
  for (const element of document.querySelectorAll('[href], [src], [poster]')) {
    for (const attr of ['href', 'src', 'poster']) {
      const value = element.getAttribute(attr);
      if (!value?.startsWith('/') || value.startsWith('//')) continue;
      assert(value.startsWith('/blog/'), `Unbased ${value} in ${file}`);
      const target = decodeURIComponent(value.slice('/blog/'.length).split(/[?#]/)[0]);
      assert(fs.existsSync(path.join('dist', target)), `Missing local target ${value} in ${file}`);
      checkedLinks++;
    }
  }
}
const article = doc('posts/screen-to-screen-navigation-understanding-with-ai/index.html');
assert(article.querySelector('#disqus_thread'));
assert(read('posts/screen-to-screen-navigation-understanding-with-ai/index.html').includes('https://itsnikhil.disqus.com/embed.js'));
assert(article.querySelector('[data-preview-comments][hidden]'));
assert(article.querySelector('a[href^="mailto:?subject="]'));
const tocLinks = [...article.querySelectorAll('details nav a[href^="#"]')];
assert(tocLinks.length > 0);
for (const link of tocLinks) assert(article.getElementById(link.hash.slice(1)));
const adaptationCSS = fs.readFileSync('src/styles/adaptation.css', 'utf8');
assert(adaptationCSS.includes('#disqus_thread { color: #383838; background-color: #fafafa; }'));
assert(adaptationCSS.includes('[data-theme="dark"] #disqus_thread a { color: #d480aa; }'));

const archive = doc('posts/index.html');
assert(archive.body.textContent.includes('Page 1 of 2'));
assert.equal(archive.querySelector('link[rel="alternate"]').getAttribute('href'), '/blog/posts/index.xml');
assert.equal(article.querySelector('link[rel="alternate"]').getAttribute('href'), '/blog/index.xml');
const projects = doc('projects/index.html');
assert(projects.body.textContent.includes('Journal Fitbit App'));
assert(projects.body.textContent.includes('total internal reflection'));
for (const img of projects.querySelectorAll('main img[src^="/"]')) assert(img.getAttribute('src').startsWith('/blog/'));
assert.equal(posts.length, 14);
for (const entry of entries) assert(entry.excerpt.length <= 180);
const composer = doc('posts/oai-app-composer/index.html');
assert(composer.querySelector('time[itemprop="dateModified"]'));
assert(composer.querySelector('meta[property="article:modified_time"]'));
assert(composer.body.textContent.includes('still needs network access'));
assert(composer.body.textContent.includes('Accuracy update'));
assert(composer.body.textContent.includes('git clone https://github.com/itsnikhil/oai-app-composer.git'));
assert(composer.body.textContent.includes('normally http://localhost:3000'));
const jwt = read('posts/implementing-silent-refresh-of-jwt/index.html');
assert(jwt.includes('Authorization checks whether'));
assert(jwt.includes('still need CSRF defenses'));
assert(jwt.includes('Security update'));
assert(!read('robots.txt').includes('Disallow: /'));
assert(read('robots.txt').includes('https://itsnikhil.github.io/blog/sitemap.xml'));
assert(read('admin/index.html').includes('https://app.forestry.io/admin/forestry.min.js'));
assert(fs.existsSync('dist/pagefind/pagefind.js'));
const version = JSON.parse(read('migration-version.json'));
assert.equal(version.theme, 'Astro Cactus 8.3.0');
console.log(`PASS: ${files.length} production pages, ${checkedLinks} local asset/navigation/feed links, SEO, search base, Disqus, editor, metadata, and technical corrections.`);
