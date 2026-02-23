// ← task to prepare JS files for production build.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.js.src;
const srcGlob = ctx.paths.js.glob;

const outputDir = ctx.paths.js.temp.staging;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start preparing JS files...");
  log.verbose(`→ Source dir: ${srcDir}`);
  log.verbose(`→ Source glob: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "prepare:js:log:start";

function logEnd(cb) {
  log.success(`Finished preparing JS files! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "prepare:js:log:end";

function prepareJsTask() {
  return gulp.src(srcGlob, { allowEmpty: true }).pipe(gulp.dest(outputDir));
}
prepareJsTask.displayName = "prepare:js:run";

const prepareJs = gulp.series(logStart, prepareJsTask, logEnd);

prepareJs.displayName = "prepare:js";
prepareJs.description =
  "Prepare JavaScript files for production build by copying them to a temporary directory.";
prepareJs.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(prepareJs.displayName, prepareJs);

module.exports = { prepareJs };
