import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  cacheDir: path.resolve(__dirname, "../node_modules/.vite"),
  test: {
    environment: "jsdom",
    testTimeout: 15000,
    server: {
      deps: {
        inline: ["@testing-library/react"],
      },
    },
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["tests/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "../node_modules/react"),
      "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
    },
  },
});

