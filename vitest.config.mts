import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    environmentNatchGlobs: [
      // actions run on the server
      ["src/app/actions/**", "node"],
      // route handlers run on the server
      ["**/route.ts", "node"],
      // app directory needs access to the dom
      ["src/app/**", "jsdom"],
    ],
    globals: true,
    env: loadEnv(mode, process.cwd(), ""),
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["vitest.setup.ts"],
  },
}));
