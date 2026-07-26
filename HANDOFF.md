# CAPM Baby handoff

## Product contract

CAPM Baby is a public, mobile-first study site. Do not add ChatGPT sign-in,
workspace authentication, or a local-only deployment. The intended learner
opens the production URL on a phone and shares the exact private sync URL across
devices.

The presentation contract is:

- primary learning language: English;
- short memory anchors and key explanations: German;
- visual style: cute pink and light blue;
- original diagrams instead of copied textbook or training graphics;
- Course 1 for a cross-domain mental model;
- Course 2 for detailed domain study.

## Source boundary

Before changing exam structure, domain weights, eligibility, duration, or
question count, verify the current public official PMI pages and Exam Content
Outline. Record the checked date in the in-app source register.

Do not reproduce:

- PMBOK Guide passages or figures;
- paid PMI training material;
- official or recalled exam questions;
- third-party prep-book diagrams or question banks.

New learning material must be independently worded. Prefer original HTML/CSS
diagrams; when an external asset is truly needed, store its author, license,
source URL, and retrieval date alongside it.

## Learning data invariants

- The practice bank must remain larger than the mock.
- Keep domain distribution aligned with the public Exam Content Outline.
- Readiness uses the complete bank as its denominator.
- Mastery requires two consecutive correct attempts.
- Incorrect and low-confidence answers return sooner.
- Mock scores are learning signals, not claims about PMI's undisclosed passing
  standard.

Run `npm test` after changing content or scoring logic.

## Sync behavior

`/api/progress?id=<uuid>` reads and writes one JSON progress document in D1.
The UUID appears in the learner's URL. There is no identity system.

The browser cache key is namespaced as `capm-baby:progress:v1:<uuid>`. It exists
for startup speed and temporary offline use, not as the source of truth. The
server record is authoritative whenever it is reachable.

Security tradeoff: the URL is a bearer secret. There is intentionally no
account recovery. Avoid logging the full query string and never place a real
learner's sync URL in screenshots, issues, analytics, or documentation.

## Release checklist

1. Confirm public official source facts and checked dates.
2. Run `npm run lint`.
3. Run `npm test`.
4. Build and deploy the exact committed source state.
5. Test the production root on a phone-sized browser.
6. Confirm the URL gains a random `sync` parameter.
7. Confirm progress survives a second device using the same exact URL.
8. Confirm no login screen or workspace restriction is enabled.

