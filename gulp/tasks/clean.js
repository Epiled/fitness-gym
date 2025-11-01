// ← task to clear dist directory

const gulp = require("gulp");
const clean = require("gulp-clean");

const paths = require("../paths");

const { log } = require("../utils/log");
const { startTimer } = require("../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start cleaning dist directory`);
  log.verbose(`→ Cleaning: ${paths.dist}`);
  cb();
}
logStart.displayName = "clean:start";

function logEnd(cb) {
  log.success(
    `Finished cleaning dist directory! ${timer.end()} → ${paths.dist}`,
  );
  cb();
}
logEnd.displayName = "clean:end";

function cleanTask() {
  return gulp
    .src([paths.dist], { read: false, allowEmpty: true })
    .pipe(clean())
    .on("error", (err) => {
      log.error(`Cleaning dist directory failed: ${err.message}`);
      throw err;
    });
}
cleanTask.displayName = "clean:run";

const cleanDefault = gulp.series(logStart, cleanTask, logEnd);

cleanDefault.displayName = "clean";
cleanDefault.description = "Clean (delete) the dist directory.";
cleanDefault.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanDefault.displayName, cleanDefault);

module.exports = { cleanDefault };
