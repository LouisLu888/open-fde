// OpenAI and Anthropic customer stories, converted into case-study records.
// Data lives in data/lab-cases.json; every `evidence` string was matched against the
// live story page on the review date, and every number in `result` appears in it.
import {readFileSync} from 'node:fs';

const records=JSON.parse(readFileSync(new URL('./data/lab-cases.json',import.meta.url),'utf8'));
const reviewed='2026-11-08';
const lowerFirst=text=>text.charAt(0).toLowerCase()+text.slice(1);

export const labSources=records.map(item=>({
 id:item.sourceId,
 title:item.pageTitle,
 author:item.vendor==='OpenAI'?`OpenAI · ${item.customer}`:`Anthropic · ${item.customer}`,
 date:item.date,
 type:'Case article',
 url:item.url,
 status:'Content checked',
 why:item.why,
 reviewed
}));

export const labCases=records.map(item=>({
 id:item.id,
 title:`${item.vendor} × ${item.title}`,
 theme:item.theme,
 source:item.sourceId,
 company:item.vendor,
 industry:item.industry,
 problem:item.problem,
 approach:item.approach,
 result:item.result,
 limit:`Published by ${item.vendor}, the vendor; ${lowerFirst(item.limit)}`,
 question:item.question
}));
