import { describe, expect, it } from "vitest";

import { siteConfig } from "../../src/config/site";
import { verifiedResults } from "../../src/data/results";

describe("public site data", () => {
  it("uses the purchased domain and hides the uncreated CTFtime profile", () => {
    expect(siteConfig.origin).toBe("https://kernelkittens.team");
    expect(siteConfig.ctfTimeUrl).toBeNull();
  });

  it("uses the Kernel Kittens accessibility address", () => {
    expect(siteConfig.accessibilityEmail).toBe("KernelKittens@pm.me");
  });

  it("publishes only verified results in source order", () => {
    expect(verifiedResults.every((result) => result.status === "verified")).toBe(true);
    expect(verifiedResults.map((result) => result.id)).toEqual([
      "cyber-apocalypse-2026",
      "bushbash-2026"
    ]);
  });

  it("keeps the verified prior-team result exact and attributed", () => {
    const result = verifiedResults.find((item) => item.id === "cyber-apocalypse-2026");

    expect(result).toMatchObject({
      placement: 12,
      fieldSize: 6744,
      solved: 136,
      totalChallenges: 136,
      score: 69425,
      creditedTeam: "1337_PwnSp4c3",
      attribution: "Member result with a prior team"
    });
  });

  it("publishes the verified BushBash result with exact prior-team attribution", () => {
    const result = verifiedResults.find((item) => item.id === "bushbash-2026");

    expect(result).toMatchObject({
      placement: 1,
      placementLabel: "1st",
      fieldSize: 994,
      solved: 28,
      totalChallenges: 28,
      score: 5997,
      division: "Open - International",
      creditedTeam: "1337_PwnSp4c3",
      attribution: "Member result with a prior team"
    });
  });
});
