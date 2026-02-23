// ← task to build the JS files.

const gulp = require("gulp");

const { jsMain } = require("./js-main");
const { jsCriticalInline } = require("./js-critical-inline");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.paths.js.dist;

function logStart(cb) {
  timer = startTimer();
  log.info("Start JS build...");
  cb();
}

function logEnd(cb) {
  log.success(`Finished JS build! ${timer.end()} → ${outputDir}`);
  cb();
}

const jsBuild = gulp.series(logStart, jsCriticalInline, jsMain, logEnd);

jsBuild.displayName = "js:build";
jsBuild.description = "Build the JS files.";
jsBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(jsBuild.displayName, jsBuild);

module.exports = { jsBuild };
