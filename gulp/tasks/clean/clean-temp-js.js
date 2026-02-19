// ← task to clear temp JS directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.js.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning temp JS directory...");
  log.verbose(`→ Cleaning: ${tempDir}`);
  cb();
}
logStart.displayName = "clean:temp:js:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning temp JS directory! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:temp:js:log:end";

function cleanTempJsTask() {
  if (!tempDir || tempDir === "." || tempDir === "/" || tempDir.length < 3) {
    log.error(`Refusing to clean suspicious path: "${tempDir}"`);
    return Promise.resolve();
  }

  return gulp.src(tempDir, { read: false, allowEmpty: true }).pipe(clean());
}

const cleanTempJs = gulp.series(logStart, cleanTempJsTask, logEnd);

cleanTempJs.displayName = "clean:temp:js";
cleanTempJs.description = "Clean (delete) temp JS directory.";
cleanTempJs.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanTempJs.displayName, cleanTempJs);

module.exports = { cleanTempJs };
