# open-fde

Source for **[open-fde.ai](https://open-fde.ai)**: the FDE / SPE Field Academy, a free, independent, evidence-labeled learning guide for Forward Deployed Engineers and Special Projects Engineers.

The whole site is one self-contained HTML file generated from the modules in `work/`. It works offline, keeps learning progress in the visitor's browser only, and needs no backend.

```sh
node work/build.mjs     # regenerate outputs/FDE_SPE_Field_Academy.html
npm ci && npx playwright install chromium && npm test   # browser verification
npm run deploy          # build + publish to Cloudflare
```

See `START_HERE.md` for the full handoff, `CONTINUE_WITH_AN_AGENT.md` for editorial and engineering rules, and `docs/` for sources and research context.

Independent and unaffiliated with the companies, programs, and authors it references. Linked works remain the property of their authors; this repository contains only original annotations.
