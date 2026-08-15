import { test } from "@playwright/test";

const routes = [
  { path: "/", name: "home" },
  { path: "/results/", name: "results" },
  { path: "/writeups/", name: "writeups" },
  { path: "/accessibility/", name: "accessibility" }
];

test("capture desktop and mobile release views", async ({ page }, testInfo) => {
  for (const route of routes) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route.path);
    await page.screenshot({
      path: testInfo.outputPath(`desktop-${route.name}.png`),
      fullPage: true,
      animations: "disabled"
    });

    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(route.path);
    await page.screenshot({
      path: testInfo.outputPath(`mobile-${route.name}.png`),
      fullPage: true,
      animations: "disabled"
    });
  }
});
