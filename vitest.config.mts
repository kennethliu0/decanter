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
    exclude: [
      "**\/node_modules/**",
      "**\/dist/**",
      "**\/cypress/**",
      "**\/.{idea,git,cache,output,temp}/**",
      "**\/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/components/shadcn/**",
    ],
    globals: true,
    env: loadEnv(mode, process.cwd(), ""),
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/components/shadcn/**"],
    },
    setupFiles: ["vitest.setup.ts"],
  },
}));
