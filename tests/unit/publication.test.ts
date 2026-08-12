import { describe, expect, it } from "vitest";

import {
  findForbiddenPublicContent,
  isPublicWriteup
} from "../../src/lib/publication";

describe("publication boundary", () => {
  it("requires explicit public status and a publication basis", () => {
    expect(
      isPublicWriteup({
        status: "public",
        publicationBasis: "Organizer release rule"
      })
    ).toBe(true);
    expect(
      isPublicWriteup({
        status: "embargoed",
        publicationBasis: "Organizer release rule"
      })
    ).toBe(false);
    expect(
      isPublicWriteup({ status: "public", publicationBasis: "" })
    ).toBe(false);
  });

  it.each([
    ["PRIVATE DRAFT. DO NOT PUBLISH", "private draft marker"],
    ["bushbash{hidden}", "BushBash flag"],
    ["HTB{hidden}", "HTB flag"],
    ["C:\\Users\\Owner\\private.txt", "local Windows path"]
  ])("rejects forbidden public text", (sample, expected) => {
    expect(findForbiddenPublicContent(sample, "fixture.md")).toContain(
      expected
    );
  });

  it("reports rule labels without echoing the private text", () => {
    const sample = "bushbash{do-not-echo}";
    const violations = findForbiddenPublicContent(sample, "fixture.md");

    expect(violations.join(" ")).not.toContain(sample);
  });
});
