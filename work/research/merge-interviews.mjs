import {readFileSync, writeFileSync} from 'node:fs';

// Merges researched interview loops (work/research/interview-brief.md output) into docs/INTERVIEWS.json.
// Usage: node work/research/merge-interviews.mjs group-a.json [group-b.json ...]
// A company in the input replaces the same company in the data file; others are kept.
// Source ids are renumbered S1..Sn per company; a reference may list several ids ("S1; S3").
// Fails on unknown source ids, types, or evidence kinds, and on prompts over 25 words.
const target=new URL('../../docs/INTERVIEWS.json',import.meta.url);
const types=new Set(['decomposition','system-design','coding','take-home','ai-build','debugging','customer-scenario','presentation','sql-data','domain','behavioral','motivation']);
const kinds=new Set(['employer','employee','candidate','third-party']);
const data=JSON.parse(readFileSync(target,'utf8'));
const byName=new Map(data.companies.map(company=>[company.company,company]));
const errors=[];
const slugOf=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const humanUrl=url=>url.replace(/^https:\/\/boards-api\.greenhouse\.io\/v1\/boards\/([^/]+)\/jobs\/(\d+).*/,'https://job-boards.greenhouse.io/$1/jobs/$2');

for(const file of process.argv.slice(2)){
 for(const raw of JSON.parse(readFileSync(file,'utf8')).companies){
  const name=raw.company.replace(/ \(.*\)$/,'');
  const map=new Map((raw.sources||[]).map((source,index)=>[source.id,'S'+(index+1)]));
  const refs=(value,where)=>{const ids=String(value||'').split(/[;,\s]+/).filter(Boolean);if(!ids.length||ids.some(id=>!map.has(id)))errors.push(`${name}: ${where} cites unknown source "${value}"`);return ids.map(id=>map.get(id)||id).join(' ');};
  const sources=(raw.sources||[]).map(source=>{if(!kinds.has(source.kind))errors.push(`${name}: source kind "${source.kind}"`);return {id:map.get(source.id),url:humanUrl(source.url),title:source.title||'',publisher:source.publisher||'',date:source.date||'',kind:source.kind,checked:source.checked||''};});
  const slug=slugOf(name);
  const questions=(raw.questions||[]).map((question,index)=>{
   if(!types.has(question.type))errors.push(`${name}: question type "${question.type}"`);
   if(!kinds.has(question.evidence))errors.push(`${name}: evidence "${question.evidence}"`);
   if(question.prompt.split(/\s+/).length>25)errors.push(`${name}: prompt over 25 words: ${question.prompt}`);
   return {id:`${slug}-q${index+1}`,prompt:question.prompt,type:question.type,role:question.role||'',stage:question.stage||'',evidence:question.evidence,source:refs(question.source,'question'),year:String(question.year||''),note:question.note||''};
  });
  const ai=raw.aiPolicy?.text?{text:raw.aiPolicy.text,source:refs(raw.aiPolicy.source,'aiPolicy')}:{};
  byName.set(name,{company:name,slug,roles:raw.roles||[],
   process:(raw.process||[]).map(stage=>({stage:stage.stage,format:stage.format||'',assesses:stage.assesses||'',source:refs(stage.source,'stage')})),
   questions,tips:(raw.tips||[]).map(tip=>({text:tip.text,source:refs(tip.source,'tip')})),aiPolicy:ai,sources,gaps:raw.gaps||''});
 }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
data.companies=[...byName.values()].sort((a,b)=>b.questions.length-a.questions.length||b.process.length-a.process.length||a.company.localeCompare(b.company));
data.checkedAt=new Date().toISOString().slice(0,10);
writeFileSync(target,JSON.stringify(data,null,1)+'\n');
console.log(JSON.stringify({companies:data.companies.length,questions:data.companies.reduce((sum,company)=>sum+company.questions.length,0),sources:data.companies.reduce((sum,company)=>sum+company.sources.length,0)},null,1));
