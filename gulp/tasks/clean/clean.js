// ← task to clear dist and temp directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning build directories...");
  log.verbose(`→ Cleaning: ${ctx.paths.dist}, ${ctx.paths.temp}`);
  cb();
}
logStart.displayName = "clean:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:log:end";

function cleanTask() {
  return gulp
    .src([ctx.paths.dist, ctx.paths.temp], { read: false, allowEmpty: true })
    .pipe(clean())
    .on("error", (err) => {
      log.error(`Cleaning build directories failed: ${err.message}`);
      throw err;
    });
}
cleanTask.displayName = "clean:run";

const cleanDefault = gulp.series(logStart, cleanTask, logEnd);

cleanDefault.displayName = "clean";
cleanDefault.description = "Clean (delete) build directories (dist and temp).";
cleanDefault.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanDefault.displayName, cleanDefault);

module.exports = { cleanDefault };
