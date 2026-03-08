// ← task to build clean dist and temp directories.

const gulp = require("gulp");

const { cleanDist } = require("./clean-dist");
const { cleanTemp } = require("./clean-temp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const targetDir = [ctx.paths.dist, ctx.paths.temp];

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning build directories...");
  log.verbose(`→ Cleaning: ${targetDir[0]}, ${targetDir[1]}`);
  cb();
}
logStart.displayName = "clean:build:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:build:log:end";

const cleanBuild = gulp.series(logStart, cleanDist, cleanTemp, logEnd);

cleanBuild.displayName = "clean:build";
cleanBuild.description = "Clean (delete) build directories (dist and temp).";
cleanBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanBuild.displayName, cleanBuild);

module.exports = { cleanBuild };
