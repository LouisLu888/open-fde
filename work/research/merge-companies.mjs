import {readFileSync, writeFileSync, existsSync} from 'node:fs';

// Merges researched company facts (work/research/company-brief.md output) into docs/COMPANIES.json.
// Usage: node work/research/merge-companies.mjs out-0.json [out-1.json ...]
// Entries replace existing ones with the same company name; others are kept. Fails on any
// invalid record, so nothing half-checked reaches the site.
const target=new URL('../../docs/COMPANIES.json',import.meta.url);
const jobs=JSON.parse(readFileSync(new URL('../../docs/JOBS.json',import.meta.url),'utf8')).jobs;
const hiring=new Set(jobs.map(job=>job.company));
const current=existsSync(target)?JSON.parse(readFileSync(target,'utf8')).companies:[];
const byName=new Map(current.map(entry=>[entry.company,entry]));
const errors=[];
const checkFigure=(name,field,item)=>{
 if(item===null||item===undefined)return null;
 if(!(Number(item.usd)>0))errors.push(`${name}: ${field}.usd must be a positive number`);
 if(!/^\d{4}(-\d{2})?(-\d{2})?$/.test(item.date||''))errors.push(`${name}: ${field}.date must be YYYY-MM`);
 if(!/^https:\/\//.test(item.source||''))errors.push(`${name}: ${field}.source must be an https URL`);
 return {usd:Number(item.usd),date:item.date,basis:item.basis||'',source:item.source,sourceTitle:item.sourceTitle||''};
};
for(const file of process.argv.slice(2)){
 for(const entry of JSON.parse(readFileSync(file,'utf8')).companies){
  const name=entry.company;
  if(!hiring.has(name))errors.push(`${name}: not a company in docs/JOBS.json (check the exact name)`);
  if(entry.website&&!/^https?:\/\//.test(entry.website))errors.push(`${name}: website must be a URL`);
  byName.set(name,{company:name,website:entry.website||'',industry:entry.industry||'',hq:entry.hq||'',stage:entry.stage||'',ticker:entry.ticker||'',valuation:checkFigure(name,'valuation',entry.valuation),arr:checkFigure(name,'arr',entry.arr),note:entry.note||''});
 }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
const companies=[...byName.values()].sort((a,b)=>a.company.localeCompare(b.company));
writeFileSync(target,JSON.stringify({checkedAt:new Date().toISOString().slice(0,10),method:'Each figure from a public source opened by the researcher, with its date. Valuation is the latest post-money or reported round/tender for private companies and market cap for public ones; ARR is reported ARR, run-rate, or fiscal/TTM revenue as labelled.',companies},null,1)+'\n');
const missing=[...hiring].filter(name=>!byName.has(name));
console.log(JSON.stringify({companies:companies.length,withValuation:companies.filter(entry=>entry.valuation).length,withArr:companies.filter(entry=>entry.arr).length,hiringCompaniesMissing:missing},null,1));
