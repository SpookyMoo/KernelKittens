# Production deployment

## Source

- Canonical repository: `https://github.com/romilp619/KernelKittens`
- Production branch: `main`
- Workflow: `.github/workflows/verify-and-deploy.yml`
- Backup remote: private Gitea repository named `gitea` in local clones

Pull requests run the full local release gate without receiving the Azure token. The gate includes a 320px visual capture, and GitHub retains those screenshots for seven days. A push or manual run on `main` uploads the exact `dist` artifact created by the successful verification job. The workflow never deploys pull requests and does not ask Azure to rebuild the source.

GitHub stores the Azure deployment token as the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. The value must not appear in Git, documentation, shell output, or issue text.

## Azure

- Resource group: `rg-kernel-kittens-web-prod`
- Static Web App: `swa-kernel-kittens-prod-r3`
- Region: West US 2
- Plan: Free
- Generated hostname: `ashy-rock-0ceff091e.7.azurestaticapps.net`
- Production branch: `main`

Azure receives the tested contents of `dist` from GitHub Actions through the official Static Web Apps deployment action. Every action is pinned to a full commit SHA. Repository visibility stays under the GitHub owner's control and is not changed by the deployment workflow.

Run the full release checks before uploading:

```powershell
npm ci
npm test
npm audit
```

Pushing a verified commit to GitHub `main` starts production deployment. The existing `npm run deploy:azure` command remains available for recovery from a trusted local checkout, but it is not the normal release path.

## DNS

Porkbun remains authoritative. Keep all four Porkbun name server records.

The intended production records are:

| Host | Type | Value |
| --- | --- | --- |
| `@` | `ALIAS` | `ashy-rock-0ceff091e.7.azurestaticapps.net` |
| `www` | `CNAME` | `ashy-rock-0ceff091e.7.azurestaticapps.net` |
| `_dnsauth.www` | `TXT` | Current Azure ownership token, stored only in DNS |

Do not remove Azure ownership TXT records while a hostname is validating. Confirm both custom hostnames are `Ready` in Azure before changing traffic records. After a DNS change, check each authoritative name server, public DNS, HTTPS, the custom 404 page, and the security headers.

## Rollback

For a bad site release, revert the bad commit on GitHub `main`. The workflow tests and deploys the reverted tree as a new auditable release. Do not force-push the shared branch.

If the Azure origin or custom certificate fails, point the apex `ALIAS` and wildcard parking record back to `pixie.porkbun.com`. This restores the registrar parking page while Azure is repaired.
