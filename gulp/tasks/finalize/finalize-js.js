// ← task to finalize JS output.

const gulp = require("gulp");

const { log } = require("../../utils/log");

const { startTimer } = require("../../utils/timer");
const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.js.src;
const tempGlob = ctx.paths.js.temp.artifacts.gen.glob;

const outputDir = ctx.paths.js.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start JS finalization...");
  cb();
}
logStart.displayName = "finalize:js:log:start";

function logEnd(cb) {
  log.success(`Finished JS finalization! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "finalize:js:log:end";

const finalizeJsTask = function () {
  return gulp.src(tempGlob, { allowEmpty: true }).pipe(gulp.dest(outputDir));
};
finalizeJsTask.displayName = "finalize:js:run";

const finalizeJs = gulp.series(logStart, finalizeJsTask, logEnd);

finalizeJs.displayName = "finalize:js";

module.exports = finalizeJs;
