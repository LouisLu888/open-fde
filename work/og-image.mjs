import {chromium} from 'playwright';
import {fileURLToPath} from 'node:url';
import {readings,categories,enrich} from './library.mjs';
import {sources,people,weeks,questions,cases} from './content.mjs';
import {stories,enrichStories} from './stories.mjs';
enrich(sources,people,weeks,questions,cases);
enrichStories(sources,readings,weeks);

// Renders the 1200x630 social preview card referenced by og:image.
const card=`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500&display=block"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#1d4a3e;color:#f7f8f3;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{font:500 28px 'Newsreader',Georgia,serif;color:#cfdcd4}
h1{font:500 96px/1 'Newsreader',Georgia,serif;letter-spacing:-.025em;max-width:960px}
.foot{display:flex;justify-content:space-between;align-items:baseline;font-size:24px;color:#a9bfb5}.foot b{color:#e9b824;font-weight:600}
</style></head><body><div class="brand">FDE Academy</div><h1>From customer problem to measurable impact.</h1>
<div class="foot"><span>A 20-chapter guide, ${readings.length} resources, ${stories.length} stories and ${cases.length} cases</span><b>open-fde.ai</b></div></body></html>`;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1200,height:630}});
await page.setContent(card,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:fileURLToPath(new URL('../outputs/og.png',import.meta.url))});
await browser.close();
console.log('Wrote outputs/og.png');
