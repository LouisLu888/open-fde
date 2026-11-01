import {readFileSync, writeFileSync} from 'node:fs';

// Merges discovery output (work/research/discovery-brief.md) into the fetcher's company list and
// docs/OTHER_BOARDS.json (companies on systems the fetcher cannot read, such as Workday).
// Usage: node work/research/merge-discovery.mjs out/discovery-a.json [out/discovery-b.json ...]
// New Greenhouse/Lever/Ashby boards are appended to work/fetch-jobs.mjs as 'system:slug' entries under a
// dated heading; slug fixes for existing companies are appended to that company's entry. Boards listed in
// SKIP are never added. Run `npm run refresh:jobs` afterwards: boards with no matching title drop out.
const root=new URL('../../',import.meta.url);
const fetcherPath=new URL('work/fetch-jobs.mjs',root);
let fetcher=readFileSync(fetcherPath,'utf8');
const SKIP=new Set(['greenhouse:cssmerge']); // multi-company board (postings describe Pronto AI); Atoms uses greenhouse:atoms
// Recruiters and hiring platforms posting for unnamed clients are not employers.
const SKIP_NAMES=new Set(['sitreps','clera','recruyt','jobgether','talentpluto','virtuhire','bubble sort recruiting','attis','allegis','terminal','truelogic','scale army','lavendo','atomic']);
const known=new Map();// lowercase slug -> company name, from the current list
const listText=fetcher.slice(fetcher.indexOf('export const companies'));
for(const match of listText.matchAll(/\['([^']+)',([^\]]*)\]/g))for(const slug of match[2].matchAll(/'([^']+)'/g))known.set(decodeURIComponent(slug[1].replace(/^\w+:/,'')).toLowerCase(),match[1]);
const names=new Set([...listText.matchAll(/\['([^']+)'/g)].map(match=>match[1]));
const readable=new Set(['greenhouse','lever','ashby']);
const additions=new Map(),fixes=new Map(),others=new Map();
for(const file of process.argv.slice(2)){
 const data=JSON.parse(readFileSync(file,'utf8'));
 for(const entry of [...(data.companies||[]),...(data.slugFixesForExistingCompanies||[])]){
  const ats=String(entry.ats||'').toLowerCase();
  if(!readable.has(ats)){if(/not independently confirmed/i.test(entry.note||''))continue;if(!names.has(entry.name)&&!SKIP_NAMES.has(entry.name.toLowerCase()))others.set(entry.name.toLowerCase(),{company:entry.name,system:entry.note?.match(/^(\w[\w ]*?)[\s(;,]/)?.[1]||'other',careersUrl:entry.boardUrl||entry.examplePostingUrl,exampleTitle:entry.exampleTitle||'',examplePostingUrl:entry.examplePostingUrl||'',website:entry.website||'',note:entry.note||''});continue;}
  const slug=decodeURIComponent(entry.slug).toLowerCase(),key=ats+':'+entry.slug;
  if(SKIP.has(key)||SKIP_NAMES.has(entry.name.toLowerCase())||known.has(slug)||[...additions.values()].some(item=>[...item.slugs].some(other=>decodeURIComponent(other).toLowerCase()===ats+':'+slug)))continue;
  const existing=entry.existingName&&names.has(entry.existingName)?entry.existingName:(names.has(entry.name)&&!additions.has(entry.name.toLowerCase())?entry.name:null);
  if(existing){(fixes.get(existing)||fixes.set(existing,new Set()).get(existing)).add(key);continue;}
  const id=entry.name.toLowerCase();
  if(additions.has(id)){if(additions.get(id).slugs.has(key))continue;const host=(entry.website||entry.boardUrl).replace(/^https?:\/\/(www\.)?/,'').split('/')[0];additions.set(id+'|'+key,{name:`${entry.name} (${host})`,slugs:new Set([key])});continue;}
  additions.set(id,{name:entry.name,slugs:new Set([key])});
 }
}
for(const [name,keys] of fixes){
 const pattern=new RegExp(`\\['${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}',([^\\]]*)\\]`);
 fetcher=fetcher.replace(pattern,(all,slugs)=>`['${name}',${slugs},${[...keys].map(key=>`'${key}'`).join(',')}]`);
}
const quote=value=>value.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
if(additions.size){
 const block=` // Found ${new Date().toISOString().slice(0,10)} by discovery (work/research/discovery-brief.md), each confirmed on its live board\n `+[...additions.values()].sort((a,b)=>a.name.localeCompare(b.name)).map(entry=>`['${quote(entry.name)}',${[...entry.slugs].map(key=>`'${quote(key)}'`).join(',')}]`).join(',')+',\n';
 fetcher=fetcher.replace(/\n\];/,'\n'+block+'];');
}
writeFileSync(fetcherPath,fetcher);
const otherPath=new URL('docs/OTHER_BOARDS.json',root);
let previous=[];try{previous=JSON.parse(readFileSync(otherPath,'utf8')).companies;}catch{}
const merged=new Map(previous.map(entry=>[entry.company.toLowerCase(),entry]));for(const [key,value] of others)merged.set(key,value);
writeFileSync(otherPath,JSON.stringify({checkedAt:new Date().toISOString().slice(0,10),note:'Companies hiring forward deployed roles on systems the daily fetcher cannot read (Workday, company careers sites, YC, Rippling, Gem, and others). Confirmed open when added; recheck before relying on them.',companies:[...merged.values()].sort((a,b)=>a.company.localeCompare(b.company))},null,1)+'\n');
console.log(JSON.stringify({newCompanies:additions.size,slugFixes:Object.fromEntries([...fixes].map(([name,keys])=>[name,[...keys]])),otherSystems:merged.size},null,1));
