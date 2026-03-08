// ← tasks to transform images size to tablet size.

const gulp = require("gulp");
const sharpResponsive = require("gulp-sharp-responsive");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.images.glob;
const srcDir = ctx.paths.images.dir;

const outputDir = ctx.paths.images.dist.tablet;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize to tablet size...");
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Format: 840x560 (webp)");
  cb();
}
logStart.displayName = "resize:tablet:log:start";

function logEnd(cb) {
  log.success(`Finished resize to tablet size! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "resize:tablet:log:end";

function resizeTabletTask() {
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
            width: 840,
            format: "webp",
            webpOptions: {
              quality: 75,
              effort: 6,
            },
          },
        ],
      }),
    )
    .pipe(gulp.dest(outputDir));
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
