import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowPath = ".github/workflows/verify-and-deploy.yml";

describe("GitHub verification and deployment workflow", () => {
  it("tests every candidate and deploys only the verified main artifact", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm audit --audit-level=high");
    expect(workflow).toContain("name: tested-site");
    expect(workflow).toContain("path: dist");
    expect(workflow).toContain("needs: verify");
    expect(workflow).toContain("github.ref == 'refs/heads/main'");
    expect(workflow).toContain("app_location: dist");
    expect(workflow).toContain("skip_app_build: true");
    expect(workflow).toContain('output_location: ""');
  });

  it("uses a secret and immutable official action references", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    const actionRefs = [...workflow.matchAll(/uses:\s+([^\s#]+)/g)].flatMap((match) =>
      match[1] ? [match[1]] : []
    );

    expect(workflow).toContain("secrets.AZURE_STATIC_WEB_APPS_API_TOKEN");
    expect(workflow).not.toContain("pull_request_target:");
    expect(actionRefs.length).toBeGreaterThan(0);
    expect(actionRefs.every((ref) => /@[0-9a-f]{40}$/.test(ref))).toBe(true);
    expect(actionRefs.every((ref) => /^(actions|Azure)\//.test(ref))).toBe(true);
  });
});
