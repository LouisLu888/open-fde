# open-fde.ai SEO action plan

Health score 59 → 85 after the fixes below (2026-10-31). Details: `FULL-AUDIT-REPORT.md`.

## Done and live

- [x] HTTP → HTTPS and www → apex with 301 (`src/worker.js`)
- [x] Permanent trailing-slash redirects
- [x] Security headers: HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy
- [x] Titles ≤ 60 characters on all 34 pages
- [x] No skipped heading levels; chapter sub-heads are h2
- [x] Chapters show what to focus on and how to apply each reading
- [x] Resources link to the chapters that use them
- [x] Visible "Updated" date on every page
- [x] Course schema: free Offer and online CourseInstance
- [x] Per-page social images (34)
- [x] Shared CSS and script as fingerprinted, one-year-cached files (average page 89 KB → 33 KB)
- [x] Tap targets ≥ 24 px on the jobs page
- [x] Site test covers titles, headings, images, schema, links, 404, tabs, search: `npm run test:site`

## Critical / High: needs you

1. Brand: keep "FDE Academy" or rename (collides with fde.academy).
2. Authorship: name an author or editor with a short bio and links (E-E-A-T); the agent then adds a Person to About and the schema.
3. Google Search Console: verify `open-fde.ai` (DNS TXT in Cloudflare), submit `https://open-fde.ai/sitemap.xml`.
4. Bing Webmaster Tools: import from Search Console, submit the sitemap.
5. First mentions: Show HN, relevant subreddits, LinkedIn/X; ask to be listed in the FDE roadmap repos.

## High: done after the audit

6. [x] Every chapter has a sourced "How it works" explanation and a hypothetical worked example (chapters now 650–930 words; `work/chapters.mjs`; `npm run test:site` fails any chapter under 550 words).

## Medium / Low: backlog

7. Content-Security-Policy in report-only mode, then enforce.
8. Self-host the Newsreader font.
9. Per-company job pages once Search Console shows demand; noindex companies with fewer than 3 postings.
10. Quarterly AI-citation check (20 prompts) and monthly `npm run seo:crawl`.
