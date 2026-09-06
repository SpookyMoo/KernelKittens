# Full-width Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align every bordered result and team card with its thin orange section rule.

**Architecture:** Keep the existing HTML and Ready v3 theme. Change only the two container layout rules in the canonical stylesheet, protected by the existing site contract test.

**Tech Stack:** Static HTML, CSS, Node.js test runner

## Global Constraints

- Keep `site/assets/theme.css` as the only public stylesheet.
- Preserve the dark archive theme and all published content.
- Keep desktop and 320px layouts accessible and readable.

---

### Task 1: Align card widths

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `site/assets/theme.css`

**Interfaces:**
- Consumes: Existing `.competition-records`, `.roster`, and `.archive-section` selectors.
- Produces: Full-width single-column result and team card containers.

- [x] **Step 1: Write the failing contract assertions**

Add assertions requiring `.competition-records` and `.roster` to use `max-width:none`, and requiring `.roster` to use `grid-template-columns:1fr`.

- [x] **Step 2: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL in `the canonical stylesheet contains the current archive theme` because the stylesheet still contains the 46rem caps and multi-column roster.

- [x] **Step 3: Apply the minimal CSS change**

Set `.competition-records` to `max-width:none`. Set `.roster` to `max-width:none` and `grid-template-columns:1fr`.

- [x] **Step 4: Run release verification**

Run: `npm test && npm audit --audit-level=high && git diff --check`
Expected: 12 tests pass, zero high-severity audit findings, and no whitespace errors.
