// ← task to clear temp CSS directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.css.temp.staging;

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

function cleanTempCssTask() {
  if (!tempDir || tempDir === "." || tempDir === "/" || tempDir.length < 3) {
    log.error(`Refusing to clean suspicious path: "${tempDir}"`);
    return Promise.resolve();
  }

  return gulp.src(tempDir, { read: false, allowEmpty: true }).pipe(clean());
}
cleanTempCssTask.displayName = "clean:temp:css:run";

const cleanTempCss = gulp.series(logStart, cleanTempCssTask, logEnd);

cleanTempCss.displayName = "clean:temp:css";
cleanTempCss.description = "Clean (delete) temp CSS directory.";
cleanTempCss.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanTempCss.displayName, cleanTempCss);

module.exports = { cleanTempCss };
