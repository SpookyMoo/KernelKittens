# Production deployment

## Source

- Canonical repository: `https://github.com/SpookyMoo/KernelKittens`
- Production branch: `main`
- Workflow: `.github/workflows/verify-and-deploy.yml`
- Backup remote: private Gitea repository named `gitea` in local clones

Pull requests run the complete local release gate. A push or manual run on `main` uploads the exact verified `dist` directory as a GitHub Pages artifact, then deploys that artifact through the `github-pages` environment.

The workflow uses no deployment secret. GitHub issues the short-lived Pages identity from the job's `id-token: write` permission. Every action is pinned to a full commit SHA.

## GitHub Pages

- Repository: `SpookyMoo/KernelKittens`
- Build source: GitHub Actions
- Custom domain: `kernelkittens.team`
- HTTPS: required after GitHub finishes certificate provisioning

The repository's Pages settings configure the custom domain. `public/CNAME` records the expected domain in every build, but the custom Actions workflow does not use it for configuration. Do not delete it or replace it with `www.kernelkittens.team`.

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

The intended GitHub Pages records are:

| Host | Type | Value |
| --- | --- | --- |
| `@` | `A` | `185.199.108.153` |
| `@` | `A` | `185.199.109.153` |
| `@` | `A` | `185.199.110.153` |
| `@` | `A` | `185.199.111.153` |
| `@` | `AAAA` | `2606:50c0:8000::153` |
| `@` | `AAAA` | `2606:50c0:8001::153` |
| `@` | `AAAA` | `2606:50c0:8002::153` |
| `@` | `AAAA` | `2606:50c0:8003::153` |
| `www` | `CNAME` | `spookymoo.github.io` |

After a DNS change, check each authoritative name server, public DNS, HTTPS, the custom 404 page, security headers, and live accessibility. Enable HTTPS enforcement only after GitHub reports the certificate ready.

## Rollback

For a bad site release, revert the bad commit on GitHub `main`. The workflow tests and deploys the reverted tree as a new release. Do not force-push.

If GitHub Pages or its certificate fails during cutover, restore the prior Porkbun parking records while the release is repaired. The old Azure generated hostname remains historical fallback evidence, not the production source.
