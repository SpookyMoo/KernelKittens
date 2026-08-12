# Production deployment

## Azure

- Resource group: `rg-kernel-kittens-web-prod`
- Static Web App: `swa-kernel-kittens-prod-r3`
- Region: West US 2
- Plan: Free
- Generated hostname: `ashy-rock-0ceff091e.7.azurestaticapps.net`
- Production branch: `main`

The repository stays private in Gitea. Azure receives the tested contents of `dist` through the pinned Static Web Apps CLI. Deployment credentials stay outside Git and are loaded only for the deployment process.

Run the full release checks before uploading:

```powershell
npm ci
npm test
npm audit
npm run deploy:azure
```

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

If the Azure origin or custom certificate fails, point the apex `ALIAS` and wildcard parking record back to `pixie.porkbun.com`. This restores the registrar parking page while Azure is repaired.
