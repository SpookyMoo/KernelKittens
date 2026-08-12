# Kernel Kittens team site design

## Decision

Build a small custom Astro site for `kernelkittens.team` and host it on a dedicated Azure Static Web Apps Free resource. Keep Porkbun as the authoritative DNS provider. The site is public, while the source repository and all embargoed write-ups stay private.

This adopts Astro rather than adopting a theme or forking the old 1337_PwnSp4c3 concept. Astro is MIT-licensed, current, and built for static content collections. A custom presentation layer avoids carrying old team branding or a generic portfolio theme into the new identity.

References:

- https://docs.astro.build/en/guides/content-collections/
- https://github.com/withastro/astro/blob/main/LICENSE
- https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain
- https://learn.microsoft.com/en-us/azure/static-web-apps/quotas

## Job of the site

The site gives CTF players, organizers, and security peers one public place to verify who Kernel Kittens is and read publication-safe work. Its first release must:

- establish the `Kernel Kittens` identity at the purchased domain;
- make write-ups the primary content type;
- show current and previous credentials without implying expired credentials are active;
- attribute earlier competition results to the team and identity that earned them;
- give CTFtime a stable team URL;
- remain easy to update from Markdown and small data files.

## Public information architecture

The public routes are:

- `/` for the identity, write-up archive status, selected credentials, and member competition history;
- `/writeups/` for the publication-safe write-up archive;
- `/writeups/<slug>/` for each public write-up;
- `/certifications/` for current credentials, previous credentials, and competition proof;
- `/accessibility/` for the accessibility commitment, known gaps, contact route, and 48-hour response target;
- `/404.html` with clear routes back to the home and write-up pages.

The primary navigation stays visible at every viewport. It uses ordinary links, not a JavaScript menu. The CTFtime link is rendered only after a real Kernel Kittens team URL is configured.

## Launch content

The first public build contains no challenge solution copied from either private write-up collection.

The write-up archive explains that material is held until organizer rules allow publication. It may state that seven confirmed BushBash solves are held privately, but it must not expose flags, solution steps, scripts, private paths, or challenge artifacts.

The certifications page may show:

- Google Cybersecurity Professional Certificate as a current team-held credential;
- Cisco Certified Network Associate as a previous, expired credential;
- CompTIA A+ as a previous, expired credential;
- the verified 2026 Hack The Box Cyber Apocalypse result as member competition history with `1337_PwnSp4c3`: 12th of 6,744 teams, 136 of 136 challenges, and 69,425 points.

Dates, credential IDs, verification links, member names, roster details, and later first-place claims remain absent until current evidence is available.

## Write-up content boundary

Write-ups use an Astro content collection with typed frontmatter for title, event, category, difficulty, published date, summary, authorship, disclosure status, and optional source links.

Only entries explicitly marked `public` may generate a route. The deployable repository does not contain embargoed solution text. Private BushBash and Cyber Apocalypse drafts remain in their current private locations.

A deterministic release gate fails if the source or built output contains:

- a non-public write-up entry;
- known private-draft markers;
- BushBash or HTB flag syntax;
- local Windows paths from the private archives;
- a route for any entry not marked public.

The gate is intentionally strict for the first release. It can be changed only when an organizer authorization or other clear publication basis is recorded beside the write-up.

## Visual foundation

The direction is a kernel patch notebook, not a green terminal theme.

### Palette

- `page`: `#F3F7FB`, a cool paper background;
- `ink`: `#101D2D`, the primary text and structural color;
- `cobalt`: `#315CF4`, the interactive and trace color;
- `signal`: `#F05A47`, used sparingly for status and the cursor;
- `solder`: `#9BB2C6`, quiet rules and metadata;
- `surface`: `#FFFFFF`, cards and reading surfaces.

The dark color scheme uses the same cobalt and signal colors on a deep blue-black surface. It follows the operating-system preference and has no theme toggle.

### Type

Use local system fonts so the site makes no third-party font request:

- a wide rounded system stack for the display wordmark;
- a plain system UI stack for body copy;
- the system monospace stack for categories, dates, and diagnostic labels.

### Signature element

The provisional mark is a geometric cat head built from a processor package. Two ears form the top corners, three circuit traces form each set of whiskers, and a single square cursor sits inside the face. The mark is hand-authored SVG with a compact icon, horizontal lockup, monochrome variant, favicon, and accessible text alternative.

The hero pairs the mark with a restrained circuit-trace field. Motion is limited to one cursor blink, disabled by `prefers-reduced-motion`, with no loss of meaning when static.

### Layout

The home page reads like a clean technical notebook. A strong identity block sits beside the large mark. Write-up cards use real event and challenge metadata as structure. Certification cards look like evidence records, with status labels that distinguish current, expired, and competition history.

## Accessibility

The release target is WCAG 2.2 AA plus the Kitsune public-site standard:

- skip link and complete landmarks;
- visible keyboard focus and logical source order;
- at least 24 pixel interactive targets;
- no hover-only information;
- reduced-motion and increased-contrast support;
- meaningful page titles, headings, link text, and SVG alternatives;
- a public accessibility page with `accessibility@kitsunetechnologies.org` as the working contact;
- automated Axe checks on every route and a live a11y MCP audit after deployment.

Critical and serious accessibility findings block release.

## Security and privacy

The first version is static and has no accounts, forms, API, analytics, advertising, cookies, trackers, third-party JavaScript, or remote fonts.

Azure response configuration sets a restrictive content security policy, HSTS, MIME sniffing protection, a strict referrer policy, frame protection, cross-origin isolation headers where compatible, and a restrictive permissions policy.

The production build contains no deployment token or Porkbun credential. The Azure deployment token is read at deployment time and held only in the process environment. Porkbun credentials remain in the existing ignored credential file.

## Azure and DNS architecture

Create:

- resource group `rg-kernel-kittens-web-prod` in Central US;
- Azure Static Web App `swa-kernel-kittens-prod` on the Free SKU;
- default Azure hostname used only as the deployment and DNS target;
- custom domains `kernelkittens.team` and `www.kernelkittens.team`.

Deploy the exact tested `dist` directory with the pinned Azure Static Web Apps CLI. The app uses Azure-managed TLS. No Azure Front Door, VM, container, database, or paid DNS zone is required.

Porkbun remains authoritative. The migration removes only the default parking records:

- apex `ALIAS` to `pixie.porkbun.com`;
- wildcard `CNAME` to `pixie.porkbun.com`.

Keep the four authoritative NS records. Add the Azure ownership TXT record, point the apex `ALIAS` to the generated Azure hostname, and point `www` by `CNAME` to the same hostname. The apex is canonical in page metadata. Both hostnames serve securely through Azure.

DNS changes happen only after the generated Azure hostname serves the tested release. Verification checks authoritative Porkbun answers, public resolvers, managed TLS, security headers, page markers, and both custom hostnames.

## Testing and release proof

Implementation follows test-first development.

Automated checks cover:

- content schema and ordering;
- publication filtering and forbidden-content scans;
- certification status wording;
- every public route and visible internal link;
- keyboard navigation, skip link, reduced motion, and mobile layout;
- Axe checks on every route;
- production build and static output inspection;
- response header configuration;
- live Azure default-host and custom-domain smoke checks.

Visual review uses desktop and mobile screenshots. The first release is not complete until the built site has been inspected and visible layout problems are fixed.

## Non-goals

The first release does not include:

- member accounts or an admin panel;
- a CMS or database;
- a contact form;
- automatic CTFtime synchronization;
- private team notes or roster details;
- unauthorized challenge solutions;
- visitor analytics;
- Azure Front Door Enterprise Grade Edge;
- a final agency-grade logo system.

The SVG package is a practical identity basis for later Claude Design work.

