import { defineConfig } from "vite";

const repositoryName = "engse203-lab02-68543210009-5";

export default defineConfig({
  base: `/${repositoryName}/labs/week-02/`,
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});