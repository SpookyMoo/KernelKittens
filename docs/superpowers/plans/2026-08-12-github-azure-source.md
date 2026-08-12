# GitHub Source And Azure Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `romilp619/KernelKittens` the canonical source repository and deploy its tested `main` build to the existing Azure Static Web App through GitHub Actions.

**Architecture:** One GitHub workflow verifies every pull request and production commit. A production run uploads the exact `dist` directory created by the successful verification job, then the official Azure action deploys that artifact without rebuilding it. The Azure deployment token stays in a GitHub repository secret.

**Tech Stack:** GitHub Actions, Node.js 24, npm, Playwright Chromium, Astro 7.2.1, Azure Static Web Apps, Azure CLI, GitHub CLI, and Vitest 4.1.10.

## Global Constraints

- Use `spookymoo` for access to `romilp619/KernelKittens`.
- Do not change repository visibility, ownership, collaborators, license, or branch protection.
- Do not force-push or overwrite existing GitHub history.
- Keep the current `gitea` remote as a private backup.
- Deploy only after `npm test` and `npm audit --audit-level=high` pass.
- Deploy the exact tested `dist` artifact without an Azure rebuild.
- Deploy only from `main` on push or manual dispatch.
- Do not expose the Azure deployment token to pull requests, logs, files, or documentation.
- Pin every GitHub action to a full commit SHA.
- Do not add GitHub Pages, preview environments, analytics, remote media, or a new Azure resource.

## File Map

- `.github/workflows/verify-and-deploy.yml`: verifies commits and deploys the exact tested artifact from `main`.
- `tests/unit/github-workflow.test.ts`: rejects unsafe triggers, mutable action tags, secret misuse, rebuilds, and non-main deployment.
- `docs/deployment.md`: records GitHub as the source and the Azure release flow without secret values.
- `README.md`: gives maintainers the short verification and deployment model.

---

### Task 1: Workflow contract and continuous deployment

**Files:**
- Create: `tests/unit/github-workflow.test.ts`
- Create: `.github/workflows/verify-and-deploy.yml`

**Interfaces:**
- Pull requests and pushes invoke `verify`.
- Only a push or manual run on `refs/heads/main` invokes `deploy`.
- `verify` uploads artifact `tested-site`; `deploy` downloads it into `dist`.
- The Azure action reads only `secrets.AZURE_STATIC_WEB_APPS_API_TOKEN`.

- [ ] **Step 1: Write the failing workflow contract**

Create `tests/unit/github-workflow.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowPath = ".github/workflows/verify-and-deploy.yml";

describe("GitHub verification and deployment workflow", () => {
  it("tests every candidate and deploys only the verified main artifact", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm audit --audit-level=high");
    expect(workflow).toContain("name: tested-site");
    expect(workflow).toContain("path: dist");
    expect(workflow).toContain("needs: verify");
    expect(workflow).toContain("github.ref == 'refs/heads/main'");
    expect(workflow).toContain("app_location: dist");
    expect(workflow).toContain("skip_app_build: true");
    expect(workflow).toContain("output_location: \"\"");
  });

  it("uses a secret and immutable official action references", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    const actionRefs = [...workflow.matchAll(/uses:\s+([^\s#]+)/g)].map((match) => match[1]);

    expect(workflow).toContain("secrets.AZURE_STATIC_WEB_APPS_API_TOKEN");
    expect(workflow).not.toContain("pull_request_target:");
    expect(actionRefs.length).toBeGreaterThan(0);
    expect(actionRefs.every((ref) => /@[0-9a-f]{40}$/.test(ref))).toBe(true);
    expect(actionRefs.every((ref) => /^(actions|Azure)\//.test(ref))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:unit -- tests/unit/github-workflow.test.ts`

Expected: FAIL because `.github/workflows/verify-and-deploy.yml` does not exist.

- [ ] **Step 3: Resolve immutable action SHAs**

Run `git ls-remote` against the official repositories for the selected release tags. Record a 40-character commit for each reference and verify the repository owner is `actions` or `Azure`.

- [ ] **Step 4: Implement the workflow**

Create `.github/workflows/verify-and-deploy.yml` with the verified tag commits:

```yaml
name: Verify and deploy

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: kernel-kittens-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Check out source
        uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
      - name: Use Node.js 24
        uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
        with:
          node-version: 24
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Install Chromium
        run: npx playwright install --with-deps chromium
      - name: Verify release
        run: npm test
      - name: Check dependency advisories
        run: npm audit --audit-level=high
      - name: Save tested site
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4
        with:
          name: tested-site
          path: dist
          if-no-files-found: error
          retention-days: 1

  deploy:
    needs: verify
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://ashy-rock-0ceff091e.7.azurestaticapps.net/
    steps:
      - name: Download tested site
        uses: actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4
        with:
          name: tested-site
          path: dist
      - name: Deploy tested site to Azure
        uses: Azure/static-web-apps-deploy@1a947af9992250f3bc2e68ad0754c0b0c11566c9 # v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: upload
          app_location: dist
          output_location: ""
          skip_app_build: true
          skip_api_build: true
```

- [ ] **Step 5: Run the focused and full local gates**

Run: `npm run test:unit -- tests/unit/github-workflow.test.ts && npm test && npm audit && git diff --check`

Expected: all commands exit zero, workflow tests pass, browser tests pass, and npm reports no known vulnerabilities.

- [ ] **Step 6: Commit the workflow**

```powershell
git add .github/workflows/verify-and-deploy.yml tests/unit/github-workflow.test.ts
git commit -m "ci: deploy tested site from GitHub"
```

---

### Task 2: Shared repository migration and live proof

**Files:**
- Modify: `README.md`
- Modify: `docs/deployment.md`
- Update: canonical Obsidian Kernel Kittens project and current session notes.

**Interfaces:**
- `origin` points to `https://github.com/romilp619/KernelKittens.git`.
- `gitea` remains unchanged.
- GitHub repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` authenticates the deployment action.
- Successful production workflow deploys to `swa-kernel-kittens-prod-r3`.

- [ ] **Step 1: Update maintainer documentation**

State that GitHub `main` is canonical, pull requests run the full gate, production deploys the exact tested artifact, and Gitea is retained as a backup. Name the secret but never include its value.

- [ ] **Step 2: Authenticate the correct GitHub account without changing browser state**

Use GitHub CLI device authentication for `spookymoo` only if no stored token exists. Do not navigate or interrupt the user's active browser. Verify with:

```powershell
gh api user --jq .login
gh repo view romilp619/KernelKittens --json nameWithOwner,visibility,isEmpty,defaultBranchRef,viewerPermission
```

Expected: login is `spookymoo` and repository permission is sufficient to push and manage Actions secrets.

- [ ] **Step 3: Inspect remote history before writing**

Run:

```powershell
git ls-remote https://github.com/romilp619/KernelKittens.git
```

If no references exist, add `origin` and push the tested branch to `main`. If references exist, fetch them, inspect the tree and history, then push `feat/initial-site` without force for a normal merge.

- [ ] **Step 4: Add the Azure token as a GitHub repository secret**

Pipe the token without printing it:

```powershell
az staticwebapp secrets list --name swa-kernel-kittens-prod-r3 --resource-group rg-kernel-kittens-web-prod --query properties.apiKey -o tsv |
  gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo romilp619/KernelKittens
```

Verify only the secret name and update timestamp with `gh secret list`. Do not retrieve or echo the stored value.

- [ ] **Step 5: Push without overwriting remote work**

For an empty repository:

```powershell
git remote add origin https://github.com/romilp619/KernelKittens.git
git push origin HEAD:main
```

For a non-empty repository, push `feat/initial-site` and create a pull request after confirming the histories can be merged safely. Never use `--force`.

- [ ] **Step 6: Verify GitHub Actions and Azure**

Watch the exact workflow run with `gh run watch --exit-status`. Confirm its head SHA matches local HEAD. Then request the Azure origin and assert the four public routes return 200, the retired certifications route returns 301 to `/results/`, the CSP is present, and the HTML contains `The scoreboard can do the talking.`

- [ ] **Step 7: Run the live accessibility release gate**

Call `a11y_audit_url` for `/`, `/results/`, `/writeups/`, and `/accessibility/`. Fix every critical or serious finding, repeat the workflow, and audit again until none remain.

- [ ] **Step 8: Record and push the handoff**

Record the GitHub repository, tested commit, workflow run, Azure origin, route verification, accessibility result, and remaining custom-domain status in `docs/deployment.md` and the canonical Obsidian notes. Commit the documentation and confirm its follow-up workflow also succeeds.
