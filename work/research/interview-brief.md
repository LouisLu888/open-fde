# Research brief: FDE interview processes and questions

Site: open-fde.ai, a free, sourced guide for forward deployed engineers (FDE / FDSE / Deployment Strategist / AI deployment engineer). We are rebuilding the Interview section as a company-by-company guide: each hiring company's interview process (stages, format, what each stage tests) plus a question bank with provenance.

The site's standard: every claim links to a public source you opened and read. Evidence is labelled honestly. No fabrication. If you cannot find something, say so; an empty field beats an invented one.

## Your job
For each company assigned to you, research its forward-deployed-type roles (any title containing Forward Deployed, FDE, FDSE, Deployment Strategist, Deployed Engineer, AI Deployment Engineer, or the company's equivalent):

1. Interview process: ordered stages (recruiter screen, technical screen, take-home, decomposition, onsite, hiring manager, etc.), format and length when known, and what each stage assesses.
2. Questions actually asked or explicitly described, each with its source.
3. Tips that come from a source (a candidate, an employee, the employer), not generic advice.
4. AI-tool policy in interviews if the employer states one.

## Where to look (in order of trust)
1. Employer-published: careers pages, engineering blogs, the job posting itself (e.g. job-boards.greenhouse.io, jobs.ashbyhq.com, jobs.lever.co pages often describe the process), employee posts on the company blog.
2. Employees and candidates first-hand: Reddit (r/csMajors, r/cscareerquestions, r/ExperiencedDevs, r/leetcode), LeetCode Discuss interview posts, Medium/Substack/personal blogs, X threads, YouTube video descriptions, podcasts with show notes.
3. Third-party compilations (IGotAnOffer, Exponent/tryexponent, interviewing.io, Prepfully, Interview Query, Hello Interview, levels.fyi blog, Taro, Pramp, DataLemur): usable but mark as third-party; prefer when they cite candidates.

Do NOT use or cite Glassdoor or Blind (terms forbid reuse). Do not use paywalled content you cannot read. Use WebSearch to find, WebFetch to open and confirm every source. Record only what the page actually says.

## Copyright
Paraphrase every question and process description in your own words, at most 25 words per question. Never copy more than 10 consecutive words from a source.

## Output
Write one JSON file to the path given in your task (usually work/research/out/interviews-<group>.json), shaped like this:

```json
{
  "companies": [
    {
      "company": "Palantir",
      "roles": ["Forward Deployed Software Engineer", "Deployment Strategist"],
      "process": [
        {"stage": "Recruiter screen", "format": "30-min call", "assesses": "Motivation, role fit", "source": "S1"}
      ],
      "questions": [
        {"prompt": "Paraphrased question, <=25 words", "type": "decomposition|coding|system-design|customer-scenario|behavioral|motivation|take-home|domain|debugging|ai-build|sql-data|presentation", "role": "FDSE", "stage": "Onsite decomposition", "evidence": "employer|candidate|employee|third-party", "source": "S2", "year": "2025", "note": "context or caveat, optional"}
      ],
      "tips": [{"text": "Specific tip, paraphrased", "source": "S3"}],
      "aiPolicy": {"text": "What the employer says about AI tools in interviews, or empty", "source": "S4"},
      "sources": [
        {"id": "S1", "url": "https://...", "title": "Page title", "publisher": "Site or author", "date": "YYYY-MM or YYYY", "kind": "employer|candidate|employee|third-party", "checked": "What you confirmed on the page, one line"}
      ],
      "gaps": "What you could not find"
    }
  ]
}
```

Aim for depth on the big hirers and honesty on the rest: 8 to 20 sourced questions for a major company is good; 0 to 3 for a small one is fine if that is what exists. Source ids are local to each company. Keep running notes short; finish with a one-paragraph summary of coverage and weakest evidence.
