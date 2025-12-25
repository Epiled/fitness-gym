// ← tasks to transform images size to tablet size

const gulp = require("gulp");
const sharpResponsive = require("gulp-sharp-responsive");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize to tablet size...");
  log.verbose(`→ Source: ${ctx.paths.images.src}`);
  log.verbose(`→ Output directory: ${ctx.paths.images.tablet}`);
  log.verbose("→ Format: 840x560 (png)");
  cb();
}
logStart.displayName = "resize:tablet:log:start";

function logEnd(cb) {
  log.success(
    `Finished resize to tablet size! ${timer.end()} → ${ctx.paths.images.tablet}`,
  );
  cb();
}
logEnd.displayName = "resize:tablet:log:end";

function resizeTabletTask() {
  const srcDir = path.dirname(ctx.paths.images.src);

  if (!fileExists(srcDir)) {
    log.warn(`Source directory not found: ${srcDir}`);
    return Promise.resolve();
  }

  return gulp
    .src(ctx.paths.images.src)
    .pipe(
      sharpResponsive({
        formats: [
          {
            width: 840,
            height: 560,
            format: "png",
          },
        ],
      }),
    )
    .pipe(gulp.dest(ctx.paths.images.tablet))
    .on("error", (err) => {
      log.error(`Resize images to tablet failed: ${err.message}`);
      throw err;
    });
}
resizeTabletTask.displayName = "resize:tablet:run";

const resizeTablet = gulp.series(logStart, resizeTabletTask, logEnd);

resizeTablet.displayName = "resize:tablet";
resizeTablet.description = "Resize source images to 840x560 for tablet output.";
resizeTablet.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(resizeTablet.displayName, resizeTablet);

module.exports = { resizeTablet };
