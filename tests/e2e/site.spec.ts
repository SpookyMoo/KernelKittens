import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/results/", "/writeups/", "/accessibility/"];

test("home exposes persistent navigation and a working skip link", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "We play CTFs. The scoreboard can do the talking."
    })
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content"
  );
});

test("home reserves an accessible static motion stage without runtime media", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("figure", { name: "Kernel Kittens motion graphics static keyframe" })
  ).toBeVisible();
  await expect(page.getByText("Static keyframe", { exact: true })).toBeVisible();
  await expect(page.locator("video, canvas, script")).toHaveCount(0);
});

test("home board shows both verified results with Cyber Apocalypse featured", async ({ page }) => {
  await page.goto("/");
  const board = page.getByRole("region", { name: "On the board." });
  const cards = board.locator('[data-result-status="verified"]');
  const featured = board.locator(".result-scorecard--featured");

  await expect(cards).toHaveCount(2);
  await expect(featured).toHaveCount(1);
  await expect(featured.getByText("Cyber Apocalypse 2026", { exact: true })).toBeVisible();
  await expect(featured).not.toContainText("BushBash");
  await expect(cards.nth(1).getByText("BushBash CTF 2026", { exact: true })).toBeVisible();
  await expect(cards.nth(1).getByText("1 / 994", { exact: true })).toBeVisible();
});

test("display headings wrap only between words", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("overflow-wrap", "normal");
});

for (const route of publicRoutes) {
  test(`${route} has one main landmark and a route home`, async ({ page }) => {
    await page.goto(route);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Kernel Kittens" })).toHaveAttribute(
      "href",
      "/"
    );
  });
}

test("results show exact verified metrics and prior-team attribution", async ({ page }) => {
  await page.goto("/results/");
  const cyberApocalypse = page.locator("[data-result-status='verified']").filter({
    hasText: "Cyber Apocalypse 2026"
  });
  const bushBash = page.locator("[data-result-status='verified']").filter({
    hasText: "BushBash CTF 2026"
  });

  await expect(page.getByRole("heading", { level: 1, name: "Results" })).toBeVisible();
  await expect(cyberApocalypse.getByText("12 / 6,744", { exact: true })).toBeVisible();
  await expect(cyberApocalypse.getByText("136 / 136", { exact: true })).toBeVisible();
  await expect(cyberApocalypse.getByText("69,425", { exact: true })).toBeVisible();
  await expect(cyberApocalypse.getByText("Member result with a prior team", { exact: true })).toBeVisible();
  await expect(cyberApocalypse.getByText(/1337_PwnSp4c3/)).toBeVisible();
  await expect(bushBash.getByText("1 / 994", { exact: true })).toBeVisible();
  await expect(bushBash.getByText("Global", { exact: true })).toBeVisible();
  await expect(bushBash.getByText("Member result with a prior team", { exact: true })).toBeVisible();
  await expect(bushBash.getByText(/1337_PwnSp4c3/)).toBeVisible();
  await expect(page.locator("[data-result-status='verified']")).toHaveCount(2);
  await expect(page.locator("[data-result-status='pending']")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/Google Cybersecurity|CCNA|CompTIA/i);
});

test("the retired certification route redirects to results", async ({ request }) => {
  const response = await request.get("/certifications/", { maxRedirects: 0 });

  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe("/results/");
});

test("write-up archive explains the publication hold without leaking flags", async ({ page }) => {
  await page.goto("/writeups/");

  await expect(page.getByRole("heading", { name: "No public write-ups yet." })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/bushbash\{|HTB\{/i);
});

test("every visible internal link resolves", async ({ page, request }) => {
  const hrefs = new Set<string>();

  for (const route of publicRoutes) {
    await page.goto(route);
    const routeHrefs = await page.locator("a[href^='/']:visible").evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute("href"))
    );
    routeHrefs.filter(Boolean).forEach((href) => hrefs.add(href as string));
  }

  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});

test("unknown routes use the custom 404 page", async ({ page }) => {
  const response = await page.goto("/route-that-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "That page is not here." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
});

test("the browser receives the restrictive release policy", async ({ page }) => {
  const response = await page.goto("/results/");
  const headers = response?.headers() ?? {};

  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).toContain("style-src 'self'");
  expect(headers["permissions-policy"]).toContain("camera=()");
  await expect(page.locator("style")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
});

test("primary navigation stays visible at a narrow mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Write-ups", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Results", exact: true })).toBeVisible();
  await expect(page.locator(".motion-stage__plate")).toHaveCSS("aspect-ratio", "16 / 9");
  const overflowingElements = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element: `${element.tagName.toLowerCase()}.${element.className}`,
          left: rect.left,
          right: rect.right,
        };
      })
      .filter(({ left, right }) => left < -0.5 || right > window.innerWidth + 0.5),
  );

  expect(overflowingElements).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test("reduced motion keeps the storyboard static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".motion-stage__playhead")).toHaveCSS("animation-name", "none");
});

test("the release makes no third-party requests and loads without console errors", async ({ page }) => {
  const thirdPartyRequests: string[] = [];
  const consoleErrors: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4321") thirdPartyRequests.push(url.origin);
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  for (const route of publicRoutes) {
    await page.goto(route);
    await expect(page.locator("style"), `${route} must not contain inline styles`).toHaveCount(0);
  }

  expect([...new Set(thirdPartyRequests)]).toEqual([]);
  expect(consoleErrors).toEqual([]);
  await expect(page.locator("script")).toHaveCount(0);
});
