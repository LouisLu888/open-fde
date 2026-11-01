import {readFileSync, writeFileSync} from 'node:fs';

// Collects open FDE-family postings from public ATS job-board APIs (Greenhouse, Lever, Ashby).
// Each company is probed on every ATS by slug; only boards that respond are kept.
// Usage: node work/fetch-jobs.mjs [--discover] [--force]  (--discover prints which slugs resolved; --force writes even after a large drop)
export const ROLE=/forward[\s-]*deploy|\bFDE\b|\bFDSE\b|special projects engineer|deployment strategist|ai deployment engineer/i;

export const companies=[
 // AI labs and model platforms
 ['OpenAI','openai'],['Anthropic','anthropic'],['Cohere','cohere'],['Mistral AI','mistral'],['xAI','xai'],['Perplexity','perplexity','perplexity-ai'],['ElevenLabs','elevenlabs'],['Together AI','togetherai','together'],['Fireworks AI','fireworksai','fireworks'],['Baseten','baseten'],['Modal','modal'],['Replicate','replicate'],['Runway','runwayml','runway'],['Character.AI','character'],['AI21 Labs','ai21'],['Reka','reka'],['Writer','writer','writerinc'],['Contextual AI','contextualai'],['Twelve Labs','twelvelabs'],['Luma AI','lumalabs','luma-ai'],['Cartesia','cartesia'],['Deepgram','deepgram'],['AssemblyAI','assemblyai'],['Hume AI','humeai'],['Poolside','poolside'],['Magic','magic'],['Reflection AI','reflectionai'],['Thinking Machines Lab','thinkingmachines'],['Safe Superintelligence','ssi'],['Liquid AI','liquidai','liquid-ai'],['Sakana AI','sakana'],['BentoML','bentoml'],['Lambda','lambda','lambdalabs'],['CoreWeave','coreweave'],['Crusoe','crusoe','crusoeenergy'],['Groq','groq'],['Cerebras','cerebrassystems','cerebras'],['SambaNova','sambanovasystems'],['Nebius','nebius'],['Hugging Face','huggingface'],
 // Data, infra, and devtools
 ['Databricks','databricks'],['Snowflake','snowflake'],['Scale AI','scaleai'],['Snorkel AI','snorkelai'],['Labelbox','labelbox'],['Surge AI','surgeai'],['Turing','turing'],['Mercor','mercor'],['Handshake','handshake'],['Invisible Technologies','invisibletech','invisible'],['Weights & Biases','wandb'],['Pinecone','pinecone'],['Weaviate','weaviate'],['Qdrant','qdrant'],['LangChain','langchain'],['LlamaIndex','llamaindex'],['Unstructured','unstructured','unstructuredtechnologies'],['Vercel','vercel'],['Supabase','supabase'],['Neon','neon','neondatabase'],['Retool','retool'],['Temporal','temporal','temporaltechnologies'],['Airbyte','airbyte'],['dbt Labs','dbtlabsinc','dbtlabs'],['Hex','hex','hextechnologies'],['Sigma Computing','sigmacomputing'],['ClickHouse','clickhouse'],['MotherDuck','motherduck'],['Fivetran','fivetran'],['Hightouch','hightouch'],['Census','census'],['Datadog','datadog'],['Grafana Labs','grafanalabs'],['Cribl','cribl'],['Chronosphere','chronosphere'],['Sourcegraph','sourcegraph91','sourcegraph'],['Cognition','cognition'],['Replit','replit'],['Cursor','anysphere','cursor'],['Codeium / Windsurf','codeium','windsurf'],['Factory','factory','factoryai'],['Augment Code','augmentcode','augment'],['Warp','warp'],['Tabnine','tabnine'],['Graphite','graphite','withgraphite'],['Browserbase','browserbase'],['E2B','e2b'],['Daytona','daytona'],['Arize AI','arizeai'],['Braintrust','braintrust','braintrustdata'],['Galileo','galileo','rungalileo'],['Patronus AI','patronusai'],['Langfuse','langfuse'],['Humanloop','humanloop'],['Vellum','vellum'],['Dust','dust'],['Glean','gleanwork','glean'],['Notion','notion'],['Airtable','airtable'],['Zapier','zapier'],['n8n','n8n'],['Workato','workato'],['UiPath','uipath'],['Celonis','celonis'],
 // Vertical and applied AI
 ['Sierra','sierra'],['Decagon','decagon','decagonai'],['Harvey','harvey'],['Legora','legora'],['EvenUp','evenup','evenuplaw'],['Spellbook','spellbook'],['Ironclad','ironcladhq','ironclad'],['Clio','clio'],['Hebbia','hebbia'],['Rogo','rogo'],['Brightwave','brightwave'],['AlphaSense','alphasense'],['Abridge','abridge'],['Ambience Healthcare','ambiencehealthcare','ambience'],['Hippocratic AI','hippocraticai'],['Tennr','tennr'],['Infinitus','infinitus','infinitussystems'],['Commure','commure'],['Cohere Health','coherehealth'],['Notable','notable','notablehealth'],['Suki','suki','sukiai'],['Nabla','nabla'],['OpenEvidence','openevidence'],['Cresta','cresta'],['Parloa','parloa'],['PolyAI','polyai'],['Bland AI','bland','blandai'],['Vapi','vapi'],['Retell AI','retellai'],['Synthflow','synthflow'],['Ada','ada','ada18'],['Forethought','forethought'],['Intercom','intercom'],['Assembled','assembled'],['Maven AGI','mavenagi'],['Crescendo','crescendo'],['Gorgias','gorgias'],['Distyl AI','distyl','distylai'],['Tribe AI','tribeai'],['Fractional AI','fractional','fractionalai'],['Credal','credal'],['Jasper','jasper'],['Typeface','typeface'],['Moveworks','moveworks'],['Aisera','aisera'],['Tines','tines'],['Torq','torq'],['Unify','unify','unifygtm'],['Clay','clay','claylabs'],['11x','11x'],['Artisan','artisan'],['Rilla','rilla'],['Gong','gong','gongio'],['Outreach','outreach'],['Apollo.io','apolloio','apollo'],['Attio','attio'],['Ramp','ramp'],['Brex','brex'],['Mercury','mercury'],['Rippling','rippling'],['Deel','deel'],['Gusto','gusto'],['Navan','navan','tripactions'],['Pigment','pigment'],['Rillet','rillet'],['Basis','basis','getbasis'],['Numeric','numeric'],['Campfire','campfire'],['Puzzle','puzzle'],['Stripe','stripe'],['Plaid','plaid'],['Modern Treasury','moderntreasury'],['Alloy','alloy'],['Unit21','unit21'],['Sardine','sardine'],['Persona','persona'],['Socure','socure'],['Feedzai','feedzai'],['Hadrian','hadrian'],['Bedrock Robotics','bedrockrobotics'],['Physical Intelligence','physicalintelligence'],['Figure','figureai','figure'],['Skild AI','skildai'],['Covariant','covariant'],['Formic','formic','formictechnologies'],['Machina Labs','machinalabs'],['Instrumental','instrumental'],['Tulip','tulip','tulipinterfaces'],['Augury','augury'],['Samsara','samsara','samsarainc'],['Motive','motive','gomotive'],['Flexport','flexport'],['project44','project44'],['Pallet','pallet'],['Vooma','vooma'],['Loop','loop','loopinc'],['Shipwell','shipwell'],['Endex','endex'],['Rox','rox'],['Glide','glide'],['Ramp Labs','ramplabs'],['Anterior','anterior'],['Ellipsis Health','ellipsishealth'],['Assort Health','assorthealth'],['Freed','freed','getfreed'],['Fieldguide','fieldguide'],['Trullion','trullion'],['Norm Ai','normai'],['Casetext','casetext'],['Eudia','eudia'],['Crosby','crosby'],['Ivo','ivo'],['DeepJudge','deepjudge'],['Sola','sola','solasecurity'],['Prophet Security','prophetsecurity'],['Dropzone AI','dropzoneai'],['Abnormal Security','abnormalsecurity'],['Wiz','wiz','wizinc'],['Chainguard','chainguard'],['Semgrep','semgrep'],['Snyk','snyk'],['Vanta','vanta'],['Drata','drata'],['Material Security','materialsecurity'],['Cyera','cyera'],['Island','island'],['Arctic Wolf','arcticwolf'],
 // Defense, government, and industrial
 ['Palantir','palantir'],['Anduril','andurilindustries','anduril'],['Shield AI','shieldai'],['Scale AI Public Sector','scaleaipublicsector'],['Applied Intuition','appliedintuition'],['Saronic','saronic'],['Hermeus','hermeus'],['Epirus','epirus','epirusinc'],['Castelion','castelion'],['Chaos Industries','chaosindustries'],['Skydio','skydio'],['Vannevar Labs','vannevarlabs'],['Rebellion Defense','rebelliondefense'],['Govini','govini'],['Second Front','secondfront','secondfrontsystems'],['Primer','primer','primerai'],['Hadean','hadean'],['Helsing','helsing'],['Picogrid','picogrid'],['Tagup','tagup'],['Ursa Major','ursamajor'],['Firestorm','firestormlabs'],['Mach Industries','machindustries'],['Overland AI','overlandai'],['Rune Technologies','runetechnologies'],['Legion Intelligence','legionintelligence'],['Ask Sage','asksage'],['EdgeRunner AI','edgerunnerai'],['Govdash','govdash'],['Hyperproof','hyperproof'],['Percipient.ai','percipientai'],['Nominal','nominal','nominalio'],['Sift','sift','siftstack'],['Vise','vise'],['Durable','durable'],
 // Large software companies with public boards
 ['Salesforce','salesforce'],['ServiceNow','servicenow'],['Intuit','intuit'],['Coinbase','coinbase'],['Instacart','instacart'],['DoorDash','doordash','doordashusa'],['Airbnb','airbnb'],['Lyft','lyft'],['Pinterest','pinterest'],['Reddit','reddit'],['Discord','discord'],['Figma','figma'],['Canva','canva'],['Atlassian','atlassian'],['HubSpot','hubspot','hubspotjobs'],['Twilio','twilio'],['Okta','okta'],['Cloudflare','cloudflare'],['MongoDB','mongodb'],['Elastic','elastic'],['Confluent','confluent'],['GitLab','gitlab'],['HashiCorp','hashicorp'],['PagerDuty','pagerduty'],['Amplitude','amplitude'],['Mixpanel','mixpanel'],['Segment','segment'],['Braze','braze'],['Iterable','iterable'],['Asana','asana'],['Box','boxinc','box'],['Dropbox','dropbox'],['DocuSign','docusign'],['Zendesk','zendesk'],['Toast','toast'],['Benchling','benchling'],['Tempus','tempus'],['Flatiron Health','flatironhealth'],['Komodo Health','komodohealth'],['Veeva','veeva'],['Hinge Health','hingehealth'],['Oscar Health','oscar','oscarhealth'],['Affirm','affirm'],['Chime','chime'],['Robinhood','robinhood'],['SoFi','sofi'],['Nubank','nubank'],['Wealthsimple','wealthsimple'],['Grammarly','grammarly'],['Duolingo','duolingo'],
];

const pick=(slug,ats)=>({
 greenhouse:'https://boards-api.greenhouse.io/v1/boards/'+slug+'/jobs',
 lever:'https://api.lever.co/v0/postings/'+slug+'?mode=json',
 ashby:'https://api.ashbyhq.com/posting-api/job-board/'+slug+'?includeCompensation=true',
}[ats]);

async function getJson(url){
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(url,{headers:{'user-agent':'open-fde.ai job index (+https://open-fde.ai)'},signal:AbortSignal.timeout(20000)});
   if(response.status===404||response.status===400)return null;
   if(!response.ok)throw Error('HTTP '+response.status);
   return await response.json();
  }catch(error){if(attempt===2)return null;await new Promise(resolve=>setTimeout(resolve,800*(attempt+1)));}
 }
}

function normalize(ats,data){
 if(ats==='greenhouse')return (data?.jobs||[]).map(job=>({title:job.title,url:job.absolute_url,location:job.location?.name||'',remote:/remote/i.test(job.location?.name||''),posted:(job.first_published||job.updated_at||'').slice(0,10),department:'',compensation:''}));
 if(ats==='lever')return (Array.isArray(data)?data:[]).map(job=>({title:job.text,url:job.hostedUrl,location:job.categories?.allLocations?.join(' · ')||job.categories?.location||'',remote:job.workplaceType==='remote'||/remote/i.test(job.categories?.location||''),posted:job.createdAt?new Date(job.createdAt).toISOString().slice(0,10):'',department:job.categories?.team||'',compensation:''}));
 if(ats==='ashby')return (data?.jobs||[]).filter(job=>job.isListed!==false).map(job=>({title:job.title,url:job.jobUrl,location:[job.location,...(job.secondaryLocations||[]).map(item=>item.location)].filter(Boolean).join(' · '),remote:!!job.isRemote||job.workplaceType==='Remote',posted:(job.publishedAt||'').slice(0,10),department:job.department||'',compensation:job.compensation?.compensationTierSummary||''}));
 return [];
}

async function pool(items,limit,worker){const results=[];let next=0;await Promise.all(Array.from({length:limit},async()=>{while(next<items.length){const index=next++;results[index]=await worker(items[index]);}}));return results;}

export async function collect(){
 const probes=[];
 for(const [name,...slugs] of companies)for(const slug of slugs)for(const ats of ['greenhouse','lever','ashby'])probes.push({name,slug,ats});
 const responses=await pool(probes,24,async probe=>({...probe,data:await getJson(pick(probe.slug,probe.ats))}));
 const boards=responses.filter(response=>response.data&&normalize(response.ats,response.data).length);
 const seen=new Set();const jobs=[];
 for(const board of boards){
  for(const job of normalize(board.ats,board.data)){
   if(!ROLE.test(job.title)||!job.url||seen.has(job.url))continue;
   seen.add(job.url);
   jobs.push({company:board.name,ats:board.ats,board:board.slug,...job,title:job.title.trim(),location:job.location.trim()});
  }
 }
 return {boards:boards.map(board=>({company:board.name,ats:board.ats,slug:board.slug,openings:normalize(board.ats,board.data).length})),jobs};
}

if(import.meta.url==='file://'+process.argv[1]){
 const {boards,jobs}=await collect();
 // A board outage or rate limit can drop most postings at once; keep the last snapshot instead.
 const previous=JSON.parse(readFileSync(new URL('../docs/JOBS.json',import.meta.url),'utf8')).jobs.length;
 if(jobs.length<previous*0.6&&!process.argv.includes('--force')){console.error(`Only ${jobs.length} postings found, down from ${previous}. Snapshot not written; rerun with --force if the drop is real.`);process.exit(1);}
 const checkedAt=new Date().toISOString();
 jobs.sort((a,b)=>a.company.localeCompare(b.company)||a.title.localeCompare(b.title)||a.location.localeCompare(b.location)||a.url.localeCompare(b.url));
 writeFileSync(new URL('../docs/JOBS.json',import.meta.url),JSON.stringify({checkedAt,method:'Public Greenhouse, Lever, and Ashby job-board APIs; titles matched '+ROLE.source,boardsChecked:boards.length,companiesProbed:new Set(companies.map(([name])=>name)).size,jobs},null,1)+'\n');
 if(process.argv.includes('--discover'))console.log(boards.map(board=>board.company+' '+board.ats+':'+board.slug+' ('+board.openings+')').join('\n'));
 const byCompany={};for(const job of jobs)byCompany[job.company]=(byCompany[job.company]||0)+1;
 console.log(JSON.stringify({checkedAt,boards:boards.length,jobs:jobs.length,companies:Object.keys(byCompany).length,byCompany},null,1));
}
