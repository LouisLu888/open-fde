# Research brief: funding stage for the FDE jobs table

Site: open-fde.ai lists companies hiring forward deployed engineers in a table with a Stage column, and visitors filter by stage. Many companies have no stage yet. Your job is to fill the stage for each company in your input file, with a public source you opened. An empty stage beats a guess.

## Allowed values for `stage`
- "Private, Seed" (pre-seed counts as seed)
- "Private, Series A", "Private, Series B", "Private, Series C", "Private, Series D", "Private, Series E", "Private, Series F+"
- "Private, late stage": private, has raised large rounds, but the latest round letter is unclear
- "Private, bootstrapped": the company or a reliable source states it has taken no outside venture funding (self-funded, bootstrapped, profitable without VC)
- "Public": give the ticker in `ticker`
- "Acquired": say by whom and when in `note`
- "Subsidiary": part of a larger company; say which in `note`
Use the latest round. A strategic investment without a letter, a grant, or a debt facility does not change the stage. If the company is not a startup (law firm, private equity firm, government lab), use "" and explain in `note`.

## Evidence
`stageSource` must be a page that states the round or status in words, for example "raised a $20M Series A" or "acquired by". The merge script opens it and checks for that wording, so a homepage or a Crunchbase profile behind a login fails. Prefer the company's announcement, then TechCrunch, Business Wire / PR Newswire, Axios Pro, Fortune, Reuters, the investor's blog. Record the round month in `stageDate` (YYYY-MM).

Watch for name collisions: confirm the article is about the same company (same website or product) as in the input. Names like "Context", "Origin", "Sphere", "Titan", "Mesh" are shared by many firms.

## Output
Write JSON to the path in your task:
```json
{"companies":[{"company":"Exact name from the input","stage":"Private, Series B","ticker":"","stageDate":"2025-09","stageSource":"https://...","stageSourceTitle":"Publisher: headline","note":"optional"}]}
```
Keep every company from the input, with stage "" when you cannot confirm it. Finish with a short summary: how many filled, by stage, and which you are least sure of.
