import { expect, test, type Locator } from "@playwright/test";

const publicRoutes = ["/", "/results/", "/writeups/", "/accessibility/"];
const bushBashMetrics = ["1 / 994", "28 / 28", "5,997", "Open - International"];

async function expectBushBashMetrics(row: Locator): Promise<void> {
  for (const metric of bushBashMetrics) {
    await expect(row.getByText(metric, { exact: true })).toBeVisible();
  }
}

test("home presents the small crew archive identity", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "kernel kittens" })).toBeVisible();
  await expect(page.locator("[data-crew-signature]")).toContainText("root@kk");
  await expect(
    page.getByText("We play CTFs and keep the useful parts here.", { exact: true })
  ).toBeVisible();
  await expect(page.locator(".motion-stage, .result-scorecard, .button-link")).toHaveCount(0);
});

test("home exposes persistent navigation and a working skip link", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content"
  );
});

test("home exposes the verified result ledger and recent files", async ({ page }) => {
  await page.goto("/");

  const ledger = page.locator("[data-result-ledger]");
  await expect(ledger.locator("[data-result-status='verified']")).toHaveCount(2);
  await expect(ledger.getByText("Cyber Apocalypse 2026", { exact: true })).toBeVisible();
  await expect(ledger.getByText("BushBash CTF 2026", { exact: true })).toBeVisible();
  await expect(page.locator("[data-recent-files]").getByRole("link")).toHaveCount(2);
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

  await expect(page.getByRole("heading", { level: 1, name: "results" })).toBeVisible();
  await expect(cyberApocalypse.getByText("12 / 6,744", { exact: true })).toBeVisible();
  await expect(cyberApocalypse.getByText("136 / 136", { exact: true })).toBeVisible();
  await expect(cyberApocalypse.getByText("69,425", { exact: true })).toBeVisible();
  await expect(cyberApocalypse).toContainText("Member result with a prior team");
  await expect(cyberApocalypse).toContainText("1337_PwnSp4c3");
  await expectBushBashMetrics(bushBash);
  await expect(bushBash).toContainText("Member result with a prior team");
  await expect(bushBash).toContainText("1337_PwnSp4c3");
  await expect(page.locator("[data-result-status='verified']")).toHaveCount(2);
  await expect(page.locator("[data-result-status='pending']")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/Google Cybersecurity|CCNA|CompTIA/i);
});

test("BushBash division stays inside its result record", async ({ page }) => {
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/results/");

    const row = page.locator("[data-result-status='verified']").filter({
      hasText: "BushBash CTF 2026"
    });
    const division = row.getByText("Open - International", { exact: true });
    const dimensions = await division.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  }
});

test("the retired certification route redirects to results", async ({ request }) => {
  const response = await request.get("/certifications/", { maxRedirects: 0 });

  expect(response.status()).toBe(301);
  expect(response.headers().location).toBe("/results/");
});

test("write-up archive reports zero public files without leaking flags", async ({ page }) => {
  await page.goto("/writeups/");

  await expect(page.locator("[data-public-file-count]")).toHaveText("0 public files");
  await expect(page.getByText(/confirmed BushBash notes remain private/i)).toBeVisible();
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
  await expect(page.getByRole("heading", { level: 1, name: "404 / file not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
});

test("the browser receives the restrictive release policy", async ({ page }) => {
  const response = await page.goto("/results/");
  const headers = response?.headers() ?? {};

  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).toContain("style-src 'self'");
  expect(headers["permissions-policy"]).toContain("camera=()");
  await expect(page.locator("style")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "results" })).toBeVisible();
});

test("primary navigation and result records stay inside a 320 pixel viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "[write-ups]", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "[results]", exact: true })).toBeVisible();
  const overflowingElements = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element: `${element.tagName.toLowerCase()}.${element.className}`,
          left: rect.left,
          right: rect.right
        };
      })
      .filter(({ left, right }) => left < -0.5 || right > window.innerWidth + 0.5)
  );

  expect(overflowingElements).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test("home file links meet the 24 pixel minimum target size", async ({ page }) => {
  await page.goto("/");

  const heights = await page.locator("[data-recent-files] a").evaluateAll((links) =>
    links.map((link) => link.getBoundingClientRect().height)
  );

  expect(heights.every((height) => height >= 24)).toBe(true);
});

test("mobile event headings use the full result record width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");

  const eventWidth = await page
    .locator("[data-result-status='verified'] th[scope='row']")
    .first()
    .evaluate((heading) => heading.getBoundingClientRect().width);

  expect(eventWidth).toBeGreaterThanOrEqual(280);
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
