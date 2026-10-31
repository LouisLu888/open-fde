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
// Rows of a markdown table that starts after the given heading.
function tableRows(md, heading) {
  const start = md.indexOf(`\n## ${heading}\n`);
  if (start < 0) throw new Error(`Missing "## ${heading}" in TRACKING_PLAN.md`);
  const lines = md.slice(start).split('\n').slice(2);
  const rows = [];
  for (const line of lines) {
    if (line.startsWith('## ')) break;
    if (!line.startsWith('|') || /^\|\s*-/.test(line)) continue;
    rows.push(line.split('|').slice(1, -1).map((cell) => cell.trim()));
  }
  return rows.slice(1);
}

function parsePlan() {
  const md = readFileSync(path.join(root, 'docs/TRACKING_PLAN.md'), 'utf8');
  const properties = Object.fromEntries(tableRows(md, 'Properties').map(([name, type, description]) => [name, { type, description }]));
  const events = tableRows(md, 'Events').map(([name, category, props, description]) => ({
    name, category, description,
    properties: props === '—' ? [] : props.split(',').map((prop) => prop.trim()),
  }));
  for (const event of events) for (const prop of event.properties) if (!properties[prop]) throw new Error(`${event.name}: property ${prop} missing from the Properties table`);
  return { events, properties };
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

const { events, properties } = parsePlan();
if (dryRun) {
  for (const e of events) console.log(`${e.name} [${e.category}]: ${e.properties.map((p) => `${p}:${properties[p].type}`).join(', ') || '(no properties)'}`);
  console.log(`${events.length} events, ${Object.keys(properties).length} properties, zone ${zone}`);
  process.exit(0);
}
if (!apiKey || !secret) {
  console.error('Set AMPLITUDE_SECRET_KEY (and an API key via AMPLITUDE_API_KEY or work/analytics/config.json).');
  process.exit(1);
}

for (const category of new Set(events.map((e) => e.category))) {
  const res = await call('POST', '/api/2/taxonomy/category', { category_name: category });
  if (!res.ok && res.status !== 409 && !/already exists/i.test(res.text)) throw new Error(`category ${category} ${res.status}: ${res.text}`);
}

for (const e of events) {
  const enc = encodeURIComponent(e.name);
  const state = await upsert('/api/2/taxonomy/event', { event_type: e.name, category: e.category, description: e.description },
    `/api/2/taxonomy/event/${enc}`, { category: e.category, description: e.description });
  for (const p of e.properties) {
    const { type, description } = properties[p];
    await upsert('/api/2/taxonomy/event-property', { event_type: e.name, event_property: p, description, type },
      `/api/2/taxonomy/event-property/${encodeURIComponent(p)}`, { event_type: e.name, description, type });
  }
  console.log(`${state}: ${e.name} [${e.category}] (${e.properties.length} properties)`);
}
console.log(`Done: ${events.length} events.`);
