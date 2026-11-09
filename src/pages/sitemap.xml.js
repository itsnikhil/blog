import {routes} from '../lib/routes.js';
import {site,url,esc} from '../lib/content.js';
export function GET(){return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['',...routes.filter(r=>r.redirect===undefined&&!r.route.includes('/page/')).map(r=>r.route)].map(p=>`<url><loc>${esc(site+url(p))}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});}
