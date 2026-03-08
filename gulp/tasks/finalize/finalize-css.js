// ← task to finalize CSS output.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.css.src;
const tempGlob = ctx.paths.css.temp.artifacts.gen.glob;

const outputDir = ctx.paths.css.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start CSS finalization...");
  cb();
}
logStart.displayName = "finalize:css:log:start";

function logEnd(cb) {
  log.info(`Finished CSS finalization! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "finalize:css:log:end";

const finalizeCssTask = function () {
  return gulp.src(tempGlob, { allowEmpty: true }).pipe(gulp.dest(outputDir));
};
finalizeCssTask.displayName = "finalize:css:run";

const finalizeCss = gulp.series(logStart, finalizeCssTask, logEnd);

finalizeCss.displayName = "finalize:css";

module.exports = finalizeCss;
