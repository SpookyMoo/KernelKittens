# Kernel Kittens application page implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the auto-opening application dialog with the approved archive record page and simplify the site-wide logo subtitle.

**Architecture:** Keep the static `site/` artifact and its single Ready v3 stylesheet. Separate the homepage from the application route, preserve the current API data hooks, and remove only dialog-specific JavaScript and CSS.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js 24 contract tests, GitHub Pages.

## Global constraints

- Ready v3 remains the only public theme.
- `site/assets/theme.css` remains the only stylesheet.
- No remote fonts, frameworks, trackers, cookies, forms, or third-party scripts.
- Every public page keeps one main landmark, a skip link, a visible home route, and visible keyboard focus.
- No em dashes, en dashes, smart quotes, or corporate filler.
- Implementation and verification run in the isolated PVE2 worktree.

---

### Task 1: Lock the new page contract

**Files:**
- Modify: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: the static files under `site/`.
- Produces: contract tests for route separation, application structure, shared identity, and retained API hooks.

- [ ] **Step 1: Replace the old shared-dialog assertion with route-specific tests**

Add assertions that the homepage links to `/apply/` and lacks application hooks. Add assertions that `/apply/` contains `data-ready-root`, the existing API origin and form hooks, numbered archive steps, no dialog markers, and no `/apply/stray.rar` text. Assert every page contains `<small>est. 2026</small>` and no `root@kk`.

- [ ] **Step 2: Run the contract test and verify RED**

Run: `npm test`
Expected: FAIL because the current homepage and application page are identical dialogs and the old subtitle remains.

### Task 2: Build the dedicated archive record page

**Files:**
- Modify: `site/index.html`
- Modify: `site/apply/index.html`
- Modify: `site/404.html`
- Modify: `site/accessibility/index.html`
- Modify: `site/results/index.html`
- Modify: `site/writeups/index.html`

**Interfaces:**
- Consumes: existing Ready v3 class names and `data-ready-*` application hooks.
- Produces: a homepage without application state and an application page with the existing hooks in normal document flow.

- [ ] **Step 1: Restore the homepage as a separate route**

Use a root canonical URL and title, keep the existing archive intro, change both application controls to `<a href="/apply/">`, and remove `data-ready-root`, the API origin, application markup, and application script.

- [ ] **Step 2: Replace the application dialog with an archive record**

Keep `data-ready-root` and the API origin on the application wrapper. Use `<main id="ready-application">`, an intro without a path label, one bordered `.application-record`, and three `.application-step` sections. Keep every existing login, assignment, checksum, download, logout, flag, TOP token, submit, result, and live-status hook.

- [ ] **Step 3: Simplify the shared logo subtitle**

Replace `root@kk / est. 2026` with `est. 2026` on all six public pages and set route-appropriate `aria-current="page"` links.

### Task 3: Remove dialog behavior and style the archive record

**Files:**
- Modify: `site/assets/apply.js`
- Modify: `site/assets/theme.css`

**Interfaces:**
- Consumes: the unchanged `data-ready-*` API hooks in `site/apply/index.html`.
- Produces: the existing API flow without modal control code and the approved responsive record layout.

- [ ] **Step 1: Remove dialog-only JavaScript**

Delete queries and listeners for `data-ready-dialog`, `data-ready-open`, `data-ready-close`, and `data-ready-reopen`. Leave session recovery, Discord login, download signing, submission, logout, and error states unchanged.

- [ ] **Step 2: Replace dialog CSS with record and step CSS**

Remove dialog, backdrop, close button, and modal sizing selectors. Add `.application-page`, `.application-record`, `.application-record__head`, `.application-steps`, and `.application-step` rules using the current Ready v3 tokens. Keep the existing 44rem mobile breakpoint and accessibility overrides.

- [ ] **Step 3: Run the contract test and verify GREEN**

Run: `npm test`
Expected: 0 failures.

### Task 4: Verify and release

**Files:**
- Verify: entire repository and every public route.

**Interfaces:**
- Consumes: the completed static site.
- Produces: release evidence and a deployable commit.

- [ ] **Step 1: Run repository checks**

Run: `npm test && npm audit && git diff --check`
Expected: all commands exit 0.

- [ ] **Step 2: Inspect responsive screenshots**

Serve `site/` on the remote box. Capture `/` and `/apply/` at 1440 by 1000 and 320 by 900. Verify no clipping, overlay, hidden navigation, or horizontal overflow.
