---
name: open-fde-maintenance
description: Runbook for recurring open-fde.ai work — refreshing the jobs snapshot and its Market demand analysis, refreshing company facts (valuation, ARR, stage) for the jobs table, refreshing interview loops and questions, checking sources and links, and shipping a change. Use whenever the user asks to update, refresh, re-research, re-analyze, or deploy any of these, or when data on the Jobs or Interview pages looks stale.
---

# open-fde.ai maintenance runbook

Every recurring task here has a script. Use it instead of improvising: the scripts validate the data, so nothing half-checked reaches the site. Run commands from the repo root.

## What runs by itself (do not redo by hand)

| Job | Where | When |
|---|---|---|
| Fetch jobs, build, test, deploy if a page changed, IndexNow for changed pages, record `jobs-history` | `.github/workflows/refresh.yml` | Daily 13:17 UTC, every push to `main`, on demand |
| Check external links, keep one `broken-links` issue | `.github/workflows/links.yml` | Mondays |
| PR that updates `docs/JOBS.json` on `main` | `.github/workflows/jobs-pr.yml` | Mondays (owner merges) |

Page dates (Updated line, `dateModified`, sitemap `lastmod`) change only when a page's content hash changes (`/page-dates.json` on the live site). Never set them by hand.

## 1. Refresh the Market demand analysis (`/jobs/market/`)

The job list refreshes daily; the analysis text in `work/jobs-brief.mjs` does not. Refresh it monthly or when the snapshot moves a lot.

1. `npm run refresh:jobs` then `npm run research:jobs`. This writes `work/research/jobs-stats.json`, the evidence for every number.
2. Update the numbers in `work/jobs-brief.mjs` from that file: snapshot date, postings, distinct roles, companies, the `asks` bars, segment table (counts, standout shares, pay medians), years, entry-level, travel, cities, strategist count, method note.
3. Re-read 8–12 full postings (one or two per segment) before changing any qualitative claim, such as the five job types or a quoted company practice. Quote only what a posting says, in under 15 words.
4. Keep the date in the brief and the method note honest: say which snapshot it reflects.

## 2. Refresh company facts (jobs table: website, industry, stage, valuation, ARR)

Data: `docs/COMPANIES.json`. Brief for researchers: `work/research/company-brief.md`.

1. List companies needing work: new names in `docs/JOBS.json` (`npm run research:merge-companies` with no input prints `hiringCompaniesMissing`), and figures older than about 6 months.
2. Split them into groups of about 20 and give each group to a sub-agent with the brief. Output to `work/research/out/companies-<n>.json` (gitignored).
3. `npm run research:merge-companies -- work/research/out/companies-*.json`. It refuses unknown company names, bad URLs, non-numeric figures, and missing dates.
4. Verify yourself before shipping: open the sources for the five largest valuations and any figure the researcher flagged as shaky. Tender, pre-money, acquisition price, and estimate must be labelled as such in `basis`.
5. Recruiters posting for unnamed clients are not employers: remove them from `companies` in `work/fetch-jobs.mjs`.

## 3. Refresh interview loops and questions (`/interview/`)

Data: `docs/INTERVIEWS.json`. Brief: `work/research/interview-brief.md`.

1. Pick companies: the biggest hirers in `docs/JOBS.json`, companies with no guide yet, and guides whose newest source is over 9 months old.
2. One sub-agent per 4–6 companies with the brief. Output `work/research/out/interviews-<group>.json`. Glassdoor and Blind are excluded (terms forbid reuse). Questions are paraphrased, 25 words or fewer.
3. Remove from the output any company the researcher found has no FDE-type role (it reports this in `gaps`). Then `npm run research:merge-interviews -- work/research/out/interviews-*.json`. A company in the input replaces its old entry; others stay. The script fails on unknown source ids, types, or evidence kinds.
4. Verify yourself: open the sources behind each company's headline claims (take-home, decomposition prompt, AI-tool policy) and confirm they say it.
5. Companies with 5 or more questions get their own page (`/interview/<slug>/`); fewer stay on the Companies tab. Changing that threshold needs edits in both `work/interviews.mjs` and `work/build-site.mjs`.

## 4. Check sources

`npm run research:check-sources` lists every interview and company source that does not return 200. 403/429 is usually a bot wall (Bloomberg, Forbes, SEC, 1point3acres): open by hand. 404/410 means gone: find a replacement or drop the claim. A 200 means reachable, not still true.

## 5. Ship a change

1. `npm run build`, then `npm test`, `npm run test:analytics`, `npm run test:site`. All three must pass.
2. Look at the changed pages on desktop and at 375 px wide (serve `site/` locally). Check for horizontal scroll.
3. Commit with a message that says what changed and why. End it with the Co-Authored-By line the session asks for.
4. Pushing to `main` deploys through CI. Pushing, deploying, and IndexNow are public actions: ask the owner each time.

## Quality rules (all research)

- Every number and claim links to a public source that the researcher opened, with a date. An empty field beats a guess.
- Label evidence: employer, employee, candidate, third-party; for money: post-money, tender, market cap, run-rate, ARR, TTM/FY revenue.
- Sub-agents do the reading; you verify a sample yourself before anything ships, and you write the final prose.
- No visitor state, no internal company material, English only (see `AGENTS.md`).
