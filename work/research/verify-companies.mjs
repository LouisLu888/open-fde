import {readFileSync, writeFileSync} from 'node:fs';

// Mechanical check of researched company facts before they are merged.
// For each entry: does the website load and name the company? Does each figure's source page load and
// contain the number (e.g. "$5B", "5 billion", "5,000,000,000")? Prints a report; with --apply, writes a
// cleaned copy next to each input (suffix .verified.json) with failing websites and figures removed, so
// only facts a page confirms reach docs/COMPANIES.json. Pages that block bots (403/429) are kept but listed
// for a manual look, since a block says nothing about the claim.
// Usage: node work/research/verify-companies.mjs [--apply] out/companies-*.json
const apply=process.argv.includes('--apply');
const files=process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
const headers={'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36','accept-language':'en'};
const cache=new Map();
const load=url=>{if(!cache.has(url))cache.set(url,fetch(url,{headers,redirect:'follow',signal:AbortSignal.timeout(25000)}).then(async response=>({status:response.status,text:response.ok?(await response.text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').toLowerCase():''})).catch(error=>({status:error.cause?.code||error.name,text:''})));return cache.get(url);};
const blocked=status=>status===403||status===429||status===401||status===999;
// Ways a page may write a dollar figure: $5B, $5 billion, 5bn, $5.2 billion, €21B (euro figures are listed for review).
const spellings=usd=>{const out=new Set();const units=[[1e12,['t','trillion']],[1e9,['b','bn','billion']],[1e6,['m','mn','million']]];for(const [size,words] of units){if(usd<size)continue;const value=usd/size;for(const digits of [0,1,2])for(const number of new Set([value.toFixed(digits),value.toFixed(digits).replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,'$1')]))for(const word of words){out.add(number+word);out.add(number+' '+word);}break;}out.add(Math.round(usd).toLocaleString('en-US'));return [...out];};
const mentions=(text,usd)=>{const flat=text.replace(/[$€£]\s?/g,'');return spellings(usd).some(form=>new RegExp('(^|[^\\d.])'+form.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![a-z\\d])').test(flat));};
const nameTokens=name=>name.toLowerCase().replace(/\(.*?\)/g,'').replace(/\b(inc|corp|co|ltd|gmbh|ag|se|llc|technologies|ai|labs|the)\b\.?/g,' ').split(/[^a-z0-9]+/).filter(token=>token.length>=3);

const report=[];
for(const file of files){
 const data=JSON.parse(readFileSync(file,'utf8'));
 await Promise.all(data.companies.map(async entry=>{
  if(entry.website){const page=await load(entry.website);const tokens=nameTokens(entry.company);const named=tokens.length===0||tokens.some(token=>page.text.includes(token)||entry.website.toLowerCase().includes(token));
   if(blocked(page.status))report.push(['review',entry.company,'website blocked',entry.website,page.status]);
   else if(page.status!==200||!named){report.push(['remove',entry.company,'website',entry.website,page.status+(named?'':' (company name not on page)')]);if(apply)entry.website='';}}
  for(const field of ['valuation','arr']){const item=entry[field];if(!item?.usd)continue;const page=await load(item.source);
   if(blocked(page.status)){report.push(['review',entry.company,field+' source blocked',item.source,page.status]);continue;}
   if(page.status!==200||!mentions(page.text,item.usd)){report.push(['remove',entry.company,field,`${item.usd} ${item.source}`,page.status===200?'number not on page':page.status]);if(apply)entry[field]=null;}}
 }));
 if(apply)writeFileSync(file.replace(/\.json$/,'.verified.json'),JSON.stringify(data,null,1)+'\n');
}
for(const row of report.sort((a,b)=>a[0].localeCompare(b[0])||a[1].localeCompare(b[1])))console.log(row.join('\t'));
console.log(JSON.stringify({remove:report.filter(row=>row[0]==='remove').length,review:report.filter(row=>row[0]==='review').length}));
