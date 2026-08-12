# Kernel Kittens results-first redesign

## Decision

Replace the current portfolio-card presentation with a competition scorecard. The site should feel like an artifact made by a CTF team, not an agency template and not a fake terminal. Results become the main proof. Certifications leave the public navigation and public pages.

The redesign keeps the existing Astro static architecture, publication gate, Azure response policy, and private source workflow. It adds no client JavaScript, trackers, remote fonts, or third-party requests.

## Public routes

- `/` introduces the team, leads with the strongest verified result, and provides the motion-art stage.
- `/results/` lists verified competition records with exact attribution.
- `/writeups/` remains the publication-safe technical archive.
- `/accessibility/` remains the accessibility statement and contact route.
- `/certifications/` permanently redirects to `/results/` for old links and is excluded from navigation and the sitemap.
- `/404.html` keeps obvious routes home and to the archive.

## Evidence rules

Public result records live in `src/data/results.ts`. Each record includes an event, year, placement label, field size, score or solve count where verified, team attribution, and evidence status.

The verified 2026 Cyber Apocalypse record stays visible with the exact result earned by `1337_PwnSp4c3`: 12th of 6,744 teams, 136 of 136 challenges, and 69,425 points. The page labels it as a member's prior-team result. It must never read as a Kernel Kittens team placement.

BushBash is not assigned a placement in the public build until its certificate or another primary result record is inspected. The repository may hold a non-public candidate entry with `status: "pending"`, but public components only render `status: "verified"`. Certificates are evidence inputs, not homepage content.

## Visual direction

The visual system is a competition scorecard with print-shop discipline.

- Use a near-white score sheet (`#F7F8FC`) and carbon ink (`#17161B`).
- Use electric cobalt (`#2457FF`) for structure and links.
- Use trophy orange (`#FF5C35`) for the active frame and important result marks.
- Use score yellow (`#F2CE4A`) as a small secondary accent.
- Use hard rules, clipped corners, registration marks, oversized ranking numerals, and event strips.
- Avoid rounded card grids, pill navigation, soft dashboard shadows, fake command prompts, matrix rain, and generic hacker decoration.
- Keep the existing cat-chip mark as a small team stamp. Do not make it the hero illustration.
- Use a condensed system display stack and a readable system UI body stack. No remote font request is allowed.

The signature element is a full-width result strip built like a match ticket. A large placement numeral, event name, year, field size, solve count, score, and attribution share one strong composition instead of separate dashboard cards.

## Motion graphics placeholders

The home hero contains a 16:9 `MotionStage` component. It is a finished static storyboard poster, not a blank gray box. It includes:

- a frame counter and `16:9 MOTION PLATE` label;
- a bold Kernel Kittens word fragment and geometric cat-chip silhouette;
- crop marks, frame divisions, and a bottom timeline;
- a visible note that the current asset is a static keyframe;
- a semantic figure caption explaining that future team motion work will replace the poster.

The component reserves stable dimensions so a future local WebM, MP4, or canvas scene can replace its inner plate without changing the page layout. The first implementation includes no video element, no autoplay, no script, and no remote media. Any CSS motion is cosmetic, pauses outside hover or focus, and is removed under `prefers-reduced-motion: reduce`.

The results page contains one smaller square motion cutdown slot using the same visual grammar. It is also static and accessible.

## Copy direction

Keep copy short, concrete, and written like the team itself.

Home headline:

> We play CTFs. The scoreboard can do the talking.

Home support:

> Results, write-ups, and whatever survived the packet capture.

Results introduction:

> Placements we can prove. Prior-team work stays labeled as prior-team work.

Do not publish defensive filler about fake proof, status taxonomies, real certifications, agency capability, customers, or invented team lore.

## Interaction and responsive behavior

- The visible navigation contains `Results` and `Write-ups`; the brand link always returns home.
- Links use hard underline or block states instead of pills.
- Every interactive target is at least 24 by 24 CSS pixels with clear keyboard focus.
- At 320 pixels, the header wraps without a menu button and the scorecard changes from columns to a legible stacked record.
- The motion stage keeps its aspect ratio and never creates horizontal scrolling.
- Dark mode keeps the score-sheet hierarchy without turning into a terminal theme.

## Accessibility and release requirements

- Preserve one `main` landmark, a working first-focus skip link, semantic headings, and an obvious route home on every page.
- Provide text equivalents for decorative graphics and meaningful captions for the motion placeholders.
- Honor reduced motion, increased contrast, color scheme, 200 percent zoom, and narrow viewports.
- Axe critical and serious findings block release.
- Run the existing unit, Astro, publication, browser, and accessibility gates.
- Capture and inspect light desktop, light mobile, and dark desktop screenshots before deployment.
- Deploy only the exact tested `dist` directory and verify the Azure origin after deployment.

## Non-goals

- No public certification gallery.
- No invented BushBash placement.
- No live score feed or CTFtime integration.
- No video production in this pass.
- No autoplay, audio, canvas runtime, or animation framework.
- No member roster, accounts, forms, analytics, or external embeds.
