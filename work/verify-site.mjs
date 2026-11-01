import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {extname} from 'node:path';
import assert from 'node:assert/strict';

// Serves site/ like Cloudflare (trailing-slash directories, 404.html with status 404) and checks
// every generated page: one h1, unique titles and descriptions, valid JSON-LD, canonical URL,
// working internal links, tabs as links, site-wide search, and old hash links forwarding.
const site=new URL('../site/',import.meta.url);
const types={'.html':'text/html; charset=utf-8','.json':'application/json','.txt':'text/plain','.xml':'application/xml','.png':'image/png'};
const server=createServer((request,response)=>{
 const path=decodeURIComponent(new URL(request.url,'http://x').pathname);
 let file=new URL('.'+path,site);
 if(path.endsWith('/'))file=new URL('index.html',file);
 else if(existsSync(file)&&statSync(file).isDirectory()){response.writeHead(307,{location:path+'/'});return response.end();}
 if(!existsSync(file)){response.writeHead(404,{'content-type':types['.html']});return response.end(readFileSync(new URL('404.html',site)));}
 response.writeHead(200,{'content-type':types[extname(file.pathname)]||'application/octet-stream'});
 response.end(readFileSync(file));
}).listen(0);
const base=`http://localhost:${server.address().port}`;
const sitemap=readFileSync(new URL('sitemap.xml',site),'utf8');
const paths=[...sitemap.matchAll(/<loc>https:\/\/open-fde\.ai([^<]*)<\/loc>/g)].map(match=>match[1]);
assert(paths.length>=34,'Sitemap lists every page: '+paths.length);

const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',error=>errors.push(page.url()+' '+error.message));
await page.route(/^https:\/\/(?!open-fde\.ai)/,route=>route.fulfill({status:204,body:''}));
const titles=new Set(),descriptions=new Set(),internal=new Set();
for(const path of paths){
 const response=await page.goto(base+path);
 assert.equal(response.status(),200,path);
 assert.equal(await page.locator('h1').count(),1,'One h1 on '+path);
 const title=await page.title();const description=await page.locator('meta[name="description"]').getAttribute('content');
 assert(!titles.has(title),'Duplicate title '+title);titles.add(title);
 assert(!descriptions.has(description),'Duplicate description on '+path);descriptions.add(description);
 assert(description.length>=70&&description.length<=170,'Description length '+description.length+' on '+path);
 assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://open-fde.ai'+path);
 for(const block of await page.locator('script[type="application/ld+json"]').allTextContents()){const data=JSON.parse(block);assert(data['@graph'].length>=2,'JSON-LD graph on '+path);}
 assert.equal(await page.locator('main>.panel').count(),1,'One section per page on '+path);
 assert(title.length<=60,'Title over 60 characters on '+path+': '+title);
 const levels=await page.locator('main h1, main h2, main h3, main h4').evaluateAll(headings=>headings.map(heading=>Number(heading.tagName[1])));
 assert(levels.every((level,index)=>index===0||level<=levels[index-1]+1),'Heading level skipped on '+path+': '+levels.join(','));
 const image=new URL(await page.locator('meta[property="og:image"]').getAttribute('content')).pathname;
 assert.equal((await page.request.get(base+image)).status(),200,'Social image '+image);
 for(const href of await page.locator('main a[href^="/"], .masthead a[href^="/"]').evaluateAll(links=>links.map(link=>link.getAttribute('href'))))internal.add(href.split('#')[0]);
}
for(const href of internal){const response=await page.request.get(base+href);assert.equal(response.status(),200,'Internal link '+href);}
const missing=await page.request.get(base+'/no-such-page/');
assert.equal(missing.status(),404,'Unknown paths return 404');

// Tabs are links between pages.
await page.goto(base+'/resources/people/');
await page.locator('[role=tab]',{hasText:'Podcasts'}).click();
await page.waitForURL(base+'/resources/podcasts/');
assert.equal(await page.locator('[role=tab][aria-selected=true]').textContent(),'Podcasts');
// Chapter navigation.
await page.goto(base+'/learn/');
await page.locator('.toc a',{hasText:'Build a thin vertical slice'}).click();
await page.waitForURL(base+'/learn/build-a-thin-vertical-slice/');
assert.equal(await page.locator('.nav a[aria-current=page]').textContent(),'Learn');
await page.locator('.chapter-nav .next').click();
await page.waitForURL(base+'/learn/evaluate-before-expanding/');
// Old hash links forward to the new pages.
for(const [hash,target] of [['#learn','/learn/'],['#ch-5','/learn/build-a-thin-vertical-slice/'],['#jobs','/jobs/'],['#res-podcasts','/resources/podcasts/'],['#roadmap','/learn/'],['#week-2','/learn/discover-the-real-problem/']]){
 await page.goto(base+'/'+hash);
 await page.waitForURL(url=>url.pathname===target,{timeout:5000});
}
// Site-wide search finds and opens items on other pages.
await page.goto(base+'/about/');
await page.locator('#globalSearch').focus();
await page.locator('#globalSearch').fill('permission revocation');
await page.locator('#globalResults a').first().waitFor();
assert.match(await page.locator('#global-hit-0').textContent(),/Permission revocation/);
await page.keyboard.press('Enter');
await page.waitForURL(url=>url.pathname==='/learn/permission-revocation-is-a-data-consistency-problem/');
assert.equal(errors.length,0,errors.join('\n'));
await browser.close();server.close();
const llms=readFileSync(new URL('llms.txt',site),'utf8');
assert(llms.includes('/learn/build-a-thin-vertical-slice/')&&llms.includes('## Interview and jobs'));
assert(readFileSync(new URL('robots.txt',site),'utf8').includes('User-agent: GPTBot'));
console.log(JSON.stringify({site:'ok',pages:paths.length,internalLinks:internal.size},null,1));
