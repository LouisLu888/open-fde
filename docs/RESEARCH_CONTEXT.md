# Research and implementation handoff

Content review date: October 31, 2026. This document records prior work; it is not a new verification of every source.

## What has been completed

The original guide was converted to a public English site, with company-internal framing removed. The library was expanded through the four requested GitHub collections and direct inspection of selected downstream primary sources. Learning is organized by fundamentals, discovery, mindset, retrieval, agents, evaluation, security, production, business value, and productization.

The latest iteration added eight distinct firsthand Stories, one Plank handoff lesson, and roadmap notes on the three additional resources requested by the user. Search, category filters, related-reading links, story progress, and backup compatibility were added and verified. No further research or implementation was left pending.

## How the community collections contributed

| Collection | Useful contribution | Boundary |
| --- | --- | --- |
| [Awesome FDE Roadmap](https://github.com/pierpaolo28/Awesome-FDE-Roadmap/blob/main/README.md) | Breadth across technical foundations, infrastructure, consulting, communication | Discovery map, not independent evidence for headline claims |
| [XDash guidance book](https://github.com/xdash/FDE-the-Guidance-Book-of-Forward-Deployed-Engineer/blob/main/README.md) | Problem selection, activation, renewal, replication | Chinese original; respect reuse terms; short original annotations only |
| [VanGong FDE guide](https://github.com/VanGong1999/FDE/blob/main/README.md) | Different learning routes, enterprise permissions, productization | Hypothetical exercises remain hypothetical; check protocol guidance against primary documentation |
| [global-fde resources](https://github.com/global-fde/awesome-fde-resources/blob/main/README.md) | Leads into agent lifecycle, benchmarking, and operations | Follow specific maintained projects; a tool list does not establish production readiness |

## The three additional sources

- **FDE Academy method article:** parallel engineering and customer-work tracks, repeated application, and reviewed delivery artifacts. It is a commercial provider's self-description. Effectiveness, accreditation, and placement claims were not independently assessed. This website is unaffiliated with FDE Academy/Futurense despite the similar name.
- **Plank about page:** background on its training and embedded-team model, not a core assignment. Followed into the specific [Day 37 lesson](https://joinplank.com/ai-fde-course/user-research-customer-cloud-day-37). The useful addition is an observed runbook handoff with findings routed into changes. The published reference run used agents as simulated participants and lacked a real customer cloud account. Do not present that as demonstrated human usability or customer deployment.
- **Vinoo Ganesh / Next Play:** a firsthand account of product/field rotations and Frontline. Selected the concrete engineering failures and scoping mistakes for Stories. Did not adopt its broad labor-market forecasts or program impact claims as established facts.

## Stories and evidence boundaries

| Person | Distinct contribution | Evidence caveat |
| --- | --- | --- |
| Vinoo Ganesh | Field failures changed product engineering judgment; rotations | Personal retrospective; program outcomes not independently audited |
| Chinemerem E. | Fintech backend engineer expands ownership beyond writing tooling | Employer-hosted, Foundry-specific; abbreviated surname preserved |
| Het Trivedi | Public technical projects and writing helped a transition to inference FDE | One hiring path, not a guarantee; employer-hosted |
| Hiro Hayami | Systems-integrator experience meets fast prototypes and cross-team delivery | Japanese original, platform AI translation; English name follows translation; operational use still developing |
| Milos Mandic | Multi-client diary: edge cases, interruptions, communication, product feedback | One self-reported startup workload, not a universal schedule |
| Henry Chang | New-grad project variety and mentorship, with unfinished projects acknowledged | Short recruiting post; exact publication date unavailable; no independently audited scale claim |
| Vlad Shulman | Establishing an FDE function, hiring, maintaining the product feedback loop | One organization's choices; reporting line and targets not universal rules |
| Dongying Zhou | Transition out of FDE to deepen product engineering skills | A 2021 internal transfer and company-specific division of responsibilities |

Each story links to its specific original publication and related library resources. Original reflection prompts are clearly separated from source claims.

## Evidence rules already implemented

- Q01–Q06 paraphrase candidate reports; Q07–Q08 describe an employer-published format. Q09–Q15 are editorial case/architecture-derived questions; Q16 is hypothetical framework application. They are not one verified employer question bank.
- Existing X handles remain explicitly unverified unless corroboration is recorded. No missing handle was guessed.
- Book review labels distinguish publisher descriptions, contents, free excerpts, and unread paid text. Podcast labels refer to notes or transcript inspection; video/audio playback was not generally verified.
- Original and newer sources keep their actual recorded review dates. Provider or customer metrics remain attributed claims, not independently established causal results.
- The source register includes background/evidence citations as well as 37 selected library assignments. Do not inflate the assignment count by counting every citation.

## Architecture and state

`build.mjs` imports `content.mjs` and `library.mjs`, calls `enrich(...)`, then imports/applies `enrichStories(...)`. These functions mutate arrays during a build. Import each set once and apply each enrichment once. The result is inline CSS/JavaScript with all learning content embedded in one HTML file.

Navigation uses hash IDs and shows one `main > .panel`. Search/filter helpers use `data-search`, `data-filter`, `data-item`, and `data-category`. Resource buttons select and reveal the matching library resource.

The site keeps no visitor state (edition 3.3 removed progress, notes, self-assessment and backups). The clean HTML snapshot is still taken before filters or panel changes touch the DOM.

## Portable package changes

The website and four content/build modules are copied unchanged. The verifier uses a normal `playwright` package import, portable `fileURLToPath` screenshot paths, and Playwright Chromium by default; `--chrome` is available. Its report separates the content date from the execution timestamp. Build and package-integrity checks need only Node built-ins. Browser binaries are installed for the recipient's OS and are not included.

## Sensible next iteration

There is no promised unfinished feature. Start with an audit. Potential opportunities, if supported by concrete findings, include improving navigation through the dense material, adding unusually instructive non-Palantir stories, or filling a specific advanced delivery gap. These are suggestions, not an instruction to expand scope or add all of them. Read the existing annotations before adding resources, and keep the library selective.

## Edition 3.2: hosting and navigation

- Hosted at https://open-fde.ai and https://www.open-fde.ai as a Cloudflare Worker with static assets (`wrangler.jsonc`). `work/build-site.mjs` assembles `site/` from `outputs/`; `site/` is generated and not committed.
- Added a site-wide search in the top bar. It indexes `[data-item]` entries, fieldcraft guides (`.fieldnote`), and roadmap weeks (`details.week`) at runtime; opening a result clears that section's filters, switches panel via `history.pushState` (avoids the hashchange focus handler), expands the target, and highlights it. No content, IDs, storage key, or backup schema changed.
- Added canonical URL, `og:url`, a 1200×630 `og:image` (`outputs/og.png`, rendered by `work/og-image.mjs` from live counts), `summary_large_image`, and an inline SVG favicon so shared links on X/LinkedIn show a preview card.
- No new sources were added and no review dates changed in this edition.


## Edition 3.3 (2026-10-31)

- Simplified design: top nav, serif headings, full-width hero, folded disclaimers.
- Removed progress tracking entirely: checkboxes, interview notes, self-assessment, export/import/reset, the My progress page, the share-text button, and local storage. Roadmap tasks are a plain list. The analytics disclosure moved to the footer.
- List view everywhere: library, fieldcraft, cases, stories, interviews, people, routes and roadmap weeks are single-column rows (eyebrow, title, one-line meta, one summary, one disclosure). Library category and preset buttons removed; the select filters remain. GitHub link in the masthead and footer; CONTRIBUTING.md, CODEOWNERS and branch protection on main.

## Edition 3.4 (2026-10-31)

New information architecture, four sections:

1. Learn (`#learn`): a book. Preface, Parts I–VI follow the delivery phases with the 12 former roadmap weeks as chapters 1–12, Part VII holds the 8 former fieldcraft guides as chapters 13–20. Chapters render inline with a table of contents; anchors `#preface`, `#part-N`, `#ch-N`.
2. Resources (`#resources`): people (`#res-people`), books, articles and guides, podcasts, videos and talks, grouped by type.
3. Interview (`#interview`): questions (`#questions`) and open jobs (`#jobs`).
4. Stories & cases (`#stories`): stories (`#story-list`) and case studies (`#cases`).

Old hashes forward: `#roadmap`, `#week-N`, `#fieldcraft`, `#library`, `#people`, `#interviews`. Site search indexes every element with `data-kind`. Section filters were removed except for jobs; the delivery-loop widget, quiz, and start-page routes were removed (the phases now open the book's preface and parts).

Later in 3.4: Resources, Interview, and Stories & cases use tabs (`[role=tab]` links; the hash selects the tab, arrow keys move between tabs, search opens the right tab). People is a table (person, why follow, X, read, watch or listen) that stacks on phones. The header brand is "FDE Academy". Home is a landing page: hero, four reasons to use the guide, an FDE vs SPE comparison built from the phase lenses in `stages`, and the four section doors. The Download button and the clean-download snapshot were removed.
