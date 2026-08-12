import { defineConfig } from "vite";
export default defineConfig({
  root: ".",
  build: { outDir: "dist", sourcemap: true, target: "es2022" },
  server: { port: 5173, proxy: { "/api": "http://127.0.0.1:3000" } },
  preview: { port: 5173, proxy: { "/api": "http://127.0.0.1:3000" } },
});
