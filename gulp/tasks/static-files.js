// ← task to copy static files to dist directory.

const gulp = require("gulp");

const { log } = require("../utils/log");
const { startTimer } = require("../utils/timer");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.src;

const outputDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start copy static files...");
  log.verbose(`→ Source: ${srcDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "static:files:log:start";

function logEnd(cb) {
  log.success(`Finished copying static files! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "static:files:log:end";

function staticFilesTask() {
  return gulp
    .src(
      [
        `${srcDir}/**/*`,

        // handled by html tasks
        `!${srcDir}/**/*.html`,

        // handled by html tasks
        `!${srcDir}/html/**/*`,
        `!${srcDir}/html/**`,

        // handled by css tasks
        `!${srcDir}/css/**/*`,
        `!${srcDir}/css/**`,

        // handled by js tasks
        `!${srcDir}/js/**/*`,
        `!${srcDir}/js/**`,

        // handled by icons pipeline (source SVGs)
        `!${srcDir}/assets/svg/icons-ui/**`,

        // handled by images pipeline
        `!${srcDir}/assets/img/**`,
      ],
      { base: srcDir, allowEmpty: true },
    )
    .pipe(gulp.dest(outputDir));
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
