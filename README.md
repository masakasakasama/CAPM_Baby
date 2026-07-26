# CAPM

An English-first, German-supported CAPM learning web app with a soft pink and
light-blue visual system. It is designed for a phone, works without a ChatGPT
account, and keeps progress synchronized through one default URL.

## Learning structure

### Course 1 — One agency, one school, one recruitment challenge

A cross-domain case follows an agency that already works with one Japanese
language school and must discover how to find suitable international students.
The course first defines the four official CAPM Exam Content Outline domains,
then places the agency case inside each definition. Original diagrams explain
the case roadmap, official domain map, student/agency/school journey, quality
funnel, channel comparison, two-week experiment, action plan, metrics, and next
experiment board. All case copy is English-first with German support. It connects:

- project-management fundamentals and core concepts;
- predictive, plan-based methods;
- agile frameworks and methodologies;
- business-analysis frameworks.

### Course 2 — Detailed domain study

Four detailed modules follow the public CAPM Exam Content Outline. Each module
contains English explanations, German anchors, original CSS diagrams, key
terms, worked reasoning, and practice links.

## Practice and readiness

- 48 original bilingual practice questions, 12 per domain.
- 96 question-specific German beginner answers, revealed only after answering.
- A 30-question weighted mock drawn from the larger bank.
- Confidence-aware spaced repetition and complete attempt history.
- Readiness based on coverage, whole-bank accuracy, study completion, repeated
  mastery, and the latest mock score.
- A displayed formula and counts so the score is auditable.

The app uses 70% only as an internal study target. It does not claim that PMI
publishes a fixed passing score.

## Source and copyright policy

The learning map and exam facts use public official sources, especially the
CAPM Exam Content Outline and CAPM certification page. Supporting concepts use
public first-party sources such as the Scrum Guide and Manifesto for Agile
Software Development.

PMBOK Guide prose, paid PMI course content, official exam questions, and other
closed materials are not copied. Explanations, diagrams, scenarios, and
questions in this repository are independently authored. The Sources screen
labels free official material, free supporting material, and closed material
that was deliberately not reproduced.

This is an independent study aid and is not affiliated with or endorsed by PMI.
PMI, CAPM, and PMBOK are marks of Project Management Institute, Inc.

## Progress sync

Every device opening the default production URL reads and updates the same
server-side D1 document. A namespaced browser cache is only a fast/offline
fallback.

- No ChatGPT login or account is used.
- The default URL synchronizes progress across phones and computers.
- Manual refresh and background refresh are included.
- Because the public site has no authentication, anyone who knows its URL can
  read and update the shared learning record.

## Local development

Prerequisite: Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
npm run lint
npm test
```

`npm test` performs a production build and validates the public domain map,
question-bank size and distribution, mock blueprint, readiness behavior,
two-course structure, source boundaries, and D1 migration.

## Important files

- `app/page.tsx` — learning interface and interaction flow
- `app/data.ts` — original question bank and public source register
- `app/beginner-faqs.ts` — plain-language German beginner questions and examples
- `app/study.ts` — Course 1 and Course 2 learning content
- `app/progress.ts` — readiness and spaced-repetition rules
- `app/api/progress/route.ts` — anonymous default-link sync API
- `db/` and `drizzle/` — D1 schema and migration
- `HANDOFF.md` — operational and content-maintenance notes
