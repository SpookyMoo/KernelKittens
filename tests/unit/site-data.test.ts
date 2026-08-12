import { describe, expect, it } from "vitest";

import { siteConfig } from "../../src/config/site";
import { credentials } from "../../src/data/credentials";

describe("public site data", () => {
  it("uses the purchased domain and hides the uncreated CTFtime profile", () => {
    expect(siteConfig.origin).toBe("https://kernelkittens.team");
    expect(siteConfig.ctfTimeUrl).toBeNull();
  });

  it("does not present expired credentials as current", () => {
    expect(
      credentials
        .filter((item) => item.kind === "current")
        .map((item) => item.title)
    ).toEqual(["Google Cybersecurity Professional Certificate"]);
    expect(credentials.filter((item) => item.kind === "expired")).toHaveLength(2);
  });

  it("attributes prior competition proof to the prior team", () => {
    const result = credentials.find((item) => item.kind === "result");

    expect(result?.context).toContain("1337_PwnSp4c3");
    expect(result?.context).toContain("12th of 6,744 teams");
    expect(result?.context).toContain("136 of 136 challenges");
    expect(result?.context).toContain("69,425 points");
  });
});

