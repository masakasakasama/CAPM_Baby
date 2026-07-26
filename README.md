# CAPM Baby

An English-first, German-supported CAPM learning web app with a soft pink and
light-blue visual system. It is designed for a phone, works without a ChatGPT
account, and keeps progress synchronized through a private, unguessable URL.

## Learning structure

### Course 1 — One project, four lenses

A short cross-domain course follows one clinic-booking project from idea to
value delivery. It connects:

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

Opening the site creates a URL with a random `sync` identifier. Bookmark or
share that exact URL with the learner's other device. Progress is stored in a
server-side D1 record keyed by that identifier; a namespaced browser cache is
only a fast/offline fallback.

- No ChatGPT login or account is used.
- The same private link synchronizes progress across phones and computers.
- Manual refresh and background refresh are included.
- Losing the private link means losing access to that progress record.
- Anyone who has the private link can read and update that record, so it should
  not be posted publicly.

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
- `app/study.ts` — Course 1 and Course 2 learning content
- `app/progress.ts` — readiness and spaced-repetition rules
- `app/api/progress/route.ts` — anonymous private-link sync API
- `db/` and `drizzle/` — D1 schema and migration
- `HANDOFF.md` — operational and content-maintenance notes

