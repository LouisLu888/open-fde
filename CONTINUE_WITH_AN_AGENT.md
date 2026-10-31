# Continuation prompt

Continue improving this existing public FDE/SPE learning website. Inspect the supplied project first and work on its existing implementation rather than starting over. You have the complete project folder; the previous chat is not required.

## Objective

Make this an exceptional, information-dense resource for becoming a Forward Deployed Engineer and improving as an experienced FDE. SPE means Special Projects Engineer in this guide; role definitions vary by company.

The audience includes aspiring engineers, working practitioners, and people building FDE teams. The website will be shared on X and LinkedIn. Prioritize engineering judgment, customer understanding, production delivery, and measurable business outcomes. Avoid repetitive “What is FDE?” introductions and superficial link collections.

## Current implementation

The public file is `outputs/FDE_SPE_Field_Academy.html`. Edit the modules under `work/` and regenerate it with `node work/build.mjs`. See `START_HERE.md` for portable build and test setup.

Public edition 3.2, content updated October 31, 2026. Live at https://open-fde.ai (Cloudflare Workers static assets; source in the `open-fde` GitHub repository):

- 37 learning resources across 10 skill areas, including 7 books and 3 specific podcast episodes
- 17 case studies and 16 interview questions with evidence labels
- 8 advanced fieldcraft guides and 8 firsthand FDE stories
- 19 people in a company/person/X/talk/article table
- A 12-week roadmap and 79 source citations

Nine sections: Choose your path, Learning library, Advanced fieldcraft, 12-week roadmap, Case studies, Stories, Interview questions, People to learn from, FDE job openings.

The site is English-only, responsive, self-contained, and usable offline except for external reading. An FDE job openings section groups open postings by company from a dated snapshot (`docs/JOBS.json`, refreshed with `npm run refresh:jobs`). A site-wide search (press `/` or Ctrl/Cmd+K) spans library, fieldcraft, roadmap, cases, stories, interview questions, and people. Per-section search, filters, completion tracking, interview notes, assessments, progress import/export, and a clean HTML download already work. Preserve them. Edition 3.2 passes 34 verification checks; package-specific evidence is in `docs/`.

## Research already incorporated

Read `docs/RESEARCH_CONTEXT.md`, `docs/SOURCES.json`, and the annotated source modules. The four community collections already reviewed are:

- https://github.com/pierpaolo28/Awesome-FDE-Roadmap
- https://github.com/xdash/FDE-the-Guidance-Book-of-Forward-Deployed-Engineer
- https://github.com/VanGong1999/FDE
- https://github.com/global-fde/awesome-fde-resources

Additional reviewed sources:

- https://fde.academy/blog/fde-academy-method-forward-deployed-engineer-training
- https://joinplank.com/about
- https://nextplayso.substack.com/p/the-definitive-guide-to-forward-deployed

Their useful contributions are included in the roadmap. Plank's specific Day 37 handoff lesson is a library resource. Its reference run used simulated participants without a real customer cloud account; retain this qualification.

The Stories section covers Vinoo Ganesh, Chinemerem E., Het Trivedi, Hiro Hayami, Milos Mandic, Henry Chang, Vlad Shulman, and Dongying Zhou. These are distinct accounts of entering FDE, doing the work, building teams, and moving into product engineering. Do not duplicate the existing Nabeel Qureshi or Leo Mehr library readings merely to increase the story count.

## Editorial requirements

1. Everything must be English and publicly shareable. Remove internal material and Amplitude-specific framing.
2. Learning links must point to specific articles, videos, podcast episodes, papers, book pages, documentation sections, or repository documents. Generic company pages may be labeled background context, not assignments.
3. Read substantive source material before annotating it. State its distinct lesson, reading focus, application, and limits. Deduplicate by learning value, not only URL.
4. Preserve interview questions rather than adding a “Deliberate practice” section. Clearly distinguish candidate reports, employer-published formats, and original case-derived questions. Do not invent actual employer questions or official answers.
5. Favor firsthand stories with concrete incidents, decisions, costs, or changed beliefs. Label employer-hosted material, recruiting context, translations, and uncorroborated claims.
6. Do not invent handles, employment histories, outcomes, metrics, or publication dates. Preserve explicit unverified-handle labels.
7. Attribute sources beside claims. Link accessibility does not establish accuracy. Distinguish reviewing a book description, selected text, a transcript, or actual media playback.
8. This independent site is unaffiliated with FDE Academy/Futurense, Plank, and other referenced companies or programs.

## Engineering requirements

Keep the visual language and useful interactions. The website must remain portable without a required backend.

The site keeps no visitor state. Progress tracking, notes, self-assessment, backups and local storage were removed in edition 3.3 at the owner's request; on load the page deletes the old `fde-spe-field-academy-public-v2` key. Do not reintroduce saved state without asking.

Source files are authoritative; do not make changes only in generated HTML. Keep work files under `work/` and deliverables under `outputs/`. Preserve source licensing and use original annotations rather than copying external publications.

## Next actions

Audit the existing content and experience, identify the highest-value gaps, and implement justified improvements. Research beyond the existing collections when necessary. Prioritize deeper learning and easier navigation over increasing counts. The prior work is complete; there is no hidden unfinished feature. Deploy with `npm run deploy` after tests pass (see `START_HERE.md`).

Use judgment to proceed without routine confirmation. Do not publish externally or send messages to others without authorization.

Run relevant checks, inspect the site on desktop and mobile, verify source links and evidence labels, and test search, filters, and the clean download. Refresh the research inventory after content changes.

Deliver updated HTML with a verified downloadable link, and briefly explain what improved, what was tested, and any material limitations. If a specific new instruction accompanies this prompt, treat it as the priority for the next iteration.
