// ← tasks to minify CSS.

const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const path = require("path");

const paths = require("../../paths");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const baseDir = ctx.isDebug ? "src/css" : "temp/css";
const label = ctx.isDebug ? "source files" : "bundle";
const bundlePath = path.join(paths.css.temp, "bundle.css");
const inputPath = ctx.isDebug ? paths.css.src : bundlePath;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start CSS minification from ${label}...`);
  log.verbose(`→ Source: ${inputPath}`);
  log.verbose(`→ Output directory: ${paths.css.dist}`);
  cb();
}
logStart.displayName = "css:minify:log:start";

function logEnd(cb) {
  log.success(
    `Finished CSS minification! → ${timer.end()} → ${paths.css.dist}`,
  );
  cb();
}
logEnd.displayName = "css:minify:log:end";

function minifyTask() {
  if (!ctx.isDebug && !fileExists(bundlePath)) {
    log.warn(
      `Bundle file not found at ${bundlePath}. Please run 'css:concat' first or use the '--debug' flag to minify directly from source files.`,
    );
    return Promise.resolve();
  }

  return gulp
    .src(inputPath, { allowEmpty: true, base: baseDir })
    .pipe(cleanCSS({ compatibility: "ie8", level: 2 }))
    .pipe(gulp.dest(paths.css.dist, { relative: false }))
    .on("error", (err) => {
      log.error(`CSS minification failed: ${err.message}`);
      throw err;
    });
}
minifyTask.displayName = "css:minify:run";

const cssMinify = gulp.series(logStart, minifyTask, logEnd);

cssMinify.displayName = "css:minify";
cssMinify.description =
  "Minify CSS files and output/saves to the dist directory/folder.";
cssMinify.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Run task in isolation using source files instead of temp bundle.",
};

gulp.task(cssMinify.displayName, cssMinify);

module.exports = { cssMinify };
