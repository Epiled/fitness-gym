// ← tasks to concat CSS.

const gulp = require("gulp");
const concatCSS = require("gulp-concat-css");
const path = require("path");

const paths = require("../../paths");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.isDebug ? paths.css.dist : paths.css.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start CSS concatenation from source files...");
  log.verbose(`→ Source: ${paths.css.src}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "css:concat:log:start";

function logEnd(cb) {
  log.success(`Finished CSS concatenation! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "css:concat:log:end";

function concatTask() {
  const srcDir = path.dirname(paths.css.src);

  if (!fileExists(srcDir)) {
    log.warn(`Source CSS directory not found at ${srcDir}.`);
    return Promise.resolve();
  }

  return gulp
    .src(paths.css.src, { allowEmpty: true, base: srcDir })
    .pipe(concatCSS("bundle.css"))
    .pipe(gulp.dest(outputDir))
    .on("error", (err) => {
      log.error(`CSS concatenation failed: ${err.message}`);
      // Propagate error to Gulp/CI
      throw err;
    });
}
concatTask.displayName = "css:concat:run";

const cssConcat = gulp.series(logStart, concatTask, logEnd);

cssConcat.displayName = "css:concat";
cssConcat.description =
  "Concatenate CSS files and saves output to dist or temp directory.";
cssConcat.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Concatenate directly into dist instead of temp.",
};

gulp.task(cssConcat.displayName, cssConcat);

module.exports = { cssConcat };
