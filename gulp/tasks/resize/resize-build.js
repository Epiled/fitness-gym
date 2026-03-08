// ← tasks to transform images size for build (mobile, tablet, desktop).

const gulp = require("gulp");

const { resizeCustom } = require("./resize-custom");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.images.glob;

const outputDir = ctx.paths.images.dist.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize images...");
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "resize:build:log:start";

function logEnd(cb) {
  log.success(`Finished resize images! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "resize:build:log:end";

const resizeBuild = gulp.parallel(logStart, resizeCustom, logEnd);

resizeBuild.displayName = "resize:build";
resizeBuild.description = "Resize source images for various devices.";
resizeBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(resizeBuild.displayName, resizeBuild);

module.exports = { resizeBuild };
