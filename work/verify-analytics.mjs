import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';

// Serves the built page as https://open-fde.ai in an isolated browser, loads the real Amplitude CDN SDK,
// and intercepts Amplitude's ingestion endpoint so no test events reach a live project.
process.env.AMPLITUDE_API_KEY||='verify-analytics-test-key';
const {analyticsBlock}=await import('./analytics/build-analytics.mjs');
let html=readFileSync(new URL('../outputs/FDE_SPE_Field_Academy.html',import.meta.url),'utf8');
if(!html.includes('<!-- analytics -->'))html=html.replace('</script></body></html>','</script>'+analyticsBlock()+'</body></html>');

async function session(initScript){
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 if(initScript)await context.addInitScript(initScript);
 const events=[];let sdkRequested=false;
 await context.route('https://open-fde.ai/**',route=>route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html}));
 await context.route('https://cdn.amplitude.com/**',route=>{sdkRequested=true;return route.continue();});
 await context.route(/amplitude\.com\/(2\/httpapi|batch)/,route=>{const raw=route.request().postDataBuffer()||Buffer.from('{}');const body=JSON.parse((raw[0]===0x1f&&raw[1]===0x8b?gunzipSync(raw):raw).toString('utf8'));events.push(...(body.events||[]));return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({code:200,events_ingested:(body.events||[]).length})});});
 await context.route(/^https:\/\/(?!open-fde\.ai|cdn\.amplitude\.com|sr-client-cfg\.amplitude\.com|api2?\.amplitude\.com|api\.eu\.amplitude\.com).*/,route=>route.fulfill({status:204,body:''}));
 const page=await context.newPage();
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('https://open-fde.ai/');
 return {browser,context,page,events,errors,get sdkRequested(){return sdkRequested;}};
}

const run=await session();
const {page,events}=run;
await page.waitForFunction(()=>window.__openfdeReady===true,null,{timeout:20000});
assert.equal(await page.evaluate(()=>typeof window.sessionReplay?.plugin),'function','Session Replay plugin loaded');
await page.locator('.nav a[href="#learn"]').click();
await page.locator('#learn').waitFor({state:'visible'});
await page.waitForTimeout(2000);
await page.locator('#globalSearch').fill('permission revocation');
await page.keyboard.press('Enter');
await page.waitForTimeout(2000);
await page.locator('.nav a[href="#resources"]').click();
await page.locator('[role=tab][href="#res-books"]').click();
await page.locator('#res-books .row details summary').first().click();
await page.locator('.nav a[href="#jobs"]').click();
await page.locator('#jobsRegion').selectOption('Europe & UK');
await page.locator('#jobs details.co-row:not([hidden]) summary').first().click();
await page.evaluate(()=>document.addEventListener('click',event=>{if(event.target.closest('.job-locations a'))event.preventDefault();}));
await page.locator('#jobs .job-locations a:visible').first().click();
// The SDK batches and may retry after its remote config call, so poll instead of a fixed wait.
const required=['Section Viewed','Tab Selected','Chapter Viewed','Search Result Opened','Content Expanded','Filter Applied','Job Posting Clicked'];
for(let attempt=0;attempt<40&&!required.every(name=>events.some(event=>event.event_type===name));attempt++){await page.evaluate(()=>window.amplitude.flush().promise);await page.waitForTimeout(250);}
const names=events.map(event=>event.event_type);
for(const name of required)assert(names.includes(name),'Missing analytics event: '+name+' in '+names.join(', '));
for(const retired of ['Site Search Result Opened','Section Filter Changed','Resource Link Clicked','Job Company Selected','Job Board Clicked'])assert(!names.includes(retired),'Retired event still sent: '+retired);
assert(names.some(name=>/page view/i.test(name)),'Autocaptured page view missing');
const props=name=>events.find(event=>event.event_type===name).event_properties;
const viewed=events.filter(event=>event.event_type==='Section Viewed').map(event=>event.event_properties.section);
assert(viewed[0]==='start'&&viewed.includes('jobs'),'Section Viewed sequence '+viewed);
const chapter=props('Chapter Viewed');
assert(typeof chapter.chapter_number==='number'&&chapter.chapter_title&&chapter.part_title&&chapter.entry_point,'Chapter Viewed properties '+JSON.stringify(chapter));
const result=props('Search Result Opened');
assert(result.search_term==='permission revocation'&&result.result_rank===1&&result.result_content_type==='chapter'&&result.section==='learn','Search Result Opened properties '+JSON.stringify(result));
const expanded=props('Content Expanded');
assert(expanded.section==='resources'&&expanded.content_type&&expanded.content_title,'Content Expanded properties '+JSON.stringify(expanded));
const filter=props('Filter Applied');
assert(filter.section==='jobs'&&filter.filter_name==='region'&&filter.filter_value==='Europe & UK','Filter Applied properties '+JSON.stringify(filter));
assert(events.some(event=>event.event_properties?.['[Amplitude] Session Replay ID']),'Events carry a Session Replay ID, so replays link to events');
const job=props('Job Posting Clicked');
assert(job.company&&job.job_title&&job.role_family&&job.job_location&&job.destination_host,'Job click properties '+JSON.stringify(job));
assert.equal(run.errors.length,0,run.errors.join('\n'));
await run.browser.close();

const optOut=await session(()=>Object.defineProperty(Navigator.prototype,'globalPrivacyControl',{get:()=>true}));
await optOut.page.locator('.nav a[href="#resources"]').click();
await optOut.page.waitForTimeout(1500);
assert(!optOut.sdkRequested&&optOut.events.length===0,'Global Privacy Control must disable analytics');
await optOut.browser.close();

const clean=await chromium.launch({headless:true});
const offline=await clean.newPage();
await offline.goto(new URL('../outputs/FDE_SPE_Field_Academy.html',import.meta.url).href);
assert.equal(await offline.evaluate(()=>!!window.__openfdeReady),false,'Analytics must stay off outside open-fde.ai');
await clean.close();
console.log(JSON.stringify({analytics:'ok',events:names.length,eventTypes:[...new Set(names)]},null,1));
