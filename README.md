# Kernel Kittens site

Public team site for [kernelkittens.team](https://kernelkittens.team).

Ready v3 is the only approved design. The complete static site lives in `site/`, and `site/assets/theme.css` is its only stylesheet. Old themes are deliberately absent from active branches and local working copies.

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
