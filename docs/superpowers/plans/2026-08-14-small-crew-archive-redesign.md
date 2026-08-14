# Small Crew Archive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portfolio-style Kernel Kittens interface with the approved handmade 2000 to 2006 small crew archive while preserving verified result data and the public-content boundary.

**Architecture:** Astro continues to emit a static, script-free site. A shared compact header and a semantic `ResultLedger` component replace the geometric brand treatment, motion stage, and result cards. One global stylesheet owns the fixed dark archive palette and responsive behavior, while route components retain the existing data and publication rules.

**Tech Stack:** Astro 7, TypeScript 6, Vitest 4, Playwright 1.62, axe-core, plain CSS

## Global Constraints

- Use the approved Phenoelit, NMRC, and PullThePlug-inspired small crew archive direction without copying their assets or text.
- Fixed colors: `#060606`, `#d8d3c5`, `#ef6a2e`, `#f2bf5b`, `#91b875`, `#5a2d1d`, and `#fff07a`.
- Use only Arial Black, Arial, Verdana, Tahoma, Consolas, and Courier New system fonts.
- Add no animation, client-side JavaScript, remote fonts, trackers, cookies, forms, or third-party requests.
- Preserve exact verified results from `src/data/results.ts` and retain prior-team attribution.
- Preserve one main landmark, an obvious route home, visible focus, keyboard navigation, reduced-motion compatibility, 320-pixel support, and WCAG 2.2 AA.
- Do not push or deploy until Moo approves the rendered preview.

---

## File map

- Create `src/components/ResultLedger.astro`: semantic result table shared by Home and Results.
- Modify `src/components/Header.astro`: ASCII cat signature, text brand, and bracketed primary navigation.
- Modify `src/layouts/BaseLayout.astro`: fixed dark theme metadata and plain archive footer.
- Modify `src/styles/global.css`: replace the complete portfolio design system with the archive system.
- Modify `src/pages/index.astro`: compact home introduction, results ledger, and recent file links.
- Modify `src/pages/results.astro`: full verified results archive without motion artwork.
- Modify `src/pages/writeups/index.astro`: file-list empty state and archive structure.
- Modify `src/components/WriteupCard.astro`: dated file-row treatment for future public entries.
- Modify `src/pages/accessibility.astro`: compact archive prose.
- Modify `src/pages/404.astro`: compact missing-file page.
- Modify `tests/e2e/site.spec.ts`: replace portfolio assertions with the approved archive contract.
- Modify `tests/e2e/a11y.spec.ts`: keep all public routes under both media settings.
- Modify `tests/e2e/visual.spec.ts`: capture the fixed dark design at desktop and mobile sizes.
- Delete `src/components/MotionStage.astro`: retired geometric motion-stage component.
- Delete `src/components/ResultScorecard.astro`: retired portfolio scorecard component.
- Keep `src/components/BrandMark.astro` and `public/brand/kernel-kittens-mark.svg` only as favicon support unless final inspection shows they are unused everywhere.

### Task 1: Lock the approved visual and content contract

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

**Interfaces:**
- Consumes: existing public routes and verified data rendered by Astro.
- Produces: browser assertions for `[data-crew-signature]`, `[data-result-ledger]`, `[data-recent-files]`, and the absence of `.motion-stage`, `.result-scorecard`, and `.button-link`.

- [ ] **Step 1: Replace the home portfolio assertions with failing archive assertions**

Add tests with these exact expectations:

```ts
test("home presents the small crew archive identity", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "kernel kittens" })).toBeVisible();
  await expect(page.locator("[data-crew-signature]")).toContainText("root@kk");
  await expect(page.getByText("We play CTFs and keep the useful parts here.", { exact: true })).toBeVisible();
  await expect(page.locator(".motion-stage, .result-scorecard, .button-link")).toHaveCount(0);
});

test("home exposes the verified result ledger and recent files", async ({ page }) => {
  await page.goto("/");

  const ledger = page.locator("[data-result-ledger]");
  await expect(ledger.locator("[data-result-status='verified']")).toHaveCount(2);
  await expect(ledger.getByText("Cyber Apocalypse 2026", { exact: true })).toBeVisible();
  await expect(ledger.getByText("BushBash CTF 2026", { exact: true })).toBeVisible();
  await expect(page.locator("[data-recent-files]").getByRole("link")).toHaveCount(2);
});
```

Keep the existing exact metric, prior-team attribution, link, security-header, publication, and accessibility assertions. Remove assertions tied to the old motion stage, featured card, giant heading wrapping, and animation playhead.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npx playwright test tests/e2e/site.spec.ts --grep "small crew archive|result ledger"`

Expected: FAIL because `[data-crew-signature]`, `[data-result-ledger]`, and the new home heading do not exist, while old portfolio components still render.

- [ ] **Step 3: Make visual capture independent of color-scheme switching**

In `tests/e2e/visual.spec.ts`, remove `page.emulateMedia({ colorScheme: "light" })` and the separate `desktop-home-dark.png` capture. Keep one desktop and one 320-pixel capture for each public route because the approved design has one fixed dark appearance.

- [ ] **Step 4: Commit the failing contract**

```powershell
git add tests/e2e/site.spec.ts tests/e2e/visual.spec.ts
git commit -m "test: define small crew archive interface"
```

### Task 2: Rebuild the shared shell and archive design system

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Astro.url.pathname`, `siteConfig.name`, and existing public routes.
- Produces: `[data-crew-signature]`, `.crew-nav`, `.page-shell`, `.archive-intro`, `.archive-section`, and fixed archive color variables.

- [ ] **Step 1: Implement the compact header**

Replace the graphical brand with this semantic structure:

```astro
<header class="site-header">
  <div class="site-header__inner">
    <a class="crew-identity" href="/" aria-label="Kernel Kittens">
      <pre class="crew-cat" aria-hidden="true"> /\_/\\
( o.o )
 &gt; ^ &lt;</pre>
      <span data-crew-signature>
        <strong>kernel kittens</strong>
        <small>root@kk / est. 2026</small>
      </span>
    </a>
    <nav aria-label="Primary">
      <ul class="crew-nav">
        {links.map((link) => (
          <li><a href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined}>[{link.label.toLowerCase()}]</a></li>
        ))}
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 2: Update theme metadata and footer copy**

Use one `<meta name="theme-color" content="#060606" />`. Keep the skip link and main landmark. Change the footer to:

```astro
<footer class="site-footer">
  <div class="site-footer__inner">
    <p>kernel kittens / CTF team</p>
    <p><a href="/accessibility/">accessibility</a> / no trackers / no remote scripts</p>
  </div>
</footer>
```

- [ ] **Step 3: Replace the global stylesheet**

Define the exact tokens from Global Constraints and implement:

```css
:root {
  color-scheme: dark;
  --page: #060606;
  --ink: #d8d3c5;
  --link: #ef6a2e;
  --score: #f2bf5b;
  --status: #91b875;
  --line: #5a2d1d;
  --focus: #fff07a;
  --muted: #aaa497;
  --content: 64rem;
  --reading: 46rem;
  --font-body: Verdana, Tahoma, sans-serif;
  --font-data: Consolas, "Courier New", monospace;
  --font-name: "Arial Black", Arial, sans-serif;
}
```

Use zero radius, no shadows, no gradients, no transitions, no animation, a compact centered rail, orange underlined links, amber result highlights, rust rules, and a three-pixel focus outline. At `max-width: 40rem`, stack the header and navigation without hiding any link.

- [ ] **Step 4: Run the home identity test**

Run: `npx playwright test tests/e2e/site.spec.ts --grep "small crew archive"`

Expected: FAIL only because the home page content still uses the old heading and components. Header signature assertions should pass.

- [ ] **Step 5: Commit the shell**

```powershell
git add src/components/Header.astro src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add small crew archive shell"
```

### Task 3: Replace the home and results scorecards with one ledger

**Files:**
- Create: `src/components/ResultLedger.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/results.astro`
- Delete: `src/components/MotionStage.astro`
- Delete: `src/components/ResultScorecard.astro`
- Test: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: `readonly VerifiedCompetitionResult[]` from `src/data/results.ts`.
- Produces: `<table data-result-ledger>`, one `<tr data-result-status="verified">` per result, and exact event, placement, solves, score, division, credited-team, and attribution text.

- [ ] **Step 1: Create the shared semantic ledger**

Implement this component interface:

```astro
---
import type { VerifiedCompetitionResult } from "../data/results";
interface Props { results: readonly VerifiedCompetitionResult[]; caption: string; }
const { results, caption } = Astro.props;
---
<div class="result-ledger-wrap">
  <table class="result-ledger" data-result-ledger>
    <caption>{caption}</caption>
    <thead><tr><th>event</th><th>place</th><th>solves</th><th>score</th><th>division</th></tr></thead>
    <tbody>
      {results.map((result) => (
        <tr data-result-status={result.status}>
          <th scope="row" data-label="event">
            <strong>{result.event} {result.year}</strong>
            <span>{result.attribution} / {result.creditedTeam}</span>
          </th>
          <td data-label="place">{result.placement} / {result.fieldSize.toLocaleString("en-US")}</td>
          <td data-label="solves">{result.solved} / {result.totalChallenges}</td>
          <td data-label="score">{result.score?.toLocaleString("en-US")}</td>
          <td data-label="division">{result.division ?? "open"}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

At narrow widths, hide the visual header and render each row as a block with `data-label` prefixes. Keep the table semantics in the DOM and do not add horizontal page scrolling.

- [ ] **Step 2: Rebuild Home around the ledger**

The home page must contain:

```astro
<header class="archive-intro archive-intro--home">
  <p class="path-label">/home</p>
  <h1>kernel kittens</h1>
  <p class="lede">We play CTFs and keep the useful parts here.</p>
  <p class="status-line">CTF team / est. 2026</p>
</header>
<section class="archive-section" aria-labelledby="home-results-title">
  <h2 id="home-results-title">results</h2>
  <ResultLedger results={verifiedResults} caption="Verified competition results" />
</section>
<section class="archive-section" data-recent-files aria-labelledby="recent-files-title">
  <h2 id="recent-files-title">recent files</h2>
  <ul class="file-list"><li><a href="/results/">/results/</a></li><li><a href="/writeups/">/writeups/</a></li></ul>
</section>
```

- [ ] **Step 3: Rebuild Results around the same ledger**

Use heading `results`, path label `/results/`, direct copy `Placements we can prove. Prior-team work keeps the prior team name.`, and the shared ledger with all verified results. Remove the motion-stage aside.

- [ ] **Step 4: Delete retired presentation components**

Delete `MotionStage.astro` and `ResultScorecard.astro` after all imports are removed. Confirm `rg "MotionStage|ResultScorecard|motion-stage|result-scorecard" src` returns no matches.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npx playwright test tests/e2e/site.spec.ts --grep "small crew archive|result ledger|exact verified metrics|320"`

Expected: all selected tests pass.

- [ ] **Step 6: Commit the core redesign**

```powershell
git add src/components/ResultLedger.astro src/pages/index.astro src/pages/results.astro src/components/MotionStage.astro src/components/ResultScorecard.astro src/styles/global.css tests/e2e/site.spec.ts
git commit -m "feat: replace portfolio cards with result ledger"
```

### Task 4: Finish the archive routes and verify the preview

**Files:**
- Modify: `src/components/WriteupCard.astro`
- Modify: `src/pages/writeups/index.astro`
- Modify: `src/pages/accessibility.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `tests/e2e/a11y.spec.ts`

**Interfaces:**
- Consumes: publication-safe Astro content entries and `siteConfig.accessibilityEmail`.
- Produces: `.writeup-entry`, `[data-public-file-count]`, `.archive-prose`, and consistent home routes.

- [ ] **Step 1: Add a failing empty-archive assertion**

```ts
test("write-up archive reports zero public files without leaking flags", async ({ page }) => {
  await page.goto("/writeups/");
  await expect(page.locator("[data-public-file-count]")).toHaveText("0 public files");
  await expect(page.getByText(/confirmed BushBash notes remain private/i)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/bushbash\{|HTB\{/i);
});
```

Run: `npx playwright test tests/e2e/site.spec.ts --grep "zero public files"`

Expected: FAIL because `[data-public-file-count]` does not exist.

- [ ] **Step 2: Restyle the writeup archive**

Use path label `/writeups/`, heading `writeups`, `0 public files`, and the exact explanation `Seven confirmed BushBash solves remain private until publication is allowed.` Future public writeups render as dated rows with an underlined path-like title and plain event/category/difficulty metadata.

- [ ] **Step 3: Restyle accessibility and 404 routes**

Use the common `.archive-intro` and `.archive-prose` structures. Preserve the WCAG 2.2 AA target, report address, known-gaps text, and obvious home links. Use `404 / file not found` as the missing-page heading and retain the link names `Back home` and `Open write-ups` for stable navigation.

- [ ] **Step 4: Run the route tests and verify GREEN**

Run: `npx playwright test tests/e2e/site.spec.ts`

Expected: all site tests pass.

- [ ] **Step 5: Run the complete release checks**

```powershell
npm test
npm audit
git diff --check
go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml
```

Expected: all tests pass, audit reports zero vulnerabilities, diff check is clean, and Actionlint exits zero.

- [ ] **Step 6: Inspect rendered screenshots**

Inspect desktop and 320-pixel captures for Home, Results, Write-ups, and Accessibility. Verify no clipped data, accidental modern cards, oversized headings, missing focus states, or page-level horizontal overflow. Iterate until the images match the approved direction.

- [ ] **Step 7: Run the public accessibility standard**

Use the `a11y-standard` skill against the built public routes. Fix all critical and serious findings, then rerun `npm run test:a11y`.

- [ ] **Step 8: Commit the finished preview**

```powershell
git add src/components/WriteupCard.astro src/pages/writeups/index.astro src/pages/accessibility.astro src/pages/404.astro src/styles/global.css tests/e2e/site.spec.ts tests/e2e/a11y.spec.ts tests/e2e/visual.spec.ts
git commit -m "feat: finish small crew archive redesign"
```

- [ ] **Step 9: Stop before public deployment**

Start a local preview, capture its exact URL, and show Moo the rendered site. Do not push the branch, merge it, or trigger Azure until Moo approves that preview.
