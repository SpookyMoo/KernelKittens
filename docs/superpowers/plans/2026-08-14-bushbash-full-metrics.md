# BushBash Full Metrics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display complete verified BushBash summary metrics wherever its existing scorecard appears.

**Architecture:** Update the existing typed result record. The shared scorecard already renders placement, solved, score, and division when present, so no component or layout change is needed.

**Tech Stack:** Astro, TypeScript, Vitest, Playwright

## Global Constraints

- Publish only aggregate scoreboard metrics.
- Preserve the prior-team credit and attribution.
- Do not publish member or challenge-level history.
- Preserve the publication boundary and accessibility gate.

---

### Task 1: Fill the BushBash scorecard metrics

**Files:**
- Modify: `tests/unit/site-data.test.ts`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/data/results.ts`

**Interfaces:**
- Consumes: the existing `VerifiedCompetitionResult` fields
- Produces: a BushBash record with `solved: 28`, `totalChallenges: 28`, `score: 5997`, and `division: "Open - International"`

- [x] **Step 1: Write failing unit and browser expectations**

Require the exact four BushBash values in the data test. Require `28 / 28`, `5,997`, and `Open - International` in the existing homepage and Results page scorecard assertions.

- [x] **Step 2: Verify the tests fail for the missing metrics**

Run `npm run test:unit -- tests/unit/site-data.test.ts`, then build and run `npx playwright test tests/e2e/site.spec.ts -g "home board|results show exact"`.

Expected: failures showing null values and missing rendered text.

- [x] **Step 3: Update the result record**

Set the BushBash fields in `src/data/results.ts` to:

```ts
solved: 28,
totalChallenges: 28,
score: 5997,
division: "Open - International",
```

- [x] **Step 4: Verify focused and full gates**

Run the focused unit and browser tests, then `npm test`, `npm audit --audit-level=high`, and `git diff --check`.

Expected: 19 unit tests, 18 browser tests including desktop and 320-pixel overflow coverage, 8 accessibility tests, and 1 visual test pass with no high-severity dependency finding or diff error.

- [x] **Step 5: Inspect and commit**

Inspect fresh desktop and mobile homepage captures, verify the public diff contains no roster or challenge history, and commit the change.
