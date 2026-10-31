# open-fde.ai tracking plan

Amplitude Browser SDK 2.49.0, loaded from Amplitude's CDN (SRI-pinned) by a ~1 KB inline loader in `work/analytics/entry.mjs`. Site code calls `emit(name, props)`; the loader forwards to `amplitude.track`. Events queue until the SDK loads.

Active only on `open-fde.ai` / `www.open-fde.ai`. Off for downloaded copies, local files, tests, and visitors sending Do Not Track or Global Privacy Control. The site stores nothing about visitors. Search queries are sent lowercased and truncated to 80 characters.

Autocapture: page views, sessions, marketing attribution. Element clicks, form interactions, and file downloads are off.

| Event | Properties | Fired when |
| --- | --- | --- |
| Section Viewed | section | A panel becomes visible (initial load and navigation) |
| Site Search Performed | query, result_count | Top-bar search settles for 0.9 s |
| Site Search Result Opened | query, result_section, result_title, rank | A top-bar search result is opened |
| Section Search Performed | section, query, result_count | A section search box settles for 0.9 s |
| Section Filter Changed | section, filter, value | Category, level, format, role family, or region filter changes |
| Resource Link Clicked | section, item_id, link_text, host | Any outbound link outside the jobs list |
| Job Posting Clicked | company, job_title, role_family, location, host | A job posting link is clicked |
| Job Board Clicked | company, host | "All <company> jobs" is clicked |
| Tab Selected | section, tab | A tab is chosen in Resources, Interview, or Stories & cases |
| Job Company Selected | company | A company chip in the jobs index is clicked |

Configure with `AMPLITUDE_API_KEY` (and `AMPLITUDE_SERVER_ZONE=EU` for EU projects) or `work/analytics/config.json` (`{"apiKey": "...", "serverZone": "US"}`). Without a key the build emits no loader.

Verify with `npm run test:analytics`: serves the page as https://open-fde.ai in Playwright, loads the real SDK, intercepts ingestion so no live data is written, and checks event names, properties, opt-out, absence of private notes, and the clean download.

Register the events above in Amplitude Data (category `open-fde.ai`, with descriptions and typed properties) via the Taxonomy API: `AMPLITUDE_SECRET_KEY=... npm run analytics:register` (`-- --dry-run` previews). The script parses this table, so edit the table first when events change; it is safe to re-run. The secret key is read from the environment only.

Retired in edition 3.4: Path Resource Opened (library jump buttons) and Guide Downloaded (download button removed). Section searches and filters now exist only in the jobs list.

Retired in edition 3.3 with progress tracking: Progress Item Toggled, Self Assessment Scored, Progress Exported, Progress Imported, Progress Reset, Share Text Copied. They remain registered in Amplitude.
