// Registers the events in docs/TRACKING_PLAN.md with Amplitude's Taxonomy API,
// so they show up in Amplitude Data as planned events with descriptions and
// typed properties instead of "unexpected" ones. Safe to re-run: existing
// events and properties are updated in place.
//
//   AMPLITUDE_SECRET_KEY=... node work/analytics/register-events.mjs [--dry-run]
//
// The project API key comes from AMPLITUDE_API_KEY or work/analytics/config.json.
// The secret key is read only from the environment and never written to disk.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const configPath = path.join(root, 'work/analytics/config.json');
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
const apiKey = process.env.AMPLITUDE_API_KEY || config.apiKey;
const zone = (process.env.AMPLITUDE_SERVER_ZONE || config.serverZone || 'US').toUpperCase();
const secret = process.env.AMPLITUDE_SECRET_KEY;
const dryRun = process.argv.includes('--dry-run');
const category = 'open-fde.ai';

const types = { checked: 'boolean', success: 'boolean', hosted: 'boolean', result_count: 'number', rank: 'number', score: 'number' };
const propDescriptions = {
  section: 'Panel id, e.g. library, jobs, progress',
  query: 'Search text, lowercased, max 80 characters',
  result_count: 'Number of matches shown',
  result_section: 'Panel of the opened result',
  result_title: 'Title of the opened result',
  rank: '1-based position of the opened result',
  filter: 'Which filter changed',
  value: 'New filter value',
  item_id: 'Stable id of the item',
  link_text: 'Visible link text, truncated',
  host: 'Destination hostname',
  resource_id: 'Library resource id',
  path: 'Learning path name',
  company: 'Hiring company',
  job_title: 'Posting title',
  role_family: 'Engineering, Strategy & product, Leadership, or Internship & early career',
  location: 'Posting location',
  item_type: 'task, question, case, resource, or story',
  checked: 'New checkbox state',
  area: 'discovery, delivery, impact, or reuse',
  score: 'Score 0-3',
  success: 'Whether the backup imported cleanly',
  hosted: 'True on open-fde.ai, false in a downloaded copy',
};

function parsePlan() {
  const md = readFileSync(path.join(root, 'docs/TRACKING_PLAN.md'), 'utf8');
  const rows = md.split('\n').filter((l) => /^\| [A-Z]/.test(l) && !l.startsWith('| Event'));
  return rows.map((row) => {
    const [name, props, when] = row.split('|').slice(1, 4).map((s) => s.trim());
    const properties = props === '—' ? [] : props.split(',').map((s) => s.trim());
    return { name, description: when, properties };
  });
}

const base = zone === 'EU' ? 'https://analytics.eu.amplitude.com' : 'https://amplitude.com';

async function call(method, route, body) {
  const res = await fetch(base + route, {
    method,
    headers: {
      authorization: 'Basic ' + Buffer.from(`${apiKey}:${secret}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: body && new URLSearchParams(body).toString(),
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, text };
}

// Create, or update when the entry already exists.
async function upsert(route, body, updateRoute, updateBody) {
  const created = await call('POST', route, body);
  if (created.ok) return 'created';
  if (created.status === 409 || /already exists/i.test(created.text)) {
    const updated = await call('PUT', updateRoute, updateBody);
    if (updated.ok) return 'updated';
    throw new Error(`PUT ${updateRoute} ${updated.status}: ${updated.text}`);
  }
  throw new Error(`POST ${route} ${created.status}: ${created.text}`);
}

const events = parsePlan();
if (dryRun) {
  for (const e of events) console.log(`${e.name}: ${e.properties.map((p) => `${p}:${types[p] || 'string'}`).join(', ') || '(no properties)'}`);
  console.log(`${events.length} events, category "${category}", zone ${zone}`);
  process.exit(0);
}
if (!apiKey || !secret) {
  console.error('Set AMPLITUDE_SECRET_KEY (and an API key via AMPLITUDE_API_KEY or work/analytics/config.json).');
  process.exit(1);
}

const cat = await call('POST', '/api/2/taxonomy/category', { category_name: category });
if (!cat.ok && cat.status !== 409 && !/already exists/i.test(cat.text)) throw new Error(`category ${cat.status}: ${cat.text}`);

for (const e of events) {
  const enc = encodeURIComponent(e.name);
  const state = await upsert('/api/2/taxonomy/event', { event_type: e.name, category, description: e.description },
    `/api/2/taxonomy/event/${enc}`, { category, description: e.description });
  for (const p of e.properties) {
    const desc = propDescriptions[p] || '';
    await upsert('/api/2/taxonomy/event-property', { event_type: e.name, event_property: p, description: desc, type: types[p] || 'string' },
      `/api/2/taxonomy/event-property/${encodeURIComponent(p)}`, { event_type: e.name, description: desc, type: types[p] || 'string' });
  }
  console.log(`${state}: ${e.name} (${e.properties.length} properties)`);
}
console.log(`Done: ${events.length} events in category "${category}".`);
