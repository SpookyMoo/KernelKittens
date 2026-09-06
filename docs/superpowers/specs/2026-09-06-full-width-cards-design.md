# Full-width cards design

## Goal

Make every bordered result and team card end at the same right edge as its thin orange section rule.

## Approved layout

- Result cards and team cards use one full-width row.
- The homepage cards fill the 64rem page shell.
- Results and team page cards fill their existing 46rem archive body.
- The 320px layout remains one full-width column.

## Implementation

Change only `site/assets/theme.css`:

- Remove the 46rem cap from `.competition-records`.
- Remove the 46rem cap from `.roster`.
- Set `.roster` to a single grid column at every viewport width.

No markup, content, color, typography, navigation, or application behavior changes.

## Verification

Run the contract tests, dependency audit, whitespace check, desktop and 320px visual checks, and accessibility audits on every public route before and after release.
