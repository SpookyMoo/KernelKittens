# Kernel Kittens GitHub To Azure Design

## Goal

Keep `SpookyMoo/KernelKittens` as the shared production source and serve `https://kernelkittens.team` from the existing Azure Static Web App. A friend works only in GitHub: branch, pull request, automated checks, merge, automatic Azure release.

## Deployment flow

- Pull requests to `main` run the complete release gate and never receive the Azure deployment secret.
- Pushes and manual runs on `main` build and verify once, retain the visual review, and upload the exact tested `dist` directory as `tested-site`.
- A separate deploy job downloads `tested-site` and sends it to `swa-kernel-kittens-prod-r3` with `skip_app_build: true`.
- GitHub stays the canonical source. Private Gitea remains a backup remote.
- All GitHub Actions stay pinned to full commit SHAs. The Azure token exists only as the `AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret.

## Domain cutover

- Keep Porkbun authoritative and preserve unrelated records.
- Prove the release on `https://ashy-rock-0ceff091e.7.azurestaticapps.net/` before changing DNS.
- Add and validate `kernelkittens.team` and `www.kernelkittens.team` on the existing Static Web App.
- Replace only the current GitHub Pages apex `A` and `AAAA` records and `www` CNAME with the Azure validation and target records returned by Azure.
- Verify Azure-managed TLS, public DNS, security headers, page markers, redirects, and accessibility. Recheck after a short delay.

## Failure and rollback

- Test or audit failures block deployment. Azure keeps the previous release if an upload fails.
- Do not alter GitHub Pages DNS until the tested Azure origin is healthy.
- Back up the exact live Porkbun records before the cutover. If the custom domain or neighboring DNS regresses, restore those records.
- Do not force-push, delete the GitHub repository, delete the Azure resource, or expose credentials.

## Verification

- Unit tests reject GitHub Pages deployment, mutable action tags, pull-request secret exposure, Azure rebuilds, and non-main deployment.
- Run `npm test`, `npm audit --audit-level=high`, `git diff --check`, and actionlint locally.
- Require a successful GitHub Actions run for the exact commit.
- Audit `/`, `/results/`, `/writeups/`, and `/accessibility/` after the Azure release. Critical or serious accessibility findings block the cutover.
