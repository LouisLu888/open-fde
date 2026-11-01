# open-fde.ai SEO audit

Audited 2026-10-31 with the claude-seo audit process, run inline (no DataForSEO, Google API, or Moz credentials were available, and the PageSpeed API was rate-limited, so performance is measured in a lab with Playwright on a phone profile). Crawl: every URL in the live sitemap (34 pages). Raw data: `crawl-before.json` and `crawl.json` in this folder; rerun with `npm run seo:crawl`.

Business type: free educational publisher (learning guide plus resource directory and job list). No local or e-commerce signals.

## Score

| Category | Weight | Before | After | What changed |
| --- | --- | --- | --- | --- |
| Technical SEO | 22% | 45 | 92 | HTTP and www now 301 to https://open-fde.ai; trailing-slash redirects are permanent; security headers; real 404 kept |
| Content quality | 23% | 55 | 66 | Chapters now explain what to focus on and how to apply each reading (+50% words); resources link to the chapters that use them; visible updated dates. Still thin and no named author |
| On-page SEO | 20% | 60 | 94 | No title over 60 characters (was 16); no skipped heading levels (was 24 pages); chapter pages use h2 sub-heads |
| Schema | 10% | 70 | 88 | Course has a free Offer and an online CourseInstance; Article images are per page. Author is the organization, not a person |
| Performance | 10% | 75 | 93 | Average page 89 KB → 33 KB; CSS and script are shared, fingerprinted files cached for a year. Lab LCP 0.2–0.6 s, CLS 0 |
| AI search readiness | 10% | 75 | 85 | Answer-first pages, FAQ, llms.txt, AI crawler access were already in place; added freshness dates and cross-links |
| Images | 5% | 50 | 90 | One social image per page (34) instead of one shared image; tap targets fixed |
| **SEO health score** | | **59** | **85** | |

"Before" is the 34-page site deployed earlier the same day, not the original single page (which would score about 35: one indexable URL and soft 404s).

## Findings

### Technical SEO

| Finding | Severity | Evidence | Status |
| --- | --- | --- | --- |
| `http://open-fde.ai/` returned 200 instead of redirecting to HTTPS | Critical | `curl -w %{http_code} http://open-fde.ai/` → 200 | Fixed: Worker returns 301 to https |
| `www.open-fde.ai` served a duplicate site (canonical pointed to apex, but no redirect) | High | same content on both hosts | Fixed: 301 to apex |
| Directories without a trailing slash answered 307 (temporary) | Medium | `/learn` → 307 | Fixed: 301 |
| No security headers (HSTS, nosniff, referrer, frame) | Medium | response headers | Fixed in `src/worker.js` |
| No Content-Security-Policy | Low | headers | Open: inline JSON-LD, the analytics loader, Session Replay, and the Amplitude embed need a tested policy; start in report-only mode |
| Real 404s, robots.txt, sitemap with lastmod, canonical tags | Pass | crawl | |

### Content quality and E-E-A-T

| Finding | Severity | Evidence | Status |
| --- | --- | --- | --- |
| Chapter pages are thin: 120–240 visible words, against competitors' 1,000+ word guides | High | crawl word counts | Improved to 170–410 by adding focus and application notes per reading. Open: each chapter needs a written explanation and a worked example |
| No named author or editor; publisher is an organization | High | About page, JSON-LD | Open: your decision |
| No visible "last updated" date | Medium | pages | Fixed: under every h1 |
| Resources did not link back to the chapters that use them | Medium | internal links | Fixed: "Used in chapter N" on 34 resources |
| Every claim links a primary source; evidence labels on interview questions and cases | Pass | | |

### On-page SEO

| Finding | Severity | Evidence | Status |
| --- | --- | --- | --- |
| 16 titles over 60 characters (cut off in results) | High | crawl | Fixed: all ≤ 60 |
| 24 pages skipped a heading level (h1 → h3) | Medium | crawl | Fixed |
| Chapter sub-heads were h4 and the part label was an h3 above the h1 | Medium | chapter pages | Fixed: part label is text, sub-heads are h2 |
| Unique titles, descriptions 96–160 characters, one h1 per page | Pass | `npm run test:site` | |

### Schema

| Finding | Severity | Status |
| --- | --- | --- |
| Course lacked `offers` and `hasCourseInstance` (needed for Google's Course list eligibility) | Medium | Fixed |
| Article `image` was the shared site image | Low | Fixed: per-page image |
| Article `author` is the organization | Medium | Open: add a Person once you decide on authorship |
| WebSite, FAQPage, Course, Article, CollectionPage/ItemList, AboutPage, BreadcrumbList present and parse | Pass | |

### Performance (lab, phone profile)

| Finding | Severity | Status |
| --- | --- | --- |
| ~70 KB of identical CSS and script inlined into every page | Medium | Fixed: `/assets/site.<hash>.css|js`, cached one year |
| `/jobs/` is 280 KB with 681 outbound links | Low | Open: acceptable for now; split by company if Search Console shows demand |
| LCP 0.2–0.6 s, CLS 0 on every page | Pass | |
| Google Fonts request on every page | Low | Open: self-host Newsreader to drop a third-party connection |

### Images and mobile

| Finding | Severity | Status |
| --- | --- | --- |
| One shared social image for all pages | Medium | Fixed: 34 generated cards in `/og/` |
| 640 tap targets under 24 px on `/jobs/` | Medium | Fixed |
| No horizontal overflow at 390 px | Pass | |

### AI search readiness

| Finding | Severity | Status |
| --- | --- | --- |
| llms.txt, llms-full.txt, explicit AI crawler allows, answer-first pages, FAQ | Pass | |
| No visible freshness dates | Medium | Fixed |
| Brand collision with fde.academy (commercial training provider) | High | Open: your decision |
| No third-party mentions yet (Reddit, HN, roadmap repos) | High | Open: outreach |

## Notes

- The first live crawl loaded each page in a real browser with analytics on, which sent about 34 test sessions and replays to the Amplitude project. The crawler now blocks Amplitude requests.
- Sources: [roadmap.sh FDE roadmap](https://roadmap.sh/forward-deployed-engineer), [fde.academy roadmap post](https://fde.academy/blog/the-forward-deployed-engineer-roadmap), [KDnuggets](https://www.kdnuggets.com/7-steps-to-become-a-forward-deployed-engineer-in-2026), [Simplilearn](https://www.simplilearn.com/career-roadmap/forward-deployed-engineer).
