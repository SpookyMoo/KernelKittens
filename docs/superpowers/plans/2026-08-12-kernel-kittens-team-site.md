# Kernel Kittens team site implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, and deploy the first public Kernel Kittens team website at `kernelkittens.team` through Azure Static Web Apps.

**Architecture:** Astro produces a static site from typed data and publication-safe Markdown. Vitest protects content and release rules, while Playwright and Axe exercise every public route. Azure Static Web Apps serves the exact tested `dist` output, and Porkbun remains authoritative for the apex and `www` DNS records.

**Tech Stack:** Node.js 24, Astro 7.2.1, TypeScript 6.0.3, Vitest 4.1.10, Playwright 1.62.1, Axe 4.13.0, Azure CLI, Azure Static Web Apps CLI 2.0.10, and Porkbun DNS API v3.

## Global constraints

- Keep the source repository private before release.
- Do not copy any embargoed BushBash or Cyber Apocalypse solution into this repository.
- Do not expose deployment tokens, Porkbun keys, member identities, flags, or local private paths.
- Current credentials and expired credentials must be visibly distinct.
- Attribute the Cyber Apocalypse result to the prior `1337_PwnSp4c3` team.
- Use no analytics, cookies, remote fonts, third-party scripts, forms, API, or client-side menu.
- Meet WCAG 2.2 AA plus the Kitsune public-site standard.
- Strip em dash, en dash, smart quotes, and banned AI copy patterns from every public string.
- Deploy only after all unit, build, browser, accessibility, content-boundary, and visual checks pass.

## File map

- `package.json`: pinned commands and dependency versions.
- `astro.config.mjs`: static output and canonical site URL.
- `tsconfig.json`: Astro strict TypeScript profile.
- `vitest.config.ts`: unit-test discovery.
- `playwright.config.ts`: production-preview browser test configuration.
- `src/config/site.ts`: canonical site identity and optional external links.
- `src/content.config.ts`: public write-up schema.
- `src/data/credentials.ts`: current, expired, and result evidence records.
- `src/lib/publication.ts`: public-entry filtering and release-boundary checks.
- `src/layouts/BaseLayout.astro`: metadata, skip link, header, main, and footer shell.
- `src/components/BrandMark.astro`: accessible provisional cat-chip SVG.
- `src/components/Header.astro`: persistent navigation.
- `src/components/CredentialCard.astro`: status-aware evidence record.
- `src/components/WriteupCard.astro`: write-up summary card.
- `src/pages/*.astro`: home, archive, certifications, accessibility, and 404 routes.
- `src/pages/writeups/[...id].astro`: public write-up route generation.
- `src/styles/global.css`: tokens, layout, responsive behavior, contrast, and motion preferences.
- `public/brand/kernel-kittens-mark.svg`: reusable standalone mark.
- `public/staticwebapp.config.json`: Azure routing and security headers.
- `scripts/check-publication-boundary.mjs`: source and build release gate.
- `tests/unit/*.test.ts`: configuration, evidence wording, content, and security tests.
- `tests/e2e/site.spec.ts`: route, link, keyboard, mobile, and content tests.
- `tests/e2e/a11y.spec.ts`: Axe checks on every route.
- `docs/deployment.md`: deployed resource, DNS shape, and secretless maintenance commands.

---

### Task 1: Project shell and typed public data

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/config/site.ts`
- Create: `src/content.config.ts`
- Create: `src/data/credentials.ts`
- Create: `src/content/writeups/.gitkeep`
- Test: `tests/unit/site-data.test.ts`

**Interfaces:**
- Produces: `siteConfig`, `credentials`, and the `writeups` Astro collection.
- `siteConfig.ctfTimeUrl` is `null` until a real team profile exists.
- Each credential has `kind: "current" | "expired" | "result"` and a plain status label.

- [ ] **Step 1: Add the pinned project and test configuration**

Create scripts for `dev`, `build`, `preview`, `check`, `test:unit`, `test:e2e`, `test:a11y`, `test`, and `release:gate`. Pin Astro 7.2.1, TypeScript 6.0.3, Vitest 4.1.10, Playwright 1.62.1, `@astrojs/check` 0.9.10, `@axe-core/playwright` 4.13.0, and Azure Static Web Apps CLI 2.0.10.

- [ ] **Step 2: Write the failing data contract test**

```ts
import { describe, expect, it } from "vitest";
import { siteConfig } from "../../src/config/site";
import { credentials } from "../../src/data/credentials";

describe("public site data", () => {
  it("uses the purchased domain and hides the uncreated CTFtime profile", () => {
    expect(siteConfig.origin).toBe("https://kernelkittens.team");
    expect(siteConfig.ctfTimeUrl).toBeNull();
  });

  it("does not present expired credentials as current", () => {
    expect(credentials.filter((item) => item.kind === "current").map((item) => item.title))
      .toEqual(["Google Cybersecurity Professional Certificate"]);
    expect(credentials.filter((item) => item.kind === "expired")).toHaveLength(2);
  });

  it("attributes prior competition proof to the prior team", () => {
    const result = credentials.find((item) => item.kind === "result");
    expect(result?.context).toContain("1337_PwnSp4c3");
    expect(result?.context).toContain("12th of 6,744 teams");
  });
});
```

- [ ] **Step 3: Run the test and confirm the missing modules fail**

Run: `npm install && npm run test:unit -- tests/unit/site-data.test.ts`

Expected: FAIL because `src/config/site.ts` and `src/data/credentials.ts` do not exist.

- [ ] **Step 4: Implement the minimum typed data**

```ts
export const siteConfig = {
  name: "Kernel Kittens",
  origin: "https://kernelkittens.team",
  description: "CTF write-ups, competition history, and work we can actually show.",
  ctfTimeUrl: null as string | null,
  accessibilityEmail: "accessibility@kitsunetechnologies.org",
} as const;
```

The credentials array contains one current Google credential, two explicitly expired credentials, and one result attributed to `1337_PwnSp4c3` with the verified figures from the design.

- [ ] **Step 5: Run the focused and full unit suite**

Run: `npm run test:unit -- tests/unit/site-data.test.ts && npm run test:unit`

Expected: PASS with zero failures.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src tests/unit/site-data.test.ts
git commit -m "build: add typed site foundation"
```

---

### Task 2: Publication boundary

**Files:**
- Create: `src/lib/publication.ts`
- Create: `scripts/check-publication-boundary.mjs`
- Test: `tests/unit/publication.test.ts`
- Test: `tests/unit/release-config.test.ts`

**Interfaces:**
- Produces: `isPublicWriteup(data): boolean` and `findForbiddenPublicContent(text, path): string[]`.
- The release script scans `src/content/writeups` and `dist` and exits nonzero on any violation.

- [ ] **Step 1: Write failing publication tests**

```ts
import { describe, expect, it } from "vitest";
import { findForbiddenPublicContent, isPublicWriteup } from "../../src/lib/publication";

describe("publication boundary", () => {
  it("requires explicit public status and a publication basis", () => {
    expect(isPublicWriteup({ status: "public", publicationBasis: "Organizer release rule" })).toBe(true);
    expect(isPublicWriteup({ status: "embargoed", publicationBasis: "Organizer release rule" })).toBe(false);
    expect(isPublicWriteup({ status: "public", publicationBasis: "" })).toBe(false);
  });

  it.each([
    ["PRIVATE DRAFT. DO NOT PUBLISH", "private draft marker"],
    ["bushbash{hidden}", "BushBash flag"],
    ["HTB{hidden}", "HTB flag"],
    ["C:\\Users\\Owner\\private.txt", "local Windows path"],
  ])("rejects %s", (text, expected) => {
    expect(findForbiddenPublicContent(text, "fixture.md")).toContain(expected);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm run test:unit -- tests/unit/publication.test.ts`

Expected: FAIL because `src/lib/publication.ts` does not exist.

- [ ] **Step 3: Implement the small allowlist and scanner**

```ts
const forbidden = [
  { label: "private draft marker", pattern: /private draft|do not publish|full detail \(private\)/i },
  { label: "BushBash flag", pattern: /bushbash\{[^}]+\}/i },
  { label: "HTB flag", pattern: /HTB\{[^}]+\}/i },
  { label: "local Windows path", pattern: /[A-Z]:\\Users\\[^\\]+\\/i },
];

export function isPublicWriteup(data: { status?: string; publicationBasis?: string }): boolean {
  return data.status === "public" && Boolean(data.publicationBasis?.trim());
}

export function findForbiddenPublicContent(text: string, _path: string): string[] {
  return forbidden.filter((item) => item.pattern.test(text)).map((item) => item.label);
}
```

The Node release script implements the same patterns directly so it can run without a TypeScript loader. It prints only paths and rule labels, never matched secret text.

- [ ] **Step 4: Run red-green verification for the release script**

Run the scanner against a temporary test fixture containing `bushbash{hidden}` and confirm a nonzero exit, remove the fixture, then run `npm run release:gate` and confirm exit zero.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/publication.ts scripts tests/unit/publication.test.ts tests/unit/release-config.test.ts package.json
git commit -m "test: enforce write-up publication boundary"
```

---

### Task 3: Brand system and page shell

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/BrandMark.astro`
- Create: `src/components/Header.astro`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro`
- Create: `public/brand/kernel-kittens-mark.svg`
- Test: `tests/e2e/site.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- `BaseLayout` accepts `title`, `description`, and optional canonical path.
- `BrandMark` accepts `decorative?: boolean` and `class?: string`.
- Every page exposes one `main` element with id `main-content`.

- [ ] **Step 1: Write the failing shell browser test**

```ts
import { expect, test } from "@playwright/test";

test("home exposes persistent navigation and a working skip link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Kernel Kittens" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
});
```

- [ ] **Step 2: Run and confirm the missing site fails**

Run: `npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: FAIL because the home route and browser configuration do not exist.

- [ ] **Step 3: Implement the static shell and hand-authored SVG**

The shell includes the skip link, visible Home, Write-ups, and Certifications links, the optional CTFtime link, and an accessibility link in the footer. The standalone SVG contains a title and uses only geometric paths, strokes, and the approved palette.

The hero copy is:

```text
Kernel Kittens
CTF write-ups, competition history, and work we can actually show.
We play CTFs and publish the useful parts once the rules allow it.
```

- [ ] **Step 4: Implement the token system and preference media queries**

Use the exact six colors from the design. Add `prefers-color-scheme: dark`, `prefers-reduced-motion: reduce`, and `prefers-contrast: more`. Keep navigation visible without JavaScript at 320 pixels and above.

- [ ] **Step 5: Build and run the focused browser test**

Run: `npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: PASS with no console errors.

- [ ] **Step 6: Commit**

```powershell
git add src/layouts src/components src/styles src/pages/index.astro public/brand playwright.config.ts tests/e2e/site.spec.ts
git commit -m "feat: add Kernel Kittens site shell"
```

---

### Task 4: Write-up archive, credentials, accessibility, and 404 pages

**Files:**
- Create: `src/components/CredentialCard.astro`
- Create: `src/components/WriteupCard.astro`
- Create: `src/pages/writeups/index.astro`
- Create: `src/pages/writeups/[...id].astro`
- Create: `src/pages/certifications.astro`
- Create: `src/pages/accessibility.astro`
- Create: `src/pages/404.astro`
- Modify: `tests/e2e/site.spec.ts`
- Test: `tests/e2e/a11y.spec.ts`

**Interfaces:**
- The archive calls `getCollection("writeups")`, filters through `isPublicWriteup`, and sorts newest first.
- The dynamic route receives only public entries from `getStaticPaths()`.
- Empty archive text states the publication boundary without exposing challenge details.

- [ ] **Step 1: Extend browser tests before creating routes**

```ts
const routes = ["/", "/writeups/", "/certifications/", "/accessibility/"];

for (const route of routes) {
  test(`${route} has one main landmark and a route home`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Kernel Kittens" })).toHaveAttribute("href", "/");
  });
}
```

Add assertions that current and expired credential labels are visible, the BushBash empty state contains no flag syntax, every visible internal link returns below HTTP 400, and an unknown path shows the custom 404 content.

- [ ] **Step 2: Run and confirm missing routes fail**

Run: `npm run build && npm run test:e2e -- tests/e2e/site.spec.ts`

Expected: FAIL on the missing route assertions.

- [ ] **Step 3: Implement the route components and public-entry generation**

Render the current credential first, expired credentials under `Previous credentials`, and the prior-team result under `Competition proof`. The empty archive says:

```text
No public write-ups yet.
Seven confirmed BushBash solves are ready, but the event rules still block publication. They stay private until that changes.
```

- [ ] **Step 4: Add Axe coverage for every route**

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/writeups/", "/certifications/", "/accessibility/"]) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? "")))
      .toEqual([]);
  });
}
```

- [ ] **Step 5: Run route and accessibility tests**

Run: `npm run build && npm run test:e2e && npm run test:a11y`

Expected: PASS with zero failed tests and zero critical or serious Axe findings.

- [ ] **Step 6: Commit**

```powershell
git add src/components src/pages tests/e2e
git commit -m "feat: add public team records"
```

---

### Task 5: Azure response policy and complete local release proof

**Files:**
- Create: `public/staticwebapp.config.json`
- Create: `public/robots.txt`
- Create: `src/pages/sitemap.xml.ts`
- Test: `tests/unit/security-headers.test.ts`
- Create: `README.md`
- Create: `AGENTS.md`

**Interfaces:**
- The Azure configuration applies global security headers and serves `/404.html` for missing routes.
- The sitemap includes only public routes and public write-up entries.

- [ ] **Step 1: Write the failing security policy test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Azure response policy", () => {
  it("ships a restrictive policy with no remote script allowance", () => {
    const config = JSON.parse(readFileSync("public/staticwebapp.config.json", "utf8"));
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("script-src 'self'");
    expect(config.globalHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(config.responseOverrides["404"].rewrite).toBe("/404.html");
  });
});
```

- [ ] **Step 2: Run and confirm the missing configuration fails**

Run: `npm run test:unit -- tests/unit/security-headers.test.ts`

Expected: FAIL because `public/staticwebapp.config.json` does not exist.

- [ ] **Step 3: Implement the restrictive static response policy**

Set CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`, and `Cross-Origin-Resource-Policy`. Do not allow inline or remote scripts.

- [ ] **Step 4: Run the complete local release gate**

Run:

```powershell
npm run check
npm run test:unit
npm run build
npm run release:gate
npm run test:e2e
npm run test:a11y
git diff --check
```

Expected: every command exits zero.

- [ ] **Step 5: Capture and inspect desktop and mobile screenshots**

Capture the home, write-up archive, certifications, and accessibility pages at 1440 by 1000 and 390 by 844. Inspect each image for clipping, weak hierarchy, collisions, unreadable labels, and accidental generic decoration. Fix visible defects and rerun the complete gate.

- [ ] **Step 6: Commit**

```powershell
git add public src/pages/sitemap.xml.ts tests/unit README.md AGENTS.md
git commit -m "chore: add Azure release policy"
```

---

### Task 6: Private source, Azure deployment, Porkbun DNS, and live verification

**Files:**
- Create: `docs/deployment.md`
- Update: canonical Obsidian project and session notes.

**Interfaces:**
- Azure resource group: `rg-kernel-kittens-web-prod`.
- Azure Static Web App: `swa-kernel-kittens-prod` in Central US on the Free SKU.
- Custom hostnames: `kernelkittens.team` and `www.kernelkittens.team`.
- Porkbun credentials are read from the existing ignored `C:\Users\Owner\ARG\.env` file.

- [ ] **Step 1: Create and push the private source repository**

Create `moo-private/kernel-kittens-site` in private Gitea. Configure the remote without an embedded credential. Push `main` with an ephemeral authorization header, then verify the remote head matches local HEAD.

- [ ] **Step 2: Create the dedicated Azure resources**

```powershell
az group create --name rg-kernel-kittens-web-prod --location centralus
az staticwebapp create --name swa-kernel-kittens-prod --resource-group rg-kernel-kittens-web-prod --location centralus --sku Free
```

Read back the resource JSON and verify the SKU, location, default hostname, and provisioning state before deployment.

- [ ] **Step 3: Deploy the exact tested output without persisting the token**

Read the deployment token with `az staticwebapp secrets list`, place it only in `SWA_CLI_DEPLOYMENT_TOKEN`, run the pinned `swa deploy ./dist --env production`, then clear the environment variable. Verify the Azure default hostname returns HTTP 200, the exact page title, and the expected security headers.

- [ ] **Step 4: Request the apex custom domain and publish its DNS proof**

Request `kernelkittens.team` with `dns-txt-token`, read its validation token, and create the required Porkbun TXT record. Replace only the default apex parking ALIAS with an ALIAS to the Azure default hostname. Wait for authoritative and public DNS to agree, then finish the Azure hostname validation.

- [ ] **Step 5: Add and validate `www`**

Create a Porkbun `www` CNAME to the Azure default hostname, request the hostname in Azure, and wait for validation. Remove the default wildcard parking CNAME after both explicit production records exist.

- [ ] **Step 6: Run live release checks**

Verify from direct HTTPS requests:

- apex and `www` return the tested site;
- TLS validates and the certificate names match;
- Azure default host, apex, and `www` share the expected release marker;
- security headers match the repository configuration;
- all public routes return the expected status;
- no private marker or flag syntax appears;
- the a11y MCP reports no critical or serious issue on every route.

Recheck DNS and HTTPS after a short delay before declaring the migration stable.

- [ ] **Step 7: Record the deployment and commit the handoff**

Write the Azure resource names, default hostname, DNS record shape, verification timestamps, tested commit SHA, and rollback instructions to `docs/deployment.md` without secret values. Update the canonical Obsidian project note and current session note.

```powershell
git add docs/deployment.md
git commit -m "docs: record Kernel Kittens deployment"
git push gitea main
```

