import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/writeups/", "/certifications/", "/accessibility/"];

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

test("credential records separate current, expired, and prior-team proof", async ({ page }) => {
  await page.goto("/certifications/");

  await expect(page.getByText("Current credential", { exact: true })).toHaveCount(1);
  await expect(page.getByText("Previous credential - expired", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Member competition result", { exact: true })).toHaveCount(1);
  await expect(page.getByText(/1337_PwnSp4c3/)).toBeVisible();
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

test("the custom 404 page provides useful recovery links", async ({ page }) => {
  await page.goto("/404.html");

  await expect(page.getByRole("heading", { level: 1, name: "That page is not here." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
});

test("primary navigation stays visible at a narrow mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Write-ups" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Certifications" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
