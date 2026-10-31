import {writeFileSync} from 'node:fs';
import {sources,people,weeks,questions,cases} from './content.mjs';
import {categories,readings,related,routes,fieldnotes,enrich} from './library.mjs';
import {stories,enrichStories} from './stories.mjs';

enrich(sources,people,weeks,questions,cases);
enrichStories(sources,readings,weeks);
const save=(name,value)=>writeFileSync(new URL('../docs/'+name,import.meta.url),JSON.stringify(value,null,2)+'\n');
save('SOURCES.json',{note:'Recorded source-review metadata; accessible links do not independently validate claims.',sources});
save('CONTENT_INVENTORY.json',{categories,readings,related,routes,fieldnotes,stories,people,weeks,questions,cases});
console.log(`Exported ${sources.length} source citations and the complete annotated content inventory.`);
