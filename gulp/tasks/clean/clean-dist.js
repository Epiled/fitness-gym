// ← task to clear dist and temp directory.

const gulp = require("gulp");

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
logStart.displayName = "clean:dist:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:dist:log:end";

async function cleanDistTask() {
  const { deleteAsync } = await import("del");

  if (
    !targetDir ||
    targetDir === "." ||
    targetDir === "/" ||
    targetDir.length < 3
  ) {
    log.error(`Refusing to clean suspicious path: "${targetDir}"`);
    return;
  }

  await deleteAsync(targetDir, { force: true });
}
cleanDistTask.displayName = "clean:dist:run";

const cleanDist = gulp.series(logStart, cleanDistTask, logEnd);

cleanDist.displayName = "clean:dist";
cleanDist.description = "Clean (delete) build directories (dist and temp).";
cleanDist.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanDist.displayName, cleanDist);

module.exports = { cleanDist };
