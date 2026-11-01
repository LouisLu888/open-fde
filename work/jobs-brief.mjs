// Market brief shown at the top of the Jobs section. Written from the full posting text of the
// 1 November 2026 snapshot (see the method note). The job list refreshes daily; this text does not,
// so rerun the analysis and update the date when the market shifts.
// Numbers come from work/research/jobs-stats.json (npm run research:jobs).
const asks=[['Clear communication',71],['Feeding lessons back to product',62],['Agents',57],['Customer-facing work',56],['Comfort with ambiguity',53],['Python',52],['Startup or founder experience',50],['LLMs',45],['TypeScript or JavaScript',30],['AWS, GCP, or Azure',24],['SQL',19]];

const segments=[
 ['AI labs and model platforms',58,'Python 72%, LLMs 60%, fine-tuning 18%','$185K–$300K (66)'],
 ['Data, infrastructure, devtools',122,'Production 73%, executives 37%, AWS/GCP/Azure 31%','$175K–$250K (117)'],
 ['Vertical and applied AI',269,'Agents 64%, startup experience 55%, consulting 46%, domain titles in banking, investing, law','$160K–$230K (257)'],
 ['Consultancies and services',48,'Agents 73%, LLMs 68%, AWS/GCP/Azure 41%, RAG 40%','$155K–$216K (56)'],
 ['Defense, government, industrial',122,'Travel 65%, Python 57%, LLMs 24%, clearance 23%','$135K–$200K (182)'],
 ['Large software companies',9,'Product feedback 83%, ambiguity 82%, LLMs 63%','$191K–$266K (5)'],
];

export const jobsBrief=()=>`<div class="market-brief">
<p class="brief-lede">We read the full text of all 1,847 postings in the 1 November 2026 snapshot: 1,464 distinct roles at 630 companies. Forward deployed is one title covering five different jobs. All five want an engineer who owns an outcome inside someone else’s systems and can explain it to executives. The employer you pick decides whether you also need model depth, domain experience, or a security clearance.</p>
<h3>One title, five jobs</h3>
<ol class="brief-list">
<li><strong>Production builder.</strong> Ship a working system inside the customer’s stack and own it from discovery to rollout. OpenAI judges its FDEs by production adoption; Databricks FDEs are billable and own the architecture; Palantir FDSEs start from questions like “Why are we losing customers?” 64% of distinct roles use the word production.</li>
<li><strong>Technical pre-sales and adoption.</strong> Demos, pilots, and training that turn a trial into a rollout, as with Cognition’s Deployed Engineers. 21% of roles mention demos. This is the closest to solutions engineering.</li>
<li><strong>Deployment strategist.</strong> Frame the problem, read the data, and win the executive sponsor. 288 postings carry this title; Palantir has the most (36), then Wonderful (26) and Mistral AI (21). Scale AI’s DHS/DOJ strategist carries a multi-million-dollar revenue quota.</li>
<li><strong>Domain expert.</strong> Former bankers, investors, and lawyers who run demos and build workflows: Rogo’s Forward Deployed Banker, Harvey’s Forward Deployed Finance Engineer ($255K–$350K posted). Deal experience counts more than code.</li>
<li><strong>Field engineer.</strong> Deploy and repair autonomy and hardware systems on site at Anduril, Shield AI, and Saronic. Defense, government, and industrial employers mention travel in 65% of roles, about twice as often as vertical AI companies.</li>
</ol>
<h3>What almost every employer asks for</h3>
<p class="brief-note">Share of companies whose postings mention each item.</p>
<ul class="brief-bars">${asks.map(([label,share])=>`<li><span>${label}</span><span class="bar" style="--share:${share}%" aria-hidden="true"></span><span class="share">${share}%</span></li>`).join('')}</ul>
<p>Among roles that state a minimum, the median is 4 years of experience. Only 58 roles are for interns or new graduates, and 23 of those are at Palantir. When a travel share is given, 50% is the most common, then 20–30%, then 75%. New York has the most postings (368), then San Francisco (311), London (146), and Washington, DC (105); 210 are remote.</p>
<h3>How employers differ</h3>
<div class="table-wrap"><table class="brief-table"><thead><tr><th scope="col">Segment</th><th scope="col">Companies</th><th scope="col">What stands out</th><th scope="col">Median posted base range (postings)</th></tr></thead><tbody>${segments.map(([name,count,stands,pay])=>`<tr><th scope="row">${name}</th><td>${count}</td><td>${stands}</td><td>${pay}</td></tr>`).join('')}</tbody></table></div>
<h3>How to get hired</h3>
<ol class="brief-list">
<li><strong>Pick one of the five jobs.</strong> A résumé that reads as builder and strategist at once reads as neither.</li>
<li><strong>Lead with one system you shipped into someone else’s environment:</strong> the messy starting point, the constraint, what ran in production, and the number that moved.</li>
<li><strong>Bring a working artifact.</strong> An agent on real, messy data with evals, access control, and a rollback answers the production, agents, and evaluation asks in one link.</li>
<li><strong>Practice turning a vague question into a scoped plan out loud.</strong> It is the core of the Palantir loop and of most others; see the <a href="#interview">interview questions</a>.</li>
<li><strong>Match the segment’s entry ticket:</strong> domain experience for vertical AI, model and eval depth for AI labs, cloud and retrieval skills for consultancies, clearance eligibility and travel tolerance for defense.</li>
</ol>
<h3>How to do well once hired</h3>
<p>Postings define success the same way: systems in production use rather than demos, a customer who can run the system after you leave, and field lessons that reach the product team. Scope tightly, measure with evals, and write decisions down. The <a href="#learn">Learn</a> chapters cover each step.</p>
<p class="brief-method">Method: keyword counts over the full public text of each posting, counted once per distinct company and title, then averaged per company so Databricks (114 postings) and Palantir (106) do not dominate. Segments for companies outside the original hand-sorted list come from their industry labels. Pay uses posted base ranges only (683 postings, mostly US) and excludes equity and bonus. AI-assisted analysis. The list below refreshes daily; this summary reflects the 1 November 2026 snapshot.</p>
</div>`;
