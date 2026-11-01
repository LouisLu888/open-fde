// Crawls every URL in the live sitemap as a phone and records SEO signals (Amplitude requests are blocked so the crawl adds no analytics data).
import {chromium} from 'playwright';
import {writeFileSync} from 'node:fs';
const sitemap=await (await fetch('https://open-fde.ai/sitemap.xml')).text();
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true});
const out=[];
for(const url of urls){
 const p=await ctx.newPage();await p.route(/amplitude\.com/,r=>r.abort());const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__lcp=0;window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});});
 const res=await p.goto(url,{waitUntil:'networkidle'});const html=await res.text();
 await p.waitForTimeout(800);
 const d=await p.evaluate(()=>{const main=document.querySelector('main');const text=(main?.innerText||'').trim();const heads=[...document.querySelectorAll('h1,h2,h3,h4')].filter(h=>h.offsetParent!==null||h.closest('details')).map(h=>+h.tagName[1]);let skips=0;for(let i=1;i<heads.length;i++)if(heads[i]>heads[i-1]+1)skips++;
  const ld=[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{try{return JSON.parse(s.textContent)['@graph'].map(g=>g['@type'])}catch{return ['INVALID']}});
  const links=[...document.querySelectorAll('a[href]')];const imgs=[...document.querySelectorAll('img')];
  return {title:document.title,desc:document.querySelector('meta[name=description]')?.content||'',h1:[...document.querySelectorAll('h1')].map(h=>h.innerText.trim()),headingSkips:skips,words:text.split(/\s+/).filter(Boolean).length,internal:links.filter(a=>a.host===location.host).length,external:links.filter(a=>a.host&&a.host!==location.host).length,imgs:imgs.length,imgNoAlt:imgs.filter(i=>!i.alt).length,ld,lang:document.documentElement.lang,ogImage:document.querySelector('meta[property="og:image"]')?.content,lcp:Math.round(window.__lcp),cls:+window.__cls.toFixed(3),tapSmall:[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<24&&getComputedStyle(e).display!=='inline'}).length,overflow:document.documentElement.scrollWidth>innerWidth,robots:document.querySelector('meta[name=robots]')?.content||''};});
 out.push({url,status:res.status(),bytes:Buffer.byteLength(html),errors,...d});
 await p.close();
}
await b.close();
writeFileSync('open-fde.ai-audit/crawl.json',JSON.stringify(out,null,1));
for(const r of out)console.log([r.status,(r.bytes/1024).toFixed(0)+'KB','w'+r.words,'t'+r.title.length,'d'+r.desc.length,'h1:'+r.h1.length,'skip'+r.headingSkips,'lcp'+r.lcp,'cls'+r.cls,'int'+r.internal,'ext'+r.external,r.errors.length?'ERR':'',r.overflow?'OVERFLOW':'',r.url.replace('https://open-fde.ai','')].join(' '));
