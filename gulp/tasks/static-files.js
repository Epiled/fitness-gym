// ← task to copy static files to dist directory.

const gulp = require("gulp");

const { log } = require("../utils/log");
const { startTimer } = require("../utils/timer");

function logStart(cb) {
  timer = startTimer();
  log.info("Start copy static files...");
  log.verbose(`→ Source: ${ctx.paths.src}`);
  log.verbose(`→ Output directory: ${ctx.paths.dist}`);
  cb();
}
logStart.displayName = "static:files:log:start";

function logEnd(cb) {
  log.success(
    `Finished copying static files! ${timer.end()} → ${ctx.paths.dist}`,
  );
  cb();
}
logEnd.displayName = "static:files:log:end";

function staticFilesTask() {
  return gulp
    .src([
      `${ctx.paths.src}/**/*`,

      // handled by html tasks
      `!${ctx.paths.src}/html/**/*`,

      // handled by css tasks
      `!${ctx.paths.src}/css/**/*`,

      // handled by icons pipeline (source SVGs)
      `!${ctx.paths.src}/assets/svg/icons-ui/**/*`,
    ])
    .pipe(gulp.dest(ctx.paths.dist));
}

const staticFiles = gulp.series(logStart, staticFilesTask, logEnd);

staticFiles.displayName = "static:files";
staticFiles.description = "Copy static files to the dist directory.";
staticFiles.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};
gulp.task(staticFiles.displayName, staticFiles);
module.exports = { staticFiles };
