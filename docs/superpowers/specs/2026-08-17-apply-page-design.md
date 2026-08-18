# Kernel Kittens application page design

## Goal

Replace the automatically opened application dialog with a dedicated `/apply/` page while keeping Ready v3 as the only visual theme.

## Approved direction

Use the archive record concept selected by Moo. The application reads as one recovered file record inside the existing dark archive shell.

## Site-wide header

- Keep the ASCII cat and `Kernel Kittens` name.
- Change the subtitle from `root@kk / est. 2026` to `est. 2026` on every public page.
- Keep `[home]` and `[apply]` as normal links.
- Mark the current route with `aria-current="page"`.

## Homepage

- Keep the current sparse Ready v3 homepage.
- Do not include application API state, the application form, a dialog, or automatic opening behavior.
- Make the recruitment action a normal link to `/apply/`.
- Keep the existing header, footer, colors, fonts, rules, and square controls.

## Application page

- Use a single `main` landmark with the existing skip link pointing to it.
- Do not show `/apply/stray.rar` or another path label above the title.
- Lead with `stray.rar` and the existing sentence: `Found this on an old drive. Looks like your problem now. GLHF.`
- Place the rules and application flow inside one bordered archive record.
- Present the flow as three numbered steps: recover assignment, download artifact, and send proof.
- Keep the existing Discord authentication, assignment recovery, checksum, download, logout, flag submission, optional TOP token submission, and status behavior.
- Remove every dialog open, close, backdrop, and focus-return control.

## Responsive behavior

- Keep the record at a readable maximum width on desktop.
- Stack the header and footer at the existing mobile breakpoint.
- Make primary actions full width on narrow screens.
- Preserve visible focus, reduced motion, forced colors, and high contrast behavior.

## Security and privacy

- Keep the existing Content Security Policy and API origin.
- Add no remote font, analytics, cookie, form action, or third-party script.
- Keep all authentication and submission requests on `https://apply.kernelkittens.team`.

## Copy constraints

- Keep the existing application rules and status messages.
- Do not add em dashes, en dashes, smart quotes, marketing filler, or invented claims.

## Acceptance criteria

- Visiting `/` never opens or contains the application.
- Every homepage application control is a real `/apply/` link.
- Visiting `/apply/` shows the archive record application in normal page flow.
- `/apply/` contains no dialog and no `/apply/stray.rar` label.
- No public page contains `root@kk`.
- The application API hooks and current user flow remain intact.
- Desktop and 320-pixel mobile screenshots match Ready v3 and have no clipping.
- Automated tests, dependency audit, diff check, and accessibility audits pass before release.
