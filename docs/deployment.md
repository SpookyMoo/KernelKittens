# Production deployment

## Source

- Canonical repository: `https://github.com/SpookyMoo/KernelKittens`
- Production branch: `main`
- Workflow: `.github/workflows/verify-and-deploy.yml`
- Backup remote: private Gitea repository named `gitea` in local clones

Pull requests run the complete local release gate. A push or manual run on `main` uploads the exact verified `dist` directory as `tested-site`, then deploys that artifact to Azure without rebuilding it.

The deployment action reads only the GitHub repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. Its value must never enter a file, log, command history, or document. Every action is pinned to a full commit SHA.

## Azure hosting

- Repository: `SpookyMoo/KernelKittens`
- Resource group: `rg-kernel-kittens-web-prod`
- Static Web App: `swa-kernel-kittens-prod-r3`
- Generated origin: `https://ashy-rock-0ceff091e.7.azurestaticapps.net/`
- Production branch: `main`
- Public edge resource group: `rg-kernel-kittens-edge-prod`
- Container Apps environment: `cae-kernel-kittens-prod`
- Container App: `ca-kernel-kittens-edge`
- Edge image: `caddy:2.10.2-alpine`
- Generated edge hostname: `ca-kernel-kittens-edge.yellowocean-91d9ac25.westus2.azurecontainerapps.io`
- Static edge IP: `4.155.127.137`
- Custom domains: `kernelkittens.team` and `www.kernelkittens.team`
- HTTPS: Azure-managed certificates on both hostnames
- Scale: zero to two replicas, 0.25 vCPU and 0.5 GiB per replica

GitHub stores the source and runs the release workflow. The workflow deploys the tested artifact to Static Web Apps. The Container App proxies public requests to that origin without caching, so collaborators need GitHub access only and do not need Azure credentials. The observed main-branch workflow completed in about two minutes.

The public edge resource group has a monthly Azure Cost Management budget named `kernel-kittens-edge-monthly-50`. It emails at 50, 80, and 100 percent of $50. This is an alert budget, not a hard spending cap.

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

Before any DNS change, back up the full Porkbun record response outside Git. Prove the tested release at the generated Azure origin and generated Container Apps hostname before moving traffic. The production records are:

- Apex `A`: `4.155.127.137`
- `www` CNAME: `ca-kernel-kittens-edge.yellowocean-91d9ac25.westus2.azurecontainerapps.io`
- `asuid` and `asuid.www` TXT: the Container App custom-domain verification ID

The pre-cutover backup is `C:\Users\Owner\Backups\porkbun\kernelkittens-before-container-apps-20260814-155459.json`. Its SHA-256 is `1C52E19783786846C40911D0A4A207FBD1C0F1886B22BA5B04E4A94D6D930EF9`.

After a DNS change, check each authoritative name server, public DNS, Azure-managed HTTPS, the custom 404 page, security headers, and live accessibility. Recheck after a short delay. Restore the backed-up GitHub Pages records if Azure validation, TLS, or neighboring DNS regresses.

## Rollback

For a bad site release, revert the bad commit on GitHub `main`. The workflow tests and deploys the reverted tree as a new release. Do not force-push.

If the Azure release fails, revert the bad commit and let GitHub Actions deploy the verified rollback. If the public edge fails, restore the four GitHub Pages apex `A` records, four apex `AAAA` records, and `www` CNAME from the pre-cutover backup while Azure is repaired.
