# open-fde

**Live site: [open-fde.ai](https://open-fde.ai)**

Source for the site: the FDE Academy, a free, independent, evidence-labeled learning guide for Forward Deployed Engineers and Special Projects Engineers.

The whole site is one self-contained HTML file generated from the modules in `work/`. It works offline, stores nothing about visitors, and needs no backend.

```sh
node work/build.mjs     # regenerate outputs/FDE_SPE_Field_Academy.html
npm ci && npx playwright install chromium && npm test   # browser verification
npm run deploy          # build + publish to Cloudflare
```

## Contributing

Contributions are welcome: a better source, a correction, a missing FDE story, a new hiring company, or a design fix. Fork the repo, make the change on a branch, and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md). Every pull request is reviewed and merged by the maintainer, [@LouisLu888](https://github.com/LouisLu888); `main` is protected and nobody else can merge.

## More

See `START_HERE.md` for the full handoff, `CONTINUE_WITH_AN_AGENT.md` for editorial and engineering rules, and `docs/` for sources and research context.

Independent and unaffiliated with the companies, programs, and authors it references. Linked works remain the property of their authors; this repository contains only original annotations.
