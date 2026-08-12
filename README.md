# Kernel Kittens site

Public team site for [kernelkittens.team](https://kernelkittens.team). It is a static Astro build with no accounts, analytics, cookies, remote fonts, or third-party scripts.

The shared source repository is `romilp619/KernelKittens` on GitHub. The `main` branch is the production source. The private Gitea remote remains available as a backup while the GitHub deployment settles in.

## Local checks

```powershell
npm install
npm run check
npm run test:unit
npm run build
npm run release:gate
npm run test:e2e
npm run test:a11y
```

The browser checks run against the production output in `dist`.

## Write-up publication rule

Only entries explicitly marked `public` with a recorded publication basis may generate a page. Do not place embargoed solutions, flags, private draft markers, or local archive paths in this repository. The release gate scans both the source collection and built output before deployment.

## Hosting

GitHub Actions runs the complete release gate on pull requests and production commits. A successful `main` run uploads the exact tested `dist` artifact to the existing Azure Static Web App. Azure does not rebuild a different copy after the tests.

The deployment token belongs in the GitHub repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`. Never place the value in a file, commit, issue, or workflow log.

Porkbun remains authoritative for the domain. Resource names, DNS shape, and rollback details are in `docs/deployment.md`.
