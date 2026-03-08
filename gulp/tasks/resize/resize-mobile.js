// ← tasks to transform images size to mobile size.

const gulp = require("gulp");
const sharpResponsive = require("gulp-sharp-responsive");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.images.glob;
const srcDir = ctx.paths.images.dir;

const outputDir = ctx.paths.images.dist.mobile;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize to mobile size...");
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Format: 390x260 (webp)");
  cb();
}
logStart.displayName = "resize:mobile:log:start";

function logEnd(cb) {
  log.success(`Finished resize to mobile size! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "resize:mobile:log:end";

function resizeMobileTask() {
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
            width: 390,
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
resizeMobileTask.displayName = "resize:mobile:run";

const resizeMobile = gulp.series(logStart, resizeMobileTask, logEnd);

resizeMobile.displayName = "resize:mobile";
resizeMobile.description = "Resize source images to 390x260 for mobile output.";
resizeMobile.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(resizeMobile.displayName, resizeMobile);

module.exports = { resizeMobile };
