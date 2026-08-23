# Kernel Kittens site

Public team site for [kernelkittens.team](https://kernelkittens.team).

The complete static site lives in `site/`, and `site/assets/theme.css` is its only stylesheet. Old themes are deliberately absent from active branches and local working copies.

The active application challenge is `stray.rar`. It uses the first-party Ready API for Discord sign-in, private archive delivery, flag submission, and solve-gated Discord access. The page shows the exact submit format `KernelFlag{first_second_third}`.

Every correct solver can join the KernelKittens Discord and receives Member. A first accepted solve under five minutes also receives CTF Player. The server owns the timer and does not reset it for another archive.

## Checks

```powershell
npm ci
npm test
npm audit --audit-level=high
git diff --check
```

## Hosting

GitHub Actions tests `site/` and publishes that exact directory to GitHub Pages. The live domain is `kernelkittens.team`.

Do not restore a design from Git history. Historical commits include rejected themes.
