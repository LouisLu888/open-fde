// Filter groups for the Jobs table. Industry labels in docs/COMPANIES.json are free text (hundreds of
// distinct values), so each is placed in one sector by the first rule that matches; order matters.
export const sectorRules=[
 ['Consulting and services',/consult|venture studio|advisory|\bIT services|cloud services|\bMSP\b|transformation services|(ai|data|enablement|deployment|implementation|engineering|enterprise ai) services|staffing$/i],
 ['Security and identity',/security|cyber|identity|privacy|authentication|social engineering|trust and safety/i],
 ['Defense and government',/defen[cs]e|military|national security|government|govtech|public (sector|safety)|border|law enforcement|child welfare/i],
 ['Healthcare and life sciences',/health|medic|clinic|pharma|bio|drug|patient|hospital\b|life science|dental|genom|protein|\bmri\b|mental/i],
 ['Legal',/legal|\blaw\b/i],
 ['Finance and insurance',/financ|fintech|bank|insur|payment|lending|credit|accounting|\btax\b|invest|trading|wealth|crypto|blockchain|bitcoin|treasury|fraud|compliance|kyc|kyb|regtech|capital markets|private equity|private markets|hedge fund|audit|fp&a|collections|deductions/i],
 ['Industrial, energy, and logistics',/space|satellite|aerospace|robot|manufactur|industrial|mining|construction|energy|electrif|hardware|logistics|supply chain|freight|trucking|fleet|warehouse|aviation|agri|agtech|drone|autonom|utility|cities|permitting|climate|nuclear|semiconductor|chip|automotive|maritime|mobility|transit|real estate|proptech|property|home services|procurement|distributor|waste|physical|civil engineering|cad\b|cae\b/i],
 ['AI models and research',/ai models?|models? (marketplace|&)|language models|llm|foundation|interpretab|ai safety|ai research|training data|post-training|evals?\b|benchmark|ai lab|ai for (science|materials)|scientific/i],
 ['AI infrastructure',/inference|gpu|ai cloud|ai training|compute|ai infrastructure|mlops|vector|ai platform|computer vision|\bedge ai/i],
 ['Customer experience and sales',/customer (service|support|experience|success|messaging)|contact center|call center|voice|speech|sales|marketing|crm|go-to-market|gtm|commerce|retail|grocery|restaurant|advertis|recruit|cpq|quot/i],
 ['Software, data, and developer tools',/data|database|analytics|cloud|developer|devops|observability|\bapi\b|infrastructure|integration|storage|network|coding|code|search|ci\/cd|testing|documentation|software|saas|\berp\b|open source/i],
 ['Enterprise AI and automation',/enterprise|agent|productivity|knowledge|work|collaborat|copilot|assistant|document|automation|communication|\bai\b/i],
];
export const sectorList=[...sectorRules.map(([name])=>name),'Other','Unknown'];
export const sectorOf=industry=>industry?(sectorRules.find(([,rule])=>rule.test(industry))?.[0]||'Other'):'Unknown';

// Funding stage, from the stage label ("Private, Series B", "Public", "Acquired", ...).
export const stageList=['Seed','Series A','Series B','Series C','Series D and later','Late-stage private','Bootstrapped','Public','Acquired or subsidiary','Unknown'];
export const stageOf=stage=>!stage?'Unknown':/seed/i.test(stage)?'Seed':/series a\b/i.test(stage)?'Series A':/series b\b/i.test(stage)?'Series B':/series c\b/i.test(stage)?'Series C':/series [d-z]/i.test(stage)?'Series D and later':/late/i.test(stage)?'Late-stage private':/bootstrap/i.test(stage)?'Bootstrapped':/public/i.test(stage)?'Public':/acqui|subsidiar/i.test(stage)?'Acquired or subsidiary':'Unknown';
