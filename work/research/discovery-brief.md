# Research brief: find every company hiring forward deployed engineers

Site: open-fde.ai lists open forward-deployed roles by company. The list comes from `work/fetch-jobs.mjs`, which probes public Greenhouse, Lever, and Ashby job-board APIs for each company slug in its `companies` array and keeps titles matching:

`/forward[\s-]*deploy|\bFDE\b|\bFDSE\b|special projects engineer|deployment strategist|ai deployment engineer/i`

Your job is to find companies that are missing from that array but currently post such roles, so the list is comprehensive. Read the `companies` array in `work/fetch-jobs.mjs` first so you only report new ones.

## What counts
- A company currently (check the posting is open) advertising a role whose title matches the pattern above, or an obvious variant ("Forward-Deployed", "Deployed Engineer", "Deployment Engineer, AI", "Field AI Engineer" only if the posting describes embedding with customers to build).
- Recruiters and staffing agencies posting for unnamed clients do not count.
- Name collisions matter: confirm the board slug belongs to the company you name (the board page shows the company name and logo).

## Output
Write JSON to the path given in your task:

```json
{"companies":[
 {"name":"Company name as the company writes it","ats":"greenhouse|lever|ashby|other","slug":"board slug, e.g. the part after jobs.ashbyhq.com/","boardUrl":"https://...","exampleTitle":"Forward Deployed Engineer","examplePostingUrl":"https://...","website":"https://...","note":"optional: other ATS (Workday, own site), or caveat"}
]}
```

For companies whose jobs are on other systems (Workday, SmartRecruiters, own careers site), still report them with `ats:"other"` and the careers URL; the fetcher cannot read them yet, but we track them.

Use WebSearch and WebFetch. Confirm each entry by opening the board or posting. Do not report a company from memory. Finish with a short summary: how many found, by ATS, and which you could not confirm.
