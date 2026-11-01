// Market brief shown at the top of the Jobs section. Written from the full posting text of the
// 1 November 2026 snapshot (see the method note). The job list refreshes daily; this text does not,
// so rerun the analysis and update the date when the market shifts.
const asks=[['Clear communication',78],['Feeding lessons back to product',70],['Customer-facing work',61],['Agents',58],['Comfort with ambiguity',56],['Startup or founder experience',52],['Python',48],['LLMs',46],['TypeScript or JavaScript',24],['SQL',18],['AWS, GCP, or Azure',18]];

const segments=[
 ['AI labs and model platforms',16,'LLMs 70%, startup experience 70%, fine-tuning 29%, RAG 28%','$185K–$300K (38)'],
 ['Data, infrastructure, devtools',21,'Ambiguity 72%, executives 50%, data engineering 36%, cloud 28%','$180K–$270K (25)'],
 ['Vertical and applied AI',35,'Consulting 43%, SQL 29%, domain titles in banking, investing, law','$154K–$200K (57)'],
 ['Defense, government, industrial',11,'Travel 82%, Python 68%, clearance 63%, LLMs 8%','$135K–$175K (71)'],
 ['Large software companies',9,'Product feedback 83%, ambiguity 82%, LLMs 63%','$191K–$266K (6)'],
];

export const jobsBrief=()=>`<div class="market-brief">
<p class="brief-lede">We read the full text of all 588 postings in the 1 November 2026 snapshot: 417 distinct roles at 92 companies. Forward deployed is one title covering five different jobs. All five want an engineer who owns an outcome inside someone else’s systems and can explain it to executives. The employer you pick decides whether you also need model depth, domain experience, or a security clearance.</p>
<h3>One title, five jobs</h3>
<ol class="brief-list">
<li><strong>Production builder.</strong> Ship a working system inside the customer’s stack and own it from discovery to rollout. OpenAI judges its FDEs by production adoption; Databricks FDEs are billable and own the architecture; Palantir FDSEs start from questions like “Why are we losing customers?” 56% of distinct roles use the word production.</li>
<li><strong>Technical pre-sales and adoption.</strong> Demos, pilots, and training that turn a trial into a rollout, as with Cognition’s Deployed Engineers. 24% of roles mention demos. This is the closest to solutions engineering.</li>
<li><strong>Deployment strategist.</strong> Frame the problem, read the data, and win the executive sponsor. 85 postings carry this title, 36 of them at Palantir. Scale AI’s DHS/DOJ strategist carries a multi-million-dollar revenue quota.</li>
<li><strong>Domain expert.</strong> Former bankers, investors, and lawyers who run demos and build workflows: Rogo’s Forward Deployed Banker, Harvey’s Forward Deployed Finance Engineer ($255K–$350K posted). Deal experience counts more than code.</li>
<li><strong>Field engineer.</strong> Deploy and repair autonomy and hardware systems on site at Anduril, Shield AI, and Saronic. Defense postings mention travel in 82% of roles and security clearance in 63%.</li>
</ol>
<h3>What almost every employer asks for</h3>
<p class="brief-note">Share of companies whose postings mention each item.</p>
<ul class="brief-bars">${asks.map(([label,share])=>`<li><span>${label}</span><span class="bar" style="--share:${share}%" aria-hidden="true"></span><span class="share">${share}%</span></li>`).join('')}</ul>
<p>Among roles that state a minimum, the median is 5 years of experience. Only 28 roles are for interns or new graduates, and 23 of those are at Palantir. When a travel share is given, 50% is the most common, then 20–25%, then 75%. New York has the most postings (139), then San Francisco (93), London (66), and Washington, DC (60); 52 are remote.</p>
<h3>How employers differ</h3>
<div class="table-wrap"><table class="brief-table"><thead><tr><th scope="col">Segment</th><th scope="col">Companies</th><th scope="col">What stands out</th><th scope="col">Median posted base range (postings)</th></tr></thead><tbody>${segments.map(([name,count,stands,pay])=>`<tr><th scope="row">${name}</th><td>${count}</td><td>${stands}</td><td>${pay}</td></tr>`).join('')}</tbody></table></div>
<h3>How to get hired</h3>
<ol class="brief-list">
<li><strong>Pick one of the five jobs.</strong> A résumé that reads as builder and strategist at once reads as neither.</li>
<li><strong>Lead with one system you shipped into someone else’s environment:</strong> the messy starting point, the constraint, what ran in production, and the number that moved.</li>
<li><strong>Bring a working artifact.</strong> An agent on real, messy data with evals, access control, and a rollback answers the production, agents, and evaluation asks in one link.</li>
<li><strong>Practice turning a vague question into a scoped plan out loud.</strong> It is the core of the Palantir loop and of most others; see the <a href="#interview">interview questions</a>.</li>
<li><strong>Match the segment’s entry ticket:</strong> domain experience for vertical AI, model and eval depth for AI labs, clearance eligibility and travel tolerance for defense.</li>
</ol>
<h3>How to do well once hired</h3>
<p>Postings define success the same way: systems in production use rather than demos, a customer who can run the system after you leave, and field lessons that reach the product team. Scope tightly, measure with evals, and write decisions down. The <a href="#learn">Learn</a> chapters cover each step.</p>
<p class="brief-method">Method: keyword counts over the full public text of each posting, counted once per distinct company and title, then averaged per company so Databricks (114 postings) and Palantir (106) do not dominate. Pay uses posted base ranges only (197 postings, mostly US) and excludes equity and bonus. AI-assisted analysis. The list below refreshes daily; this summary reflects the 1 November 2026 snapshot.</p>
</div>`;
