import {readFileSync, writeFileSync} from 'node:fs';

// Re-runs the analysis behind the Market demand tab (work/jobs-brief.mjs) on the current
// docs/JOBS.json: fetches each posting's full text from the public job-board APIs, then counts
// skills, segments, seniority, travel, pay, and locations. Writes work/research/jobs-stats.json
// (the evidence for every number in the brief) and prints a summary.
// Usage: npm run refresh:jobs && node work/research/analyze-jobs.mjs
const root=new URL('../../',import.meta.url);
const snapshot=JSON.parse(readFileSync(new URL('docs/JOBS.json',root),'utf8'));
const source=readFileSync(new URL('work/fetch-jobs.mjs',root),'utf8');

// Segment of each company, from the comment headings in the fetcher's company list.
const segmentOf={};let segment='';
for(const line of source.slice(source.indexOf('export const companies')).split('\n')){const heading=line.match(/^\s*\/\/\s*(.+)/);if(heading)segment=heading[1].trim();for(const match of line.matchAll(/\['([^']+)'/g))segmentOf[match[1]]??=segment;}

const strip=html=>html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/<\/(p|li|h\d|div|br)>/gi,'\n').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#\d+;/g,' ').replace(/\s+/g,' ');
const api={greenhouse:slug=>`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,lever:slug=>`https://api.lever.co/v0/postings/${slug}?mode=json`,ashby:slug=>`https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`};
const text={};
const boards=[...new Map(snapshot.jobs.map(job=>[job.ats+':'+job.board,job])).values()];
await Promise.all(boards.map(async board=>{
 const data=await fetch(api[board.ats](board.board),{signal:AbortSignal.timeout(30000)}).then(response=>response.json()).catch(()=>null);if(!data)return;
 if(board.ats==='greenhouse')for(const job of data.jobs||[])text[job.absolute_url]=strip(job.content||'');
 if(board.ats==='lever')for(const job of data||[])text[job.hostedUrl]=[job.descriptionPlain,...(job.lists||[]).map(list=>list.text+' '+strip(list.content||'')),job.additionalPlain].join(' ');
 if(board.ats==='ashby')for(const job of data.jobs||[])text[job.jobUrl]=job.descriptionPlain||strip(job.descriptionHtml||'');
}));
const jobs=snapshot.jobs.map(job=>({...job,segment:segmentOf[job.company]||'Other',body:(text[job.url]||'').toLowerCase()}));
const distinct=[...new Map(jobs.map(job=>[job.company+'|'+job.title,job])).values()];

const skills={'Clear communication':/communicat/,'Feeding lessons back to product':/feedback|roadmap/,'Customer-facing work':/customer[- ]facing|client[- ]facing|work directly with (customers|clients)/,'Agents':/\bagents?\b|agentic/,'Comfort with ambiguity':/ambigu/,'Startup or founder experience':/founder|startup|zero[- ]to[- ]one|0[- ]?to[- ]?1/,'Python':/\bpython\b/,'LLMs':/\bllms?\b|large language|generative ai|genai/,'TypeScript or JavaScript':/typescript|javascript/,'SQL':/\bsql\b/,'AWS, GCP, or Azure':/\baws\b|\bgcp\b|azure/,'Fine-tuning':/fine[- ]tun/,'RAG':/\brag\b|retrieval[- ]augmented/,'Data engineering':/data pipelines?|\betl\b|data engineering|data model/,'Executives':/executive|c-suite|c-level/,'Travel':/\btravel/,'Security clearance':/security clearance|ts\/sci|clearance/,'Consulting':/consult/,'Production':/\bproduction\b/,'Demos':/\bdemos?\b/};
// Share of companies mentioning each item: per company, the share of its distinct roles that mention it, averaged over companies.
const companyWeighted=list=>{const byCompany={};for(const job of list)(byCompany[job.company]??=[]).push(job);const groups=Object.values(byCompany);return {companies:groups.length,shares:Object.fromEntries(Object.entries(skills).map(([label,pattern])=>[label,Math.round(100*groups.reduce((sum,group)=>sum+group.filter(job=>pattern.test(job.body)).length/group.length,0)/groups.length)]))};};
const median=values=>{const sorted=[...values].sort((a,b)=>a-b);return sorted.length?sorted[Math.floor((sorted.length-1)/2)]:null;};
const payOf=job=>{const match=(job.compensation+' '+job.body).match(/\$\s?(\d{2,3})(?:,\d{3}|k)\s*(?:-|–|—|to)\s*\$?\s?(\d{2,3})(?:,\d{3}|k)/i);if(!match)return null;const low=+match[1],high=+match[2];return low>=60&&low<high&&high<=900?[low,high]:null;};
const pay=list=>{const ranges=list.map(payOf).filter(Boolean);return {postings:ranges.length,medianLowK:median(ranges.map(range=>range[0])),medianHighK:median(ranges.map(range=>range[1]))};};
const segments=[...new Set(jobs.map(job=>job.segment))];
const minYears=distinct.map(job=>[...job.body.matchAll(/(\d{1,2})\+?\s*(?:-|–|to)?\s*(?:\d{1,2}\s*)?\+?\s*years/g)].map(match=>+match[1]).filter(value=>value<16)).filter(values=>values.length).map(values=>Math.min(...values));
const travel={};for(const job of distinct){const match=job.body.match(/(\d{2})\s?%\s*(?:of the time\s*)?(?:\w+\s){0,4}travel|travel[^.]{0,60}?(\d{2})\s?%/);if(match){const share=+(match[1]||match[2]);travel[share]=(travel[share]||0)+1;}}
const count=(list,key)=>Object.entries(list.reduce((totals,job)=>{totals[key(job)]=(totals[key(job)]||0)+1;return totals;},{})).sort((a,b)=>b[1]-a[1]);
const cities=['New York','San Francisco','London','Washington','Remote','Austin','Seattle','Tokyo','Singapore','Boston','Munich','Paris','Toronto'];
const stats={
 snapshot:snapshot.checkedAt,postings:jobs.length,distinctRoles:distinct.length,companies:new Set(jobs.map(job=>job.company)).size,withText:jobs.filter(job=>job.body.length>300).length,
 topCompanies:count(jobs,job=>job.company).slice(0,8),
 askedFor:companyWeighted(distinct),
 bySegment:Object.fromEntries(segments.map(name=>[name,{...companyWeighted(distinct.filter(job=>job.segment===name)),pay:pay(jobs.filter(job=>job.segment===name))}])),
 pay:pay(jobs),
 deploymentStrategist:{postings:jobs.filter(job=>/strategist/i.test(job.title)).length,byCompany:count(jobs.filter(job=>/strategist/i.test(job.title)),job=>job.company).slice(0,5)},
 entryLevel:{roles:distinct.filter(job=>/intern|new grad|early career|graduate|junior/i.test(job.title)).length,byCompany:count(distinct.filter(job=>/intern|new grad|early career|graduate|junior/i.test(job.title)),job=>job.company).slice(0,5)},
 distinctRolesMentioning:{production:distinct.filter(job=>skills.Production.test(job.body)).length,demos:distinct.filter(job=>skills.Demos.test(job.body)).length},
 minimumYears:{rolesStating:minYears.length,median:median(minYears)},
 travelShareStated:Object.entries(travel).sort((a,b)=>b[1]-a[1]),
 locations:cities.map(city=>[city,jobs.filter(job=>job.location.toLowerCase().includes(city.toLowerCase())).length]).sort((a,b)=>b[1]-a[1]),
};
writeFileSync(new URL('work/research/jobs-stats.json',root),JSON.stringify(stats,null,1)+'\n');
console.log(JSON.stringify({snapshot:stats.snapshot,postings:stats.postings,distinctRoles:stats.distinctRoles,companies:stats.companies,withText:stats.withText,askedFor:stats.askedFor.shares,pay:stats.pay,minimumYears:stats.minimumYears,entryLevel:stats.entryLevel,strategists:stats.deploymentStrategist},null,1));
