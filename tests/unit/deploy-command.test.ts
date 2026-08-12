import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Azure deploy command", () => {
  it("uses the pinned CLI without unsupported deploy flags", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const command = packageJson.scripts["deploy:azure"];

    expect(command).toContain("@azure/static-web-apps-cli@2.0.10");
    expect(command).toContain("swa deploy ./dist --env production");
    expect(command).not.toMatch(/swa deploy .* --yes(?:\s|$)/);
  });
});
