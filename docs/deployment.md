# Production deployment

## Source

- Canonical repository: `https://github.com/SpookyMoo/KernelKittens`
- Production branch: `main`
- Workflow: `.github/workflows/verify-and-deploy.yml`
- Backup remote: private Gitea repository named `gitea` in local clones

Pull requests run the complete local release gate. A push or manual run on `main` uploads the exact verified `dist` directory as `tested-site`, then deploys that artifact to Azure without rebuilding it.

The deployment action reads only the GitHub repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. Its value must never enter a file, log, command history, or document. Every action is pinned to a full commit SHA.

## Azure Static Web Apps

- Repository: `SpookyMoo/KernelKittens`
- Resource group: `rg-kernel-kittens-web-prod`
- Static Web App: `swa-kernel-kittens-prod-r3`
- Generated origin: `https://ashy-rock-0ceff091e.7.azurestaticapps.net/`
- Production branch: `main`
- Custom domain: `kernelkittens.team`
- Alternate domain: `www.kernelkittens.team`
- HTTPS: Azure-managed after custom-domain validation

GitHub stores the source and runs the release workflow. Azure serves the site. Contributors need GitHub access only and do not need Azure credentials.

Run the full release checks before pushing:

```powershell
npm ci
npm test
npm audit --audit-level=high
git diff --check
go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml
```

## DNS

Porkbun remains authoritative. Keep all four Porkbun name server records and every unrelated record.

Before any DNS change, back up the full Porkbun record response outside Git. Prove the tested release at the generated Azure origin, add both custom domains in Azure, and create only the validation records Azure returns. Replace only the current GitHub Pages apex `A` and `AAAA` records and the `www` CNAME after Azure accepts the hostnames.

After a DNS change, check each authoritative name server, public DNS, Azure-managed HTTPS, the custom 404 page, security headers, and live accessibility. Recheck after a short delay. Restore the backed-up GitHub Pages records if Azure validation, TLS, or neighboring DNS regresses.

## Rollback

For a bad site release, revert the bad commit on GitHub `main`. The workflow tests and deploys the reverted tree as a new release. Do not force-push.

If the Azure release fails, revert the bad commit and let GitHub Actions deploy the verified rollback. If the custom-domain cutover fails, restore the exact backed-up Porkbun records while Azure validation or TLS is repaired.
