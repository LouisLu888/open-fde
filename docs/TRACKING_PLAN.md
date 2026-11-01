# open-fde.ai tracking plan

Edition 3.4. Redesigned 2026-10-31 for the four-section site (Learn, Resources, Interview, Stories & cases) using Amplitude's taxonomy standards: events are `Object Past-Tense-Verb` in Title Case, properties are `snake_case`, one action is one event with properties (not many near-duplicate events), the same concept uses the same property name everywhere, and nothing duplicates Autocapture.

## How it loads

A ~1.5 KB inline loader (`work/analytics/entry.mjs`) fetches the Amplitude Browser SDK 2.49.0 and the Session Replay plugin 1.36.2 from Amplitude's CDN, both pinned with SRI. Site code calls `emit(name, props)`; events queue until the SDK starts.

Active only on `open-fde.ai` / `www.open-fde.ai`. Off for downloaded copies, local files, tests, and visitors sending Do Not Track or Global Privacy Control. The site stores nothing about visitors in the browser.

**Autocapture:** page views, sessions, and marketing attribution. Element clicks, form interactions, and file downloads are off; the custom events below cover the clicks that matter with meaningful properties.

**Session Replay:** records sessions (and powers heatmaps) at sample rate 1.0 by default (`replaySampleRate` in `work/analytics/config.json` or `AMPLITUDE_REPLAY_SAMPLE_RATE`; the remote setting in Amplitude overrides both). Masking level is medium: everything typed into an input is hidden. The home page discloses analytics and session recording.

**Search text:** `search_term` is lowercased and cut to 80 characters. People sometimes type personal details into search, so never chart raw `search_term` on the public Stats page.

## Events

| Event | Category | Properties | Description |
| --- | --- | --- | --- |
| Section Viewed | Engagement | section | A visitor opened one of the site's top-level pages: home, Learn, Resources, Interview, Stories & cases, or Stats. Fires on first load and on each navigation to a different page, not on tab switches or scrolling within a page. Use it for traffic by section and as the first step of section funnels. |
| Tab Selected | Engagement | section, tab | A visitor switched tabs inside a page, for example from People to Books in Resources, or from Candidate reports to Practice questions in Interview. Fires on click or arrow-key selection, not when a link or search result opens a tab. Shows which resource types and job content people seek out. |
| Chapter Viewed | Feature | chapter_number, chapter_title, part_title, entry_point | A visitor read a chapter of the Learn book: its title stayed fully on screen for 1.5 seconds. Fires at most once per chapter per page load. The preface is chapter 0. The core learning metric; use it for most-read chapters and how far readers get. |
| Search Performed | Engagement | search_scope, search_term, result_count | A visitor searched, either the site-wide search in the header or the jobs search. Fires once typing pauses for 0.9 seconds. search_scope tells the two apart. Use result_count = 0 to find content gaps. |
| Search Result Opened | Engagement | search_term, section, result_content_type, result_title, result_rank | A visitor opened a result from the site-wide search. Fires on click or Enter. Pair with Search Performed to measure search success. |
| Filter Applied | Engagement | section, filter_name, filter_value | A visitor narrowed the jobs list (role family, region, company) or the interview question bank (question type, company, evidence). Fires when a filter value changes; "all" means a filter was cleared. |
| Content Expanded | Engagement | section, content_type, content_title | A visitor opened a collapsed detail: a resource's "How to use it", an interview response guide, story notes, a case's approach and result, a source note, or the full company list. Fires on open only. Shows which items people go deeper on. |
| Outbound Link Clicked | Engagement | section, content_type, content_title, link_text, destination_host | A visitor followed a link to another site: a book, article, podcast, talk, person's profile, case source, company jobs page, or GitHub. Does not fire for individual job postings (see Job Posting Clicked). |
| Job Posting Clicked | Feature | company, job_title, role_family, job_location, destination_host | A visitor opened a specific job posting on the employer's site from the Open jobs tab. The site's main conversion. Use it with Filter Applied to see which filters lead to applications. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| section | string | Top-level page the action happened on. Values: start, learn, resources, interview, jobs, stories, stats, header. |
| tab | string | Tab id within a page. Examples: jobs-open, jobs-market, res-people, res-books, res-articles, res-podcasts, res-videos, interview-overview, interview-companies, interview-bank, q-practice, story-list, cases. |
| chapter_number | number | Chapter number in the Learn book. 0 is the preface; 1–12 follow the delivery phases; 13–20 are advanced fieldcraft. |
| chapter_title | string | Chapter title as shown. Example: Build a thin vertical slice. |
| part_title | string | Book part the chapter belongs to. Examples: Discover, Build, Advanced fieldcraft, Preface. |
| entry_point | string | How the reader reached the chapter. Values: toc (table of contents), search, link (a shared or old link), scroll. |
| search_scope | string | Which search box was used. Values: site, jobs. |
| search_term | string | What the visitor typed, lowercased, max 80 characters. Do not chart publicly. |
| result_count | number | Number of results shown for the search. |
| result_content_type | string | Kind of item opened from search. Examples: chapter, part, person, book, article, podcast, interview question, story, case study, hiring company. |
| result_title | string | Title of the opened search result. |
| result_rank | number | 1-based position of the opened result in the search list. |
| filter_name | string | Which filter changed. Jobs: role_family, region, company. Interview bank: role_family (question type select), company, evidence. |
| filter_value | string | New filter value; "all" when cleared. Examples: Engineering, Europe & UK, Databricks. |
| content_type | string | Kind of item acted on. Examples: book, article, podcast, video, person, interview question, story, case study, chapter, note, job_board, company_list, page_link. |
| content_title | string | Title of the item acted on, max 120 characters. |
| link_text | string | Visible text of the clicked link, max 120 characters. |
| destination_host | string | Hostname of the external site the link opens. Example: www.lennysnewsletter.com. |
| company | string | Hiring company name. Example: Databricks. |
| job_title | string | Posting title as listed by the employer. |
| role_family | string | Editorial grouping of the job title. Values: Engineering, Strategy & product, Leadership, Internship & early career. |
| job_location | string | Location shown on the clicked posting link. Example: London, United Kingdom. |

## Retired events

Kept in Amplitude for history; nothing sends them now. Hide them in Amplitude Data once the new events have a few weeks of data.

- Edition 3.4 taxonomy redesign: Site Search Performed and Section Search Performed (now Search Performed), Site Search Result Opened (now Search Result Opened), Section Filter Changed and Job Company Selected (now Filter Applied), Resource Link Clicked and Job Board Clicked (now Outbound Link Clicked), Path Resource Opened, Guide Downloaded.
- Edition 3.3, with progress tracking: Progress Item Toggled, Self Assessment Scored, Progress Exported, Progress Imported, Progress Reset, Share Text Copied.

## Register and verify

`AMPLITUDE_SECRET_KEY=... npm run analytics:register` registers the events and properties above in Amplitude Data through the Taxonomy API, with their categories, descriptions, and types (`-- --dry-run` previews). The script parses the two tables in this file, so edit the tables first when events change. It is safe to re-run.

`npm run test:analytics` serves the page as https://open-fde.ai in Playwright, loads the real SDK and Session Replay plugin, intercepts every request to Amplitude so no live data is written, and checks event names, properties, retired events, opt-out, and that nothing loads outside the production hosts.

## Public stats page

`#stats` embeds an Amplitude dashboard and a chart icon appears in the header, but only when `work/stats.json` has `embed` set (paste the dashboard's embed code or its `src` URL; only `https://*.amplitude.com` URLs are accepted). `publicLink` optionally adds an "Open the full dashboard" link. `STATS_EMBED` overrides the file at build time. Chart only aggregated counts (sections, chapters, tabs, companies, hosts, traffic sources).
