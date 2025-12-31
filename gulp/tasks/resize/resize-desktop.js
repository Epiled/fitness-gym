// ← tasks to transform images size to desktop size.

const gulp = require("gulp");
const sharpResponsive = require("gulp-sharp-responsive");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.images.glob;
const srcDir = ctx.paths.images.dir;

const outputDir = ctx.paths.images.dist.desktop;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize to desktop size...");
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Format: 1920x1080 (webp)");
  cb();
}
logStart.displayName = "resize:desktop:log:start";

function logEnd(cb) {
  log.success(`Finished resize to desktop size! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "resize:desktop:log:end";

function resizeDesktopTask() {
  if (!fileExists(srcDir)) {
    log.warn(`Source directory not found: ${srcDir}`);
    return Promise.resolve();
  }

  return gulp
    .src(srcGlob, { allowEmpty: true })
    .pipe(
      sharpResponsive({
        formats: [
          {
            width: 1920,
            height: 1080,
            format: "webp",
            quality: 80,
          },
        ],
      }),
    )
    .pipe(gulp.dest(outputDir));
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
