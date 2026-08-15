# Homepage Copy Cleanup Design

## Scope

Update the public homepage without changing its layout or routes:

- Change the introduction from `We play CTFs and keep the useful parts here.` to `We play CTFs.`
- Remove the redundant `/results/` link from Recent Files while keeping `/writeups/`.
- Render the team name as `Kernel Kittens` in the homepage heading, persistent header, and footer.

The Results page and its primary navigation link remain available. Historical design documents remain unchanged.

## Implementation

The copy changes stay in the Astro templates that own each visible string. The existing Playwright homepage test will assert the new introduction, all visible team-name instances, the single Recent Files link, and the absence of the old copy.

## Verification

Follow red-green TDD with the focused homepage browser tests. Then run the full test suite, dependency audit, whitespace check, workflow lint, desktop and 320-pixel screenshot inspection, and the public accessibility audit before release.
