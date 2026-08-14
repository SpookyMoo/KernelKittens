import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowPath = ".github/workflows/verify-and-deploy.yml";

describe("GitHub verification and deployment workflow", () => {
  it("tests every candidate and deploys the verified main artifact to Azure", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm audit --audit-level=high");
    expect(workflow).toContain("actions/upload-artifact@");
    expect(workflow).toContain("name: tested-site");
    expect(workflow).toContain("path: dist");
    expect(workflow).toContain("needs: verify");
    expect(workflow).toContain("github.ref == 'refs/heads/main'");
    expect(workflow).toContain("actions/download-artifact@");
    expect(workflow).toContain("Azure/static-web-apps-deploy@");
    expect(workflow).toContain("secrets.AZURE_STATIC_WEB_APPS_API_TOKEN");
    expect(workflow).toContain("app_location: dist");
    expect(workflow).toContain("skip_app_build: true");
    expect(workflow).not.toContain("actions/upload-pages-artifact@");
    expect(workflow).not.toContain("actions/deploy-pages@");
    expect(workflow).not.toContain("pages: write");
    expect(workflow).not.toContain("id-token: write");
  });

  it("uses immutable official action references", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    const actionRefs = [...workflow.matchAll(/uses:\s+([^\s#]+)/g)].flatMap((match) =>
      match[1] ? [match[1]] : []
    );

    expect(workflow).not.toContain("pull_request_target:");
    expect(actionRefs.length).toBeGreaterThan(0);
    expect(actionRefs.every((ref) => /@[0-9a-f]{40}$/.test(ref))).toBe(true);
    expect(actionRefs.every((ref) => /^(actions|Azure)\//.test(ref))).toBe(true);
  });

  it("leaves the custom domain out of the Azure build artifact", () => {
    expect(existsSync("public/CNAME")).toBe(false);
  });

  it("makes the 320 pixel visual review part of the deployment gate", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const visualSpec = readFileSync("tests/e2e/visual.spec.ts", "utf8");
    const workflow = readFileSync(workflowPath, "utf8");

    expect(packageJson.scripts["test:visual"]).toBe(
      "playwright test tests/e2e/visual.spec.ts"
    );
    expect(packageJson.scripts.test).toContain("npm run test:visual");
    expect(visualSpec).toContain("width: 320");
    expect(visualSpec).not.toContain("width: 390");
    expect(workflow).toContain("name: visual-review");
    expect(workflow).toContain("if: ${{ success() }}");
    expect(workflow).not.toContain("if: ${{ always() }}");
  });
});
