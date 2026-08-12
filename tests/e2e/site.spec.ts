import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/results/", "/writeups/", "/accessibility/"];

test("home exposes persistent navigation and a working skip link", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Kernel Kittens" })
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content"
  );
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

  await expect(page.getByRole("heading", { level: 1, name: "Results" })).toBeVisible();
  await expect(page.getByText("Cyber Apocalypse 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("12 / 6,744", { exact: true })).toBeVisible();
  await expect(page.getByText("136 / 136", { exact: true })).toBeVisible();
  await expect(page.getByText("69,425", { exact: true })).toBeVisible();
  await expect(page.getByText("Member result with a prior team", { exact: true })).toBeVisible();
  await expect(page.getByText(/1337_PwnSp4c3/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/Google Cybersecurity|CCNA|CompTIA/i);
  await expect(page.locator("body")).not.toContainText(/BushBash.*(?:1st|first)/i);
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
  await expect(page.getByRole("link", { name: "Write-ups" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Results" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
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
