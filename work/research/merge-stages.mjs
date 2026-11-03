import {readFileSync, writeFileSync} from 'node:fs';

// Fills the funding stage of companies in docs/COMPANIES.json from stage research
// (work/research/stage-brief.md output), leaving every other field alone.
// Each stage must cite a page that states it in words: the script opens stageSource and requires the
// round ("Series B"), "seed", "acquired", "subsidiary", "bootstrapped" or the ticker on the page. Pages that
// block bots (401/403/429) are listed for a manual look and not merged.
// --manual="Name,Name" merges stages whose source you opened by hand in a browser (bot walls, script-rendered pages).
// Usage: node work/research/merge-stages.mjs [--dry-run] [--manual="A,B"] out/stages-*.json
const dryRun=process.argv.includes('--dry-run');
const manual=new Set((process.argv.find(arg=>arg.startsWith('--manual='))||'').slice(9).split(',').map(name=>name.trim()).filter(Boolean));
const files=process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
const target=new URL('../../docs/COMPANIES.json',import.meta.url);
const data=JSON.parse(readFileSync(target,'utf8'));
const byName=new Map(data.companies.map(entry=>[entry.company,entry]));
const allowed=/^(Private, (Seed|Series [A-E]|Series F\+|late stage|bootstrapped)|Public|Acquired|Subsidiary)$/;
const headers={'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36','accept-language':'en'};
const load=url=>fetch(url,{headers,redirect:'follow',signal:AbortSignal.timeout(25000)}).then(async response=>({status:response.status,text:response.ok?(await response.text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').toLowerCase():''})).catch(error=>({status:error.cause?.code||error.name,text:''}));
// Words the source must contain for each stage.
const evidence=(stage,ticker)=>{const round=stage.match(/Series ([A-F])/);if(round)return round[1]==='F'?/series [f-z]\b/:new RegExp('series '+round[1].toLowerCase()+'\\b');if(/Seed/.test(stage))return /seed/;if(/late stage/.test(stage))return /series [d-z]\b|growth round|late[- ]stage|valuation/;if(/bootstrapped/.test(stage))return /bootstrap|self-funded|self funded|no (outside|external|venture) (funding|capital)|without (outside|venture)/;if(stage==='Acquired')return /acqui/;if(stage==='Subsidiary')return /subsidiar|part of|division of|acqui/;if(stage==='Public')return new RegExp(ticker?ticker.toLowerCase().replace(/[^a-z0-9.]/g,''):'nyse|nasdaq|publicly traded');return /$^/;};
const report={merged:[],skipped:[],review:[],errors:[]};
for(const file of files)for(const entry of JSON.parse(readFileSync(file,'utf8')).companies){
 const name=entry.company,current=byName.get(name);
 if(!entry.stage){report.skipped.push(name);continue;}
 if(!current){report.errors.push(`${name}: not in docs/COMPANIES.json`);continue;}
 if(!allowed.test(entry.stage)){report.errors.push(`${name}: stage "${entry.stage}" is not an allowed value`);continue;}
 if(entry.stage==='Public'&&!entry.ticker){report.errors.push(`${name}: Public needs a ticker`);continue;}
 if(!/^https:\/\//.test(entry.stageSource||'')){report.errors.push(`${name}: stageSource must be an https URL`);continue;}
 const page=manual.has(name)?{status:200,text:'',manual:true}:await load(entry.stageSource);
 if([401,403,429,999].includes(page.status)){report.review.push(`${name}\t${entry.stage}\t${entry.stageSource}\t${page.status}`);continue;}
 if(!page.manual&&(page.status!==200||!evidence(entry.stage,entry.ticker).test(page.text))){report.review.push(`${name}\t${entry.stage}\t${entry.stageSource}\t${page.status===200?'stage not stated on page':page.status}`);continue;}
 Object.assign(current,{stage:entry.stage,ticker:entry.ticker||current.ticker||'',stageDate:entry.stageDate||'',stageSource:entry.stageSource,stageSourceTitle:entry.stageSourceTitle||''});
 if(entry.note&&!current.note?.includes(entry.note))current.note=[current.note,entry.note].filter(Boolean).join(' ');
 report.merged.push(`${name}: ${entry.stage}`);
}
if(!dryRun&&!report.errors.length)writeFileSync(target,JSON.stringify(data,null,1)+'\n');
console.log(report.review.length?'Review by hand (not merged):\n'+report.review.join('\n'):'');
if(report.errors.length){console.error(report.errors.join('\n'));process.exit(1);}
console.log(JSON.stringify({merged:report.merged.length,skippedEmpty:report.skipped.length,review:report.review.length,stillMissing:data.companies.filter(entry=>!entry.stage).length,dryRun},null,1));
