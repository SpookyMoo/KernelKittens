# Kernel Kittens Small Crew Archive Redesign

## Goal

Replace the current portfolio-style site with a small security crew archive inspired by independent security and wargame sites from 2000 through 2006. The result should feel maintained by the team, not assembled from a modern landing-page template.

## Approved direction

Moo approved direction B from the historical comparison: handmade identity, one odd graphic, sparse copy, compact records. The strongest references are Phenoelit, NMRC, and PullThePlug, with useful structural ideas from LSD-PLaNET, hack.co.za, iSEC, SmashTheStack, GhettoHackers, OpenRCE, and Fravia.

This is inspiration, not reproduction. Do not copy source graphics, logos, layouts, or text.

## Subject and audience

- Subject: Kernel Kittens, a small competitive CTF team.
- Audience: other CTF players, event organizers, friends, and people looking for results or public writeups.
- Primary job: show verified results quickly and provide a durable path to public writeups.

## Design system

### Color

- `packet-black: #060606` for the page background.
- `warm-ink: #d8d3c5` for normal text.
- `old-orange: #ef6a2e` for links and the team name.
- `score-amber: #f2bf5b` for standout placements.
- `status-green: #91b875` for short status text.
- `rust-line: #5a2d1d` for quiet rules and table separators.
- `focus-yellow: #fff07a` for keyboard focus.

All combinations must meet WCAG 2.2 AA. The approved dark appearance is fixed instead of changing into a separate light theme.

### Type

- Team name: Arial Black, Arial, sans-serif, used once and at a restrained size.
- Body and navigation: Verdana, Tahoma, sans-serif.
- Data, dates, paths, and status lines: Consolas, Courier New, monospace.
- No remote fonts.

### Layout

- Use one centered content rail, no wider than 64rem.
- Keep the header compact. Put the ASCII cat beside the team name and bracketed navigation.
- Use horizontal rules, plain tables, and dated text records instead of cards.
- Keep content readable at 320 CSS pixels with no horizontal page overflow.
- Use zero border radius, no shadows, no gradients, no glass effects, and no decorative section numbering.

Desktop outline:

```text
+----------------------------------------------------------+
|  /\_/\    [home] [results] [writeups]                   |
| ( o.o )   kernel kittens                                 |
|  > ^ <    CTF team / est. 2026                           |
+----------------------------------------------------------+
| We play CTFs and keep the useful parts here.              |
|                                                          |
| event                    place       solves      score     |
| Cyber Apocalypse 2026    12 / 6,744  136 / 136   69,425   |
| BushBash CTF 2026        1 / 994     28 / 28     5,997    |
|                                                          |
| recent files                                             |
| /results/                                                |
| /writeups/                                               |
+----------------------------------------------------------+
```

On narrow screens, the identity and navigation stack. Result tables become labeled record blocks rather than forcing sideways scrolling.

## Signature element

The only decorative flourish is a small ASCII cat paired with `root@kk` and `est. 2026`. It replaces the geometric motion stage and the polished processor logo in prominent page chrome. It must be marked decorative so screen readers hear the adjacent `Kernel Kittens` name once.

## Page behavior

### Global header and footer

- Keep the skip link first in keyboard order.
- Keep Home, Results, and Write-ups visible without JavaScript.
- Show the active route with brackets and an underline or color change, not a filled navigation pill.
- Footer text: team name, accessibility route, and a short truthful statement that the site has no trackers or remote scripts.

### Home

- Remove the giant headline, motion stage, buttons, scorecards, and marketing-style section copy.
- Lead with `kernel kittens` and the sentence `We play CTFs and keep the useful parts here.`
- Render both verified results in a compact ledger.
- Keep prior-team attribution visible in each record.
- Add a small `recent files` list that links to Results and Write-ups.

### Results

- Use a full results ledger with exact verified values from `src/data/results.ts`.
- Preserve placement, field size, solves, total challenges, score, division, credited team, and attribution.
- Do not imply BushBash placed 12th. The verified data remains Cyber Apocalypse at 12th of 6,744 and BushBash at 1st of 994.
- Remove the square motion cutdown.

### Write-ups

- Render public entries as a dated file list when entries exist.
- While empty, show `0 public files` and explain that confirmed BushBash notes remain private until publication is allowed.
- Never expose flags, embargoed challenge material, local paths, or private drafts.

### Accessibility and 404

- Restyle both pages using the same archive language and compact reading width.
- Keep the accessibility statement and obvious home route.
- Keep one main landmark per route.

## Motion and scripting

- Add no animation.
- Add no client-side JavaScript.
- Preserve the restrictive content security policy and zero third-party requests.

## Testing and release boundary

- Update browser tests before implementation so they fail on the current portfolio design.
- Test the ASCII signature, bracketed navigation, compact results ledger, exact verified metrics, empty writeup state, 320-pixel layout, single main landmark, internal links, no inline styles, no scripts, and no third-party requests.
- Run the full project test suite, release boundary check, dependency audit, `git diff --check`, and Actionlint.
- Run the public-site accessibility audit and fix all critical or serious findings before release.
- Inspect desktop and 320-pixel mobile screenshots before asking to publish.
- Do not push or deploy this redesign until Moo approves the rendered preview.
