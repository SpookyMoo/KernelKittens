# Kernel Kittens site

Public team site for [kernelkittens.team](https://kernelkittens.team).

Ready v3 is the only approved design. The complete static site lives in `site/`, and `site/assets/theme.css` is its only stylesheet. Old themes are deliberately absent from active branches and local working copies.

The homepage member console checks the first-party Ready API for the signed-in user's current KernelKittens `CTF Player` role. It starts locked, checks again every 30 seconds while visible, and performs a fresh check before opening a Discord destination. Errors, stale data, malformed data, and missing roles stay locked. Discord channel permissions remain the final authority.

## Checks

```powershell
npm install
npm test
npm audit
git diff --check
```

## Hosting

GitHub Actions tests `site/` and publishes that exact directory to GitHub Pages. The live domain is `kernelkittens.team`.

Do not restore a design from Git history. Historical commits include rejected themes.
