// ← task to build the JS files.

const gulp = require("gulp");

const { jsMain } = require("./js-main");
const { jsCriticalInline } = require("./js-critical-inline");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.isDebug
  ? ctx.paths.js.dist
  : ctx.paths.js.temp.artifacts.gen.dir;

function logStart(cb) {
  timer = startTimer();
  log.info("Start JS build...");
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Pipeline: jsCriticalInline → jsMain");
  cb();
}
logStart.displayName = "js:build:log:start";

function logEnd(cb) {
  log.success(`Finished JS build! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "js:build:log:end";

const jsBuild = gulp.series(logStart, jsCriticalInline, jsMain, logEnd);

jsBuild.displayName = "js:build";
jsBuild.description = "Build the JS files.";
jsBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
};

gulp.task(jsBuild.displayName, jsBuild);

module.exports = { jsBuild };
