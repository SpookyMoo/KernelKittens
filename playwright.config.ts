import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4321",
    env: {
      ...process.env,
      ASTRO_PREVIEW_BACKGROUND: "0"
    },
    url: "http://127.0.0.1:4321",
    reuseExistingServer: false,
    timeout: 120_000
  }
});
