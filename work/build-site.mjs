import {copyFileSync, mkdirSync, writeFileSync} from 'node:fs';

// Assemble the static site served at https://open-fde.ai from the generated HTML.
const root=new URL('../',import.meta.url);
const site=new URL('site/',root);
const page=new URL('outputs/FDE_SPE_Field_Academy.html',root);
mkdirSync(site,{recursive:true});
copyFileSync(page,new URL('index.html',site));
copyFileSync(page,new URL('FDE_SPE_Field_Academy.html',site));
copyFileSync(new URL('outputs/og.png',root),new URL('og.png',site));
writeFileSync(new URL('robots.txt',site),'User-agent: *\nAllow: /\nSitemap: https://open-fde.ai/sitemap.xml\n');
writeFileSync(new URL('sitemap.xml',site),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://open-fde.ai/</loc></url></urlset>\n');
console.log('Site assembled in site/');
