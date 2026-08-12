# Kernel Kittens Results Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the credential-led portfolio layout with a distinct competition scorecard, verified results page, and accessible static motion-art placeholders.

**Architecture:** Astro continues to render a script-free static site. Typed result records in `src/data/results.ts` feed shared scorecard components, while status filtering prevents an unverified BushBash placement from reaching public HTML. A reusable `MotionStage.astro` reserves responsive 16:9 and square art slots without loading video or client JavaScript.

**Tech Stack:** Astro 7.2.1, TypeScript 6.0.3, Vitest 4.1.10, Playwright 1.62.1, Axe 4.13.0, CSS custom properties, semantic HTML, and Azure Static Web Apps.

## Global Constraints

- Keep the source repository private before release.
- Do not copy embargoed challenge text, flags, solution steps, member identities, or private archive paths into the repository.
- Render only result records with `status: "verified"`.
- Attribute the Cyber Apocalypse result to the prior `1337_PwnSp4c3` team.
- Do not claim a BushBash placement until primary evidence is inspected.
- Remove certifications from public navigation, public copy, and the sitemap.
- Use no analytics, cookies, remote fonts, third-party scripts, autoplay, canvas runtime, or remote media.
- Meet WCAG 2.2 AA plus the Kitsune public-site standard.
- Strip em dash, en dash, smart quotes, and generic AI copy patterns from every public string.
- Deploy only after unit, build, publication, browser, accessibility, content, and visual checks pass.

## File Map

- `src/data/results.ts`: typed verified and pending competition records.
- `src/components/ResultScorecard.astro`: shared result-led scoreboard composition.
- `src/components/MotionStage.astro`: static storyboard plate with wide and square variants.
- `src/components/Header.astro`: persistent Home, Results, and Write-ups navigation.
- `src/pages/index.astro`: results-led home composition.
- `src/pages/results.astro`: verified public competition ledger.
- `src/pages/certifications.astro`: removed after Azure redirect coverage is in place.
- `src/pages/sitemap.xml.ts`: fixed public routes without certifications.
- `src/layouts/BaseLayout.astro`: updated browser theme colors.
- `src/styles/global.css`: complete scorecard visual system and preference handling.
- `public/staticwebapp.config.json`: permanent `/certifications/*` redirect to `/results/`.
- `tests/unit/site-data.test.ts`: result type, proof, attribution, and filtering rules.
- `tests/unit/security-headers.test.ts`: redirect policy contract.
- `tests/e2e/site.spec.ts`: routes, navigation, motion semantics, results, and mobile behavior.
- `tests/e2e/a11y.spec.ts`: Axe coverage for every current public route.
- `tests/e2e/visual.spec.ts`: light desktop, light mobile, and dark desktop captures.

---

### Task 1: Typed competition records

**Files:**
- Create: `src/data/results.ts`
- Modify: `tests/unit/site-data.test.ts`

**Interfaces:**
- Produces `CompetitionResult`, `competitionResults`, and `verifiedResults`.
- `CompetitionResult.status` is `"verified" | "pending"`.
- Public components consume only `verifiedResults`.

- [ ] **Step 1: Write the failing data tests**

Replace credential assertions with:

```ts
import { competitionResults, verifiedResults } from "../../src/data/results";

it("publishes only verified results", () => {
  expect(verifiedResults.every((result) => result.status === "verified")).toBe(true);
  expect(verifiedResults.map((result) => result.id)).not.toContain("bushbash-2026");
});

it("keeps the verified prior-team result exact and attributed", () => {
  const result = verifiedResults.find((item) => item.id === "cyber-apocalypse-2026");
  expect(result).toMatchObject({
    placement: 12,
    fieldSize: 6744,
    solved: 136,
    totalChallenges: 136,
    score: 69425,
    creditedTeam: "1337_PwnSp4c3",
    attribution: "Member result with a prior team"
  });
});

it("does not assign an unverified BushBash placement", () => {
  const result = competitionResults.find((item) => item.id === "bushbash-2026");
  expect(result).toMatchObject({ status: "pending", placement: null });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:unit -- tests/unit/site-data.test.ts`

Expected: FAIL because `src/data/results.ts` does not exist.

- [ ] **Step 3: Add the typed records and verified filter**

Create `CompetitionResult` with numeric nullable metrics, exact attribution, and status. Add the verified Cyber Apocalypse record and a pending BushBash candidate with `placement: null`. Export:

```ts
export const verifiedResults = competitionResults.filter(
  (result): result is CompetitionResult & { status: "verified" } => result.status === "verified"
);
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:unit -- tests/unit/site-data.test.ts`

Expected: PASS with three result-data tests and the existing site configuration test passing.

- [ ] **Step 5: Commit the data contract**

```powershell
git add src/data/results.ts tests/unit/site-data.test.ts
git commit -m "feat: add verified competition records"
```

---

### Task 2: Public route and navigation contract

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `tests/e2e/a11y.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`
- Modify: `tests/unit/security-headers.test.ts`
- Modify: `public/staticwebapp.config.json`
- Modify: `src/components/Header.astro`
- Modify: `src/pages/sitemap.xml.ts`
- Create: `src/pages/results.astro`
- Delete: `src/pages/certifications.astro`

**Interfaces:**
- `/results/` is a prerendered public page.
- `/certifications/*` returns a permanent redirect to `/results/` in Azure and in the local release server.
- The fixed route arrays are `/`, `/results/`, `/writeups/`, and `/accessibility/`.

- [ ] **Step 1: Change tests before routes**

Update every route list to use `/results/`. Replace the credential browser test with exact assertions for `Cyber Apocalypse 2026`, `12 / 6,744`, `136 / 136`, `69,425`, and `Member result with a prior team`. Assert that `Certifications`, `Google Cybersecurity`, `CCNA`, and `CompTIA` are absent from public pages. Add a unit assertion for this route entry:

```ts
expect(config.routes).toContainEqual({
  route: "/certifications/*",
  redirect: "/results/",
  statusCode: 301
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm run test:unit -- tests/unit/security-headers.test.ts && npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: FAIL because the redirect and `/results/` route do not exist.

- [ ] **Step 3: Implement routing and the minimum results page**

Add the permanent redirect before the asset-cache route, remove the certifications page, add the results page from `verifiedResults`, change the header label and href to `Results` and `/results/`, and update the sitemap fixed paths.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm run test:unit -- tests/unit/security-headers.test.ts && npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: PASS with the new public route set and no certification content.

- [ ] **Step 5: Commit the public information architecture**

```powershell
git add public/staticwebapp.config.json src/components/Header.astro src/pages src/pages/sitemap.xml.ts tests
git commit -m "feat: make competition results the public record"
```

---

### Task 3: Scorecard and motion-stage semantics

**Files:**
- Create: `src/components/ResultScorecard.astro`
- Create: `src/components/MotionStage.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/results.astro`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- `ResultScorecard` accepts `result: CompetitionResult & { status: "verified" }` and `featured?: boolean`.
- `MotionStage` accepts `variant?: "wide" | "square"`, `title: string`, and `caption: string`.
- Both components render semantic HTML without scripts.

- [ ] **Step 1: Add failing semantic browser tests**

Assert that home contains:

```ts
await expect(page.getByRole("heading", {
  level: 1,
  name: "We play CTFs. The scoreboard can do the talking."
})).toBeVisible();
await expect(page.getByRole("figure", { name: /static keyframe/i })).toBeVisible();
await expect(page.locator("video, canvas, script")).toHaveCount(0);
```

Assert that `/results/` has one visible verified scorecard and no text matching `/BushBash.*(?:1st|first)/i`.

- [ ] **Step 2: Run the focused browser tests and verify RED**

Run: `npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: FAIL on the new heading, figure, and scorecard assertions.

- [ ] **Step 3: Implement the shared components and page composition**

Render the motion plate as a `figure` containing a labeled visual `div` and `figcaption`. Use decorative spans for crop marks, frame number, word fragment, mark silhouette, and timeline. Render all result metrics from typed data. Do not include a media element, script, or animation framework.

- [ ] **Step 4: Run the focused browser tests and verify GREEN**

Run: `npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: PASS with the static motion figure and exact result attribution visible.

- [ ] **Step 5: Commit the semantic components**

```powershell
git add src/components src/pages tests/e2e/site.spec.ts
git commit -m "feat: add scorecard and motion art stages"
```

---

### Task 4: Competition scorecard visual system

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/BrandMark.astro`
- Modify: `src/pages/writeups/index.astro`
- Modify: `src/pages/accessibility.astro`
- Modify: `src/pages/404.astro`

**Interfaces:**
- Global tokens provide score-sheet, ink, cobalt, trophy-orange, and score-yellow roles in light and dark modes.
- `.motion-stage--wide` keeps a 16:9 ratio and `.motion-stage--square` keeps a 1:1 ratio.
- Responsive scorecards stack below 48rem without horizontal overflow.

- [ ] **Step 1: Add responsive and preference assertions**

At a 320 by 720 viewport, assert the navigation, Results link, motion figure, and result metrics remain visible and `document.documentElement.scrollWidth` equals 320. Under reduced motion, assert all transition durations compute to zero or near-zero values.

- [ ] **Step 2: Run the focused browser test and verify RED**

Run: `npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: FAIL on the new layout and reduced-motion selectors before the CSS rewrite.

- [ ] **Step 3: Replace the soft card system**

Implement the approved palette, hard rules, clipped corners, registration marks, condensed display stack, block navigation states, oversized rank numerals, event strips, and motion-plate geometry. Remove pill radii, dashboard card shadows, the giant logo card, and the pale background grid. Keep `prefers-color-scheme`, `prefers-contrast`, and `prefers-reduced-motion` blocks.

- [ ] **Step 4: Run mobile, browser, and accessibility checks**

Run: `npm run build && npm run test:e2e && npm run test:a11y`

Expected: PASS with no horizontal overflow and no critical or serious Axe findings.

- [ ] **Step 5: Commit the visual system**

```powershell
git add src/styles/global.css src/layouts src/components/BrandMark.astro src/pages
git commit -m "style: redesign site as a competition scorecard"
```

---

### Task 5: Visual review, full release gate, and live deployment

**Files:**
- Modify as needed after screenshot inspection.
- Modify: `docs/deployment.md` only if the deployed release marker or route list changes.
- Update: canonical Obsidian Kernel Kittens project and current session notes.

**Interfaces:**
- The exact verified `dist` directory is deployed to the existing Azure Static Web App.
- The generated Azure origin must return the redesigned homepage, `/results/`, expected security headers, and no certification page.

- [ ] **Step 1: Capture the visual matrix**

Run: `npx playwright test tests/e2e/visual.spec.ts`

Expected: desktop and mobile PNGs for Home, Results, Write-ups, and Accessibility plus a dark desktop home PNG.

- [ ] **Step 2: Inspect every screenshot and fix visible defects**

Check hierarchy, clipping, collision, reading width, color contrast, result attribution, the 16:9 stage, the square cutdown, and 320-pixel behavior. Patch visible problems and rerun the visual capture until the images are coherent.

- [ ] **Step 3: Run the complete release proof**

Run:

```powershell
npm test
npm audit
git diff --check
```

Expected: every command exits zero, all unit and browser tests pass, Axe has no critical or serious findings, and npm reports no known vulnerabilities.

- [ ] **Step 4: Commit and push the tested branch**

```powershell
git add src public tests docs
git commit -m "feat: ship results-first Kernel Kittens redesign"
git push gitea feat/initial-site
```

- [ ] **Step 5: Deploy and verify the exact build**

Read the existing deployment token through Azure CLI into the process environment, deploy `dist` with the pinned SWA CLI, clear the token, and verify the generated origin with direct HTTPS requests. Confirm `/`, `/results/`, `/writeups/`, and `/accessibility/` return 200; `/certifications/` redirects; security headers remain present; and the home HTML contains the new headline.

- [ ] **Step 6: Run the live accessibility audit and write handoff notes**

Audit every live public route through the configured a11y MCP. Record the tested commit, visual direction, route change, pending BushBash evidence, Azure origin, and verification result in the canonical Obsidian project and session notes without secrets.
