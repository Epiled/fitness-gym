// ← task to generate main JS file.

const gulp = require("gulp");
const esbuild = require("esbuild");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.paths.js.dist;

let timer;

async function buildTask() {
  timer = startTimer();
  log.info("Start JS build...");
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Pipeline: esbuild (code splitting)");

  await esbuild.build({
    entryPoints: {
      main: "./src/js/main.js",
    },

    bundle: true,

    splitting: false,

    outdir: outputDir,

    format: "esm",
    platform: "browser",
    target: ["es2018"],

    minify: true,
    sourcemap: false,
    logLevel: "info",
  });
  log.success("JS build completed successfully.");
}

const jsBuild = gulp.series(buildTask);

jsBuild.displayName = "js:build";

gulp.task(jsBuild.displayName, jsBuild);

module.exports = { jsBuild };
