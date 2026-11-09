/** Design-neutral content migration audit. Usage: node cactus-audit.mjs [target dist] */
import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve('.');
const dist=path.resolve(process.argv[2]||'dist');
const errors=[]; const warnings=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg)};
const read=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):'';
const routes=JSON.parse(read(`${source}/tests/hugo-routes.json`));
for(const route of routes)check(fs.existsSync(path.join(dist,route)),`Missing legacy route ${route}`);
check(!fs.existsSync(`${dist}/resume/index.html`),'Draft résumé was published');
const anchors=JSON.parse(read(`${source}/tests/hugo-anchors.json`));
for(const [route,ids] of Object.entries(anchors)) {
 const html=read(path.join(dist,route));
 const found=new Set([...html.matchAll(/\bid\s*=\s*["']([^"']*)["']/g)].map(m=>m[1]));
 for(const id of ids)check(found.has(id),`Missing anchor ${route}#${id}`);
}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const staticFiles=walk(`${source}/public`);
for(const file of staticFiles){const rel=path.relative(`${source}/public`,file); check(fs.existsSync(path.join(dist,rel)),`Missing static file ${rel}`);}
const articles=routes.filter(p=>/^(posts|projects)\/[^/]+\/index\.html$/.test(p));
check(articles.length===21,'Source article route count changed');
for(const route of [...articles,'form-auto-submitter/privacy/index.html']) {
 const html=read(path.join(dist,route));
 check(!html.includes('{{<'),`Unconverted Hugo shortcode ${route}`);
 check(/<h1\b/.test(html),`No main heading ${route}`);
 for(const match of html.matchAll(/\b(?:src|poster)=["'](\/[^"'#?]+)["']/g)){
  const url=match[1];if(url.startsWith('//'))continue;
  const rel=decodeURIComponent(url.replace(/^\/blog\//,'/'));
  check(fs.existsSync(path.join(dist,rel)),`Missing local media ${url} in ${route}`);
 }
}
const checks={
 'posts/oai-app-composer/index.html':['Accuracy update','still needs network access','git clone https://github.com/itsnikhil/oai-app-composer.git','normally http://localhost:3000'],
 'posts/implementing-silent-refresh-of-jwt/index.html':['Security update','Authorization checks whether','still need CSRF defenses'],
 'projects/journal/index.html':['Journal'],
 'projects/aquarex/index.html':['total internal reflection'],
 'posts/screen-to-screen-navigation-understanding-with-ai/index.html':['id="app-navigation"']
};
for(const [route,phrases] of Object.entries(checks)){
 const html=read(path.join(dist,route));
 const text=html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
 for(const phrase of phrases)check(html.includes(phrase)||text.includes(phrase),`Missing preserved content '${phrase}' in ${route}`);
}
for(const route of articles){
 const html=read(path.join(dist,route));
 if(!html.includes('rel="canonical"'))warnings.push(`No canonical ${route}`);
}
console.log(JSON.stringify({dist,legacyRoutes:routes.length,publishedEntries:22,historicalAnchors:Object.values(anchors).flat().length,sourceStaticFiles:staticFiles.length,errors,warnings},null,2));
if(errors.length)process.exitCode=1;
