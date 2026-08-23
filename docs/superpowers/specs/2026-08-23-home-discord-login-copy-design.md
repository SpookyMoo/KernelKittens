# Homepage Discord Login and Application Copy Design

Date: 2026-08-23
Status: Approved from Moo's direct instructions

## Goal

Put a clear Discord login in the main page header and tighten the application copy without changing the existing Discord authentication or assignment flow.

## Required outcome

- Add a third item to the homepage navigation in the top-right header area.
- Use Discord's official Clyde symbol without modifying its shape or color.
- Show the visible label `Log in with Discord` beside the symbol.
- Link directly to `https://apply.kernelkittens.team/auth/discord/start`.
- Change the application timing sentence to `CTF members can reliably finish this in 10-15 minutes.`
- Change the invite sentence to `Finishing at any time grants an invite to the CTF server.`
- Keep the current Ready v3 archive design and existing application behavior.

## Page structure

The login belongs in the existing primary navigation. This keeps it in the requested top-right location on desktop and lets the established responsive header wrap it naturally on narrow screens. A separate utility bar would add layout complexity without improving the task.

The link contains a decorative image with an empty alternative text value and a visible text label. The label supplies the accessible name, so screen readers do not hear duplicate Discord wording.

## Asset handling

Store Discord's current official white Clyde SVG at `site/brand/discord-symbol.svg`. The site loads the asset locally. There are no remote fonts, scripts, trackers, or runtime requests for the logo.

The SVG stays unmodified. CSS controls only its rendered dimensions and alignment.

## Styling

Add a small `discord-login` rule to the one canonical stylesheet. The rule uses inline flex alignment and the same type, hover treatment, focus treatment, and minimum target height as the other navigation links.

The logo renders at its native 4:3 proportion. The desktop navigation stays right-aligned. At the existing mobile breakpoint, the complete navigation remains visible and wraps without horizontal overflow at 320 CSS pixels.

## Accessibility

- Keep the visible `Log in with Discord` label.
- Treat the symbol as decorative because the adjacent text names the action.
- Preserve the existing visible focus indicator and minimum 44-pixel navigation target.
- Preserve the skip link, landmarks, home route, and keyboard-only navigation.
- Audit every public route before and after release.

## Security and privacy

The change adds no JavaScript and no new permissions. The link enters the existing OAuth start route. The homepage does not receive, store, or inspect authentication data. The current content security policy remains valid because the image is self-hosted.

## Tests

Contract tests must prove that the homepage contains the exact OAuth URL, visible login label, local logo reference, and no application JavaScript. They must also prove the exact new application copy and reject the retired wording.

Run the full test suite, dependency audit, whitespace check, desktop and 320-pixel visual review, and automated accessibility checks for every public route.

## Release and rollback

Publish through a reviewable branch and pull request. GitHub Pages must deploy the merged `site/` artifact. The rollback point is production commit `c88d0be2448d76ac0a79189ece968665bf035ca2`; revert the merge if the login link, application route, or neighboring pages regress.
