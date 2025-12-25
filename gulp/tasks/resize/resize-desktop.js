// ← tasks to transform images size to desktop size

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
  log.info("Start resize to desktop size...");
  log.verbose(`→ Source: ${ctx.paths.images.src}`);
  log.verbose(`→ Output directory: ${ctx.paths.images.desktop}`);
  log.verbose("→ Format: 1920x1080 (png)");
  cb();
}
logStart.displayName = "resize:desktop:log:start";

function logEnd(cb) {
  log.success(
    `Finished resize to desktop size! ${timer.end()} → ${ctx.paths.images.desktop}`,
  );
  cb();
}
logEnd.displayName = "resize:desktop:log:end";

function resizeDesktopTask() {
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
            width: 1920,
            height: 1080,
            format: "png",
          },
        ],
      }),
    )
    .pipe(gulp.dest(ctx.paths.images.desktop))
    .on("error", (err) => {
      log.error(`Resize images to desktop failed: ${err.message}`);
      throw err;
    });
}
resizeDesktopTask.displayName = "resize:desktop:run";

const resizeDesktop = gulp.series(logStart, resizeDesktopTask, logEnd);

resizeDesktop.displayName = "resize:desktop";
resizeDesktop.description =
  "Resize source images to 1920x1080 for desktop output.";
resizeDesktop.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(resizeDesktop.displayName, resizeDesktop);

module.exports = { resizeDesktop };
