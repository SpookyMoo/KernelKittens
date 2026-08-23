# Results and recruitment copy implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved Results and `stray.rar` copy without changing application behavior.

**Architecture:** Keep the static HTML structure and Ready v3 theme intact. Lock the visible sentences in the existing Node contract suite before changing the three affected pages.

**Tech Stack:** Static HTML, Node.js 24 built-in test runner, GitHub Actions, GitHub Pages

## Global constraints

- Keep `site/` as the exact deployment artifact.
- Do not change Ready assignment, scoring, Discord OAuth, solve receipts, challenge files, or bot behavior.
- Do not add scripts, dependencies, analytics, or remote assets.
- Use straight ASCII punctuation and the exact approved copy.
- Preserve the prior-team attribution to `1337_PwnSp4c3`.

---

### Task 1: Lock and publish the copy

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `site/index.html`
- Modify: `site/results/index.html`
- Modify: `site/apply/index.html`

**Interfaces:**
- Consumes: Static page files through the existing `read(relative)` test helper.
- Produces: Exact visible copy in the deployed `site/` artifact.

- [ ] **Step 1: Write the failing copy assertions**

Add these assertions to the existing homepage, Results page, and application tests:

```js
assert.equal((home.match(/RESULT 2026 \/ member result with a prior team/g) ?? []).length, 2);
assert.doesNotMatch(home, /KK \/ RESULT 2026/);

assert.equal((results.match(/RESULT 2026 \/ member result with a prior team/g) ?? []).length, 2);
assert.doesNotMatch(results, /KK \/ RESULT 2026/);

assert.match(apply, /<h2>stray\.rar<\/h2>/);
assert.doesNotMatch(apply, /candidate assignment/);
assert.match(apply, /Team members can reliably finish this in 10-15 minutes\./);
assert.match(apply, /Finishing earns a Discord invite\. If you run out of time, a team member can still invite you manually\./);
```

- [ ] **Step 2: Run the focused suite and confirm RED**

Run:

```bash
npm test
```

Expected: the new assertions fail because the old labels and heading remain and the two guidance sentences do not exist.

- [ ] **Step 3: Make the minimal HTML changes**

In both result records on `site/index.html` and `site/results/index.html`, use:

```html
<p class="path-label">RESULT 2026 / member result with a prior team</p>
```

In `site/apply/index.html`, use this record heading and append the two list items under "Before you start":

```html
<h2>stray.rar</h2>
<li>Team members can reliably finish this in 10-15 minutes.</li>
<li>Finishing earns a Discord invite. If you run out of time, a team member can still invite you manually.</li>
```

- [ ] **Step 4: Confirm GREEN**

Run `npm test`. Expected: all tests pass with no warnings or failures.

- [ ] **Step 5: Run the release gates**

Run `npm audit --audit-level=high` and `git diff --check`. Serve `site/`, inspect `/`, `/results/`, and `/apply/` at 1440 by 900 and 320 by 800, then audit every public route with the Kitsune accessibility tool. Critical or serious findings block deployment.

- [ ] **Step 6: Commit the implementation**

```bash
git add tests/site-contract.test.mjs site/index.html site/results/index.html site/apply/index.html
git commit -m "fix: clarify results and recruitment copy"
```

Push through a pull request, merge only after CI passes, then verify the exact live copy and GitHub Pages deployment.
