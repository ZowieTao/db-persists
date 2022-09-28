import * as path from "path";
import webWorkerLoader from "rollup-plugin-web-worker-loader";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import { terser } from "rollup-plugin-terser";

function getConfig(entry, filename, perf) {
  // Remove the extension
  let basename = filename.replace(/\.[^.]*/, "");

  return {
    input: entry,
    output: {
      dir: perf ? "dist/perf" : "dist",
      entryFileNames: filename,
      chunkFileNames: `${basename}-[name]-[hash].js`,
      format: "esm",
      exports: "named",
    },
    plugins: [
      !perf &&
        alias({
          entries: {
            "perf-deets": path.resolve(
              __dirname,
              "./node_modules/perf-deets/noop.js"
            ),
          },
        }),
      webWorkerLoader({
        pattern: /.*\/worker\.js/,
        targetPlatform: "browser",
        external: [],
        plugins: [terser()],
      }),
      nodeResolve(),
    ],
    ...(perf ? { external: ["perf-deets"] } : {}),
  };
}

export default {
  input: "./src/index.ts",
};
