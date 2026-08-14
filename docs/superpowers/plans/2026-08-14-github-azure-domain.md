# Kernel Kittens GitHub To Azure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy every verified `SpookyMoo/KernelKittens` main commit to the existing Azure Static Web App and serve it at `kernelkittens.team`.

**Architecture:** GitHub Actions verifies pull requests and main commits. Main runs pass the exact tested `dist` artifact to Azure without rebuilding it. Porkbun stays authoritative and moves the apex and `www` only after the Azure origin and custom-domain validation are healthy.

**Tech Stack:** Astro 7, Vitest, Playwright, GitHub Actions, Azure Static Web Apps, Azure CLI, GitHub CLI, Porkbun DNS

## Global Constraints

- GitHub `SpookyMoo/KernelKittens` on `main` remains the canonical production source.
- A friend needs GitHub access only and never receives Azure credentials.
- Deploy only the exact tested `dist` artifact with `skip_app_build: true`.
- Never print, store in a file, or commit the Azure or Porkbun credential values.
- Preserve the private Gitea remote, unrelated DNS records, and the currently live site until the Azure origin is verified.
- Critical or serious accessibility findings block the domain cutover.

---

### Task 1: Azure workflow contract and implementation

**Files:**
- Modify: `tests/unit/github-workflow.test.ts`
- Modify: `.github/workflows/verify-and-deploy.yml`
- Modify: `public/CNAME`

**Interfaces:**
- Consumes: the existing `npm test` release gate and `dist` output.
- Produces: artifact `tested-site` and a production deploy authenticated by `secrets.AZURE_STATIC_WEB_APPS_API_TOKEN`.

- [ ] **Step 1: Replace the Pages assertions with Azure assertions**

Require `tested-site`, `actions/upload-artifact`, `actions/download-artifact`, `Azure/static-web-apps-deploy`, `app_location: dist`, `skip_app_build: true`, and the named GitHub secret. Reject Pages actions and Pages permissions. Keep the pinned-action, PR trigger, main-only deployment, and visual-review assertions.

- [ ] **Step 2: Run the focused unit test and verify the expected failure**

Run: `npm run test:unit -- tests/unit/github-workflow.test.ts`

Expected: FAIL because the current workflow still deploys with GitHub Pages.

- [ ] **Step 3: Replace the Pages deployment with exact-artifact Azure deployment**

The verify job uploads `dist` as `tested-site` only on `refs/heads/main`. The deploy job needs verify, runs only for main, downloads into `dist`, and calls the pinned official Azure action with:

```yaml
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  action: upload
  app_location: dist
  api_location: ""
  output_location: ""
  skip_app_build: true
```

Remove `public/CNAME` because it is a GitHub Pages artifact, not Azure domain configuration.

- [ ] **Step 4: Run focused tests and actionlint**

Run: `npm run test:unit -- tests/unit/github-workflow.test.ts`

Run: `go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml`

Expected: both exit zero.

- [ ] **Step 5: Commit the workflow migration**

```powershell
git add tests/unit/github-workflow.test.ts .github/workflows/verify-and-deploy.yml public/CNAME
git commit -m "ci: deploy tested site to Azure"
```

### Task 2: Deployment documentation and full local release gate

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/deployment.md`

**Interfaces:**
- Consumes: the workflow contract from Task 1.
- Produces: the current source, Azure resource, domain, secret name, cutover, and rollback instructions.

- [ ] **Step 1: Update project guidance and deployment documentation**

Record `SpookyMoo/KernelKittens`, `swa-kernel-kittens-prod-r3`, the generated Azure hostname, the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret name, the pull-request flow, and the DNS rollback boundary. Remove statements that GitHub Pages is the production host.

- [ ] **Step 2: Run the complete local gate**

Run: `npm test`

Run: `npm audit --audit-level=high`

Run: `git diff --check`

Run: `go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml`

Expected: every command exits zero, with 19 unit tests, 16 browser tests, 8 automated accessibility tests, and the visual capture passing.

- [ ] **Step 3: Inspect the desktop and 320-pixel screenshots**

Open the generated visual captures and confirm no clipping, overlap, or fallback-font overflow.

- [ ] **Step 4: Commit the documentation**

```powershell
git add AGENTS.md docs/deployment.md
git commit -m "docs: record Azure production flow"
```

### Task 3: GitHub secret, shared branch, and Azure release

**Files:**
- External: GitHub repository `SpookyMoo/KernelKittens`
- External: Azure Static Web App `swa-kernel-kittens-prod-r3`

**Interfaces:**
- Consumes: the deployment token returned by Azure CLI through an in-memory PowerShell variable.
- Produces: a successful GitHub Actions run whose head SHA matches the tested commit.

- [ ] **Step 1: Verify GitHub write authority without changing the active account**

Use the existing remote credential path to push `feat/azure-static-web-app`. Do not switch the global GitHub CLI account or touch Chrome.

- [ ] **Step 2: Pipe the Azure token directly into the GitHub repository secret**

Read `az staticwebapp secrets list` into an in-memory variable, pass it to `gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo SpookyMoo/KernelKittens`, then clear the variable. Do not echo it.

- [ ] **Step 3: Push the feature branch and open a pull request**

Push without force. Open a pull request into `main`, verify its checks, then merge only after the release gate passes.

- [ ] **Step 4: Verify the production workflow and Azure origin**

Watch the post-merge workflow with `gh run watch --exit-status`. Confirm its head SHA matches GitHub `main`. Request `/`, `/results/`, `/writeups/`, and `/accessibility/` from the generated Azure hostname, verify the security headers, and confirm `/certifications/` redirects to `/results/`.

- [ ] **Step 5: Run live accessibility audits**

Audit all four public routes. Fix and redeploy any critical or serious result before continuing.

### Task 4: Azure custom domains and Porkbun cutover

**Files:**
- External: Azure Static Web Apps custom domains
- External: Porkbun DNS records for `kernelkittens.team`
- Modify: `docs/deployment.md`
- Modify: current Obsidian session note

**Interfaces:**
- Consumes: the verified Azure origin and exact backed-up Porkbun record set.
- Produces: Azure-managed HTTPS for the apex and `www`, with a recoverable DNS rollback.

- [ ] **Step 1: Back up and classify the live DNS records**

Save the Porkbun API response to a task-local ignored backup outside Git. Identify only the four GitHub Pages apex `A` records, four apex `AAAA` records, and `www` CNAME as replacement targets.

- [ ] **Step 2: Request Azure custom domains and create validation records**

Use Azure CLI to request `kernelkittens.team` and `www.kernelkittens.team`. Create only the exact TXT or CNAME validation records Azure returns.

- [ ] **Step 3: Move the apex and www targets**

After validation, replace the GitHub Pages targets with the Azure-supported apex alias and `www` CNAME. Preserve name servers and all unrelated records.

- [ ] **Step 4: Verify and recheck the cutover**

Check authoritative Porkbun answers, public DNS, both HTTPS names, every route, redirects, headers, and accessibility. Recheck after a short delay. Restore the backed-up records if Azure validation, TLS, or neighboring DNS regresses.

- [ ] **Step 5: Record the exact deployed state**

Update `docs/deployment.md` and the current Obsidian session note with the tested commit, workflow run URL, Azure origin, custom-domain state, DNS shape, verification time, and rollback location. Never record secret values.

- [ ] **Step 6: Commit the final handoff and verify its workflow**

```powershell
git add docs/deployment.md
git commit -m "docs: record Azure domain cutover"
git push github-personal main
```

Confirm the follow-up workflow succeeds and the live site remains healthy.
