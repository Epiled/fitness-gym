// ← task to clear dist and temp directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const targetDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning build directories...");
  log.verbose(`→ Cleaning: ${targetDir}`);
  cb();
}
logStart.displayName = "clean:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:log:end";

function cleanDistTask() {
  if (!tempDir || tempDir === "." || tempDir === "/" || tempDir.length < 3) {
    log.error(`Refusing to clean suspicious path: "${tempDir}"`);
    return Promise.resolve();
  }

  return gulp.src(targetDir, { read: false, allowEmpty: true }).pipe(clean());
}
cleanDistTask.displayName = "clean:run";

const cleanDist = gulp.series(logStart, cleanDistTask, logEnd);

cleanDist.displayName = "clean";
cleanDist.description = "Clean (delete) build directories (dist and temp).";
cleanDist.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanDist.displayName, cleanDist);

module.exports = { cleanDist };
