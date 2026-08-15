# Homepage Copy Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove redundant homepage copy and consistently capitalize the Kernel Kittens name.

**Architecture:** Keep the current Astro page structure and navigation. Change only the visible strings and Recent Files list owned by the homepage, header, and base layout, with browser-level assertions covering the rendered result.

**Tech Stack:** Astro 7, TypeScript, Playwright

## Global Constraints

- Keep `/results/` available in primary navigation and as a public route.
- Keep `/writeups/` as the only Recent Files entry.
- Use `Kernel Kittens` for every visible team-name instance in the rendered templates.
- Do not change historical design documents.

---

### Task 1: Homepage copy and capitalization

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: Astro-rendered homepage at `/` and existing `data-recent-files` marker.
- Produces: Homepage text `We play CTFs.`, visible team name `Kernel Kittens`, and one Recent Files link to `/writeups/`.

- [ ] **Step 1: Write the failing browser assertions**

```ts
await expect(page.getByText("We play CTFs.", { exact: true })).toBeVisible();
await expect(page.getByText("We play CTFs and keep the useful parts here.", { exact: true })).toHaveCount(0);
await expect(page.getByText("Kernel Kittens", { exact: true })).toHaveCount(3);
const recentFiles = page.locator("[data-recent-files]");
await expect(recentFiles.getByRole("link")).toHaveCount(1);
await expect(recentFiles.getByRole("link", { name: "/writeups/", exact: true })).toHaveAttribute("href", "/writeups/");
await expect(recentFiles.getByRole("link", { name: "/results/", exact: true })).toHaveCount(0);
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run: `npm run build; npm run test:e2e -- --grep "home presents|verified result ledger"`

Expected: FAIL because the old introduction, lowercase name, and `/results/` Recent Files link still render.

- [ ] **Step 3: Apply the minimal Astro template changes**

```astro
<h1>Kernel Kittens</h1>
<p class="lede">We play CTFs.</p>
<ul class="file-list">
  <li><a href="/writeups/">/writeups/</a></li>
</ul>
```

Also change the persistent header identity to `<strong>Kernel Kittens</strong>` and footer label to `<p>Kernel Kittens / CTF team</p>`.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm run build; npm run test:e2e -- --grep "home presents|verified result ledger"`

Expected: both focused tests PASS.

- [ ] **Step 5: Run release verification**

Run: `npm test`, `npm audit`, `git diff --check`, and `go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml`.

Expected: all checks exit 0, desktop and 320-pixel screenshots show the requested copy, and the public accessibility audit reports no critical or serious findings.

- [ ] **Step 6: Commit the implementation**

```powershell
git add tests/e2e/site.spec.ts src/pages/index.astro src/components/Header.astro src/layouts/BaseLayout.astro
git commit -m "fix: clean up homepage copy"
```
