// ← task to generate main JS file.

const gulp = require("gulp");
const esbuild = require("esbuild");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.js.glob;
const srcDir = ctx.paths.js.dir;

const tempDir = ctx.paths.js.temp.staging;
const tempGlob = ctx.paths.js.temp.artifacts.gen.glob;

const inputGlob = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.isDebug
  ? ctx.paths.js.dist
  : ctx.paths.js.temp.artifacts.gen.dir;

let timer;

async function buildTask() {
  timer = startTimer();
  log.info("Start JS build...");
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Pipeline: esbuild (code splitting)");

  await esbuild.build({
    entryPoints: {
      main: path.resolve(baseDir, "main.js"),
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

const jsMain = gulp.series(buildTask);

jsMain.displayName = "js:build";

gulp.task(jsMain.displayName, jsMain);

module.exports = { jsMain };
