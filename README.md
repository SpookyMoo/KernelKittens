# Kernel Kittens site

Public team site for [kernelkittens.team](https://kernelkittens.team). It is a static Astro build with no accounts, analytics, cookies, remote fonts, or third-party scripts.

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

Azure Static Web Apps serves the tested `dist` directory. Porkbun remains authoritative for the domain. Resource names and the verified DNS shape are recorded in `docs/deployment.md` after deployment.
