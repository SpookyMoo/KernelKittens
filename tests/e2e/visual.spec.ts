import { test } from "@playwright/test";

const routes = [
  { path: "/", name: "home" },
  { path: "/writeups/", name: "writeups" },
  { path: "/certifications/", name: "certifications" },
  { path: "/accessibility/", name: "accessibility" }
];

test("capture desktop and mobile release views", async ({ page }, testInfo) => {
  for (const route of routes) {
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route.path);
    await page.screenshot({
      path: testInfo.outputPath(`desktop-${route.name}.png`),
      fullPage: true,
      animations: "disabled"
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route.path);
    await page.screenshot({
      path: testInfo.outputPath(`mobile-${route.name}.png`),
      fullPage: true,
      animations: "disabled"
    });
  }

  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({
    path: testInfo.outputPath("desktop-home-dark.png"),
    fullPage: true,
    animations: "disabled"
  });
});
