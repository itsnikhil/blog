import fs from 'node:fs';
import assert from 'node:assert/strict';
import {entries,posts,taxonomies} from '../src/lib/content.js';
const paths=JSON.parse(fs.readFileSync('tests/hugo-routes.json','utf8'));
const missing=paths.filter(p=>!fs.existsSync(`dist/${p}`));
assert.deepEqual(missing,[],`Missing Hugo routes: ${missing.join(', ')}`);
assert.equal(entries.length,22,'All published content is retained');
assert.equal(posts.length,14,'All blog posts are retained');
assert(!fs.existsSync('dist/resume/index.html'),'Draft résumé must not be published');
for(const entry of entries){
 assert.notEqual(entry.title,'Untitled',`Frontmatter missing in ${entry.file}`);
 const html=fs.readFileSync(`dist/${entry.route}/index.html`,'utf8');
 assert(!html.includes('{{<'),`Unconverted shortcode in ${entry.route}`);
 assert(html.includes(`https://itsnikhil.github.io/blog/${entry.route}/`),`Canonical missing in ${entry.route}`);
 assert(!/\b(?:src|href)="\/(?:js|lib|img|css)\//.test(html),`Asset missing /blog base in ${entry.route}`);
}
assert(taxonomies.tags.some(t=>t.slug==='code-readability-'),'Preserve historical trailing-hyphen slug');
const carousel=fs.readFileSync('dist/posts/screen-to-screen-navigation-understanding-with-ai/index.html','utf8');
assert(carousel.includes('id="app-navigation"'));
assert(carousel.includes('class="carousel-slide active"'));
const js=fs.readFileSync('dist/js/carousel.js','utf8');
assert(!js.includes('{{'),'Carousel has no unresolved Hugo template');
new Function(js);
console.log(`PASS: ${paths.length} legacy HTML/XML routes, ${entries.length} published entries, drafts, canonical URLs, base paths and carousel syntax.`);
const anchors=JSON.parse(fs.readFileSync('tests/hugo-anchors.json','utf8'));
for(const [path,ids] of Object.entries(anchors)){
 const html=fs.readFileSync(`dist/${path}`,'utf8');
 for(const id of ids)assert(html.includes(`id="${id}"`),`Missing historical fragment ${path}#${id}`);
}
for(const [type,terms] of Object.entries(taxonomies)){
 const feed=fs.readFileSync(`dist/${type}/index.xml`,'utf8');
 assert.equal((feed.match(/<item>/g)||[]).length,terms.length,`${type} overview feed contains terms`);
 assert(feed.includes(`<link>https://itsnikhil.github.io/blog/${type}/</link>`));
}
console.log('PASS: historical heading anchors and taxonomy RSS semantics.');
