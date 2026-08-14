import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("cross-platform type checking", () => {
  it("installs Node types directly instead of relying on platform-dependent transitive packages", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

    expect(packageJson.devDependencies["@types/node"]).toBe("24.13.3");
  });
});
