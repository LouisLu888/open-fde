# Research brief: company facts for the FDE jobs table

Site: open-fde.ai, a free, sourced guide for forward deployed engineers. The Jobs page lists companies hiring FDEs. We are turning it into a table: company, website, industry, stage, valuation, ARR/revenue. Every number must come from a public source you opened, with its date. No guessing, no estimates from memory. An empty field beats a wrong one. Prefer the most recent figure and state its date.

## For each company in your list, find
1. **website**: official homepage URL.
2. **industry**: a short label, 2–4 words, e.g. "AI models", "Data platform", "Legal AI", "Defense tech", "Developer tools", "Customer service AI", "Fintech", "Cloud infrastructure".
3. **stage**: one of: "Public" (give ticker in `ticker`), "Private, Seed", "Private, Series A" ... "Private, Series F+", "Private, late stage" (when the round letter is unclear), "Acquired" (say by whom in `note`), "Subsidiary".
4. **valuation**: latest post-money valuation in USD for private companies (from the latest priced round or a reported tender/secondary, say which in `valuationBasis`), or market capitalization for public companies (`valuationBasis`: "market cap", with the date you read it). Also the date (YYYY-MM) and source.
5. **arr**: latest reported annual recurring revenue or revenue run-rate in USD. For public companies use the latest fiscal-year revenue or trailing-twelve-month revenue. Say which in `arrBasis` ("ARR", "run-rate", "FY2025 revenue", "TTM revenue"). Date and source. Many private companies never disclose; leave null then.
6. **hq**: headquarters city.

## Sources (in order of trust)
Company press releases and investor relations, SEC filings, the company blog; then reputable press: Reuters, Bloomberg, The Information (only if the claim is readable in a free article or summary), TechCrunch, Fortune, CNBC, Forbes, WSJ, FT, Axios; then Crunchbase news / PitchBook news pages. For market cap, companiesmarketcap.com or a finance page is fine. Use WebSearch to find and WebFetch to confirm. Record what the page actually says. If two sources disagree, use the more recent primary one and mention the other in `note`.

## Output
Write JSON to the path given in your task (usually work/research/out/companies-<n>.json):

```json
{"companies":[
 {"company":"Exact name as given","website":"https://...","industry":"AI models","hq":"San Francisco",
  "stage":"Private, late stage","ticker":"",
  "valuation":{"usd":300000000000,"date":"2025-03","basis":"Series F post-money","source":"https://...","sourceTitle":"Publisher: headline"},
  "arr":{"usd":5000000000,"date":"2025-08","basis":"run-rate","source":"https://...","sourceTitle":"Publisher: headline"},
  "note":"optional caveat"}
]}
```
Use `null` for valuation or arr when not found. Keep every company in your list, even if most fields are null. Finish with a one-paragraph summary of coverage and the shakiest figures.
