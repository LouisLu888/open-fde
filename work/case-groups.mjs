// Industry and company for each case study, used by the case-study filters.
// Company is the firm that did the deployment work; industry is the customer's.
// New cases set `company` and `industry` on the case itself; this map covers the older ones.
export const caseIndustries=['Aerospace and defense','Manufacturing and industrial','Automotive','Energy and utilities','Healthcare and life sciences','Financial services','Insurance','Retail and consumer goods','Transportation and logistics','Travel and hospitality','Telecom','Government and public sector','Nonprofit','Education','Professional services','Media and advertising','Software and internet'];

const meta={
 C01:['Cognition','Software and internet'],
 C02:['Ramp','Financial services'],
 C03:['Palantir','Aerospace and defense'],
 C04:['OpenAI','Manufacturing and industrial'],
 C05:['OpenAI','Telecom'],
 C06:['OpenAI','Professional services'],
 C07:['OpenAI','Financial services'],
 C08:['OpenAI','Financial services'],
 C09:['Anthropic','Software and internet'],
 C10:['Sierra','Retail and consumer goods'],
 C11:['Sierra','Retail and consumer goods'],
 C12:['Cognition','Financial services'],
 C13:['Cognition','Financial services'],
 C14:['Anthropic','Software and internet'],
 C15:['Ode','Software and internet'],
 C16:['Ode','Software and internet'],
 C17:['Ode','Professional services'],
 C18:['Ode','Healthcare and life sciences'],
 C19:['Ode','Software and internet'],
 C20:['Ode','Retail and consumer goods'],
 C21:['Ode','Media and advertising'],
 C22:['Ode','Software and internet'],
 C23:['Ode','Transportation and logistics'],
 C24:['Ode','Software and internet'],
 C25:['Stripe','Financial services'],
 C26:['GitHub','Software and internet'],
 C27:['Google','Software and internet']
};

export function tagCases(cases){
 const ids=new Set();
 for(const item of cases){
  if(ids.has(item.id))throw new Error(`Duplicate case id ${item.id}`);
  ids.add(item.id);
  const [company,industry]=meta[item.id]||[];
  item.company??=company;
  item.industry??=industry;
  if(!item.company)throw new Error(`${item.id} needs a company`);
  if(!caseIndustries.includes(item.industry))throw new Error(`${item.id} has unknown industry "${item.industry}"`);
 }
}
