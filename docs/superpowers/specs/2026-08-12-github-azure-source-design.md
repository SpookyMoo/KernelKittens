# GitHub source and Azure deployment design

## Decision

Make `romilp619/KernelKittens` the canonical source repository and use GitHub Actions to deploy the existing Astro site to the existing Azure Static Web App.

This preserves the earlier Azure hosting decision while making a shared GitHub repository the source of truth. GitHub Pages is not added because it would create a second public host with different headers and redirect behavior. Gitea remains a private backup remote until the GitHub deployment has passed a live check.

References:

- https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration
- https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management
- https://docs.github.com/en/actions/reference/security/secrets

## Repository boundary

- Canonical GitHub repository: `https://github.com/romilp619/KernelKittens`
- Authorized personal account: `spookymoo`
- Do not use the currently authenticated `KitsuneTech1` account for the shared repository.
- Do not change repository visibility, ownership, collaborators, license, or default-branch protection.
- Do not force-push or overwrite existing GitHub history.
- If the GitHub repository is empty, push the tested history to `main`.
- If it already has unrelated commits, fetch them and publish this work on `feat/initial-site` for a normal merge instead of replacing its history.
- Keep the current `gitea` remote. Add GitHub as `origin` after access is verified.

## Continuous integration and deployment

Add one workflow at `.github/workflows/verify-and-deploy.yml`.

The verification job runs on pull requests to `main`, pushes to `main`, and manual runs. It:

1. checks out the exact commit;
2. installs Node.js 24 from the repository's existing engine contract;
3. restores dependencies with `npm ci`;
4. installs Playwright Chromium and its runner dependencies;
5. runs `npm test` and `npm audit --audit-level=high`;
6. uploads the generated `dist` directory as a one-day artifact only when the event can deploy.

The deployment job runs only after verification on `main`, for a push or manual run. It downloads the exact tested artifact and sends it to `swa-kernel-kittens-prod-r3` with `skip_app_build: true`. Azure does not rebuild different source after the tests.

The workflow uses one in-progress run per branch and cancels an older run when a newer commit arrives. It gets read-only repository permission. Pull requests do not receive the Azure deployment secret and do not create preview deployments.

## Secret handling

Read the existing Azure Static Web Apps deployment token through Azure CLI and pipe it directly into the GitHub CLI secret command. Do not print it, save it to disk, put it in shell history, or copy it into documentation.

Repository secret name:

`AZURE_STATIC_WEB_APPS_API_TOKEN`

The workflow passes that secret only to `Azure/static-web-apps-deploy`. GitHub automatically masks common Azure keys, but the workflow must not echo the value.

## Action supply chain

Pin every action to a full commit SHA. Keep the readable release tag in a trailing comment. The workflow uses only official GitHub actions and the official Azure Static Web Apps deployment action:

- `actions/checkout`
- `actions/setup-node`
- `actions/upload-artifact`
- `actions/download-artifact`
- `Azure/static-web-apps-deploy`

Resolve the tag SHAs directly from each official repository immediately before writing the workflow. Tests reject mutable action references such as `@main` or `@v4`.

## Azure target

- Resource group: `rg-kernel-kittens-web-prod`
- Static Web App: `swa-kernel-kittens-prod-r3`
- Generated origin: `https://ashy-rock-0ceff091e.7.azurestaticapps.net/`
- Deployment provider before migration: `SwaCli`
- Production branch: `main`

The existing resource stays in place. The workflow changes only how its tested static files arrive.

## Failure behavior

- A failed type check, unit test, build, publication gate, browser test, accessibility test, or high-severity audit blocks deployment.
- A missing GitHub secret fails the deployment job without changing the live site.
- A failed Azure upload leaves the previous release available.
- An inaccessible or non-empty shared repository stops the push until its state is understood. No force option is allowed.
- Gitea remains usable as a rollback source until GitHub has a successful workflow run and the Azure origin passes live verification.

## Verification

Local tests validate the workflow structure, event boundary, secret reference, exact tested artifact flow, and pinned actions.

After pushing:

- confirm the GitHub default branch contains the expected commit;
- confirm the `Verify and deploy` run finishes successfully;
- confirm the production deployment points to that commit;
- request `/`, `/results/`, `/writeups/`, and `/accessibility/` from the Azure origin;
- confirm `/certifications/` returns a permanent redirect to `/results/`;
- confirm the security headers and new home headline;
- run the a11y MCP against every live public route;
- recheck the Azure origin after a short delay.

## Non-goals

- No GitHub Pages deployment.
- No pull-request preview sites.
- No repository visibility or collaborator changes.
- No custom-domain DNS change in this migration.
- No deletion of the Gitea remote.
- No new Azure resource.
