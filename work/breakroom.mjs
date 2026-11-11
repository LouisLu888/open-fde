// The breakroom: classic jokes, memes, and eponymous laws about consulting, sales, and field engineering.
// Folklore and memes are retold in our own words (no meme images are copied). Origins are stated only as
// far as they could be traced; "House joke" marks lines written for this site.
// An item is either a dialogue (`lines` shown, `punch` is the last line, said by `punchWho`)
// or a told joke (`setup` shown, `punch` hidden until opened). Laws use `law` and have no punchline.
const nabeel='https://nabeelqu.co/reflections-on-palantir';
const wiki=page=>'https://en.wikipedia.org/wiki/'+page;
const gag=id=>['the post on 9GAG','https://9gag.com/gag/'+id];
const iwsmt=slug=>['the post on iwastesomuchtime','https://www.iwastesomuchtime.com/'+slug];

export const breakroom=[
 {id:'consultants',title:'Consultants',intro:'The oldest jokes in professional services, told about consultants long before anyone was forward deployed.',items:[
  {id:'watch',title:'The borrowed watch',lines:[['You','What time is it?']],punchWho:'Consultant',punch:'May I borrow your watch? … It’s ten past three. I’ll send the invoice. (In the long version, they keep the watch.)',origin:'Folklore; origin unknown.'},
  {id:'shepherd',title:'The shepherd’s dog',setup:'A consultant pulls up beside a shepherd and offers a bet: if he can say exactly how many sheep are in the flock, he keeps one. Out come the laptop, the satellite images, and a model. “1,586.” Correct. He picks an animal and loads it into his car.',punch:'The shepherd offers a bet back and names the man’s job: “You came uninvited, charged me for an answer I already had, and you don’t know my business. Now please give me back my dog.”',origin:'Folklore; told in many versions, origin unknown.'},
  {id:'balloon',title:'Thirty feet up',lines:[['Balloonist','Excuse me, where am I?'],['Man in a field','About thirty feet up, in a balloon.'],['Balloonist','You must be a consultant. Completely accurate, and no use at all.']],punchWho:'Man in a field',punch:'And you must be a manager. You don’t know where you are or where you’re going, and somehow it’s now my problem.',origin:'Folklore. The professions change with the teller; humor archives already called it an old joke in 2000.'},
  {id:'lightbulb',title:'The light bulb',lines:[['Q','How many consultants does it take to change a light bulb?']],punchWho:'A',punch:'How many can you afford? (Alternate answer: one, after an eight-week assessment of the current lighting state.)',origin:'Folklore; origin unknown.'},
  {id:'uber',title:'Imagine Uber, but no car',lines:[['CEO','How do we grow revenue?']],punchWho:'Consultant',punch:'Imagine Uber, but no car. (The meme pairs it with a ride option called Walking Buddy: for a fee, someone walks there with you.)',origin:'Meme; seen on 9GAG.',source:gag('aVgj2Zd')},
  {id:'pokemon',title:'Consulting in 2026',setup:'You ask a business consultant a question in 2026.',punch:'Every answer arrives as a different AI assistant, thrown like a Pokémon: one chatbot, then another, then another.',origin:'Meme; seen on 9GAG.',source:gag('aVgjr8K')},
  {id:'big4',title:'The promotion criteria',setup:'A Big Four firm’s promotion ladder, drawn as six heads: analyst, consultant, senior consultant, manager, senior manager, partner.',punch:'The hairline recedes a little with every promotion. The partner has a full head of hair.',origin:'Meme; seen on 9GAG.',source:gag('a87rXwY')},
  {id:'depends',title:'It depends',setup:'The consultant’s answer to every question: “It depends.” The follow-up: a two-by-two matrix.',origin:'Industry saying.'},
  {id:'demand',title:'The business model',setup:'Under a meme about a school bully who grew up to be a psychiatrist, one commenter summed up a lot of consulting.',punch:'Created the demand, then became the solution.',origin:'Comment on a meme seen on 9GAG.',source:gag('aWpQ6Rq')}
 ]},
 {id:'sales',title:'Sales',intro:'Sales and engineering need each other and joke about each other in roughly equal measure.',items:[
  {id:'yes',title:'Can it?',lines:[['Customer','Can the product do that?'],['Sales','Yes.']],punchWho:'Engineering',punch:'Can it?',origin:'Industry joke; origin unknown.'},
  {id:'roadmap',title:'The roadmap',lines:[['New hire','What is a product roadmap?']],punchWho:'Engineer',punch:'A list of features sales has already sold.',origin:'House joke, on an old theme.'},
  {id:'ibm',title:'The safe choice',setup:'Nobody ever got fired for buying IBM.',origin:'A saying among computer buyers and salespeople, in print by the mid-1980s; the attribution to IBM itself is unproven.',source:['Barry Popik’s notes on the phrase','https://barrypopik.com/blog/no_one_ever_got_fired_for_buying_ibm_microsoft_gold'],truth:'The joke is about risk, not quality. A champion who buys the safe option keeps their job if the project fails. A young vendor has to make the champion look safe, and on many deals that is the FDE’s job.'},
  {id:'abc',title:'A, B, C',setup:'Always be closing.',origin:'From the 1992 film of Glengarry Glen Ross; the speech was written for the film.',source:['Glengarry Glen Ross (film)',wiki('Glengarry_Glen_Ross_(film)')],truth:'The field version: always be connecting, to the customer’s data, their systems, and the person who can approve access. (House joke.)'},
  {id:'cats',title:'Two closing styles',setup:'Sales technique, shown as two cats sitting in a watermelon stall.',punch:'The first cat looks up softly: “Please buy.” The second glares at the camera: “BUY!”',origin:'Meme; seen on 9GAG.',source:gag('avW25Rq')},
  {id:'happy-ears',title:'Happy ears',setup:'The condition of hearing “we love it, let’s talk next quarter” and forecasting it as closed.',origin:'Sales slang.'},
  {id:'quarter',title:'The last week of the quarter',setup:'Anything is possible in the last week of the quarter.',punch:'Including discounts, delivery dates, and features nobody has built.',origin:'House joke.'},
  {id:'demo',title:'The demo gods',setup:'The demo worked in all twelve rehearsals.',punch:'The demo gods were at the thirteenth.',origin:'Industry saying.'}
 ]},
 {id:'clients',title:'Customers and meetings',intro:'The other side of the table. Most of these started as posts and screenshots that people passed around, and every account manager has a version.',items:[
  {id:'cheaper',title:'Can you do it cheaper?',lines:[['Client','Love the design. Can you do it cheaper?']],punchWho:'The meme',punch:'Left: a horse hand-carved into a staircase banister. Right: the cheaper version, a toy horse strapped to the newel post with tape.',origin:'Meme; seen on 9GAG.',source:gag('an7ALj0')},
  {id:'unneeded-code',title:'Unnecessary code',lines:[['Client','What happened to my website? It looks all wrong.'],['Developer','It was working yesterday. Let me look… someone has deleted part of the code.']],punchWho:'Client',punch:'Yes, that was me. I was removing some of your unnecessary code. Why isn’t the site working?',origin:'Client anecdote; seen on iwastesomuchtime.',source:iwsmt('effectiveemployerfascinate')},
  {id:'pizza',title:'The best requirements document',setup:'The most detailed requirements a customer ever writes are on a pizza order.',punch:'One delivery receipt asks to swap green peppers for banana peppers, at no charge, in a full paragraph that apologizes for being that guy and answers the cook’s objections in advance.',origin:'Photo of a receipt; seen on iwastesomuchtime.',source:iwsmt('gladchorusopen'),truth:'The customer who writes the long note is the easy one. The hard requirements are the ones nobody writes down because everyone on site already knows them.'},
  {id:'email',title:'This meeting could have been an email',setup:'This meeting could have been an email.',punch:'It was an email. Two weeks ago. Nobody replied, so now it’s a meeting.',origin:'Post by Steven Dunston; seen on 9GAG.',source:gag('ayqEQPr')},
  {id:'pm-optimism',title:'Why project managers doubt conspiracies',setup:'Why are project managers rarely conspiracy theorists?',punch:'A conspiracy needs hundreds of people to coordinate in secret and hit every deadline. As Merlin Mann put it, the theorists’ optimism is adorable.',origin:'After a post by Merlin Mann; seen on iwastesomuchtime.',source:iwsmt('project-managers-are-a-conspiracy-theory')},
  {id:'excel',title:'The Excel secret',setup:'Office tip: if you know Excel even slightly better than your coworkers, never tell them.',punch:'Field edition: never admit at a customer site that you can write SQL. You will be writing their quarterly report by Friday.',origin:'First line after a post by Drew (@dmc1138), seen on iwastesomuchtime; the field edition is a house joke.',source:iwsmt('how-to-avoid-becoming-the-excel-guy-at-work')},
  {id:'linkedin',title:'Reality vs LinkedIn',lines:[['Reality','A monkey stole snacks from a tourist.']],punchWho:'LinkedIn',punch:'Proactively sourced high-value food assets through direct stakeholder engagement.',origin:'Meme; seen on 9GAG.',source:gag('a2vQj6Z')},
  {id:'linkedin-fde',title:'Reality vs LinkedIn, field edition',lines:[['Reality','Fixed the date formats in the customer’s CSV export.']],punchWho:'LinkedIn',punch:'Led an enterprise data transformation for a Fortune 500 partner.',origin:'House joke.'}
 ]},
 {id:'field',title:'In the field',intro:'Jokes from forward deployed work: the customer site, the data, and the gap between a demo and production. Most are house jokes, and several have a true story behind them.',items:[
  {id:'acronym',title:'What FDE stands for',setup:'FDE stands for Forward Deployed Engineer.',punch:'Also: Frequently Debugging Excel, Flying Delta Everywhere, and Forever Defending Estimates.',origin:'House joke.'},
  {id:'vs-consultant',title:'FDE or consultant?',lines:[['Recruiter','What’s the difference between an FDE and a consultant?']],punchWho:'FDE',punch:'The FDE has commit access. The consultant gets to leave.',origin:'House joke.',truth:['The serious version of the difference: what an FDE builds goes back into the product, so the next customer is faster. Nabeel Qureshi describes that loop as how Palantir moved from services to product.',nabeel,'Reflections on Palantir']},
  {id:'clean-data',title:'Clean data',lines:[['Customer','Don’t worry, the data is clean.']],punchWho:'FDE, a week later',punch:'It was. Every column was spotless, in four different date formats.',origin:'House joke.'},
  {id:'access',title:'Two days, ten weeks',lines:[['Executive','How long to deploy the model?']],punchWho:'FDE',punch:'Two days for the model. Ten weeks for the VPN token.',origin:'House joke.',truth:['Former Palantir FDE Nabeel Qureshi describes pilots that spent 8–12 weeks just getting access to the data.',nabeel,'Reflections on Palantir']},
  {id:'qa-bar',title:'The QA engineer walks into a bar',setup:'A QA engineer walks into a bar. Orders a beer. Orders 0 beers. Orders 99999999999 beers. Orders a lizard. Orders −1 beers. Orders a string of keyboard mash.',punch:'The first real customer walks in and asks where the bathroom is. The bar bursts into flames.',origin:'Joke by Brenan Keller on X; seen on iwastesomuchtime.',source:iwsmt('politetrenchcontain'),truth:'The field version is every first week on site: the test plan covered the edge cases, and the customer’s first real question was one nobody thought to ask.'},
  {id:'my-machine',title:'Works on my machine',setup:'It works on my machine.',punch:'Field edition: it works in our cloud. The customer’s network has a proxy installed in 2009 that no one is allowed to touch.',origin:'The first line is a programmers’ saying; the field edition is a house joke.'},
  {id:'pilot',title:'How long is a pilot?',lines:[['New FDE','How long does a pilot last?']],punchWho:'Senior FDE',punch:'Until the executive sponsor changes jobs.',origin:'House joke.',truth:'Pilots that never reach production are common enough to have a name: pilot purgatory. Naming a second sponsor early is cheaper than restarting the pilot.'},
  {id:'two-things',title:'Two hard things',setup:'There are only two hard things in computer science: cache invalidation and naming things.',punch:'In the field there are also two: getting access to the data, and getting the team to stop using the spreadsheet.',origin:'First line attributed to Phil Karlton; the field version is a house joke.',source:['Martin Fowler on the quote','https://martinfowler.com/bliki/TwoHardThings.html']},
  {id:'friday',title:'Read-only Friday',setup:'Read-only Friday: never deploy before the weekend.',punch:'A rule every engineer follows, right up until the customer’s go-live is a Friday.',origin:'Industry saying; the punchline is a house joke.'}
 ]},
 {id:'laws',title:'Laws of the trade',intro:'Half joke, half warning. Each is named after the person who wrote it down, and each shows up in customer work sooner or later.',items:[
  {id:'ninety',title:'The ninety-ninety rule',law:'The first 90 percent of the code takes the first 90 percent of the time. The remaining 10 percent takes the other 90 percent.',origin:'Tom Cargill of Bell Labs, popularized by Jon Bentley in Communications of the ACM, September 1985.',source:['Ninety–ninety rule',wiki('Ninety%E2%80%93ninety_rule')]},
  {id:'hofstadter',title:'Hofstadter’s law',law:'Everything takes longer than you expect, even after you allow for Hofstadter’s law.',origin:'Douglas Hofstadter, Gödel, Escher, Bach (1979).',source:['Hofstadter’s law',wiki('Hofstadter%27s_law')]},
  {id:'brooks',title:'Brooks’s law',law:'Adding people to a late software project makes it later.',origin:'Fred Brooks, The Mythical Man-Month (1975).',source:['Brooks’s law',wiki('Brooks%27s_law')]},
  {id:'conway',title:'Conway’s law',law:'A system ends up shaped like the communication structure of the organization that built it.',origin:'Melvin Conway, “How Do Committees Invent?”, Datamation (1968).',source:['Conway’s law',wiki('Conway%27s_law')],truth:'For an FDE, the customer’s org chart is visible in the integration diagram: one connector per department that does not talk to the others.'},
  {id:'parkinson',title:'Parkinson’s law',law:'Work expands to fill the time available for its completion.',origin:'C. Northcote Parkinson, The Economist (1955). Every fixed-fee engagement has tested it.',source:['Parkinson’s law',wiki('Parkinson%27s_law')]},
  {id:'goodhart',title:'Goodhart’s law',law:'When a measure becomes a target, it ceases to be a good measure.',origin:'Charles Goodhart (1975); this short wording is Marilyn Strathern’s (1997).',source:['Goodhart’s law',wiki('Goodhart%27s_law')],truth:'The reason the case studies on this site carry an evidence limit: a usage number that was the pilot’s target says little about whether the work got better.'}
 ]}
];

// What the customer says, and what it means. House jokes, placed in the field section.
export const translator={
 id:'translator',
 title:'Client-speak translator',
 intro:'A pocket guide for the first week on site. All house jokes.',
 rows:[
  ['The data is clean.','Someone looked at it once, in 2019.'],
  ['We have an API.','Someone emails a CSV export on Mondays.'],
  ['This should be a quick win.','Nobody has scoped it.'],
  ['Let’s loop in IT.','Add six weeks.'],
  ['We’re all aligned.','Nobody has read the document.'],
  ['It’s just a pilot.','It is production, without the budget.'],
  ['Can we add AI to it?','We have not decided what it is.'],
  ['Let’s take this offline.','You were right, in front of my boss.']
 ]
};

// The tree swing cartoon, described panel by panel. The captions vary between versions.
export const treeSwing={
 id:'tree-swing',
 title:'The tree swing',
 intro:'A cartoon that has hung on office walls since the 1970s. A customer asks for a swing on a tree, and each panel shows what someone along the way made of it. The drawings vary by version; these are the common captions.',
 panels:['How the customer explained it','How the project leader understood it','How the analyst designed it','How the programmer wrote it','How the sales executive described it','How the project was documented','What operations installed','How the customer was billed','How it was supported','What the customer really needed'],
 punch:'The last panel is a plain tire swing. Every panel before it is something more elaborate that does not work as a swing.',
 origin:'The earliest known printing is the University of London Computer Centre newsletter, March 1973; the artist is unknown.',
 source:['Tree swing cartoon',wiki('Tree_swing_cartoon')]
};

// Page markup. `escape` and `heading` come from the main build.
export function breakroomPanel({escape,heading}){
 const link=([label,url])=>` <a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
 const truth=value=>{if(!value)return '';const [text,url,label]=Array.isArray(value)?value:[value];return `<p class="joke-truth"><strong>Behind the joke.</strong> ${escape(text)}${url?link([label,url]):''}</p>`;};
 const say=(who,text,cls='')=>`<p class="say${cls}"><span class="who">${escape(who)}</span>${escape(text)}</p>`;
 const body=item=>{
  if(item.law)return `<p class="law-text">${escape(item.law)}</p>`;
  const shown=item.lines?`<div class="transcript">${item.lines.map(([who,text])=>say(who,text)).join('')}</div>`:`<p class="joke-setup">${escape(item.setup)}</p>`;
  if(!item.punch)return shown;
  const punch=item.lines?`<div class="transcript">${say(item.punchWho,item.punch,' punch-line')}</div>`:`<p class="punch-text">${escape(item.punch)}</p>`;
  return `${shown}<details class="punch"><summary>Show the punchline</summary>${punch}</details>`;
 };
 const row=item=>`<article class="joke" id="joke-${item.id}" data-kind="Joke"><h3 class="joke-title">${escape(item.title)}</h3>${body(item)}${truth(item.truth)}<p class="joke-origin">${escape(item.origin)}${item.source?link(item.source):''}</p></article>`;
 const translatorBlock=`<div class="translator" id="jokes-${translator.id}"><h3 class="joke-title">${translator.title}</h3><p class="joke-intro">${escape(translator.intro)}</p><dl class="translator-rows"><div class="translator-head" aria-hidden="true"><span>They say</span><span>They mean</span></div>${translator.rows.map(([said,meant])=>`<div><dt>${escape(said)}</dt><dd>${escape(meant)}</dd></div>`).join('')}</dl></div>`;
 const section=item=>`<section class="joke-section" id="jokes-${item.id}" data-topic="${item.id}" aria-labelledby="jokes-${item.id}-title"><h2 class="joke-section-title" id="jokes-${item.id}-title">${item.title}</h2><p class="joke-intro">${escape(item.intro)}</p><div class="jokes">${item.items.map(row).join('')}</div>${item.id==='field'?translatorBlock:''}</section>`;
 const swing=`<section class="joke-section swing" id="jokes-${treeSwing.id}" data-topic="${treeSwing.id}" aria-labelledby="jokes-${treeSwing.id}-title"><h2 class="joke-section-title" id="jokes-${treeSwing.id}-title">${treeSwing.title}</h2><p class="joke-intro">${escape(treeSwing.intro)}</p><ol class="swing-panels">${treeSwing.panels.map(panel=>`<li>${escape(panel)}</li>`).join('')}</ol><details class="punch"><summary>What the last panel shows</summary><p class="punch-text">${escape(treeSwing.punch)}</p></details><p class="joke-origin">${escape(treeSwing.origin)}${link(treeSwing.source)}</p></section>`;
 const order=[breakroom[0],breakroom[1],breakroom[2],'swing',breakroom[3],breakroom[4]];
 const count=breakroom.reduce((sum,group)=>sum+group.items.length,0)+translator.rows.length;
 const short={consultants:'Consultants',sales:'Sales',clients:'Customers',field:'In the field',laws:'Laws'};
 const chips=[['all','All',count],...order.map(group=>group==='swing'?[treeSwing.id,'Tree swing',null]:[group.id,short[group.id],group.items.length+(group.id==='field'?translator.rows.length:0)])];
 return `<section id="breakroom" class="panel">${heading('','The breakroom.','Jokes, memes, and laws that consultants, salespeople, and field engineers pass around. Old folklore and recent memes, retold in our own words, each with its origin as far as it can be traced.')}
<div class="group" id="breakroom-list"><div class="joke-lead" aria-live="polite"><p class="joke-pick-label" id="jokePickLabel">One to start with</p><p class="joke-pick-title" id="jokePickTitle"></p><div class="joke-pick-body" id="jokePick"></div><div class="joke-pick-punch" id="jokePickPunch" hidden></div><div class="joke-pick-actions"><button class="button primary" type="button" id="jokeReveal">Show the punchline</button><button class="button" type="button" id="jokeNext">Another one</button></div></div>
<div class="joke-filter" role="group" aria-label="Show jokes about">${chips.map(([id,label,n])=>`<button type="button" class="joke-chip" data-topic="${id}" aria-pressed="${id==='all'}">${label}${n?`<span class="joke-chip-count">${n}</span>`:''}</button>`).join('')}</div>
${order.map(group=>group==='swing'?swing:section(group)).join('')}
<p class="joke-footer">${count} jokes, memes, and laws. Know a better one, or the real origin of one of these? <a href="#about">Send it in</a>.</p></div></section>`;
}
