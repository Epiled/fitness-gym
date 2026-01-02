// ← task to clear dist and temp directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const targetDir = ctx.paths.dist;
const tempDir = ctx.paths.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning build directories...");
  log.verbose(`→ Cleaning: ${targetDir}, ${tempDir}`);
  cb();
}
logStart.displayName = "clean:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:log:end";

function cleanTask() {
  if (!tempDir || tempDir === "." || tempDir === "/" || tempDir.length < 3) {
    log.error(`Refusing to clean suspicious path: "${tempDir}"`);
    return Promise.resolve();
  }

  return gulp
    .src([targetDir, tempDir], { read: false, allowEmpty: true })
    .pipe(clean());
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
