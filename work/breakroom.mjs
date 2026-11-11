// The breakroom: classic jokes, memes, and eponymous laws about consulting, sales, and field engineering.
// Folklore is retold in our own words. Origins are stated only as far as they could be traced;
// "House joke" marks lines written for this site.
const nabeel='https://nabeelqu.co/reflections-on-palantir';
const wiki=page=>'https://en.wikipedia.org/wiki/'+page;

export const breakroom=[
 {id:'consultants',title:'Consultants',intro:'The oldest jokes in professional services. They were told about consultants long before anyone was forward deployed, and most of them still land.',items:[
  {id:'watch',setup:'You ask a consultant what time it is.',punch:'They borrow your watch, tell you the time, and send an invoice. In the longer version, they keep the watch.',origin:'Folklore; origin unknown.'},
  {id:'shepherd',setup:'A consultant pulls up beside a shepherd and offers a bet: if he can say exactly how many sheep are in the flock, he keeps one. The shepherd agrees. Out come the laptop, the satellite images, and a model. “1,586.” Correct. He picks an animal and loads it into his car.',punch:'The shepherd offers a bet back: name the man’s job and get the animal back. “You’re a consultant. You came uninvited, charged me for an answer I already had, and you don’t know my business. Now please give me back my dog.”',origin:'Folklore; told in many versions, origin unknown.'},
  {id:'balloon',setup:'A lost balloonist drifts low and shouts down to a man in a field: “Where am I?” The man answers: “About thirty feet up, in a balloon.”',punch:'“You must be a consultant: completely accurate and no use at all.” “And you must be a manager: you don’t know where you are or where you’re going, and somehow it’s now my problem.”',origin:'Folklore. The profession changes with the teller (engineer, IT, mathematician); it was already called an old joke in humor archives in 2000.'},
  {id:'lightbulb',setup:'How many consultants does it take to change a light bulb?',punch:'How many can you afford? (Alternate answer: one, but first an eight-week assessment of the current lighting state.)',origin:'Folklore; origin unknown.'},
  {id:'depends',setup:'The consultant’s answer to every question: “It depends.” The follow-up: a two-by-two matrix.',origin:'Industry saying.'},
  {id:'deck',setup:'A consultant is someone who takes the idea your team already had, puts it on slide 14, and presents it to your CEO.',origin:'Industry saying, in many forms.',truth:'Outside advice often works because it carries authority inside the company, not because the idea is new. Field teams see it too: a proposal can land differently when the vendor presents it.'}
 ]},
 {id:'sales',title:'Sales',intro:'Sales and engineering need each other and joke about each other in roughly equal measure.',items:[
  {id:'ibm',setup:'Nobody ever got fired for buying IBM.',origin:'A saying among computer buyers and salespeople, in print by the mid-1980s; the attribution to IBM itself is unproven.',source:['Barry Popik’s notes on the phrase','https://barrypopik.com/blog/no_one_ever_got_fired_for_buying_ibm_microsoft_gold'],truth:'The joke is about risk, not quality. A champion who buys the safe option keeps their job if the project fails. A young vendor has to make the champion look safe, and on many deals that is the FDE’s job.'},
  {id:'abc',setup:'A, B, C. Always be closing.',origin:'From the 1992 film of Glengarry Glen Ross; the speech was written for the film.',source:['Glengarry Glen Ross (film)',wiki('Glengarry_Glen_Ross_(film)')],truth:'The field version: always be connecting, to the customer’s data, their systems, and the person who can approve access. (House joke.)'},
  {id:'roadmap',setup:'What is a product roadmap?',punch:'A list of features sales has already sold.',origin:'House joke, on an old theme.'},
  {id:'yes',setup:'The customer asks whether the product can do it. Sales says yes. Engineering asks a question.',punch:'“Can it?”',origin:'Industry joke; origin unknown.'},
  {id:'happy-ears',setup:'Happy ears: the condition of hearing “we love it, let’s talk next quarter” and forecasting it as closed.',origin:'Sales slang.'},
  {id:'quarter',setup:'Anything is possible in the last week of the quarter.',punch:'Including discounts, delivery dates, and features nobody has built.',origin:'House joke.'},
  {id:'demo',setup:'The demo worked in all twelve rehearsals.',punch:'The demo gods were at the thirteenth.',origin:'Industry saying.'}
 ]},
 {id:'field',title:'In the field',intro:'Jokes from forward deployed work: the customer site, the data, and the gap between a demo and production. Most are house jokes, and several have a true story behind them.',items:[
  {id:'acronym',setup:'FDE stands for Forward Deployed Engineer.',punch:'Also: Frequently Debugging Excel, Flying Delta Everywhere, and Forever Defending Estimates.',origin:'House joke.'},
  {id:'vs-consultant',setup:'What’s the difference between an FDE and a consultant?',punch:'The FDE has commit access. The consultant gets to leave.',origin:'House joke.',truth:['The serious version of the difference: what an FDE builds goes back into the product, so the next customer is faster. Nabeel Qureshi describes that loop as how Palantir moved from services to product.',nabeel,'Reflections on Palantir']},
  {id:'clean-data',setup:'The customer assured us the data was clean.',punch:'It was. Every column was spotless, in four different date formats.',origin:'House joke.'},
  {id:'access',setup:'How long does it take to deploy an AI model at a large enterprise?',punch:'Two days for the model. Ten weeks for the VPN token.',origin:'House joke.',truth:['Former Palantir FDE Nabeel Qureshi describes pilots that spent 8–12 weeks just getting access to the data.',nabeel,'Reflections on Palantir']},
  {id:'my-machine',setup:'It works on my machine.',punch:'The field edition: it works in our cloud. The customer’s network has a proxy installed in 2009 that no one is allowed to touch.',origin:'The first line is a programmers’ saying; the field edition is a house joke.'},
  {id:'pilot',setup:'How long does a pilot last?',punch:'Until the executive sponsor changes jobs.',origin:'House joke.',truth:'Pilots that never reach production are common enough to have a name: pilot purgatory. Naming a second sponsor early is cheaper than restarting the pilot.'},
  {id:'two-things',setup:'There are only two hard things in computer science: cache invalidation and naming things.',punch:'In the field there are also two: getting access to the data, and getting the team to stop using the spreadsheet.',origin:'First line attributed to Phil Karlton; the field version is a house joke.',source:['Martin Fowler on the quote','https://martinfowler.com/bliki/TwoHardThings.html']},
  {id:'friday',setup:'Read-only Friday.',punch:'A rule followed by every engineer, right up until the customer’s go-live is Friday.',origin:'Industry saying; the punchline is a house joke.'}
 ]},
 {id:'laws',title:'Laws of the trade',intro:'Half joke, half warning. Each one is named after the person who wrote it down, and each one shows up in customer work sooner or later.',items:[
  {id:'ninety',setup:'The ninety-ninety rule',punch:'The first 90 percent of the code takes the first 90 percent of the time. The remaining 10 percent takes the other 90 percent.',origin:'Tom Cargill of Bell Labs, popularized by Jon Bentley in Communications of the ACM, September 1985.',source:['Ninety–ninety rule',wiki('Ninety%E2%80%93ninety_rule')]},
  {id:'hofstadter',setup:'Hofstadter’s law',punch:'Everything takes longer than you expect, even after you allow for Hofstadter’s law.',origin:'Douglas Hofstadter, Gödel, Escher, Bach (1979).',source:['Hofstadter’s law',wiki('Hofstadter%27s_law')]},
  {id:'brooks',setup:'Brooks’s law',punch:'Adding people to a late software project makes it later.',origin:'Fred Brooks, The Mythical Man-Month (1975).',source:['Brooks’s law',wiki('Brooks%27s_law')]},
  {id:'conway',setup:'Conway’s law',punch:'A system ends up shaped like the communication structure of the organization that built it.',origin:'Melvin Conway, “How Do Committees Invent?”, Datamation (1968).',source:['Conway’s law',wiki('Conway%27s_law')],truth:'For an FDE, the customer’s org chart is visible in the integration diagram: one connector per department that does not talk to the others.'},
  {id:'parkinson',setup:'Parkinson’s law',punch:'Work expands to fill the time available for its completion.',origin:'C. Northcote Parkinson, The Economist (1955). Every fixed-fee engagement has tested it.',source:['Parkinson’s law',wiki('Parkinson%27s_law')]},
  {id:'goodhart',setup:'Goodhart’s law',punch:'When a measure becomes a target, it ceases to be a good measure.',origin:'Charles Goodhart (1975); this short wording is Marilyn Strathern’s (1997).',source:['Goodhart’s law',wiki('Goodhart%27s_law')],truth:'The reason the case studies on this site carry an evidence limit: a usage number that was the pilot’s target says little about whether the work got better.'}
 ]}
];

// The tree swing cartoon, described panel by panel. The captions vary between versions.
export const treeSwing={
 id:'tree-swing',
 title:'The tree swing',
 intro:'A cartoon that has hung on office walls since the 1970s. A customer asks for a swing on a tree, and each panel shows what someone along the way made of it. The drawings vary by version; the captions below are the common ones.',
 panels:['How the customer explained it','How the project leader understood it','How the analyst designed it','How the programmer wrote it','How the sales executive described it','How the project was documented','What operations installed','How the customer was billed','How it was supported','What the customer really needed'],
 punch:'The last panel is a plain tire swing. Every panel before it is something more elaborate that does not work as a swing.',
 origin:'The earliest known printing is the University of London Computer Centre newsletter, March 1973; the artist is unknown.',
 source:['Tree swing cartoon',wiki('Tree_swing_cartoon')]
};
