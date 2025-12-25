// ← tasks to transform images size to mobile size

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
  log.info("Start resize to mobile size...");
  log.verbose(`→ Source: ${ctx.paths.images.src}`);
  log.verbose(`→ Output directory: ${ctx.paths.images.mobile}`);
  log.verbose("→ Format: 390x260 (png)");
  cb();
}
logStart.displayName = "resize:mobile:log:start";

function logEnd(cb) {
  log.success(
    `Finished resize to mobile size! ${timer.end()} → ${ctx.paths.images.mobile}`,
  );
  cb();
}
logEnd.displayName = "resize:mobile:log:end";

function resizeMobileTask() {
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
            width: 390,
            height: 260,
            format: "png",
          },
        ],
      }),
    )
    .pipe(gulp.dest(ctx.paths.images.mobile))
    .on("error", (err) => {
      log.error(`Resize images to mobile failed: ${err.message}`);
      throw err;
    });
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
