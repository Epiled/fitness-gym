// ← task to clear temp CSS directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.css.temp.replace(/\\/g, "/");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning temp CSS directory...");
  log.verbose(`→ Cleaning: ${tempDir}`);
  cb();
}
logStart.displayName = "clean:temp:css:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning temp CSS directory! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:temp:css:log:end";

function cleanTempCSSTask() {
  return gulp.src(tempDir, { read: false, allowEmpty: true }).pipe(clean());
}
cleanTempCSSTask.displayName = "clean:temp:css:run";

const cleanTempCSS = gulp.series(logStart, cleanTempCSSTask, logEnd);

cleanTempCSS.displayName = "clean:temp:css";
cleanTempCSS.description = "Clean (delete) temp CSS directory.";
cleanTempCSS.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanTempCSS.displayName, cleanTempCSS);

module.exports = { cleanTempCSS };
