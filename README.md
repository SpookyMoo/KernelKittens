# Kernel Kittens site

Public team site for [kernelkittens.team](https://kernelkittens.team). It is a static Astro build with no accounts, analytics, cookies, remote fonts, or third-party scripts.

The public source repository is `SpookyMoo/KernelKittens` on GitHub. The `main` branch is the production source. The private Gitea remote remains available as a backup.

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

GitHub Actions runs the complete release gate on pull requests and production commits. A successful `main` run uploads the exact tested `dist` artifact to GitHub Pages. GitHub does not rebuild a different copy after the tests.

Porkbun remains authoritative for `kernelkittens.team`. DNS shape and rollback details are in `docs/deployment.md`.
