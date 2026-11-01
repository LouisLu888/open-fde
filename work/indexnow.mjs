import {readFileSync} from 'node:fs';

// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver; Bing feeds Copilot and ChatGPT search)
// that every URL in the built sitemap changed. Run after `npm run deploy`.
const key=readFileSync(new URL('indexnow-key.txt',import.meta.url),'utf8').trim();
const sitemap=readFileSync(new URL('../site/sitemap.xml',import.meta.url),'utf8');
const urlList=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json; charset=utf-8'},body:JSON.stringify({host:'open-fde.ai',key,keyLocation:`https://open-fde.ai/${key}.txt`,urlList})});
console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);
if(!response.ok&&response.status!==202)process.exit(1);
