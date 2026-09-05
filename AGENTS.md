# Kernel Kittens project guidance

## One approved theme

- Ready v3 is the only approved visual theme. It is the dark archive interface in `site/` with a black page, orange links, brown rules, terminal labels, an ASCII cat, and the `stray.rar` application title.
- The application lives at `/apply/` as a full archive record page. Do not restore a dialog, popup, overlay, or automatic opening behavior.
- Do not restore, reference, or recreate the retired light portfolio, motion-stage, scorecard, small-crew, branding-card, or alternate application themes.
- `site/assets/theme.css` is the only public stylesheet. Do not add a second theme, theme switcher, remote font, CSS framework, or generated Astro stylesheet.
- The live homepage and `/apply/` are the visual reference. The homepage links to `/apply/`, and the application stays in normal page flow. Preserve the Discord assignment and proof behavior unless Moo explicitly requests a change.
- Historical commits may contain retired designs. History is evidence, not an approved source. Never select a theme from Git history.

## Public content boundary

- Treat every file in this repository as deployable public content.
- Never add embargoed challenge text, flags, private draft markers, personal identities, credential IDs, or local archive paths.
- Attribute the 2026 Cyber Apocalypse result to the prior team `1337_PwnSp4c3`.
- Render only verified competition results. Do not add a public certification gallery unless Moo directly changes that decision.
- The roster on `/team/` and the homepage shows display names and competitions only. Never publish Discord usernames. Moo had them removed for opsec, and `tests/site-contract.test.mjs` fails if one returns as visible text.
- Use `romil0xsec`, never the real name in that member's Discord global name. Moo's card is `SHOOTTHEMESSENGER`.
- Keep the prior-team suffix on roster events, as in `Cyber Apocalypse 2026 (1337_PwnSp4c3)`. Without it the roster reads as if those were Kernel Kittens results.
- Roster avatars are self-hosted under `site/brand/team/`. The CSP is `img-src 'self'`, so never point an avatar at `cdn.discordapp.com`.

## Copy and interface

- Use plain, direct language. Do not use em dashes, en dashes, smart quotes, corporate filler, or generic security hype.
- Keep primary navigation visible without JavaScript.
- Every page needs an obvious route home, a skip link, visible keyboard focus, and one `main` landmark.
- Do not add analytics, cookies, remote fonts, forms, or third-party scripts without a new privacy and security review.

## Required release checks

- Run `npm test`, `npm audit`, and `git diff --check`.
- Serve `site/` and inspect desktop plus 320-pixel mobile screenshots before deployment.
- Audit every public route with the Kitsune accessibility tool. Critical or serious findings block release.

## Repository and deployment

- GitHub `SpookyMoo/KernelKittens` on `main` is the only production source.
- `site/` is the exact deployment artifact. GitHub Actions tests and publishes that directory through GitHub Pages.
- Do not deploy this repository to the retired Azure Static Web App.
- `site/CNAME` must remain `kernelkittens.team` unless Moo explicitly changes the public domain.
