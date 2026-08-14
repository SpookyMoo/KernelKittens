# Kernel Kittens project guidance

## Public content boundary

- Treat every file in this repository as deployable public content, even while the source remote is private.
- Never add embargoed challenge text, flags, private draft markers, personal identities, credential IDs, or local archive paths.
- A write-up needs `status: public` and a specific `publicationBasis` before it can generate a route.
- Attribute the 2026 Cyber Apocalypse result to the prior team `1337_PwnSp4c3`.
- Render only verified competition results. BushBash stays pending with no placement until primary evidence is inspected.
- Do not add a public certification gallery unless Moo directly changes that decision.

## Copy and interface

- Use plain, direct language. Do not use em dashes, en dashes, smart quotes, corporate filler, or generic security hype.
- Keep the primary navigation visible without client-side JavaScript.
- Every page needs an obvious route home, visible keyboard focus, and one `main` landmark.
- Do not add analytics, cookies, remote fonts, forms, or third-party scripts without a new privacy and security review.

## Required release checks

Run `npm test`, `npm audit`, `git diff --check`, and `go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.12 .github/workflows/verify-and-deploy.yml`. Inspect desktop and 320-pixel mobile screenshots before deployment. Critical or serious accessibility findings block release.

## Repository and deployment

- GitHub `SpookyMoo/KernelKittens` on `main` is the production source.
- Keep the private Gitea remote as a backup. Do not force-push or overwrite shared GitHub history.
- GitHub Actions deploys the exact tested `dist` artifact to Azure Static Web App `swa-kernel-kittens-prod-r3`.
- The Azure token must exist only as GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. Never print or commit it.
- `kernelkittens.team` and `www.kernelkittens.team` are Azure custom domains. Keep Porkbun authoritative and preserve unrelated DNS records.
