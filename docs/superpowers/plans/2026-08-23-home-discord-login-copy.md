# Homepage Discord Login and Recruitment Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for each behavior change and superpowers:verification-before-completion before any completion claim.

**Goal:** Add a clear, accessible Discord login to the homepage header and publish Moo's exact application copy.

**Architecture:** Keep the site static. Extend the existing homepage navigation, self-host Discord's official unmodified SVG, and reuse the current OAuth start URL. Do not change the API, bot, JavaScript flow, or content security policy.

**Tech stack:** Static HTML, the canonical Ready v3 CSS file, Node's built-in test runner, GitHub Pages.

## Global constraints

- Work only in the isolated remote development environment.
- Preserve the Ready v3 archive theme and every existing public route.
- Do not add third-party scripts, remote fonts, analytics, or a new OAuth implementation.
- Use exact user-approved copy.
- Keep the official Discord symbol unmodified.
- Preserve unrelated work.

### Task 1: Lock the new contract with failing tests

**Files:**
- Modify: `tests/site-contract.test.mjs`

1. Add a homepage assertion for the exact OAuth start URL and visible `Log in with Discord` label.
2. Assert that the homepage references `/brand/discord-symbol.svg` exactly once and that the asset exists.
3. Assert that the homepage still loads no application JavaScript or third-party script.
4. Replace the application copy expectations with:
   - `CTF members can reliably finish this in 10-15 minutes.`
   - `Finishing at any time grants an invite to the CTF server.`
5. Assert that the retired `Team members` and old invite wording are absent.
6. Run `npm test` and confirm the new assertions fail for the missing behavior.
7. Commit the failing test contract.

### Task 2: Add the official Discord login

**Files:**
- Modify: `site/index.html`
- Modify: `site/assets/theme.css`
- Add: `site/brand/discord-symbol.svg`

1. Download the current official Clyde SVG from Discord's brand asset host.
2. Verify the downloaded file is an SVG and keep its markup unchanged.
3. Add a third primary navigation link after Apply.
4. Set the link URL to `https://apply.kernelkittens.team/auth/discord/start`.
5. Add the decorative Clyde image with `alt=""`, explicit intrinsic dimensions, and the visible text `Log in with Discord`.
6. Add the smallest CSS rule needed for icon and label alignment while inheriting existing navigation focus, hover, and target-size behavior.

### Task 3: Update the application copy

**Files:**
- Modify: `site/apply/index.html`

1. Replace the timing sentence with `CTF members can reliably finish this in 10-15 minutes.`
2. Replace the invite sentence with `Finishing at any time grants an invite to the CTF server.`
3. Do not change the assignment download, proof submission, session API, or OAuth behavior.
4. Run `npm test` and confirm the full contract passes.
5. Commit the implementation.

### Task 4: Review and verify the release candidate

**Files:**
- Review every changed file.

1. Run `npm test`.
2. Run `npm audit`.
3. Run `git diff --check` against production.
4. Serve `site/` from the isolated box through a local SSH tunnel.
5. Capture and inspect the homepage and application page at 1440 by 900 and 320 by 800.
6. Confirm the logo remains proportionate, the desktop link is top-right, the mobile header does not overflow, and neighboring content is unchanged.
7. Run automated accessibility checks against `/`, `/apply/`, `/results/`, `/writeups/`, `/accessibility/`, and `/404.html`.
8. Request a focused code review and resolve any material finding.

### Task 5: Publish and verify production

1. Push the branch without exposing credentials to the development VM.
2. Open a pull request with the exact requirements and verification evidence.
3. Wait for required checks, merge, and confirm GitHub Pages deploys the merged commit.
4. Verify the live homepage login URL, visible label, logo, application copy, session endpoint, and all public route statuses.
5. Repeat the accessibility audit on every live public route.
6. Recheck after a short delay for deployment consistency.
7. If any required behavior regresses, revert to `c88d0be2448d76ac0a79189ece968665bf035ca2`.
8. Stop task-owned preview processes, delete the exact Azure resource group, and verify no task-owned resources remain.
