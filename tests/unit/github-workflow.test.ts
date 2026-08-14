import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflowPath = ".github/workflows/verify-and-deploy.yml";

describe("GitHub verification and deployment workflow", () => {
  it("tests every candidate and deploys the verified main artifact to GitHub Pages", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm audit --audit-level=high");
    expect(workflow).toContain("actions/upload-pages-artifact@");
    expect(workflow).toContain("path: dist");
    expect(workflow).toContain("needs: verify");
    expect(workflow).toContain("github.ref == 'refs/heads/main'");
    expect(workflow).toContain("actions/deploy-pages@");
    expect(workflow).toContain("name: github-pages");
    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("id-token: write");
    expect(workflow).not.toContain("Azure/static-web-apps-deploy");
    expect(workflow).not.toContain("AZURE_STATIC_WEB_APPS_API_TOKEN");
  });

  it("uses immutable official action references", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    const actionRefs = [...workflow.matchAll(/uses:\s+([^\s#]+)/g)].flatMap((match) =>
      match[1] ? [match[1]] : []
    );

    expect(workflow).not.toContain("pull_request_target:");
    expect(actionRefs.length).toBeGreaterThan(0);
    expect(actionRefs.every((ref) => /@[0-9a-f]{40}$/.test(ref))).toBe(true);
    expect(actionRefs.every((ref) => /^actions\//.test(ref))).toBe(true);
  });

  it("records the purchased custom domain in the build input", () => {
    const cname = readFileSync("public/CNAME", "utf8");

    expect(cname).toBe("kernelkittens.team\n");
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
