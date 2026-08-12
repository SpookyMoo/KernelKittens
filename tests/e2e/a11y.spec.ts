import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/writeups/", "/certifications/", "/accessibility/"]) {
  test(`${route} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    const blockingViolations = result.violations.filter((item) =>
      ["critical", "serious"].includes(item.impact ?? "")
    );

    expect(blockingViolations).toEqual([]);
  });
}
