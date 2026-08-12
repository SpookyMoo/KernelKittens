import { describe, expect, it } from "vitest";

import { siteConfig } from "../../src/config/site";
import { competitionResults, verifiedResults } from "../../src/data/results";

describe("public site data", () => {
  it("uses the purchased domain and hides the uncreated CTFtime profile", () => {
    expect(siteConfig.origin).toBe("https://kernelkittens.team");
    expect(siteConfig.ctfTimeUrl).toBeNull();
  });

  it("publishes only verified results", () => {
    expect(verifiedResults.every((result) => result.status === "verified")).toBe(true);
    expect(verifiedResults.map((result) => result.id)).not.toContain("bushbash-2026");
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

  it("does not assign an unverified BushBash placement", () => {
    const result = competitionResults.find((item) => item.id === "bushbash-2026");

    expect(result).toMatchObject({ status: "pending", placement: null });
  });
});
