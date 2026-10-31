# Contributing to open-fde

Thanks for helping improve [open-fde.ai](https://open-fde.ai), a free learning guide for Forward Deployed Engineers.

## What helps most

- A correction: a wrong claim, a dead link, an outdated date.
- A better primary source for something already covered.
- A firsthand FDE story, case, or interview report with a public, specific source.
- A company hiring FDEs that the job snapshot misses (add its Greenhouse, Lever, or Ashby slug to `work/fetch-jobs.mjs`).
- A design or accessibility fix.

Open an issue first if the change is large or you are unsure it fits.

## How to propose a change

1. Fork the repository and create a branch.
2. Edit the source modules in `work/` (content lives in `work/content.mjs`, `work/library.mjs`, and `work/stories.mjs`; layout in `work/build.mjs`). Do not hand-edit `outputs/FDE_SPE_Field_Academy.html`; it is generated.
3. Rebuild and test:

   ```sh
   npm ci
   npx playwright install chromium
   npm run build
   npm test
   ```

4. Open a pull request against `main`. Describe what changed and link the sources you relied on.

## Review and merging

`main` is protected. Every change lands through a pull request, and only the maintainer, [@LouisLu888](https://github.com/LouisLu888), can approve and merge. Expect questions about sources: the guide distinguishes reported claims, verified facts, and editorial synthesis, and new content should say which it is.

## Content rules

- English only, independent, and free of internal or confidential company material.
- Link the specific publication, not a company homepage.
- Summarize in your own words; do not paste copyrighted text.
- The site stores nothing about visitors. Please do not add accounts, saved progress, or tracking beyond the documented analytics in `docs/TRACKING_PLAN.md`.
