import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {decodeHTML} from 'entities';
import {parse as parseToml} from 'smol-toml';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
export const base = '/blog';
export const site = 'https://itsnikhil.github.io';
export const description = 'I am a programmer interested in all sorts of technology. I like working on open source projects, writing blog articles, and reading on the internet. I also like swimming, biking and playing games. I study at The Northcap University.';
export const esc = (s='') => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slug = s => String(s).toLowerCase().replace(/\s+/g,'-').replace(/[^\p{L}\p{N}\-_.~]/gu,'');
export const topicLabel = name => ({javascript:'JavaScript',python:'Python',discord:'Discord',performance:'Performance',algorithm:'Algorithm',code:'Code',technology:'Technology'}[name.trim().toLowerCase()]||name.trim());
export const url = p => `${base}/${p.replace(/^\/+|\/+$/g,'')}${p && !p.endsWith('.xml') ? '/' : ''}`;
const markdown = new Marked(markedHighlight({langPrefix:'hljs language-',highlight(code, lang){return hljs.highlight(code,{language:hljs.getLanguage(lang)?lang:'plaintext'}).value;}}));
let headingCounts=new Map();
markdown.use({renderer:{heading({tokens,depth}){const text=this.parser.parseInline(tokens);const clean=text.replace(/<[^>]*>/g,'').replace(/&#(?:39|x27);|&apos;/g,"'").replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');const key=clean.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s/g,'-');const count=headingCounts.get(key)||0;headingCounts.set(key,count+1);return `<h${depth} id="${key}${count?'-'+count:''}">${text}</h${depth}>\n`;}}});
function carousel(attrs, body) {
 const opts=Object.fromEntries([...attrs.matchAll(/(\w+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
 const slides=body.split('\n').map(l=>l.split('|').map(s=>s.trim())).filter(p=>p.length===2);
 return `<div class="step-carousel" tabindex="0" role="region" aria-label="Image carousel" aria-roledescription="carousel" id="${esc(opts.id||'carousel')}" data-autoplay="${esc(opts.autoplay||'false')}" data-interval="${esc(opts.interval||'5000')}"><div class="carousel-container" style="height:${esc(opts.height||'400px')}"><div class="carousel-slides">${slides.map(([src,caption],i)=>`<div class="carousel-slide ${i===0?'active':''}" data-slide="${i}" role="group" aria-roledescription="slide" aria-label="${i+1} of ${slides.length}" aria-hidden="${i!==0}"><img src="${esc(src)}" alt="${esc(plainText(markdown.parseInline(caption)))}" loading="lazy"><div class="carousel-caption"><p>${markdown.parseInline(caption)}</p></div></div>`).join('')}</div><button class="carousel-nav prev" aria-label="Previous slide">&#10094;</button><button class="carousel-nav next" aria-label="Next slide">&#10095;</button></div><div class="carousel-indicators">${slides.map((_,i)=>`<button class="indicator ${i===0?'active':''}" data-slide="${i}" aria-label="Go to slide ${i+1}"></button>`).join('')}</div><p class="sr-only carousel-status" role="status" aria-live="polite" aria-atomic="true"></p><button class="carousel-pause" type="button" hidden>Pause slides</button><div class="carousel-counter" aria-hidden="true"><span class="current-slide">1</span> / <span class="total-slides">${slides.length}</span></div></div>`;
}
function render(body) {
 headingCounts=new Map();
 const html=markdown.parse(body.replace(/{{<\s*rawhtml\s*>}}([\s\S]*?){{<\s*\/rawhtml\s*>}}/g,'$1').replace(/{{<\s*step-carousel([^>]*?)>}}([\s\S]*?){{<\s*\/step-carousel\s*>}}/g,(_,attrs,inner)=>carousel(attrs,inner)));
 return html.replace(/(src|href)="\/(?!\/|blog(?:\/|"))([^"#]*)"/g,(_,attr,p)=>`${attr}="${base}/${p}"`);
}
export const plainText = text => decodeHTML(String(text).replace(/<(script|style|pre)[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').replace(/\s+([,.;:!?])/g,'$1').trim();
const summarize = text => {const plain=plainText(text);return plain.length<=180?plain:plain.slice(0,177).replace(/\s+\S*$/,'')+'…';};
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
export const entries=walk('content').filter(f=>f.endsWith('.md')).map(file=>{
 const {data,content}=matter(fs.readFileSync(file,'utf8'), fs.readFileSync(file,'utf8').startsWith('+++') ? {delimiters:'+++',language:'toml',engines:{toml:parseToml}} : {}); const rel=file.replace(/^content\//,'').replace(/\.md$/,'').replace(/\/index$/,'');
 const route=data.url?data.url.replace(/^\/|\/$/g,''):rel.split('/').map(slug).join('/');
 const date=data.date?new Date(data.date):null;
 const html=render(content);
 const cleanDescription=data.description?plainText(markdown.parseInline(data.description)):undefined;
 return {...data,file,route,title:data.title||'Untitled',date:date&&!isNaN(date)?date:null,tags:data.tags||[],categories:data.categories||[],html,description:cleanDescription,summary:summarize(html),excerpt:summarize(cleanDescription||html)};
}).filter(p=>!p.draft).sort((a,b)=>(b.date?.getTime()||0)-(a.date?.getTime()||0));
export const posts=entries.filter(p=>p.route.startsWith('posts/'));
export const projects=entries.filter(p=>p.route.startsWith('projects/'));
export const taxonomies=Object.fromEntries(['tags','categories'].map(type=>{
 const groups=new Map();
 for(const entry of entries) for(const name of entry[type]) {const key=slug(name);if(!groups.has(key))groups.set(key,{name,slug:key,entries:[]});if(!groups.get(key).entries.includes(entry))groups.get(key).entries.push(entry);}
 return [type,[...groups.values()].sort((a,b)=>a.name.localeCompare(b.name))];
}));
export const featured=JSON.parse(fs.readFileSync('data/projects.json','utf8')).list;
