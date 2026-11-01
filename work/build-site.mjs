import {chromium} from 'playwright';
import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

// Assemble the static site served at https://open-fde.ai.
// The single-page build (outputs/FDE_SPE_Field_Academy.html) is split into one crawlable page per
// section, tab, and chapter, each with its own title, description, canonical URL, breadcrumbs, and
// JSON-LD. Hash links from the old single page keep working through a route map on every page.
const root=new URL('../',import.meta.url);
const site=new URL('site/',root);
const origin='https://open-fde.ai';
const today=new Date().toISOString().slice(0,10);
// A page's "Updated" date, dateModified, and sitemap lastmod change only when its content does.
// The live site publishes /page-dates.json (content hash and date per page); a page whose hash
// matches keeps its published date. The jobs snapshot date is left out of the hash.
const datesUrl=process.env.PAGE_DATES_URL||origin+'/page-dates.json';
const publishedDates=await fetch(datesUrl,{signal:AbortSignal.timeout(15000)}).then(response=>{
 if(response.status===404)return {};
 if(!response.ok)throw Error('HTTP '+response.status);
 return response.json();
}).catch(error=>{
 if(process.env.CI)throw Error('Cannot read published page dates from '+datesUrl+': '+error.message);
 console.warn('Published page dates unavailable ('+error.message+'); every page is dated today.');
 return {};
});
const jobDate=new Date(JSON.parse(readFileSync(new URL('docs/JOBS.json',root),'utf8')).checkedAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
const spa=readFileSync(new URL('outputs/FDE_SPE_Field_Academy.html',root),'utf8');
const indexNowKey=readFileSync(new URL('work/indexnow-key.txt',root),'utf8').trim();

// Pages cut from the single-page build. Chapter pages are added from the book's contents.
const pages=[
 {path:'/',panel:'start',type:'home',title:'FDE Academy: free guide for forward deployed engineers',description:'Learn forward deployed engineering free: a 20-chapter guide, sourced books and podcasts, FDE interview questions, open FDE jobs, and firsthand stories.'},
 {path:'/what-is-a-forward-deployed-engineer/',panel:'what-is-fde',type:'answer',crumb:'What is an FDE?',title:'What is a forward deployed engineer (FDE)? | FDE Academy',description:'A forward deployed engineer works with customers to make a product deliver real outcomes in their systems. What FDEs do, where the role came from, who hires.'},
 {path:'/fde-vs-spe/',panel:'fde-vs-spe',type:'answer',crumb:'FDE vs SPE',title:'FDE vs SPE: forward deployed vs special projects engineer',description:'How a Forward Deployed Engineer differs from a Special Projects Engineer, phase by phase: who owns what, where the work happens, and what to read for each role.'},
 {path:'/learn/',panel:'learn',type:'course',learn:'index',crumb:'Learn',title:'Learn forward deployed engineering: free 20-chapter guide',description:'A free 20-chapter book on forward deployed engineering, from the first customer meeting to the handoff, with reading, tasks, and a test for each chapter.'},
 {path:'/resources/people/',panel:'resources',group:'res-people',type:'collection',crumb:'People',parents:[['Resources','/resources/people/']],h1:'People to follow in forward deployed engineering',title:'People to follow in forward deployed engineering',description:'Practitioners and team builders who publish how forward deployed engineering works, with what to read or watch from each and their X handles.'},
 {path:'/resources/books/',panel:'resources',group:'res-books',type:'collection',crumb:'Books',parents:[['Resources','/resources/people/']],h1:'Books for forward deployed engineers',title:'Books for forward deployed engineers | FDE Academy',description:'Books worth reading for forward deployed engineering, each with why it matters, what to focus on, how to apply it, and its limits.'},
 {path:'/resources/articles/',panel:'resources',group:'res-articles',type:'collection',crumb:'Articles',parents:[['Resources','/resources/people/']],h1:'Articles and guides for forward deployed engineers',title:'Articles and guides for forward deployed engineers',description:'Hand-picked articles, papers, and documentation for forward deployed engineers, grouped by skill area, each with a reading plan and its limits.'},
 {path:'/resources/podcasts/',panel:'resources',group:'res-podcasts',type:'collection',crumb:'Podcasts',parents:[['Resources','/resources/people/']],h1:'Podcasts about forward deployed engineering',title:'Forward deployed engineer podcasts | FDE Academy',description:'Podcast episodes about forward deployed engineering from Lenny’s Podcast, YC Lightcone, Forward Deployed, and more, with what to listen for in each.'},
 {path:'/resources/videos/',panel:'resources',group:'res-videos',type:'collection',crumb:'Videos',parents:[['Resources','/resources/people/']],h1:'Talks and videos on forward deployed engineering',title:'Forward deployed engineering talks and videos',description:'Conference talks and videos on how companies such as Ramp and Cognition run forward deployed engineering, with notes on what each covers.'},
 {path:'/interview/',panel:'interview',group:'questions',type:'collection',crumb:'Interview questions',h1:'Forward deployed engineer interview questions',title:'Forward deployed engineer interview questions',description:'FDE interview questions paraphrased from first-person Palantir FDSE candidate reports, each with its source, a response guide, and likely follow-ups.'},
 {path:'/interview/employer-formats/',panel:'interview',group:'q-employer',type:'collection',crumb:'Employer formats',parents:[['Interview','/interview/']],h1:'FDE interview formats published by employers',title:'FDE interview formats published by employers',description:'Interview formats that employers such as Sierra published themselves, turned into practice questions with a response guide and follow-ups.'},
 {path:'/interview/practice/',panel:'interview',group:'q-practice',type:'collection',crumb:'Practice questions',parents:[['Interview','/interview/']],h1:'FDE practice interview questions from real cases',title:'FDE practice interview questions from real cases',description:'Original FDE practice questions built from documented deployments and architecture, plus one operations scenario. Not reported employer questions.'},
 {path:'/jobs/',panel:'jobs',type:'jobs',crumb:'Jobs',h1:'Forward deployed engineer jobs',title:'Forward deployed engineer jobs by company | FDE Academy',description:'Open forward deployed engineer roles grouped by company from public job boards, each linking to the employer’s own posting. Filter by role and region.'},
 {path:'/stories/',panel:'stories',group:'story-list',type:'collection',crumb:'Stories',h1:'Forward deployed engineer stories',title:'Forward deployed engineer stories | FDE Academy',description:'Firsthand accounts from forward deployed engineers: career changes, life in the field, building FDE teams, and what comes after, with lessons and limits.'},
 {path:'/case-studies/',panel:'stories',group:'cases',type:'collection',crumb:'Case studies',h1:'Forward deployed engineering case studies',title:'Forward deployed engineering case studies',description:'Case studies of customer AI deployments: the problem, the approach, the reported result, and the evidence limit, with discussion questions.'},
 {path:'/about/',panel:'about',type:'about',crumb:'About',title:'About FDE Academy: how the guide is made',description:'How FDE Academy chooses and checks its sources, how the jobs snapshot works, how to send corrections, and what the site does with analytics.'},
];
// Ids that are whole pages. Everything else is reached as page#id.
const pageIds={start:'/',learn:'/learn/','what-is-fde':'/what-is-a-forward-deployed-engineer/','fde-vs-spe':'/fde-vs-spe/',about:'/about/',resources:'/resources/people/','res-people':'/resources/people/','res-books':'/resources/books/','res-articles':'/resources/articles/','res-podcasts':'/resources/podcasts/','res-videos':'/resources/videos/',interview:'/interview/',questions:'/interview/','q-employer':'/interview/employer-formats/','q-practice':'/interview/practice/',jobs:'/jobs/',stories:'/stories/','story-list':'/stories/',cases:'/case-studies/',stats:'/stats/'};

const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
await page.setContent('<!doctype html><title>build</title>');
const built=await page.evaluate(({spa,pages,pageIds,origin,today})=>{
 const parse=()=>new DOMParser().parseFromString(spa,'text/html');
 const source=parse();
 const text=element=>element?element.textContent.replace(/↗/g,'').replace(/\s+/g,' ').trim():'';
 const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const clip=(value,length)=>value.length>length?value.slice(0,length-1).replace(/\s+\S*$/,'')+'…':value;

 // Chapter pages from the book.
 const chapters=[...source.querySelectorAll('#learn .chapter[id^="ch-"]')].map(chapter=>({id:chapter.id,number:Number(chapter.dataset.chapter),title:text(chapter.querySelector('h3')),part:chapter.dataset.part,lead:text(chapter.querySelector('.lead'))}));
 chapters.forEach(chapter=>{chapter.path='/learn/'+slug(chapter.title)+'/';pageIds[chapter.id]=chapter.path;});
 const learnIndex=pages.findIndex(spec=>spec.path==='/learn/');
 pages.splice(learnIndex+1,0,...chapters.map((chapter,index)=>({path:chapter.path,panel:'learn',learn:chapter.id,type:'chapter',chapter,prev:chapters[index-1],next:chapters[index+1],crumb:`Chapter ${chapter.number}`,parents:[['Learn','/learn/']],title:(`${chapter.title} | FDE Academy`.length<=60?`${chapter.title} | FDE Academy`:chapter.title),description:clip(`Chapter ${chapter.number} (${chapter.part}): ${chapter.lead} Reading, tasks, and a done-when test.`,158)})));
 [...source.querySelectorAll('#learn .part')].forEach(part=>{const first=part.nextElementSibling;if(first&&pageIds[first.id])pageIds[part.id]=pageIds[first.id]+'#'+part.id;});
 if(source.getElementById('stats'))pages.push({path:'/stats/',panel:'stats',type:'about',crumb:'Stats',title:'How readers use FDE Academy: live stats',description:'Live, anonymous, aggregated usage of open-fde.ai from Amplitude: most-read chapters, sections, and the companies readers apply to.'});

 // Cut each page from a fresh copy of the single-page build.
 const docs=pages.map(spec=>{
  const doc=parse();
  doc.querySelectorAll('main>.panel').forEach(panel=>{if(panel.id!==spec.panel)panel.remove();});
  const panel=doc.getElementById(spec.panel);
  panel.removeAttribute('hidden');
  if(spec.group){
   panel.querySelectorAll(':scope>.group').forEach(group=>{if(group.id!==spec.group)group.remove();else group.removeAttribute('hidden');});
   panel.querySelectorAll('[role=tab]').forEach(tab=>tab.setAttribute('aria-selected',String(tab.dataset.tab===spec.group)));
  }
  const book=panel.querySelector('.book');
  if(spec.learn==='index'&&book)[...book.children].forEach(child=>{if(child.id!=='preface')child.remove();});
  if(spec.type==='chapter'){
   panel.querySelector('.toc')?.remove();
   panel.querySelector('.section-heading')?.remove();
   const chapter=doc.getElementById(spec.learn);
   const part=chapter.previousElementSibling?.classList.contains('part')?chapter.previousElementSibling:null;
   [...book.children].forEach(child=>{if(child!==chapter&&child!==part)child.remove();});
   const heading=chapter.querySelector('h3');const h1=doc.createElement('h1');h1.innerHTML=heading.innerHTML;heading.replaceWith(h1);
   if(part){const label=part.querySelector('h3');const p=doc.createElement('p');p.className='part-title';p.innerHTML=label.innerHTML;label.replaceWith(p);}
   chapter.querySelectorAll('h4').forEach(h4=>{const h2=doc.createElement('h2');h2.className='chapter-sub';h2.innerHTML=h4.innerHTML;h4.replaceWith(h2);});
   const nav=doc.createElement('nav');nav.className='chapter-nav';nav.setAttribute('aria-label','Chapters');
   const prev=spec.prev?{href:spec.prev.path,label:`Chapter ${spec.prev.number}`,title:spec.prev.title}:{href:'/learn/#preface',label:'Preface',title:'What the job is'};
   nav.innerHTML=`<a class="prev" href="${prev.href}" rel="prev"><span>← ${prev.label}</span><strong>${prev.title}</strong></a>`+(spec.next?`<a class="next" href="${spec.next.path}" rel="next"><span>Chapter ${spec.next.number} →</span><strong>${spec.next.title}</strong></a>`:'');
   chapter.after(nav);
  }else{
   const heading=panel.querySelector('.section-heading h2');
   if(heading){const h1=doc.createElement('h1');h1.setAttribute('tabindex','-1');h1.textContent=spec.h1||heading.textContent;heading.replaceWith(h1);}
  }
  if(spec.type!=='chapter'&&!panel.querySelector('h2')&&panel.querySelector('h3')){
   panel.querySelectorAll('h3,h4').forEach(old=>{const next=doc.createElement('h'+(Number(old.tagName[1])-1));[...old.attributes].forEach(attribute=>next.setAttribute(attribute.name,attribute.value));next.innerHTML=old.innerHTML;old.replaceWith(next);});
  }
  spec.fingerprint=[spec.title,spec.description,panel.innerHTML].join('\n');
  if(spec.type!=='home'){
   const updated=doc.createElement('p');updated.className='updated';updated.innerHTML='Updated <time datetime="__MODIFIED__">__MODIFIED_TEXT__</time>';
   panel.querySelector('h1').after(updated);
   const crumbs=[['Home','/'],...(spec.parents||[]),[spec.crumb,null]];
   const nav=doc.createElement('nav');nav.className='breadcrumbs';nav.setAttribute('aria-label','Breadcrumb');
   nav.innerHTML='<ol>'+crumbs.map(([name,href])=>href?`<li><a href="${href}">${name}</a></li>`:`<li aria-current="page">${name}</li>`).join('')+'</ol>';
   panel.prepend(nav);
   spec.crumbs=crumbs;
  }
  return {spec,doc,panel};
 });

 // Route map: every id in a page's content points to that page.
 const routes={...pageIds};
 docs.forEach(({spec,panel})=>panel.querySelectorAll('[id]').forEach(element=>{if(!(element.id in routes))routes[element.id]=spec.path+'#'+element.id;}));

 const org={'@type':'Organization','@id':origin+'/#org',name:'FDE Academy',url:origin+'/',logo:origin+'/og.png',sameAs:['https://github.com/LouisLu888/open-fde']};
 const breadcrumbLd=crumbs=>({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,href],index)=>({'@type':'ListItem',position:index+1,name,...(href?{item:origin+href}:{})}))});
 const rowLink=(row,path)=>{const external=row.querySelector('h3 a[href^="http"]');return external?external.href:origin+path+'#'+row.id;};
 const schema=(spec,panel,url)=>{
  const graph=[org];
  const page={'@id':url,url,name:spec.title,description:spec.description,inLanguage:'en',isPartOf:{'@id':origin+'/#website'},dateModified:'__MODIFIED__'};
  if(spec.type==='home'){
   graph.push({'@type':'WebSite','@id':origin+'/#website',name:'FDE Academy',url:origin+'/',description:spec.description,publisher:{'@id':origin+'/#org'},inLanguage:'en'});
   graph.push({'@type':'FAQPage',...page,mainEntity:[...panel.querySelectorAll('.faq-item')].map(item=>({'@type':'Question',name:text(item.querySelector('summary')),acceptedAnswer:{'@type':'Answer',text:text(item.querySelector('p'))}}))});
  }else if(spec.type==='answer'||spec.type==='chapter'){
   graph.push({'@type':'Article',...page,headline:text(panel.querySelector('h1')),author:{'@id':origin+'/#org'},publisher:{'@id':origin+'/#org'},datePublished:'2026-10-31',image:origin+'/og/'+spec.path.replace(/^\/|\/$/g,'').replace(/\//g,'-')+'.png',...(spec.type==='chapter'?{isPartOf:{'@type':'Course','@id':origin+'/learn/#course',name:'Learn forward deployed engineering'},position:spec.chapter.number}:{})});
  }else if(spec.type==='course'){
   graph.push({'@type':'Course','@id':origin+'/learn/#course',name:'Learn forward deployed engineering',description:spec.description,url,provider:{'@id':origin+'/#org'},isAccessibleForFree:true,inLanguage:'en',offers:{'@type':'Offer',price:0,priceCurrency:'USD',category:'Free'},hasCourseInstance:{'@type':'CourseInstance',courseMode:'Online',courseWorkload:'PT80H'},hasPart:chapters.map(chapter=>({'@type':'CreativeWork',name:`Chapter ${chapter.number}: ${chapter.title}`,url:origin+chapter.path}))});
  }else if(spec.type==='collection'||spec.type==='jobs'){
   const rows=[...panel.querySelectorAll('.group [data-kind]')].filter(row=>row.id);
   graph.push({'@type':'CollectionPage',...page,mainEntity:{'@type':'ItemList',numberOfItems:rows.length,itemListElement:rows.map((row,index)=>({'@type':'ListItem',position:index+1,name:text(row.querySelector('h3,strong')),url:spec.type==='jobs'?origin+spec.path+'#'+row.id:rowLink(row,spec.path)}))}});
  }else{
   graph.push({'@type':'AboutPage',...page,about:{'@id':origin+'/#org'}});
  }
  if(spec.crumbs)graph.push(breadcrumbLd(spec.crumbs));
  return JSON.stringify({'@context':'https://schema.org','@graph':graph});
 };

 const setMeta=(doc,selector,attribute,value)=>{const element=doc.querySelector(selector);if(element)element.setAttribute(attribute,value);};
 const finish=({spec,doc,panel})=>{
  const url=origin+spec.path;
  doc.title=spec.title;
  setMeta(doc,'meta[name="description"]','content',spec.description);
  setMeta(doc,'link[rel="canonical"]','href',url);
  setMeta(doc,'meta[property="og:url"]','content',url);
  setMeta(doc,'meta[property="og:title"]','content',spec.title);
  setMeta(doc,'meta[property="og:description"]','content',spec.description);
  setMeta(doc,'meta[property="og:type"]','content',spec.type==='chapter'||spec.type==='answer'?'article':'website');
  setMeta(doc,'meta[name="twitter:title"]','content',spec.title);
  setMeta(doc,'meta[name="twitter:description"]','content',spec.description);
  const image=origin+'/og/'+(spec.path==='/'?'home':spec.path.replace(/^\/|\/$/g,'').replace(/\//g,'-'))+'.png';
  setMeta(doc,'meta[property="og:image"]','content',image);setMeta(doc,'meta[name="twitter:image"]','content',image);setMeta(doc,'meta[property="og:image:alt"]','content',spec.title);
  // Links: section and item hashes become page URLs unless the target is on this page.
  doc.querySelectorAll('a[href^="#"]').forEach(link=>{
   const id=link.getAttribute('href').slice(1);
   const inHeader=!!link.closest('.masthead');
   if(!inHeader&&!link.matches('[role=tab]')&&doc.getElementById(id))return;
   if(routes[id])link.setAttribute('href',routes[id]);
   else if(id==='start')link.setAttribute('href','/');
  });
  doc.querySelectorAll('.nav a').forEach(link=>{if(link.getAttribute('href')===pageIds[spec.panel])link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  const routeScript=doc.createElement('script');routeScript.type='application/json';routeScript.id='route-data';routeScript.textContent=JSON.stringify(routes);
  doc.body.prepend(routeScript);
  const ld=doc.createElement('script');ld.type='application/ld+json';ld.textContent=schema(spec,panel,url);
  doc.head.append(ld);
  return '<!doctype html>\n'+doc.documentElement.outerHTML;
 };
 const output=docs.map(entry=>({path:entry.spec.path,html:finish(entry),fingerprint:entry.spec.fingerprint,heading:text(entry.panel.querySelector('h1')),eyebrow:entry.spec.type==='chapter'?`Chapter ${entry.spec.chapter.number} · ${entry.spec.chapter.part}`:(entry.spec.crumbs||[]).slice(1,-1).map(([name])=>name).concat(entry.spec.crumb?[entry.spec.crumb]:[]).join(' · '),image:(entry.spec.path==='/'?'home':entry.spec.path.replace(/^\/|\/$/g,'').replace(/\//g,'-'))+'.png',title:entry.spec.title,description:entry.spec.description,text:(()=>{const clone=entry.panel.cloneNode(true);clone.querySelectorAll('script,style,.tabs,.breadcrumbs,.filterbar,.job-index,svg').forEach(element=>element.remove());clone.querySelectorAll('p,li,h1,h2,h3,h4,tr,dt,dd,summary,article').forEach(element=>element.append('\n'));return clone.textContent.replace(/↗/g,'').replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n\n').trim();})()}));

 // 404: the home shell with a short message.
 const notFound=parse();
 notFound.querySelectorAll('main>.panel').forEach(panel=>panel.remove());
 const lost=notFound.createElement('section');lost.className='panel';lost.id='start';
 lost.innerHTML=`<div class="section-heading"><h1>Page not found</h1><p>This page does not exist. It may have moved when the guide was split into separate pages.</p></div><ul class="readlist">${[['/learn/','Learn: the 20-chapter guide'],['/resources/people/','Resources: people, books, articles, podcasts, videos'],['/interview/','Interview questions'],['/jobs/','Forward deployed engineer jobs'],['/stories/','Stories and case studies'],['/','Home']].map(([href,label])=>`<li><a href="${href}">${label}</a></li>`).join('')}</ul>`;
 notFound.querySelector('main').append(lost);
 notFound.title='Page not found | FDE Academy';
 notFound.querySelector('link[rel="canonical"]')?.remove();
 const robots=notFound.createElement('meta');robots.name='robots';robots.content='noindex';notFound.head.append(robots);
 notFound.querySelectorAll('a[href^="#"]').forEach(link=>{const id=link.getAttribute('href').slice(1);if(routes[id])link.setAttribute('href',routes[id]);else if(id==='start')link.setAttribute('href','/');});

 // Site-wide search index for static pages.
 const index=[...source.querySelectorAll('[data-kind]')].map(element=>{const holder=element.id?element:element.closest('[id]');return {id:element.id||'',kind:element.dataset.kind,panel:element.closest('.panel')?.id||'',title:text(element.querySelector('h3')||element.querySelector('strong')||element),eyebrow:text(element.querySelector('.eyebrow')),text:text(element).toLowerCase().slice(0,3000),url:routes[element.id]||routes[holder?.id]||'/'};});

 return {output,notFound:'<!doctype html>\n'+notFound.documentElement.outerHTML,index,chapters};
},{spa,pages,pageIds,origin,today});
const cards={};
const card=await browser.newPage({viewport:{width:1200,height:630}});
for(const entry of built.output){
 const big=entry.heading.length>48?72:entry.heading.length>30?84:96;
 await card.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500&display=block"><style>*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#1d4a3e;color:#f7f8f3;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}.top{font:500 26px 'Newsreader',Georgia,serif;color:#cfdcd4}.top span{font:400 22px ui-sans-serif,system-ui,sans-serif;color:#a9bfb5;margin-left:14px}h1{font:500 ${big}px/1.04 'Newsreader',Georgia,serif;letter-spacing:-.02em;max-width:1040px}.foot{display:flex;justify-content:space-between;font-size:24px;color:#a9bfb5}.foot b{color:#e9b824;font-weight:600}</style></head><body><div class="top">FDE Academy${entry.eyebrow?`<span>${entry.eyebrow.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`:''}</div><h1>${entry.heading.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</h1><div class="foot"><span>A free field guide for forward deployed engineers</span><b>open-fde.ai</b></div></body></html>`,{waitUntil:'networkidle'});
 await card.evaluate(()=>document.fonts.ready);
 cards[entry.image]=await card.screenshot({type:'png'});
}
await browser.close();

rmSync(site,{recursive:true,force:true});
mkdirSync(site,{recursive:true});
mkdirSync(new URL('og/',site),{recursive:true});
for(const [name,png] of Object.entries(cards))writeFileSync(new URL('og/'+name,site),png);
// Shared CSS and page script are identical on every page; serve them once as cacheable files.
const sharedStyle=built.output[0].html.match(/<style>([\s\S]*?)<\/style>/)[1];
const sharedScript=built.output[0].html.match(/<script>(const cleanPage|const checkTypes|[\s\S]*?function navigate[\s\S]*?)<\/script>/)[1];
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,10);
const cssName=`/assets/site.${hash(sharedStyle)}.css`,jsName=`/assets/site.${hash(sharedScript)}.js`;
mkdirSync(new URL('assets/',site),{recursive:true});
writeFileSync(new URL('.'+cssName,site),sharedStyle);writeFileSync(new URL('.'+jsName,site),sharedScript);
const externalize=html=>{const out=html.replace('<style>'+sharedStyle+'</style>',`<link rel="stylesheet" href="${cssName}">`).replace('<script>'+sharedScript+'</script>',`<script src="${jsName}"></script>`);if(out.includes(sharedScript))throw new Error('Shared script not externalized');return out;};
for(const entry of built.output){
 entry.hash=createHash('sha256').update(entry.fingerprint.replaceAll(jobDate,'')).digest('hex').slice(0,16);
 entry.date=publishedDates[entry.path]?.hash===entry.hash?publishedDates[entry.path].date:today;
 const label=new Date(entry.date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 entry.html=externalize(entry.html).replaceAll('__MODIFIED_TEXT__',label).replaceAll('__MODIFIED__',entry.date);
 if(entry.html.includes('__MODIFIED'))throw new Error('Date placeholder left on '+entry.path);
}
built.notFound=built.notFound.replace('<style>'+sharedStyle+'</style>',`<link rel="stylesheet" href="${cssName}">`).replace('<script>'+sharedScript+'</script>',`<script src="${jsName}"></script>`);
for(const {path,html} of built.output){
 const dir=new URL('.'+path,site);
 mkdirSync(dir,{recursive:true});
 writeFileSync(new URL('index.html',dir),html);
}
writeFileSync(new URL('404.html',site),built.notFound);
writeFileSync(new URL('search-index.json',site),JSON.stringify(built.index));
copyFileSync(new URL('outputs/og.png',root),new URL('og.png',site));
writeFileSync(new URL(`${indexNowKey}.txt`,site),indexNowKey);
writeFileSync(new URL('_redirects',site),'/FDE_SPE_Field_Academy.html / 301\n');

const aiAgents=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-User','Claude-SearchBot','PerplexityBot','Perplexity-User','Google-Extended','Applebot-Extended','CCBot','Bingbot','DuckAssistBot'];
writeFileSync(new URL('robots.txt',site),'# Search engines and AI assistants are welcome to read and cite this guide.\nUser-agent: *\nAllow: /\n\n'+aiAgents.map(agent=>`User-agent: ${agent}\nAllow: /`).join('\n\n')+`\n\nSitemap: ${origin}/sitemap.xml\n`);
writeFileSync(new URL('page-dates.json',site),JSON.stringify(Object.fromEntries(built.output.map(({path,hash,date})=>[path,{hash,date}])),null,1)+'\n');
writeFileSync(new URL('sitemap.xml',site),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+built.output.map(({path,date})=>`<url><loc>${origin}${path}</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>\n');

const byPath=Object.fromEntries(built.output.map(entry=>[entry.path,entry]));
const line=path=>`- [${byPath[path].title.replace(/ \| FDE Academy$/,'')}](${origin}${path}): ${byPath[path].description}`;
const llms=`# FDE Academy

> A free, open-source field guide for forward deployed engineers (FDEs): a 20-chapter learning path from the first customer meeting to the handoff, curated and sourced resources, interview questions with provenance, a dated snapshot of open FDE jobs, and firsthand stories. Independent; every resource links to its original publication.

## Start here
${['/what-is-a-forward-deployed-engineer/','/fde-vs-spe/','/about/'].map(line).join('\n')}

## Learn
${line('/learn/')}
${built.chapters.map(chapter=>`- [Chapter ${chapter.number}: ${chapter.title}](${origin}${chapter.path}): ${chapter.part}. ${chapter.lead}`).join('\n')}

## Resources
${['/resources/people/','/resources/books/','/resources/articles/','/resources/podcasts/','/resources/videos/'].map(line).join('\n')}

## Interview and jobs
${['/interview/','/interview/employer-formats/','/interview/practice/','/jobs/'].map(line).join('\n')}

## Stories and case studies
${['/stories/','/case-studies/'].map(line).join('\n')}

## Optional
- [Full text of every page](${origin}/llms-full.txt)
- [Source code](https://github.com/LouisLu888/open-fde)
`;
writeFileSync(new URL('llms.txt',site),llms);
writeFileSync(new URL('llms-full.txt',site),`# FDE Academy: full text\n\nGenerated ${today} from ${origin}. Each page below starts with its URL.\n\n`+built.output.map(({path,title,text})=>`---\n\n# ${title}\nURL: ${origin}${path}\n\n${text}\n`).join('\n'));
console.log(`Site assembled in site/: ${built.output.length} pages (${built.output.filter(entry=>entry.date===today).length} dated today), ${built.index.length} search entries.`);
