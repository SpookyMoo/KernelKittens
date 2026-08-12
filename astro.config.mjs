import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kernelkittens.team",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory"
  }
});

