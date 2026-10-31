// Original annotations of specific firsthand publications, reviewed 2026-10-31.
export const storySources = [
 ['story-vinoo','The Definitive Guide to Forward Deployed Engineering','Vinoo Ganesh · Next Play','2026-02-05','First-person essay','https://nextplayso.substack.com/p/the-definitive-guide-to-forward-deployed','Content checked; personal retrospective and opinions, not independently audited outcomes'],
 ['story-chinemerem','Who Wants to be a Delta?','Chinemerem E. · Palantir Blog','2021-10-21','Employer-hosted personal essay','https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035','Content checked; author uses an abbreviated surname'],
 ['story-het','What I learned as a forward deployed engineer working at an AI startup','Het Trivedi · Baseten','2024-05-31 · updated 2025-05-17','Employer-hosted personal essay','https://www.baseten.co/blog/what-i-learned-as-a-forward-deployed-engineer-working-at-an-ai-startup/','Content checked; early-tenure account, not a hiring guarantee'],
 ['story-hiro','Hiro Hayami: the first two months at AI Shift · English translation','Hiro Hayami · AI Shift on note','2026-07-08','Employer-hosted personal essay','https://note.com/ai_shift/n/ncf695f3565c6?hl=en','Platform AI translation checked; Japanese original; English name follows that translation'],
 ['story-milos','What FDEs Actually Do All Week','Milos Mandic · FDE Hub','2025-12-09','First-person work diary','https://www.fdehub.org/p/what-fdes-actually-do-all-week','Content checked; self-reported week at Lleverage, not a representative workload survey'],
 ['story-henry','Henry Chang: reflections after a first year as a new-grad FDE','Henry Chang · LinkedIn','Exact date not exposed · edited public post','First-person public post','https://www.linkedin.com/posts/hchang23_hi-friends-it-has-been-a-little-over-a-year-activity-7376835639838695424-PJ-3','Public post text checked; project results not independently corroborated; access may require sign-in'],
 ['story-vlad','Forward deployed engineering on the frontier of AI','Vlad Shulman · Baseten','2025-06-10 · updated 2025-06-11','First-person team-building account','https://www.baseten.co/blog/forward-deployed-engineering/','Content checked; employer-hosted account of one team’s organizational choices'],
 ['story-dongying','Transitioning from Field to Engineering','Dongying Zhou · ActionIQ Tech Blog','2021-12-05','Employer-hosted personal essay','https://medium.com/actioniq-tech/transitioning-from-field-to-engineering-73287cf0dd14','Content checked; describes a 2021 internal move and company-specific role boundaries'],
 ['academy-method','The FDE Academy Method: How Forward Deployed Engineer Training Actually Works','R&D · FDE Academy / Futurense','2026-09-24','Training-provider article','https://fde.academy/blog/fde-academy-method-forward-deployed-engineer-training','Content checked; provider self-description, not an independent assessment of training outcomes'],
 ['plank-about','About Plank · provider context','Plank','Undated · living page','Provider context only','https://joinplank.com/about','Content checked; background only, not a learning assignment or independent endorsement'],
 ['plank-handoff','Day 37: User research and customer cloud','Plank · AI FDE Course','Undated · living lesson','Hands-on lesson','https://joinplank.com/ai-fde-course/user-research-customer-cloud-day-37','Lesson and reference-run limitations checked; course and deployment not independently executed']
].map(([id,title,author,date,type,url,status])=>({id,title,author,date,type,url,status,reviewed:'2026-10-31'}));

export const stories = [
 {
  id:'S01',source:'story-vinoo',person:'Vinoo Ganesh',company:'Palantir · retrospective',category:'Career transitions',kind:'Personal retrospective',
  title:'The field changed how he built product software',journey:'Product engineering ↔ customer deployments → Frontline rotations',
  account:'Ganesh describes an empty date field triggering runaway Cassandra keyspace creation in a customer deployment. Alternating between product work and the field changed the failures he anticipated. He later helped build Frontline, a program that put product engineers into customer deployments.',
  tension:'He describes both overengineering a one-off cleanup and underengineering a script that stayed in use. Urgency alone did not reveal the right lifespan for a solution.',
  focus:'Read “My Transformation” and “Building Frontline,” then compare the two scoping mistakes.',
  question:'What assumption would you test on site before building? Who decides whether a temporary fix is retired or becomes a supported capability?',
  boundary:'Firsthand recollection. The essay’s forecasts and program impact claims are not independently validated here.',related:['ramp','toil']
 },
 {
  id:'S02',source:'story-chinemerem',person:'Chinemerem E.',company:'Palantir · joined from Nigerian fintech',category:'Career transitions',kind:'Employer-hosted essay',
  title:'From backend APIs to owning the customer outcome',journey:'Fintech backend engineer → Forward Deployed Software Engineer',
  account:'After building APIs and payment infrastructure, Chinemerem joined Palantir in 2020. Initially, using an existing platform felt less like engineering than writing the tooling. The role expanded to discovering the problem, scoping it, delivering a solution, and enabling the customer’s IT team.',
  tension:'An identity built around writing code had to accommodate work that made existing capabilities useful. The account connects data work to operational action.',
  focus:'Read the sections on becoming a Delta, redefining engineering, and taking ownership.',
  question:'Which part of your last delivery needed new code, and which needed a better workflow, clearer ownership, or customer enablement?',
  boundary:'Recruiting context and a Foundry-specific experience from 2020–21. Reuse is a judgment call, not a rule against building.',related:['users','flawless']
 },
 {
  id:'S03',source:'story-het',person:'Het Trivedi',company:'Baseten',category:'Career transitions',kind:'Employer-hosted essay',
  title:'A public technical project became a route into FDE',journey:'Startup founder → AI projects and writing → inference FDE',
  account:'After a startup failed to find product–market fit, Trivedi built AI projects and wrote about them. A post using Baseten’s Truss reached a cofounder and led toward the role. His early work involved customer requirements, inference benchmarks, production hardening, and support handoff.',
  tension:'Several technically demanding projects competed for attention. Losing a customer also carried an emotional cost after investing in the deployment.',
  focus:'Follow the path into the job and the sections on customer work and challenges.',
  question:'What public artifact would demonstrate your engineering reasoning and understanding of a customer constraint, beyond showing a polished demo?',
  boundary:'One early-career account hosted by the employer. A visible project can show ability; it does not guarantee an offer.',related:['guidellm','flawless']
 },
 {
  id:'S04',source:'story-hiro',person:'Hiro Hayami',company:'AI Shift · Japan',category:'Career transitions',kind:'Translated personal essay',
  title:'From waterfall delivery to feedback through working software',journey:'Systems integrator / project lead → first two months as an FDE',
  account:'Hayami moved from years of structured systems delivery into AI Shift. Showing working agents surfaced requirements earlier than completing specifications. Integration setup, demos, and feedback became central to the work; colleagues helped challenge the expectation of working alone.',
  tension:'Unstable model behavior challenged habits built around fixed specifications. At publication, the project was released for customer verification; sustained operational use was still ahead.',
  focus:'Read the background, development, and team-collaboration sections in the English view.',
  question:'Where would a prototype clarify uncertainty? Which action still needs deterministic checks and human approval before it can run?',
  boundary:'Japanese original, platform AI translation; names and nuance may differ. Prompt instructions described in the story are not a guarantee of tool ordering or safety.',related:['agents','authorization']
 },
 {
  id:'S05',source:'story-milos',person:'Milos Mandic',company:'Lleverage · AI startup',category:'Life in the field',kind:'First-person work diary',
  title:'The hidden workload between scoping and shipping',journey:'Experienced software engineer → parallel customer deployments',
  account:'Mandic follows a week of simultaneous deployments: an insurance document pipeline needed better edge-case coverage, a shared infrastructure outage interrupted plans, and communication scattered across customer tools. Repeated onboarding explanations became a playbook; recurring implementation needs fed product discussions.',
  tension:'Protected building time competed with support, presales, and status calls. His reported workload is one startup arrangement, not a universal FDE schedule.',
  focus:'Read the active builds, outage, communication, and Friday product-feedback sections.',
  question:'Which interruptions need an immediate response, which can be batched, and which recurring requests should change the product or onboarding process?',
  boundary:'Self-reported diary. Customer examples and time allocation were not independently audited.',related:['toil','hamel']
 },
 {
  id:'S06',source:'story-henry',person:'Henry Chang',company:'Palantir · new graduate',category:'Life in the field',kind:'Short public post',
  title:'A first year across several industries',journey:'UCLA graduate → first year as a Forward Deployed Software Engineer',
  account:'Chang describes work spanning utilities, construction, manufacturing, and historical documents, alongside product-team collaboration. He credits peers and a technical lead, and explicitly says that some projects had not reached production.',
  tension:'A broad project portfolio can contain both deployed services and unfinished experiments. A learning story needs to preserve that distinction.',
  focus:'A brief first-year reflection, useful for project variety and mentorship rather than architecture detail.',
  question:'For each project on your résumé, can you separate your contribution, deployment status, and evidence of use or business impact?',
  boundary:'Personal recruiting post; exact publication date is not exposed. LinkedIn may require sign-in. Scale and impact claims are not independently verified.',related:['staff','experiments']
 },
 {
  id:'S07',source:'story-vlad',person:'Vlad Shulman',company:'Baseten',category:'Building FDE teams',kind:'Team leader’s account',
  title:'Building a team that keeps contributing to the product',journey:'Founder and technical leader → leading an FDE function',
  account:'Shulman describes early engineers becoming Baseten’s first FDEs. Keeping the function in engineering preserved product contributions while adding coordination overhead. Hiring broadened after the team learned that strong software engineers could acquire the required ML knowledge.',
  tension:'A customer workaround can satisfy an immediate need while never reaching the product. Organizational placement alone does not close that loop.',
  focus:'Skip the role introduction; read establishing the function, hiring lessons, and the product-feedback loop.',
  question:'Which recurring field problem has a product owner, adoption criterion, and maintenance budget? What customer work should another function handle?',
  boundary:'One leader’s account. Its preferred reporting line and product-integration target are contextual choices, not universal staffing rules.',related:['team','openai-fde']
 },
 {
  id:'S08',source:'story-dongying',person:'Dongying Zhou',company:'ActionIQ · 2021 role boundaries',category:'After FDE',kind:'Employer-hosted essay',
  title:'Moving from field breadth into engineering depth',journey:'Forward Deployed Engineer → product Software Engineer',
  account:'Zhou moved internally from field engineering to the Execute team in July 2021. Broad platform knowledge had been valuable, but customer-specific configuration did not satisfy the desire to understand the codebase more deeply. The transition brought difficult learning in implementation, debugging, and testing.',
  tension:'Field experience contributed a user perspective; deeper engineering work exposed system internals that had been hard to see from the field.',
  focus:'Read “Making the Move” and “Bringing from and back to Field.”',
  question:'Does your next role offer the depth, customer exposure, mentorship, and ownership you want? Ask about actual work rather than relying on the title.',
  boundary:'ActionIQ’s 2021 organization is not a definition of FDE everywhere. This is an individual internal transfer, not a promised career path.',related:['ddia','staff']
 }
];

export function enrichStories(sources,readings,weeks){
 sources.push(...storySources);
 readings.push({id:'plank-handoff',category:'scale',level:'Practitioner',format:'Hands-on lesson',access:'Free / cloud costs if run',
  why:'Treat the handoff as a usability study: can another person deploy and operate what you built?',
  focus:'Day 37: the runbook test, security review, observed stalls, and findings routed into fixes.',
  outcome:'Have a peer follow the runbook without coaching. Record blocked steps and give each finding an owner.',
  caveat:'The published reference run used agents as simulated participants without a real customer cloud account. It does not establish human usability or production deployment; the lesson itself acknowledges this.'});
 weeks.find(week=>week.id===11).deeper.push('plank-handoff');
}
