import {readFileSync, writeFileSync} from 'node:fs';

// Checks every external link in the built guide (job postings excluded: they come fresh from the
// job boards). Writes a Markdown report to work/link-report.md and prints a summary.
// Broken: 404, 410, or the host cannot be reached after retries. Unverified: the site refused an
// automated check (401, 403, 429, 999, 5xx) and needs a look in a browser.
// Usage: node work/check-links.mjs  (run `npm run build` first)
const html=readFileSync(new URL('../outputs/FDE_SPE_Field_Academy.html',import.meta.url),'utf8').replace(/<section[^>]*id="jobs"[\s\S]*?<\/section>/,'');
const links=new Map();
for(const match of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"#]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)){
 const url=match[1].replace(/&amp;/g,'&');
 if(/^https:\/\/(open-fde\.ai|github\.com\/LouisLu888\/open-fde)/.test(url))continue;
 if(!links.has(url))links.set(url,match[2].replace(/<[^>]+>|↗/g,'').replace(/\s+/g,' ').trim().slice(0,80));
}

const headers={'user-agent':'Mozilla/5.0 (compatible; open-fde.ai link check; +https://open-fde.ai/about/)','accept':'text/html,application/xhtml+xml,*/*'};
async function check(url){
 let last;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(url,{headers,redirect:'follow',signal:AbortSignal.timeout(20000)});
   response.body?.cancel();
   if(response.ok)return {status:response.status,result:'ok'};
   last={status:response.status,result:[404,410].includes(response.status)?'broken':'unverified'};
   if(last.result==='broken')return last;
  }catch(error){last={status:error.cause?.code||error.name,result:'broken'};}
  await new Promise(resolve=>setTimeout(resolve,1500*(attempt+1)));
 }
 return last;
}

const entries=[...links];
const results=[];let next=0;
await Promise.all(Array.from({length:8},async()=>{while(next<entries.length){const [url,text]=entries[next++];results.push({url,text,...await check(url)});}}));
const broken=results.filter(item=>item.result==='broken'),unverified=results.filter(item=>item.result==='unverified');
const rows=items=>items.sort((a,b)=>a.url.localeCompare(b.url)).map(item=>`- [${item.text||item.url}](${item.url}) — ${item.status}`).join('\n');
const report=`Checked ${results.length} external links on ${new Date().toISOString().slice(0,10)}.\n\n## Broken (${broken.length})\n\n${rows(broken)||'None.'}\n\n## Could not verify automatically (${unverified.length})\n\nThese sites refused an automated check. Open them in a browser.\n\n${rows(unverified)||'None.'}\n`;
writeFileSync(new URL('link-report.md',import.meta.url),report);
console.log(JSON.stringify({checked:results.length,broken:broken.length,unverified:unverified.length}));
