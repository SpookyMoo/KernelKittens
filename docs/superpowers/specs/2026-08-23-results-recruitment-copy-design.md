# Results and recruitment copy design

## Goal

Make the public labels read cleanly and explain the `stray.rar` benchmark plus Discord fallback without changing the application flow.

## Approved copy

- On the homepage and Results page, change every `KK / RESULT 2026 / member result with a prior team` label to `RESULT 2026 / member result with a prior team`.
- On the application page, change the `candidate assignment` record heading to `stray.rar`.
- Add these two points under "Before you start":
  - `Team members can reliably finish this in 10-15 minutes.`
  - `Finishing earns a Discord invite. If you run out of time, a team member can still invite you manually.`

The second sentence describes the team process. It does not claim the current static page automatically creates or reveals an invite.

## Scope

This is a copy-only release. Do not change Ready assignment, timing, scoring, Discord OAuth, solve receipts, challenge files, or bot behavior.

## Verification

- Add contract assertions for the exact new copy and for removal of the old labels.
- Watch those assertions fail before changing public HTML.
- Run `npm test`, `npm audit --audit-level=high`, and `git diff --check`.
- Serve `site/` and inspect the homepage, Results page, and application page at desktop and 320-pixel widths.
- Audit every public route against WCAG 2.2 AA and the Kitsune accessibility checks.
- After deployment, verify the exact live copy and confirm the GitHub Pages workflow completed.
