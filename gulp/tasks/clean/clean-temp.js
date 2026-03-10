// ← task to clear temp directory.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning temp directory...");
  log.verbose(`→ Cleaning: ${tempDir}`);
  cb();
}
logStart.displayName = "clean:temp:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning temp directory! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:temp:log:end";

async function cleanTempTask() {
  const { deleteAsync } = await import("del");

  if (!tempDir || tempDir === "." || tempDir === "/" || tempDir.length < 3) {
    log.error(`Refusing to clean suspicious path: "${tempDir}"`);
    return;
  }

  await deleteAsync(tempDir, { force: true });
}
cleanTempTask.displayName = "clean:temp:run";

const cleanTemp = gulp.series(logStart, cleanTempTask, logEnd);

cleanTemp.displayName = "clean:temp";
cleanTemp.description = "Clean (delete) temp directory.";
cleanTemp.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanTemp.displayName, cleanTemp);

module.exports = { cleanTemp };
