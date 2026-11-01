import {readFileSync} from 'node:fs';

// Interview guides by company, built from docs/INTERVIEWS.json (researched from public sources;
// every stage, question, tip, and policy points to a source the company entry lists).
// Companies with enough material get their own page; the rest stay on the Companies tab.
export const interviewData=JSON.parse(readFileSync(new URL('../docs/INTERVIEWS.json',import.meta.url),'utf8'));

const escape=value=>String(value??'').replace(/[&<>"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[character]));
export const typeLabels={decomposition:'Decomposition','system-design':'System design',coding:'Coding','take-home':'Take-home','ai-build':'AI build',debugging:'Debugging','customer-scenario':'Customer scenario',presentation:'Presentation','sql-data':'SQL and data',domain:'Domain',behavioral:'Behavioral',motivation:'Motivation'};
export const evidenceLabels={employer:'Employer-published',employee:'Employee account',candidate:'Candidate report','third-party':'Third-party guide'};
const evidenceOrder=['employer','employee','candidate','third-party'];
export const companies=interviewData.companies;
export const richCompany=company=>company.questions.length>=5;
const sourceOf=(company,id)=>company.sources.find(source=>source.id===id);
const cite=(company,ids)=>String(ids).split(/\s+/).filter(Boolean).map(id=>{const source=sourceOf(company,id);if(!source)throw new Error(`Unknown source ${id} for ${company.company}`);return `<a class="cite" href="${escape(source.url)}" rel="noopener" title="${escape(source.title)} (${evidenceLabels[source.kind]})">[${company.sources.indexOf(source)+1}]</a>`;}).join('');
const badge=kind=>`<span class="evidence evidence-${kind}">${evidenceLabels[kind]}</span>`;
const newest=company=>company.sources.map(source=>source.date).filter(Boolean).sort().pop()||'';
const mix=items=>evidenceOrder.filter(kind=>items.some(item=>item.evidence===kind)).map(kind=>`${items.filter(item=>item.evidence===kind).length} ${evidenceLabels[kind].toLowerCase()}`).join(', ');
const plural=(count,word)=>`${count} ${word}${count===1?'':'s'}`;

// The loop most FDE employers share, matched from each company's documented stages.
export const loopStages=[
 ['Recruiter screen',/recruiter|intro call|phone call|application/i,'Why forward deployed work, why this company, location, level, and past customer-facing work.'],
 ['Technical screen or coding',/technical screen|coding|assessment|coderpad|live technical|pair/i,'Practical code under time pressure: data handling, APIs, simple algorithms, often with follow-ups on complexity.'],
 ['Take-home or build',/take-home|take home|build|project|exercise|notebook/i,'A working artifact, often an LLM or agent app, then a walkthrough of the design choices.'],
 ['Decomposition or system design',/decomp|system design|design|case/i,'Turn a vague customer goal into users, data, a first slice, and success metrics before building.'],
 ['Customer simulation or presentation',/customer|client|presentation|present|pitch|demo|kickoff/i,'Explain, demo, and defend work to a non-technical or executive audience.'],
 ['Hiring manager and values',/hiring manager|behavioral|values|leadership|culture|executive|team/i,'Ownership in past projects, judgment, and how you work with customers and teammates.'],
];
const stageCompanies=pattern=>companies.filter(company=>company.process.some(stage=>pattern.test(stage.stage+' '+stage.format)));

const questionItem=(company,question,bank)=>`<li class="q-item"${bank?' data-kind="Interview question"':''} data-item="questions" data-category="${question.type}" data-company="${escape(company.slug)}" data-evidence="${question.evidence}" id="${question.id}">${bank?`<h3 class="q-prompt">${escape(question.prompt)}</h3>`:`<p class="q-prompt">${escape(question.prompt)}</p>`}<p class="q-meta"><span class="tag">${typeLabels[question.type]||question.type}</span>${badge(question.evidence)}${question.role?`<span>${escape(question.role)}</span>`:''}${question.year?`<span>${escape(question.year)}</span>`:''}${cite(company,question.source)}</p>${question.note?`<p class="q-note">${escape(question.note)}</p>`:''}</li>`;

export function companyGuide(company,openRoles){
 const byType=Object.keys(typeLabels).map(type=>[type,company.questions.filter(question=>question.type===type)]).filter(([,items])=>items.length);
 return `<article class="company-guide" id="${company.slug}-interview" data-company-guide${richCompany(company)?' data-rich':''}>
<header class="guide-head"><h3>${escape(company.company)} interview</h3><p class="guide-roles">${company.roles.map(escape).join(' · ')}</p><p class="guide-meta">${plural(company.process.length,'stage')} and ${plural(company.questions.length,'question')} from ${plural(company.sources.length,'source')}${newest(company)?`, newest ${escape(newest(company))}`:''}.${openRoles?` <a href="#jobs">${plural(openRoles,'open role')}</a> in the jobs snapshot.`:''}</p></header>
${company.process.length?`<h4>Process</h4><ol class="loop">${company.process.map(stage=>`<li><p class="stage-name">${escape(stage.stage)}</p><p>${escape(stage.format)}${stage.format&&!/[.!?]$/.test(stage.format)?'.':''} ${stage.assesses?`<span class="assesses">Assesses: ${escape(stage.assesses)}.</span>`:''} ${cite(company,stage.source)}</p></li>`).join('')}</ol>`:''}
${company.aiPolicy?.text?`<p class="ai-policy"><strong>AI tools in interviews:</strong> ${escape(company.aiPolicy.text)} ${cite(company,company.aiPolicy.source)}</p>`:''}
${byType.length?`<h4>Questions</h4>${byType.map(([type,items])=>`<h5>${typeLabels[type]} <span>${items.length}</span></h5><ul class="q-list">${items.map(question=>questionItem(company,question)).join('')}</ul>`).join('')}`:''}
${company.tips.length?`<h4>Tips from the sources</h4><ul class="tips">${company.tips.map(tip=>`<li>${escape(tip.text)} ${cite(company,tip.source)}</li>`).join('')}</ul>`:''}
${company.gaps?`<p class="gaps"><strong>Not found in public sources:</strong> ${escape(company.gaps)}</p>`:''}
<h4>Sources</h4><ol class="source-list">${company.sources.map(source=>`<li><a href="${escape(source.url)}" rel="noopener">${escape(source.title)}</a>. ${escape(source.publisher)}${source.date?`, ${escape(source.date)}`:''}. ${badge(source.kind)}</li>`).join('')}</ol>
</article>`;
}

export function interviewPanel({subnav,heading,practiceRows,openRolesFor}){
 const rich=companies.filter(richCompany),thin=companies.filter(company=>!richCompany(company));
 const allQuestions=companies.flatMap(company=>company.questions.map(question=>[company,question]));
 const totalSources=companies.reduce((sum,company)=>sum+company.sources.length,0);
 const table=`<div class="table-wrap"><table class="brief-table company-table"><thead><tr><th scope="col">Company</th><th scope="col">Stages</th><th scope="col">Questions</th><th scope="col">Evidence</th><th scope="col">Newest</th></tr></thead><tbody>${companies.filter(company=>company.process.length||company.questions.length).sort((a,b)=>b.questions.length-a.questions.length||b.process.length-a.process.length).map(company=>`<tr><th scope="row"><a href="#${company.slug}-interview">${escape(company.company)}</a></th><td>${company.process.length}</td><td>${company.questions.length}</td><td>${mix(company.questions)||'Process only'}</td><td>${escape(newest(company))}</td></tr>`).join('')}</tbody></table></div>`;
 const empty=companies.filter(company=>!company.process.length&&!company.questions.length);
 const overview=`<section class="group" id="interview-overview" role="tabpanel" aria-labelledby="tab-interview-overview"><h2 class="group-title">How forward deployed interviews work</h2>
<p class="group-intro">${allQuestions.length} questions and ${companies.reduce((sum,company)=>sum+company.process.length,0)} interview stages from ${totalSources} public sources, covering ${companies.filter(company=>company.process.length||company.questions.length).length} companies that hire forward deployed engineers. Every item links to where it was published. Loops change often and vary by team, so confirm the current format with your recruiter.</p>
<h3>The loop most employers share</h3>
<ol class="loop loop-generic">${loopStages.map(([name,pattern,tests])=>{const using=stageCompanies(pattern);return `<li><p class="stage-name">${name}</p><p>${tests}</p><p class="stage-companies">Documented at ${using.length} of ${companies.filter(company=>company.process.length).length} companies with a known process${using.length?`: ${using.slice(0,8).map(company=>`<a href="#${company.slug}-interview">${escape(company.company)}</a>`).join(', ')}${using.length>8?' and more':''}`:''}.</p></li>`;}).join('')}</ol>
<h3>What sets these loops apart from software engineering interviews</h3>
<ul class="brief-list plain"><li><strong>Building with AI is often the test, not cheating.</strong> Sierra’s onsite has you build alone for about two hours with any AI tools; Glean gives every FDE candidate an AI-focused exercise. Others, such as Anthropic and Salesforce, ban AI tools unless the interviewer allows them. Check each company’s policy below.</li><li><strong>Vague prompts on purpose.</strong> Palantir and Databricks run decomposition rounds that start from a business goal, such as improving traffic with city data, and judge how you frame users, data, and metrics before any design.</li><li><strong>Customer rooms.</strong> Cognition, Clay, and ElevenLabs use simulated customer calls, executive pitches, or case studies with a non-technical buyer.</li><li><strong>Take-homes that ship.</strong> OpenAI candidates report a week-long take-home delivered as code plus a running app, then a design walkthrough.</li></ul>
<h3>How to read the evidence</h3>
<dl class="evidence-legend">${evidenceOrder.map(kind=>`<dt>${badge(kind)}</dt><dd>${{employer:'The company describes its own process, on its blog, careers page, or job posting.',employee:'Someone who works there describes it.',candidate:'A first-person account from someone who interviewed. One person, one loop, often one team.',['third-party']:'A prep site or guide. Useful for structure; questions are often unattributed.'}[kind]}</dd>`).join('')}</dl>
<h3>Companies covered</h3>${table}
${empty.length?`<p class="gaps">No public interview material found yet for ${empty.map(company=>escape(company.company)).join(', ')}. Sources on Glassdoor and Blind are excluded because their terms forbid reuse.</p>`:''}
<p class="next-step">Next: open a company guide from the table, drill the <a href="#interview-bank">question bank</a>, then rehearse with the <a href="#q-practice">practice questions</a>.</p>
</section>`;
 const companiesTab=`<section class="group" id="interview-companies" role="tabpanel" aria-labelledby="tab-interview-companies"><h2 class="group-title">Interview guides by company</h2>
<p class="group-intro">Each guide lists the stages in order, what each one assesses, the questions reported at that company, and the sources behind them.</p>
<ul class="guide-index">${rich.map(company=>`<li><a href="#${company.slug}-interview"><strong>${escape(company.company)}</strong><span>${plural(company.process.length,'stage')}, ${plural(company.questions.length,'question')}, newest ${escape(newest(company))}</span></a></li>`).join('')}</ul>
${rich.map(company=>companyGuide(company,openRolesFor(company.company))).join('')}
${thin.filter(company=>company.process.length||company.questions.length||company.aiPolicy?.text).length?`<h3 class="thin-title">Companies with less public material</h3>${thin.filter(company=>company.process.length||company.questions.length||company.aiPolicy?.text).map(company=>companyGuide(company,openRolesFor(company.company))).join('')}`:''}
</section>`;
 const companyOptions=companies.filter(company=>company.questions.length).map(company=>`<option value="${escape(company.slug)}">${escape(company.company)}</option>`).join('');
 const bank=`<section class="group" id="interview-bank" role="tabpanel" aria-labelledby="tab-interview-bank"><h2 class="group-title">FDE interview question bank</h2>
<p class="group-intro">Every question reported or published for forward deployed roles, paraphrased, with its source and evidence type. Answer aloud and state your assumptions before you look anything up.</p>
<div class="filterbar"><label class="search-label"><span class="sr-only">Search questions</span><input type="search" data-search="questions" placeholder="Search questions…"></label><label><span class="sr-only">Filter by company</span><select data-extra-filter="questions" data-field="company"><option value="">All companies</option>${companyOptions}</select></label><label><span class="sr-only">Filter by question type</span><select data-filter="questions"><option value="">All types</option>${Object.entries(typeLabels).filter(([type])=>allQuestions.some(([,question])=>question.type===type)).map(([type,label])=>`<option value="${type}">${label}</option>`).join('')}</select></label><label><span class="sr-only">Filter by evidence</span><select data-extra-filter="questions" data-field="evidence"><option value="">All evidence</option>${evidenceOrder.map(kind=>`<option value="${kind}">${evidenceLabels[kind]}</option>`).join('')}</select></label><span class="result-count" data-count="questions" aria-live="polite"></span></div><p class="empty" data-empty="questions" hidden>No matches. Clear a filter or try another word.</p>
<ul class="q-list q-bank">${allQuestions.map(([company,question])=>questionItem(company,{...question,id:question.id+'-bank'},true).replace('<p class="q-meta">',`<p class="q-meta"><a class="q-company" href="#${company.slug}-interview">${escape(company.company)}</a>`)).join('')}</ul>
</section>`;
 const tabs=[['interview-overview','Overview'],['interview-companies','Companies'],['interview-bank','Question bank'],['q-practice','Practice']];
 return `<section id="interview" class="panel">${heading('','Prepare for the loop.','How forward deployed interviews work at each company, the questions candidates and employers have published, and practice questions with response guides.')}
${subnav(tabs)}
${overview}${companiesTab}${bank}${practiceRows}
</section>`;
}
