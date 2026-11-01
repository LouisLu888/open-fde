import {readFileSync} from 'node:fs';

// Checks that every source URL in docs/INTERVIEWS.json and docs/COMPANIES.json still answers.
// A 200 means the page is reachable, not that the claim is still true; re-read the page for that.
// Usage: node work/research/check-sources.mjs
const read=file=>JSON.parse(readFileSync(new URL('../../docs/'+file,import.meta.url),'utf8'));
const urls=new Map();
for(const company of read('INTERVIEWS.json').companies)for(const source of company.sources)urls.set(source.url,`INTERVIEWS ${company.company} ${source.id}`);
for(const company of read('COMPANIES.json').companies)for(const field of ['valuation','arr'])if(company[field]?.source)urls.set(company[field].source,`COMPANIES ${company.company} ${field}`);
const headers={'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'};
const results=[];let next=0;const entries=[...urls];
await Promise.all(Array.from({length:8},async()=>{while(next<entries.length){const [url,where]=entries[next++];let status;try{const response=await fetch(url,{headers,redirect:'follow',signal:AbortSignal.timeout(20000)});status=response.status;response.body?.cancel();}catch(error){status=error.cause?.code||error.name;}results.push({url,where,status});}}));
const bad=results.filter(result=>result.status!==200);
for(const result of bad)console.log(`${result.status}\t${result.where}\t${result.url}`);
console.log(JSON.stringify({checked:results.length,ok:results.length-bad.length,notOk:bad.length}));
// 403/429 usually means a bot wall (1point3acres, some news sites): open those by hand. 404/410 means
// the page is gone: find a replacement source or drop the claim.
