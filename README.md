# open-fde

**Live site: [open-fde.ai](https://open-fde.ai)**

Source for the site: the FDE Academy, a free, independent, evidence-labeled learning guide for Forward Deployed Engineers and Special Projects Engineers.

The whole site is one self-contained HTML file generated from the modules in `work/`. It works offline, stores nothing about visitors, and needs no backend.

```sh
node work/build.mjs     # regenerate outputs/FDE_SPE_Field_Academy.html
npm ci && npx playwright install chromium && npm test   # browser verification
npm run deploy          # refresh jobs, build, publish to Cloudflare
npm run check:links     # report broken external links in work/link-report.md
```

## Maintenance

Recurring research and refresh tasks (Market demand analysis, company facts, interview loops, source checks, shipping) are scripted under `work/research/` and documented in [.claude/skills/open-fde-maintenance/SKILL.md](.claude/skills/open-fde-maintenance/SKILL.md).

## Automatic updates

`.github/workflows/refresh.yml` rebuilds and deploys the site every day, on every merge to `main`, and on demand: it refreshes the jobs snapshot, runs all three test suites, deploys only if a page changed, and tells IndexNow which pages changed. A page's "Updated" date and sitemap `lastmod` move only when its content changes (hashes are published at `/page-dates.json`). Each day's jobs snapshot is committed to the `jobs-history` branch, with `counts.csv` for trends.

`.github/workflows/jobs-pr.yml` opens a pull request every Monday that updates `docs/JOBS.json` on `main` (CI cannot push to the protected branch).

`.github/workflows/links.yml` checks every external link on Mondays and keeps one `broken-links` issue open while any link is dead.

Setup, once: repository secret `CLOUDFLARE_API_TOKEN` (Cloudflare "Edit Cloudflare Workers" template), repository variables `CLOUDFLARE_ACCOUNT_ID` and `AMPLITUDE_API_KEY`.

## Contributing

Contributions are welcome: a better source, a correction, a missing FDE story, a new hiring company, or a design fix. Fork the repo, make the change on a branch, and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md). Every pull request is reviewed and merged by the maintainer, [@LouisLu888](https://github.com/LouisLu888); `main` is protected and nobody else can merge.

## More

See `START_HERE.md` for the full handoff, `CONTINUE_WITH_AN_AGENT.md` for editorial and engineering rules, and `docs/` for sources and research context.

Independent and unaffiliated with the companies, programs, and authors it references. Linked works remain the property of their authors; this repository contains only original annotations.
