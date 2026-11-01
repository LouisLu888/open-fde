# open-fde.ai SEO and AEO plan

Owner: Louis. Written 2026-10-31. Template: publisher (learning content, no transactions).
`[me]` = the agent can do it in this repo. `[you]` = needs your account, identity, decision, or outreach.

## 1. Where the site stands (audit, 2026-10-31)

| Finding | Evidence | Severity |
| --- | --- | --- |
| One indexable URL. Every section is a `#hash` view of `/`, and search engines ignore fragments, so Learn chapters, podcasts, interview questions, and jobs cannot rank on their own. | `sitemap.xml` lists only `/` | Critical |
| Soft 404s. Any path returns 200 with the full page, including `/llms.txt` and `/does-not-exist`. | `not_found_handling: single-page-application` in `wrangler.jsonc` | Critical |
| No structured data. | 0 `application/ld+json` blocks | High |
| Stale meta description ("12-week roadmap", "FDE/SPE library"). | `<meta name="description">` | High |
| 485 KB single HTML; every visitor downloads the whole site. | build output | Medium |
| No `llms.txt`, no explicit AI-crawler policy. | `robots.txt` | Medium |
| No author or editorial page, so weak E-E-A-T. | site | Medium |
| Name collision: **fde.academy** is a commercial FDE training provider ranking for "forward deployed engineer roadmap". Our brand "FDE Academy" competes with, and can be confused with, theirs. | SERP for "forward deployed engineer roadmap" | High (brand decision) |

## 2. Audience, goals, KPIs

Audience: software engineers considering or starting forward deployed work; working FDEs; hiring managers building FDE teams. Intent clusters:

1. Definition: "what is a forward deployed engineer", "FDE meaning", "FDE vs solutions engineer", "FDE vs SPE".
2. Path: "how to become a forward deployed engineer", "FDE roadmap", "FDE skills".
3. Interview: "forward deployed engineer interview questions", "Palantir FDSE interview".
4. Jobs: "forward deployed engineer jobs", "FDE jobs [company/city]".
5. Learning media: "forward deployed engineer podcast", "FDE books".
6. Topics in chapters: "thin vertical slice", "LLM evaluation for customer deployments", "idempotent API retries", "permission revocation consistency".

| Metric | Baseline (Oct 2026) | 3 months | 6 months | 12 months |
| --- | --- | --- | --- | --- |
| Indexed pages (Search Console) | 1 | 35 | 40+ | 60+ |
| Organic clicks / month | ~0 | 300 | 1,500 | 5,000 |
| Ranking keywords (top 100) | ~0 | 50 | 200 | 600 |
| Top-10 rankings on cluster 1–4 head terms | 0 | 2 | 5 | 10 |
| AI answer citations (ChatGPT/Perplexity/AI Overviews, manual sample of 20 prompts) | 0 | 2 | 5 | 8 |
| Referring domains | ~1 (GitHub) | 10 | 25 | 60 |
| Core Web Vitals (mobile, field) | n/a | all green | all green | all green |

No keyword-volume tool (DataForSEO) is connected, so targets are directional; replace with Search Console data after 8 weeks.

## 3. Competitors

| Site | What ranks | Gap we can take |
| --- | --- | --- |
| roadmap.sh/forward-deployed-engineer | Skill tree roadmap | No sources, no jobs, no interview evidence |
| fde.academy | Paid program blog, "roadmap" posts | Commercial; we are free, sourced, and independent |
| amitshekhariitbhu/forward-deployed-engineer-roadmap (GitHub) | Step list with blogs | AI-skills only; nothing on customer work, jobs, or stories |
| KDnuggets, Simplilearn, Analytics Vidhya, Scaler, Udemy blog | "How to become" listicles | Thin, generic; no primary sources or live jobs |
| Wikipedia "Forward Deployed Engineer" | Definition | We can be the cited source for practice, not just definition |

Our edge: a sourced 20-chapter path, a live job snapshot (588 postings / 92 companies), 16 interview questions with provenance, firsthand stories, and FDE vs SPE comparison. Each of those deserves its own URL.

## 4. Site architecture (target)

```
/                                   home: what this is, FAQ, FDE vs SPE summary
/what-is-a-forward-deployed-engineer/   answer page (definition-first, cited)
/fde-vs-spe/                        comparison page
/learn/                             book contents + preface
/learn/<chapter-slug>/              20 chapter pages, prev/next links
/resources/people/  /resources/books/  /resources/articles/  /resources/podcasts/  /resources/videos/
/interview/                         interview questions
/jobs/                              FDE job openings (dated snapshot)
/stories/                           firsthand FDE stories
/case-studies/                      case studies
/about/                             who made it, method, sources, corrections
/stats/                             public Amplitude dashboard (when configured)
/404                                real 404 page
```

Internal linking: every chapter links its part's previous and next chapter and the resources it cites; resource pages link back to the chapters that use them; home FAQ answers link to the deep pages; breadcrumbs on every subpage.

## 5. Schema plan

| Page | Types |
| --- | --- |
| Home | WebSite, Organization (publisher), FAQPage, BreadcrumbList |
| Learn index | Course (+ hasPart chapters as CreativeWork), BreadcrumbList |
| Chapter | Article (isPartOf the Course), BreadcrumbList |
| Resources pages | CollectionPage + ItemList (Book, PodcastEpisode, VideoObject where the item is one, CreativeWork otherwise), BreadcrumbList |
| Interview | CollectionPage + ItemList of Question, BreadcrumbList |
| Jobs | CollectionPage + ItemList of links (not JobPosting: postings live on employer sites), BreadcrumbList |
| Stories / cases | CollectionPage + ItemList of Article, BreadcrumbList |
| What is an FDE / FDE vs SPE | Article + FAQPage, BreadcrumbList |
| About | AboutPage, Organization |

FAQ rich results are limited by Google to authoritative government and health sites, but FAQPage markup still helps answer engines parse question-answer pairs.

## 6. AEO (answer engines: ChatGPT, Perplexity, Claude, Gemini, AI Overviews)

- Answer-first blocks: a 40–60 word direct answer at the top of each answer page, then detail.
- Definitions phrased the way people ask ("What is a forward deployed engineer?").
- Every claim linked to a primary source; dates on the page (`dateModified`).
- `llms.txt` and `llms-full.txt` with the site map and plain-text content.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, CCBot.
- Server-rendered HTML for every page (no content only behind JavaScript).
- Track AI referrals in Amplitude (referrer contains chatgpt.com, perplexity.ai, claude.ai, gemini.google.com).

## 7. Checklist

Status 2026-10-31: every Phase 1 `[me]` item is done and live (34 pages, `npm run test:site` passes). Commands: `npm run deploy` builds and publishes; `npm run seo:indexnow` re-notifies Bing/IndexNow after content changes.

### Phase 1: Foundation (week 1)

- [x] [me] Real 404 page and 404 status for unknown paths (stop soft 404s)
- [x] [me] Prerendered static page per section, chapter, resource type, interview, jobs, stories, cases, with unique title, description, canonical, Open Graph, H1
- [x] [me] Hash links from the old single page forward to the new URLs
- [x] [me] Accurate meta descriptions (150–160 characters) per page
- [x] [me] JSON-LD per the schema plan
- [x] [me] BreadcrumbList and visible breadcrumbs on subpages
- [x] [me] `sitemap.xml` with every URL and `lastmod`
- [x] [me] `robots.txt` with explicit AI-crawler allows and sitemap
- [x] [me] `llms.txt` and `llms-full.txt`
- [x] [me] Home FAQ (6–8 questions) with answer-first copy
- [x] [me] "What is a forward deployed engineer?" and "FDE vs SPE" answer pages
- [x] [me] About page: method, sources, independence, corrections, contact via GitHub issues
- [x] [me] IndexNow key file and submission of all URLs (Bing, Yandex, Seznam; feeds Copilot and ChatGPT search)
- [ ] [you] Decide the brand: keep "FDE Academy" (collides with fde.academy) or rename (suggestions: "Open FDE", "FDE Field Guide")
- [ ] [you] Verify the domain in Google Search Console (DNS TXT in Cloudflare) and submit `sitemap.xml`
- [ ] [you] Verify in Bing Webmaster Tools (import from Search Console) and submit the sitemap
- [ ] [you] Decide whether to name yourself as author/editor (strongest E-E-A-T signal); if yes, give name, one-line bio, LinkedIn/X links, and whether to mention Amplitude

### Phase 2: Expansion (weeks 2–8)

- [ ] [me] Per-page Open Graph images (chapter title cards)
- [x] [me] Split the 485 KB single page so each URL ships only its content
- [ ] [me] Internal links from resources back to the chapters that cite them
- [ ] [me] Monthly job snapshot refresh with visible "updated" date (`npm run refresh:jobs`)
- [ ] [you] Launch posts: Hacker News (Show HN), r/cscareerquestions, r/ExperiencedDevs, LinkedIn, X; link the most specific page per community
- [ ] [you] Ask to be listed: amitshekhariitbhu roadmap, pierpaolo28/Awesome-FDE-Roadmap, roadmap.sh resources (PRs or issues from your GitHub)
- [ ] [you] Tell the podcast hosts and authors featured (Forward Deployed, Lenny's, Lightcone) that they are cited; some will share
- [ ] [me] Check Search Console coverage and fix any excluded pages (needs Search Console access)

### Phase 3: Scale (months 3–6)

- [ ] [me] Company pages for top hiring companies (/jobs/databricks/, /jobs/palantir/...) once Search Console shows demand
- [ ] [me] "FDE interview guide" long-form page grouping questions by company
- [ ] [me] Glossary pages for recurring terms (thin vertical slice, deployment strategist, SPE)
- [ ] [you] Guest posts or newsletter mentions (Lenny's, The Pragmatic Engineer, Latent Space community)
- [ ] [me] Quarterly AI-citation check: 20 prompts across ChatGPT, Perplexity, Claude; record which pages are cited

### Phase 4: Authority (months 7–12)

- [ ] [you] Original data: yearly "State of FDE hiring" report from the job snapshots (we have the data; you publish and pitch it)
- [ ] [you] Talks or podcast appearances that link back
- [ ] [me] Keep `dateModified` and sources current; prune dead links monthly

## Audit 2026-10-31

Full audit and action plan: `open-fde.ai-audit/`. Health score 59 → 85. Fixed: HTTP/www 301s via `src/worker.js`, permanent trailing-slash redirects, security headers, titles ≤ 60, heading order, per-page social images, Course offers, shared cached assets, tap targets, chapter reading notes, resource → chapter links, visible updated dates.

## 8. Risks

- Brand confusion with fde.academy: may lose clicks and look derivative. Mitigation: rename, or differentiate the title tag ("open-fde: free FDE field guide").
- Thin pages: job and company pages go stale. Mitigation: dated snapshots, noindex company pages with fewer than 3 postings.
- AI answers reduce clicks. Mitigation: be the cited source; measure citations, not just clicks.
