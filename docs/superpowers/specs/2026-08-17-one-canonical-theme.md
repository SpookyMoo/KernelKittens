# One canonical Kernel Kittens theme

## Decision

The approved public theme is Ready v3, the dark archive interface currently live at `kernelkittens.team`. Its identifying parts are the black page, orange links, brown rules, terminal labels, ASCII cat, square application dialog, and `stray.rar` application title.

No other Kernel Kittens visual theme remains active in source, deployment, branches, local prototypes, or project guidance. Old Git history stays intact because rewriting shared history would add risk without helping day-to-day agents.

## Canonical source

`main/site/` is the complete deployable website. It is plain static HTML, CSS, JavaScript, and existing challenge assets. The live homepage and application behavior are the reference implementation.

Every public route uses one stylesheet, `site/assets/theme.css`. The stylesheet contains the Ready v3 archive system plus the small global reset needed to preserve the current rendering. Prior branding, motion-stage, scorecard, portfolio, light-theme, and small-crew CSS are removed.

## Pages

The homepage and application retain their current structure and behavior. Results, write-ups, accessibility, and 404 keep their existing public information but use the same archive header, typography, colors, spacing, and footer.

Every page has a skip link, one `main` landmark, visible focus, and an obvious home route. The application keeps its current API origin, validation flow, sign-out behavior, dialog behavior, and status regions.

## Guardrails

`AGENTS.md` names Ready v3 as the only permitted theme and lists forbidden legacy selectors and concepts. A repository test fails if:

- any public page omits the Ready archive shell or canonical stylesheet;
- an obsolete stylesheet or theme selector returns;
- homepage or application identity markers disappear;
- a public route loses its accessibility landmarks;
- generated output contains em dashes, en dashes, or smart quotes.

The deployment workflow publishes only `site/` after tests and dependency audit pass.

## Cleanup

Delete the Astro theme source, generated old-theme assets, retired design specs, obsolete feature branches, and local theme prototypes. Keep the private Ready challenge engine and production challenge artifacts because they are application infrastructure, not visual themes.

Before deleting local checkouts, verify no running process is using them. Replace the stale local `kernel-kittens-site` checkout with a clean clone of canonical `main`.

## Verification

Run the repository contract test, HTML parsing, link and asset checks, dependency audit, `git diff --check`, and a clean static server smoke test. After release, audit every public route with the Kitsune accessibility tool and compare homepage/application screenshots against the approved Ready v3 reference.
