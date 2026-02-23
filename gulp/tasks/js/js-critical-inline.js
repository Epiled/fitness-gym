// ← task to generate critical JS file

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

function logStart(cb) {
  log.info("Start insert JS critical inline...");
  cb();
}
logStart.displayName = "js:critical:inline:log:start";

function logEnd(cb) {
  log.info(`Finished insert JS critical inline! ${timer.end()} → ${outputDir}`);
  cb();
}
logStart.displayName = "js:critical:inline:log:end";

async function jsCriticalInlineTask() {
  timer = startTimer();

  await esbuild.build({
    entryPoints: {
      inline: path.resolve(baseDir, "inline.entry.js"),
    },

    bundle: true,

    splitting: false,

    outdir: outputDir,

    format: "iife",
    platform: "browser",
    target: ["es2018"],

    minify: true,
    sourcemap: false,
    logLevel: "info",
  });
}
jsCriticalInlineTask.displayName = "js:critical:inline:run";

const jsCriticalInline = gulp.series(logStart, jsCriticalInlineTask, logEnd);

jsCriticalInline.displayName = "js:critical:inline";
jsCriticalInline.description = "";
jsCriticalInline.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Hi",
};

gulp.task(jsCriticalInline.displayName, jsCriticalInline);

module.exports = { jsCriticalInline };
