import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Azure response policy", () => {
  it("ships a restrictive policy with no remote script allowance", () => {
    const config = JSON.parse(
      readFileSync("public/staticwebapp.config.json", "utf8")
    );
    const policy = config.globalHeaders["Content-Security-Policy"];

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("'unsafe-inline'");
    expect(policy).not.toMatch(/https?:/);
    expect(config.globalHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(config.globalHeaders["Strict-Transport-Security"]).toContain("max-age=");
    expect(config.responseOverrides["404"].rewrite).toBe("/404.html");
  });

  it("externalizes Astro styles so the CSP can load every layout", () => {
    const astroConfig = readFileSync("astro.config.mjs", "utf8");

    expect(astroConfig).toContain('inlineStylesheets: "never"');
  });
});
