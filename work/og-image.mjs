import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {readings,categories,enrich} from './library.mjs';
import {sources,people,weeks,questions,cases} from './content.mjs';
import {stories,enrichStories} from './stories.mjs';
enrich(sources,people,weeks,questions,cases);
enrichStories(sources,readings,weeks);

// Renders the 1200x630 social preview card referenced by og:image.
const stat=(value,label)=>`<div class="stat"><b>${value}</b><span>${label}</span></div>`;
const card=`<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#f6fbfb;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#10201f;display:flex}
.side{width:300px;background:#112e2b;color:#e1f5ec;padding:56px 44px;display:flex;flex-direction:column;justify-content:space-between}
.logo{width:72px;height:72px;border-radius:18px;background:#0f766e;color:#fff;font:700 34px ui-monospace,Menlo,monospace;display:flex;align-items:center;justify-content:center}
.brand{font-weight:750;font-size:26px;margin-top:22px}.brand small{display:block;font:600 14px ui-monospace,Menlo,monospace;letter-spacing:.12em;color:#8fd3c4;margin-top:6px}
.url{font:700 22px ui-monospace,Menlo,monospace;color:#f8ce7b}
.main{flex:1;padding:64px 64px 56px;display:flex;flex-direction:column;justify-content:space-between}
.eyebrow{font:700 15px ui-monospace,Menlo,monospace;letter-spacing:.16em;color:#0f766e}
h1{font-size:64px;line-height:1.04;letter-spacing:-.025em;margin-top:18px;font-weight:780}
p{font-size:23px;line-height:1.4;color:#304c49;margin-top:20px;max-width:780px}
.stats{display:flex;gap:14px}.stat{flex:1;background:#fff;border:1px solid #cadbd7;border-radius:16px;padding:16px 18px}.stat b{display:block;font:750 34px ui-monospace,Menlo,monospace;color:#0f766e}.stat span{font-size:15px;color:#526d69}
</style></head><body><div class="side"><div><div class="logo">f/</div><div class="brand">FDE / SPE<small>FIELD ACADEMY</small></div></div><div class="url">open-fde.ai</div></div>
<div class="main"><div><div class="eyebrow">FREE · INDEPENDENT · EVIDENCE-LABELED</div><h1>From customer problem<br>to measurable impact.</h1><p>A learning guide for Forward Deployed Engineers: curated reading, real cases, firsthand stories, and a 12-week roadmap.</p></div>
<div class="stats">${stat(readings.length,'curated resources')}${stat(cases.length,'case studies')}${stat(stories.length,'firsthand stories')}${stat(questions.length,'interview questions')}</div></div></body></html>`;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1200,height:630}});
await page.setContent(card);
await page.screenshot({path:fileURLToPath(new URL('../outputs/og.png',import.meta.url))});
await browser.close();
console.log('Wrote outputs/og.png');
