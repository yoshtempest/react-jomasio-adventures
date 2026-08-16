import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * Standalone build that bundles `src/sw.ts` — and the `tempest-react-sdk/sw`
 * helpers it imports — into a single classic service worker at `dist/sw.js`.
 *
 * Runs after the app build through the `build:sw` script. `emptyOutDir: false`
 * is mandatory: without it this second pass wipes the `dist/` the app build
 * just produced. The `iife` format emits a worker with no `import`/`export`
 * tokens, so it registers as a classic worker and needs no `type: "module"`.
 */
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/sw.ts"),
      formats: ["iife"],
      name: "sw",
      fileName: () => "sw.js",
    },
    rollupOptions: {
      output: { entryFileNames: "sw.js", inlineDynamicImports: true },
    },
  },
});
