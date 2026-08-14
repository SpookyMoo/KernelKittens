# BushBash verified result

## Purpose

Add the verified BushBash CTF 2026 first-place result to the public Results page without displacing the stronger Cyber Apocalypse scale result from the homepage.

## Evidence and attribution

- The organizer-issued certificate verifies a member's `FIRST PLACE - GLOBAL` result with team `1337_PwnSp4c3` at BushBash CTF 2026.
- The canonical private project notes record the field as 994 teams.
- Public attribution must read `Member result with a prior team` and credit `1337_PwnSp4c3`. The result must not be presented as a Kernel Kittens team placement.

The public repository will contain the result facts but not the private certificate, personal identity, flags, challenge solutions, or local evidence paths.

## Display

Cyber Apocalypse remains the first verified record and the homepage feature. BushBash appears second on `/results/` with:

- event: BushBash CTF 2026;
- placement: 1st;
- field size: 994;
- division: Global;
- credited team: `1337_PwnSp4c3`;
- attribution: `Member result with a prior team`.

BushBash score and total challenge counts are not in the inspected evidence, so the card must omit those metrics rather than invent values. The existing scorecard will render only metrics present on a verified result.

## Data and component changes

`src/data/results.ts` keeps one typed list of pending and verified records. Verified results always require placement and field size. Solve counts, score, and division become optional display metrics. The BushBash record changes from pending to verified.

`ResultScorecard.astro` builds its metric list from available values. Cyber Apocalypse keeps Placement, Solved, and Score. BushBash shows Placement and Division. Existing accessible labels and semantic definition-list markup remain intact.

## Tests

- Update unit coverage to require the exact BushBash placement, field size, division, team, and prior-team attribution.
- Update browser coverage to require both verified result cards and the exact BushBash public text.
- Keep the homepage assertion focused on Cyber Apocalypse so array order and featured-result behavior remain explicit.
- Run the full local release gate, inspect desktop and 320-pixel captures, then run the live accessibility audit after deployment.

## Release

Ship through a pull request to `SpookyMoo/KernelKittens`. Merge only after GitHub verification passes. Watch the main deployment run, then verify the public Results page through the Azure edge.
