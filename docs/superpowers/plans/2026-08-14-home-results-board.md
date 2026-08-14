# Homepage Results Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put both verified results on the homepage board while keeping Cyber Apocalypse as the sole featured card.

**Architecture:** The homepage will map the existing ordered `verifiedResults` collection into the existing `ResultScorecard` component. The first item receives the featured prop, and a small wrapper supplies vertical spacing without changing the Results page layout.

**Tech Stack:** Astro, TypeScript, CSS, Playwright

## Global Constraints

- Render verified results in their existing source order.
- Keep Cyber Apocalypse 2026 first and featured.
- Put BushBash CTF 2026 directly beneath it.
- Do not change the complete Results page.
- Preserve the public publication boundary and accessibility gate.

---

### Task 1: Render the complete homepage board

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `verifiedResults` and `ResultScorecard`
- Produces: `.home-results` containing ordered verified scorecards

- [x] **Step 1: Write the failing browser test**

Update the homepage result test to select the section headed `On the board.`, require two verified scorecards, require Cyber Apocalypse in the sole featured card, and require BushBash with `1 / 994` in the second card.

- [x] **Step 2: Run the focused test to verify it fails**

Run `npm run build` followed by `npx playwright test tests/e2e/site.spec.ts -g "home board"`.

Expected: failure because the homepage currently renders one scorecard.

- [x] **Step 3: Write the minimal implementation**

Replace the single featured scorecard with:

```astro
<div class="home-results">
  {verifiedResults.map((result, index) => (
    <ResultScorecard result={result} featured={index === 0} />
  ))}
</div>
```

Add this spacing rule:

```css
.home-results {
  display: grid;
  gap: 2rem;
}
```

- [x] **Step 4: Run focused and full verification**

Run `npm run build`, the focused Playwright test, then `npm test`.

Expected: all checks pass with 19 unit tests, 17 browser tests, 8 accessibility tests, and 1 visual test.

- [x] **Step 5: Inspect and commit**

Inspect the fresh desktop and mobile homepage captures, review the diff for public-boundary leaks, and commit the implementation.
