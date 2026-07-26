# CAPM handoff

## Product contract

CAPM is a public, mobile-first study site. Do not add ChatGPT sign-in,
workspace authentication, or a local-only deployment. Every device uses the
same default production URL and shared progress record.

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

`/api/progress` reads and writes one shared JSON progress document in D1.
Legacy `?sync=<uuid>` records remain readable only so an old link can seed the
shared record during migration. There is no identity system.

The browser cache key is namespaced as `capm:progress:v2:capm-default-v1`. It
exists for startup speed and temporary offline use, not as the source of truth.
The server record is authoritative whenever it is reachable.

Security tradeoff: without authentication, anyone who can open the public site
can read and update the shared learning record. The progress data must not hold
sensitive or personal information.

## Release checklist

1. Confirm public official source facts and checked dates.
2. Run `npm run lint`.
3. Run `npm test`.
4. Build and deploy the exact committed source state.
5. Test the production root on a phone-sized browser.
6. Confirm the URL does not gain a `sync` parameter.
7. Confirm progress survives a second device using the default URL.
8. Confirm no login screen or workspace restriction is enabled.
