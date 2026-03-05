// ← task to generate main JS file.

const gulp = require("gulp");
const esbuild = require("esbuild");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.js.dir;

const tempDir = ctx.paths.js.temp.staging;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const inputGlob = path.resolve(baseDir, "main.js");

const outputDir = ctx.isDebug
  ? ctx.paths.js.dist
  : ctx.paths.js.temp.artifacts.gen.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start JS main...");
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "js:main:log:start";

function logEnd(cb) {
  log.success(`Finished JS main! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "js:main:log:end";

async function jsMainTask() {
  await esbuild.build({
    entryPoints: {
      main: inputGlob,
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
}
jsMainTask.displayName = "js:main:run";

const jsMain = gulp.series(logStart, jsMainTask, logEnd);

jsMain.displayName = "js:main";
jsMain.description = "Generate the main JS file.";
jsMain.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
};

gulp.task(jsMain.displayName, jsMain);

module.exports = { jsMain };
