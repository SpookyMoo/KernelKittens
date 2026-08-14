# BushBash Result Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the verified BushBash CTF 2026 first-place result on `/results/` while keeping Cyber Apocalypse as the homepage feature.

**Architecture:** Extend the typed result record so verified events can omit unsupported score and solve metrics. Build each scorecard's metrics from present values, keep Cyber Apocalypse first, and promote the BushBash record from pending to verified.

**Tech Stack:** Astro 5, TypeScript, Vitest, Playwright, axe-core, GitHub Actions, Azure Static Web Apps, Azure Container Apps

## Global Constraints

- Credit BushBash to `1337_PwnSp4c3` as `Member result with a prior team`.
- Publish `1 / 994` and `Global`; do not invent a score or challenge count.
- Keep Cyber Apocalypse first in `verifiedResults` and featured on the homepage.
- Do not publish certificates, local paths, personal identity, flags, or challenge solutions.
- Use ASCII punctuation and the existing accessible definition-list markup.

---

### Task 1: Verified result data and adaptive scorecard

**Files:**
- Modify: `tests/unit/site-data.test.ts`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/data/results.ts`
- Modify: `src/components/ResultScorecard.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `competitionResults`, `verifiedResults`, and `VerifiedCompetitionResult` from `src/data/results.ts`.
- Produces: verified record `bushbash-2026` and a scorecard accepting nullable solve count, score, and division fields.

- [ ] **Step 1: Write the failing unit contract**

Replace the pending-result assertions with:

```ts
it("publishes only verified results in source order", () => {
  expect(verifiedResults.map((result) => result.id)).toEqual([
    "cyber-apocalypse-2026",
    "bushbash-2026"
  ]);
});

it("publishes the verified BushBash result with exact prior-team attribution", () => {
  const result = verifiedResults.find((item) => item.id === "bushbash-2026");
  expect(result).toMatchObject({
    placement: 1,
    placementLabel: "1st",
    fieldSize: 994,
    solved: null,
    totalChallenges: null,
    score: null,
    division: "Global",
    creditedTeam: "1337_PwnSp4c3",
    attribution: "Member result with a prior team"
  });
});
```

- [ ] **Step 2: Write the failing browser contract**

Add card-scoped assertions to the Results test so repeated attribution text remains unambiguous:

```ts
const bushBash = page.locator("[data-result-status='verified']").filter({
  hasText: "BushBash CTF 2026"
});
await expect(bushBash.getByText("1 / 994", { exact: true })).toBeVisible();
await expect(bushBash.getByText("Global", { exact: true })).toBeVisible();
await expect(bushBash.getByText("Member result with a prior team", { exact: true })).toBeVisible();
await expect(bushBash.getByText(/1337_PwnSp4c3/)).toBeVisible();
await expect(page.locator("[data-result-status='verified']")).toHaveCount(2);
```

Add a homepage test:

```ts
test("home keeps Cyber Apocalypse as the featured result", async ({ page }) => {
  await page.goto("/");
  const featured = page.locator(".result-scorecard--featured");
  await expect(featured.getByText("Cyber Apocalypse 2026", { exact: true })).toBeVisible();
  await expect(featured).not.toContainText("BushBash");
});
```

Remove the old assertion that forbids a first-place BushBash result.

- [ ] **Step 3: Verify the tests fail for the missing result**

```powershell
npx vitest run tests/unit/site-data.test.ts
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "results show|home keeps"
```

Expected: BushBash is still pending, so the unit contract and two-card browser assertion fail.

- [ ] **Step 4: Implement the result schema and data**

Use this verified interface in `src/data/results.ts`:

```ts
export interface VerifiedCompetitionResult extends ResultBase {
  status: "verified";
  placement: number;
  placementLabel: string;
  fieldSize: number;
  solved: number | null;
  totalChallenges: number | null;
  score: number | null;
  division: string | null;
}
```

Add `division: null` to Cyber Apocalypse and pending records. Replace BushBash with:

```ts
{
  id: "bushbash-2026",
  event: "BushBash CTF",
  year: 2026,
  status: "verified",
  placement: 1,
  placementLabel: "1st",
  fieldSize: 994,
  solved: null,
  totalChallenges: null,
  score: null,
  division: "Global",
  creditedTeam: "1337_PwnSp4c3",
  attribution: "Member result with a prior team"
}
```

- [ ] **Step 5: Implement adaptive metrics**

Build this list in `ResultScorecard.astro`:

```ts
const metrics = [
  { label: "Placement", value: `${result.placement} / ${result.fieldSize.toLocaleString("en-US")}` },
  ...(result.solved !== null && result.totalChallenges !== null
    ? [{ label: "Solved", value: `${result.solved} / ${result.totalChallenges}` }]
    : []),
  ...(result.score !== null
    ? [{ label: "Score", value: result.score.toLocaleString("en-US") }]
    : []),
  ...(result.division !== null ? [{ label: "Division", value: result.division }] : [])
];
```

Render `metrics.map()` as the existing `<dt>` and `<dd>` pairs. Change the Results-page grid to:

```css
.result-list .result-scorecard__metrics {
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  grid-template-rows: none;
}
```

- [ ] **Step 6: Verify the focused tests pass**

```powershell
npx vitest run tests/unit/site-data.test.ts
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "results show|home keeps"
```

Expected: selected tests pass with two verified result cards and Cyber Apocalypse featured.

- [ ] **Step 7: Commit the tested feature**

```powershell
git add tests/unit/site-data.test.ts tests/e2e/site.spec.ts src/data/results.ts src/components/ResultScorecard.astro src/styles/global.css
git commit -m "feat: publish BushBash first place"
```

### Task 2: Verify and release

**Files:**
- Modify outside Git: the canonical Kernel Kittens project note
- Modify outside Git: the current Kimi session note

**Interfaces:**
- Consumes: the committed result and existing GitHub-to-Azure workflow.
- Produces: merged GitHub change, verified Azure deployment, live accessibility evidence, and durable notes.

- [ ] **Step 1: Run the complete release gate**

```powershell
npm test
npm audit --audit-level=high
git diff --check
go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml
```

Expected: 19 unit tests, 17 browser tests, 8 accessibility tests, one visual test, zero high-severity findings, and no actionlint output.

- [ ] **Step 2: Inspect desktop and 320-pixel captures**

Confirm both cards have readable metrics, no overflow, no clipped attribution, and no collision at 320 pixels.

- [ ] **Step 3: Push and verify the pull request**

```powershell
git push --set-upstream github-personal feat/bushbash-result
gh pr create --repo SpookyMoo/KernelKittens --base main --head feat/bushbash-result --title "Add verified BushBash result"
gh pr checks --repo SpookyMoo/KernelKittens --watch --interval 10
```

Expected: `Verify tested release` passes and Azure deployment skips on the pull request.

- [ ] **Step 4: Merge and watch production**

Merge without rewriting shared history. Read the merge SHA and select the main run with that exact SHA:

```powershell
$mergeSha=gh pr view --repo SpookyMoo/KernelKittens --json mergeCommit --jq '.mergeCommit.oid'
$runId=gh run list --repo SpookyMoo/KernelKittens --workflow verify-and-deploy.yml --branch main --event push --limit 10 --json databaseId,headSha --jq ".[] | select(.headSha == `"$mergeSha`") | .databaseId"
gh run watch $runId --repo SpookyMoo/KernelKittens --interval 10 --exit-status
```

Expected: verification and Azure deployment pass.

- [ ] **Step 5: Verify the public pages and accessibility**

Confirm `/` still features Cyber Apocalypse. Confirm `/results/` contains BushBash, `1 / 994`, `Global`, `1337_PwnSp4c3`, CSP, and HSTS. Run `a11y:a11y_audit_url` on both routes with best-practice checks enabled and require zero critical or serious violations.

- [ ] **Step 6: Update durable notes**

Record the evidence basis, attribution, merge commit, workflow run, live checks, and accessibility result. Do not copy private certificate contents beyond the public result facts.
