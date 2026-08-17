# One canonical theme implementation plan

> **For agentic workers:** Execute inline in the isolated Azure workspace. Keep every destructive step guarded by an exact branch or path check.

**Goal:** Make Ready v3 the only active Kernel Kittens theme without changing the approved homepage or application behavior.

**Architecture:** Replace the stale Astro source with a dependency-free static `site/` tree. A Node contract test enforces one theme and the GitHub Pages workflow deploys only that verified tree.

**Tech Stack:** Static HTML and CSS, existing browser JavaScript, Node.js 24 tests, GitHub Pages.

## Global constraints

- The live Ready v3 homepage and application are the visual reference.
- Keep existing public content and application behavior.
- Do not rewrite Git history.
- Do not touch the Ready challenge engine or production challenge artifacts.
- Public release requires WCAG 2.2 AA automated checks.

### Task 1: Define the single-theme contract

**Files:**
- Create: `tests/site-contract.test.mjs`
- Create: `docs/superpowers/specs/2026-08-17-one-canonical-theme.md`
- Create: `docs/superpowers/plans/2026-08-17-one-canonical-theme.md`

- [ ] Write assertions for the complete route list, Ready shell, one stylesheet, required landmarks, homepage identity, application identity, and banned legacy selectors.
- [ ] Run `node --test tests/site-contract.test.mjs` and confirm it fails because `site/` does not exist.
- [ ] Commit the approved design, plan, and failing contract.

### Task 2: Build the canonical static source

**Files:**
- Create: `site/index.html`
- Create: `site/apply/index.html`
- Create: `site/results/index.html`
- Create: `site/writeups/index.html`
- Create: `site/accessibility/index.html`
- Create: `site/404.html`
- Create: `site/assets/theme.css`
- Create: `site/assets/apply.js`
- Create: `site/brand/kernel-kittens-mark.svg`
- Create: `site/CNAME`
- Create: `site/.nojekyll`
- Create: `site/robots.txt`
- Create: `site/sitemap.xml`

- [ ] Copy the approved homepage and application from the verified production artifact.
- [ ] Move the Ready v3 stylesheet and required global reset into `site/assets/theme.css`.
- [ ] Preserve the application script byte-for-byte as `site/assets/apply.js`.
- [ ] Rebuild the remaining public routes with the same archive shell and their existing content.
- [ ] Run the contract test and confirm it passes.
- [ ] Serve `site/` and verify every route and asset returns the expected status.

### Task 3: Remove competing source and deployment paths

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `.github/workflows/verify-and-deploy.yml`
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `src/`
- Delete: obsolete `docs/superpowers/plans/` and `docs/superpowers/specs/`
- Delete: old Astro and browser-test configuration
- Delete: old generated theme assets from the deployed branch

- [ ] Point project guidance and README at `site/` and name Ready v3 as the only approved theme.
- [ ] Replace the Azure/Astro workflow with a tested GitHub Pages artifact deployment.
- [ ] Remove dependencies and keep `npm test` plus `npm audit`.
- [ ] Run `npm test`, `npm audit`, `git diff --check`, and the static smoke test.
- [ ] Commit and push canonical `main`.
- [ ] Switch Pages to workflow deployment with the current legacy branch configuration recorded for rollback.
- [ ] Verify the live artifact and accessibility audit on every route.
- [ ] Delete obsolete remote branches only after the workflow deployment succeeds.
- [ ] Replace stale local theme checkouts only after verifying no process uses them.
