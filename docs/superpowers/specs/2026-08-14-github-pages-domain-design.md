# Kernel Kittens GitHub Pages Domain Design

## Goal

Publish the existing tested Kernel Kittens Astro site from a public `SpookyMoo/KernelKittens` repository and serve it at `https://kernelkittens.team` through GitHub Pages.

## Design

- Keep `feat/initial-site` and the private Gitea remote intact as the backup source.
- Add the personal GitHub repository as a separate `github` remote. Do not replace Gitea or force-push.
- Replace the Azure deployment job with GitHub Pages artifact upload and deployment jobs. Pull requests run verification only. Pushes to `main` verify once and deploy the exact `dist` output.
- Keep the current canonical origin, sitemap URLs, and site copy on `https://kernelkittens.team`.
- Add `public/CNAME` containing only `kernelkittens.team` so the built artifact retains the custom domain.
- Point Porkbun apex records to GitHub Pages and `www` to `spookymoo.github.io`. Preserve Porkbun name servers and unrelated DNS records.
- Enable enforced HTTPS only after GitHub reports the domain and certificate ready.

## Safety

- The publication-boundary scanner must pass before anything is pushed publicly.
- GitHub Actions must use pinned official actions, least-privilege permissions, and the protected `github-pages` environment.
- No Azure token, GitHub token, DNS credential, challenge material, flag, or private identity may enter Git history or workflow logs.
- A failed build or accessibility gate blocks deployment.

## Verification

- Unit tests verify GitHub Pages workflow structure, the `CNAME`, pinned actions, and removal of Azure deployment requirements.
- Run the full `npm test`, `npm audit --audit-level=high`, `git diff --check`, and actionlint gates.
- Inspect desktop and 320-pixel screenshots.
- After release, verify GitHub Pages status, authoritative DNS, public DNS, HTTPS, the home page, write-ups, results, accessibility page, custom 404, security headers, and live accessibility.

