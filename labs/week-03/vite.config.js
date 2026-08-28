import { defineConfig } from "vite";

const repositoryName = "engse203-lab02-68543210059-0";

export default defineConfig({
  base: `/${repositoryName}/labs/week-03/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});