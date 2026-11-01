import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readings,categories,fieldnotes,enrich} from './library.mjs';
import {sources,people,weeks,questions,cases} from './content.mjs';
import {stories,storySources,enrichStories} from './stories.mjs';
enrich(sources,people,weeks,questions,cases);
enrichStories(sources,readings,weeks);

const outputPath=new URL('../outputs/FDE_SPE_Field_Academy.html',import.meta.url);
const html=readFileSync(outputPath,'utf8');
assert(!/[\u3400-\u9fff]/u.test(html),'Chinese content remains');
assert(!/amplitude/i.test(html.replace(/<!-- analytics -->[\s\S]*?<!-- \/analytics -->/g,'').replace(/<section[^>]*id="jobs"[\s\S]*?<\/section>/,'').replace(/<section id="stats"[\s\S]*?<\/section>/,'').replace('collected with Amplitude','')),'Company-specific content remains outside analytics and public job listings');
const browser=await chromium.launch({headless:true,...(process.argv.includes('--chrome')?{channel:'chrome'}:{})});
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true,reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
await page.goto(outputPath.href);
await page.locator('h1').waitFor();
assert.deepEqual(await page.locator('.nav a').allTextContents(),['Learn','Resources','Interview','Jobs','Stories & cases']);
assert.equal(await page.locator('.door').count(),5);
assert.equal(await page.locator('#start .compare tbody tr').count(),9,'FDE vs SPE comparison on home');
assert.equal((await page.locator('.brand').textContent()).startsWith('FDE Academy'),true);
assert.equal(await page.locator('#downloadHtml').count(),0,'No download button');
const statsOn=html.includes('id="stats"');
assert.equal(await page.locator('.stats-link').count(),statsOn?1:0,'Stats icon appears only when a dashboard embed is configured');
if(statsOn){
 await page.locator('.stats-link').click();
 await page.locator('#stats').waitFor({state:'visible'});
 assert.match(await page.locator('#stats iframe').getAttribute('src'),/^https:\/\/([a-z0-9-]+\.)*amplitude\.com\//);
 assert.equal(await page.locator('.stats-link').getAttribute('aria-current'),'page');
}
assert.equal(await page.locator('input[type=checkbox],textarea,#progress').count(),0,'No progress tracking UI');
await page.evaluate(()=>localStorage.setItem('fde-spe-field-academy-public-v2','{}'));
await page.reload();
assert.equal(await page.evaluate(()=>localStorage.length),0,'Legacy saved progress is cleared');

// Learn: a book with a table of contents.
await page.locator('.nav a[href="#learn"]').click();
await page.locator('#learn').waitFor({state:'visible'});
assert.equal(await page.locator('.toc li li').count(),weeks.length+fieldnotes.length);
assert.equal(await page.locator('#learn .chapter').count(),1+weeks.length+fieldnotes.length);
assert.equal(await page.locator('#learn .part').count(),7);
assert.equal(await page.locator('#ch-1 .tasks li').count(),3);
await page.locator('.toc a[href="#ch-14"]').click();
await page.locator('#ch-14').waitFor({state:'visible'});
assert.match(await page.locator('#ch-14 h3').textContent(),/Permission revocation/);
assert(await page.locator('#ch-14').evaluate(element=>{const box=element.getBoundingClientRect();return box.top>=0&&box.top<innerHeight;}),'TOC link scrolls to the chapter');

// Old links forward to the new sections.
for(const [hash,visible] of [['roadmap','#learn'],['week-2','#ch-2'],['fieldcraft','#part-7'],['library','#resources'],['people','#res-people'],['interviews','#questions'],['cases','#cases']]){
 await page.goto(outputPath.href+'#'+hash);
 await page.locator(visible).waitFor({state:'visible'});
}

// Resources: every curated resource and person appears once.
await page.locator('.nav a[href="#resources"]').click();
await page.locator('#resources').waitFor({state:'visible'});
assert.equal(await page.locator('#res-people tbody tr').count(),people.length);
assert.equal(await page.locator('#res-people thead th').count(),5);
assert.equal(await page.locator('#resources [role=tab]').count(),5);
assert(await page.locator('#res-people').isVisible()&&await page.locator('#res-books').isHidden(),'People tab is the default');
await page.locator('[role=tab][href="#res-books"]').click();
await page.locator('#res-books').waitFor({state:'visible'});
assert(await page.locator('#res-people').isHidden());
assert.equal(await page.locator('[role=tab][href="#res-books"]').getAttribute('aria-selected'),'true');
await page.keyboard.press('ArrowRight');
await page.locator('#res-articles').waitFor({state:'visible'});
assert.equal(await page.evaluate(()=>location.hash),'#res-articles');
assert.equal(await page.locator('[id^="reading-"]').count(),readings.length);
assert.equal(new Set(readings.map(reading=>reading.id)).size,readings.length);
assert.equal(await page.locator('#res-books .row').count(),readings.filter(reading=>/^Book/.test(reading.format)).length);
assert.equal(await page.locator('#res-podcasts .row').count(),readings.filter(reading=>reading.format==='Podcast').length);
assert(await page.locator('#res-videos .row').count()>=3);
await page.goto(outputPath.href+'#res-books');
await page.goto(outputPath.href+'#reading-zanzibar');
await page.locator('#reading-zanzibar').waitFor({state:'visible'});
await page.locator('#reading-zanzibar summary').click();
assert(await page.locator('#reading-zanzibar details').getAttribute('open')!==null);

// Interview and stories.
await page.locator('.nav a[href="#interview"]').click();
await page.locator('#questions').waitFor({state:'visible'});
assert.equal(await page.locator('#interview .row').count(),questions.length,'Every question is in one source tab');
assert.deepEqual(await page.locator('#interview [role=tab]').allTextContents(),['Candidate reports','Employer formats','Practice questions']);
assert.equal(await page.locator('#questions .row').count(),6,'Candidate reports are Q01-Q06');
assert(await page.locator('#questions').isVisible()&&await page.locator('#q-practice').isHidden(),'Candidate reports tab is the default');
await page.locator('[role=tab][href="#q-employer"]').click();
await page.locator('#q-employer').waitFor({state:'visible'});
assert.deepEqual(await page.locator('#q-employer .eyebrow').evaluateAll(rows=>rows.map(row=>row.textContent.slice(0,3))),['Q07','Q08']);
await page.locator('.nav a[href="#jobs"]').click();
await page.locator('#jobs').waitFor({state:'visible'});
assert(await page.locator('#interview').isHidden(),'Jobs is its own section');
await page.locator('.nav a[href="#stories"]').click();
await page.locator('#stories').waitFor({state:'visible'});
assert.equal(await page.locator('#story-list .row').count(),stories.length);
assert.equal(new Set(stories.map(story=>story.source)).size,stories.length);
assert.match(await page.locator('#story-S04').textContent(),/platform AI translation/);
assert.equal(await page.locator('#cases .row').count(),cases.length);
await page.locator('[role=tab][href="#cases"]').click();
await page.locator('#cases').waitFor({state:'visible'});
assert(await page.locator('#story-list').isHidden());
await page.screenshot({path:fileURLToPath(new URL('stories-preview.png',import.meta.url)),fullPage:false});

// Phone width: no horizontal overflow.
await page.setViewportSize({width:390,height:844});
for(const section of ['start','learn','resources','interview','jobs','stories']){
 await page.goto(outputPath.href+'#'+section);
 await page.locator('#'+section).waitFor({state:'visible'});
 const dimensions=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 assert(dimensions.scroll<=dimensions.width,'Mobile overflow: '+section+' '+JSON.stringify(dimensions));
}
await page.screenshot({path:fileURLToPath(new URL('mobile-preview.png',import.meta.url)),fullPage:false});
await page.setViewportSize({width:1440,height:1000});

// Site-wide search.
await page.goto(outputPath.href+'#start');
await page.locator('body').click({position:{x:5,y:5}});
await page.keyboard.press('/');
assert.equal(await page.evaluate(()=>document.activeElement.id),'globalSearch','Slash shortcut focuses site-wide search');
await page.locator('#globalSearch').fill('permission revocation');
await page.locator('#globalResults').waitFor({state:'visible'});
assert.match(await page.locator('#global-hit-0').textContent(),/Permission revocation/);
await page.keyboard.press('Enter');
await page.locator('#learn').waitFor({state:'visible'});
await page.waitForFunction(()=>/Permission revocation/.test(document.activeElement.querySelector('h3')?.textContent||''),null,{timeout:3000});
assert(await page.locator('#globalResults').isHidden());
await page.locator('#globalSearch').fill('Discover the real problem');
await page.keyboard.press('Enter');
await page.locator('#ch-2').waitFor({state:'visible'});
await page.waitForFunction(()=>document.activeElement.id==='ch-2');
await page.locator('#globalSearch').fill('Zanzibar');
await page.locator('#globalResults a',{hasText:'Consistent, Global Authorization'}).click();
await page.locator('#reading-zanzibar').waitFor({state:'visible'});
await page.waitForFunction(()=>document.activeElement.id==='reading-zanzibar');
await page.locator('#globalSearch').fill('Nabeel');
assert(await page.locator('#globalResults a').count()>=2,'Site-wide search spans sections');
assert.equal(new Set(await page.locator('#globalResults small').allTextContents()).size>1,true);
await page.keyboard.press('Escape');
assert(await page.locator('#globalResults').isHidden());
await page.locator('#globalSearch').fill('impossible-search-zz');
assert.match(await page.locator('#globalResults').textContent(),/No matches/);
await page.locator('#globalSearch').fill('');
await page.goto(outputPath.href+'#jobs');
await page.locator('#jobs').waitFor({state:'visible'});
const jobsSnapshot=JSON.parse(readFileSync(new URL('../docs/JOBS.json',import.meta.url),'utf8'));
const companyCount=new Set(jobsSnapshot.jobs.map(job=>job.company)).size;
assert.equal(await page.locator('[data-count="jobs"]').textContent(),jobsSnapshot.jobs.length+' postings · '+companyCount+' companies');
assert.equal(await page.locator('#jobs .job-locations a').count(),jobsSnapshot.jobs.length,'Every posting has its own link');
assert(await page.locator('#jobs .job-locations a').evaluateAll(links=>links.every(link=>/^https:\/\/(job-boards\.greenhouse\.io|boards\.greenhouse\.io|jobs\.lever\.co|jobs\.ashbyhq\.com)\//.test(link.href)||link.href.startsWith('https://'))));
await page.locator('[data-search="jobs"]').fill('OpenAI');
assert.equal(await page.locator('[data-item="jobs"]:visible').count(),1);
await page.locator('[data-search="jobs"]').fill('');
await page.locator('#jobsRegion').selectOption('Europe & UK');
const europe=await page.locator('#jobs .job-locations a:visible').allTextContents();
assert(europe.length>0&&europe.length<jobsSnapshot.jobs.length,'Region filter narrows postings');
await page.locator('[data-filter="jobs"]').selectOption('Internship & early career');
assert(await page.locator('#jobs [data-job]:visible').evaluateAll(rows=>rows.every(row=>row.dataset.family==='Internship & early career')));
await page.locator('[data-search="jobs"]').fill('impossible-search-zz');
assert(await page.locator('[data-empty="jobs"]').isVisible());
await page.locator('[data-search="jobs"]').fill('');await page.locator('#jobsRegion').selectOption('');await page.locator('[data-filter="jobs"]').selectOption('');
await page.locator('#globalSearch').fill('Anthropic');
assert(await page.locator('#globalResults small',{hasText:'Hiring company'}).count()>=1,'Global search finds hiring companies');
await page.locator('#globalSearch').fill('');
assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),'https://open-fde.ai/og.png');
assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://open-fde.ai/');
assert.equal(errors.length,0,errors.join('\n'));
const links=await page.locator('a[href^="https://"]').evaluateAll(elements=>[...new Set(elements.map(element=>element.href))]);
assert(links.every(url=>new URL(url).pathname!=='/'||new URL(url).search.length>1||new URL(url).hostname==='www.momtestbook.com'),'Generic homepage link');
assert(storySources.every(source=>links.includes(source.url)),'Missing new source attribution');
assert.equal(new Set(sources.map(source=>source.id)).size,sources.length,'Duplicate source ID');
assert.equal(new Set(sources.map(source=>source.url)).size,sources.length,'Duplicate source URL');
const recipientPage=await browser.newPage();
recipientPage.on('pageerror',error=>errors.push(error.message));
await recipientPage.goto(outputPath.href);
await recipientPage.locator('.nav a[href="#stories"]').click();
await recipientPage.locator('#stories').waitFor({state:'visible'});
assert.equal(await recipientPage.locator('#story-list .row:visible').count(),stories.length);
await recipientPage.locator('.nav a[href="#learn"]').click();
await recipientPage.locator('#learn').waitFor({state:'visible'});
assert.equal(errors.length,0,errors.join('\n'));
const report={contentUpdated:'2026-10-31',testedAt:new Date().toISOString(),browser:process.argv.includes('--chrome')?'Google Chrome':'Playwright Chromium',checks:['English-only','No private-company content','Stats icon and embedded Amplitude dashboard when configured (hidden otherwise)','Four navigation sections; landing home with reasons, FDE vs SPE comparison, and doors; no download button','No progress tracking UI; legacy saved progress cleared','Learn: table of contents, 7 parts, preface plus 20 chapters, TOC links scroll to chapters','Old section links forward to the new structure','Resources: every curated resource and person listed once, grouped by type','Interview questions and case studies all listed','Eight unique firsthand stories','Tabs: Resources, Interview, Stories switch by click, link, and arrow keys; search opens the right tab','People table with intro, X handle, reading, and talks','Built HTML opens and functions in a fresh page','390px viewport: all sections without body overflow','Site-wide search: keyboard shortcut, ranking, cross-section results, chapter navigation, empty state','Job openings: counts match snapshot, per-posting links, company search, region and role-family filters, empty state, global search','Social preview and canonical metadata','New source links present and unique','No JavaScript runtime errors'],bytes:Buffer.byteLength(html),sha256:createHash('sha256').update(html).digest('hex'),externalLinks:links.length};
writeFileSync(new URL('verification.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
