# FDE / SPE Field Academy — complete handoff

Public edition 3.2 · Content updated October 31, 2026.

## Open the website

Open `outputs/FDE_SPE_Field_Academy.html` in a browser. It is the complete website and needs no installation, server, or account. The guide works offline; linked reading needs internet access.

## Continue with another agent

1. Extract this entire ZIP on the other laptop.
2. Give your agent access to the extracted folder.
3. Tell it: **“Read CONTINUE_WITH_AN_AGENT.md and continue improving this existing project.”**

The folder contains the website, editable source, handoff prompt, research context, all 79 source citations, content inventory, browser checks, verification evidence, and reference screenshots. The previous chat and its attachments are not required.

## Contents

| Path | Purpose |
| --- | --- |
| `CONTINUE_WITH_AN_AGENT.md` | Self-contained continuation prompt and product requirements |
| `AGENTS.md` | Project rules for the next agent |
| `outputs/FDE_SPE_Field_Academy.html` | Ready-to-open, publicly shareable website |
| `work/build.mjs` | Generates the HTML from the source modules |
| `work/content.mjs` | Original sources, people, roadmap, interview questions, cases |
| `work/library.mjs` | Curated library, learning routes, advanced fieldcraft |
| `work/stories.mjs` | Stories and additional training references |
| `work/verify.mjs` | Portable automated browser verification |
| `docs/RESEARCH_CONTEXT.md` | Research decisions, evidence boundaries, and suggested next steps |
| `docs/SOURCES.json` | All source links, authors, dates, and review labels |
| `docs/CONTENT_INVENTORY.json` | Resource categories, stories, and source relationships |
| `docs/VERIFICATION_BASELINE.json` | Previous completed browser checks against this HTML |
| `docs/PACKAGE_TEST_REPORT.json` | Verification performed for this handoff |
| `previews/` | Desktop and mobile design references |
| `FILE_MANIFEST.json` | File sizes and SHA-256 checksums for transfer verification |

## Rebuild on the other laptop

Install Node.js 22 or newer if it is not already available. Open a terminal in this extracted folder:

```sh
node work/build.mjs
```

The build uses only Node's built-in libraries. It needs no downloaded dependencies or internet access. It overwrites the HTML in `outputs/`.

## Run browser checks

From the project folder:

```sh
npm ci --ignore-scripts
npx playwright install chromium
npm test
```

The first setup downloads test dependencies and the matching browser. Those platform-specific binaries and Node.js are not bundled in the ZIP. They are unnecessary for opening, editing, or rebuilding the website.

On a supported Linux system that needs browser libraries, use `npx playwright install --with-deps chromium` instead; installing system packages may require administrator access. See the [official Playwright browser setup documentation](https://playwright.dev/docs/browsers).

Tests use an isolated browser. They do not open your personal browser profile. Results and fresh screenshots are written under `work/`. The test paths use portable file-URL conversion for folders with spaces and Windows-style paths. Windows and Linux have not been run in this handoff environment.

If you intentionally use installed Google Chrome for testing, the verifier also accepts `--chrome`: `node work/verify.mjs --chrome`. The default uses Playwright's installed Chromium.

## Check the transferred package

Before editing files:

```sh
node work/check-package.mjs
```

This checks the shipped file checksums. Expected edits will naturally change them. Browser verification is separate from transfer verification.

After changing source content, regenerate the HTML and the research inventory:

```sh
npm run build
npm run refresh:research
```

## Refresh the job openings

The FDE job openings section is a snapshot in `docs/JOBS.json`. To refresh it from the public Greenhouse, Lever, and Ashby boards, then rebuild and deploy:

```sh
npm run refresh:jobs   # add companies to the list in work/fetch-jobs.mjs
npm test && npm run deploy
```

## Deploy to open-fde.ai

The live site is a Cloudflare Worker serving static assets from `site/`. With Wrangler logged in to the owning account:

```sh
npm run build:og      # only when counts or the card design change
npm test
npm run deploy        # builds HTML, assembles site/, runs wrangler deploy
```

`wrangler.jsonc` binds both `open-fde.ai` and `www.open-fde.ai` as custom domains.

## Attribution

The package contains project source and original short annotations, not copies of the linked articles, books, videos, or podcasts. Source authors retain their own rights and license terms. The guide is independent and unaffiliated with the companies and training providers it references. No deployment, domain, paid account, or credentials are required.
