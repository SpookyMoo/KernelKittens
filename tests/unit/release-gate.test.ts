import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("publication release gate", () => {
  it("scans text-based SVG assets without echoing their private content", () => {
    const result = spawnSync(
      process.execPath,
      [
        "scripts/check-publication-boundary.mjs",
        "--source-only",
        "--scan-root",
        "tests/fixtures/publication-boundary"
      ],
      { encoding: "utf8" }
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("blocked.svg: BushBash flag");
    expect(result.stderr).not.toContain("do-not-echo");
  });
});
