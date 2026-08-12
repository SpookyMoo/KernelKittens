import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const colorScheme of ["light", "dark"] as const) {
  for (const route of ["/", "/writeups/", "/certifications/", "/accessibility/"]) {
    test(`${route} has no blocking ${colorScheme} mode violations`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      const result = await new AxeBuilder({ page }).analyze();
      const blockingViolations = result.violations.filter((item) =>
        ["critical", "serious"].includes(item.impact ?? "")
      );

      expect(blockingViolations).toEqual([]);
    });
  }
}
