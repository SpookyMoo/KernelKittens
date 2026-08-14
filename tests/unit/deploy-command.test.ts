import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Deployment scripts", () => {
  it("removes the local Azure deployment command", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

    expect(packageJson.scripts).not.toHaveProperty("deploy:azure");
  });
});
