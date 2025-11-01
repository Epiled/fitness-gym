// ← tasks to minify css.

const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const fs = require("fs");
const path = require("path");

const paths = require("../../paths");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const useSrcFlag = process.argv.includes("--src");

const label = useSrcFlag ? "source files" : "bundle";
const bundlePath = path.join(paths.css.temp, "bundle.css");
const inputPath = useSrcFlag ? paths.css.src : bundlePath;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start CSS minification from ${label}...`);
  log.verbose(`→ Source: ${inputPath}`);
  log.verbose(`→ Output directory: ${paths.css.dist}`);
  cb();
}
logStart.displayName = "css:concat:log:start";

function logEnd(cb) {
  log.success(
    `Finished CSS minification! → ${timer.end()} → ${paths.css.dist}`,
  );
  cb();
}
logEnd.displayName = "css:concat:log:end";

function minifyTask() {
  if (!useSrcFlag && !fs.existsSync(bundlePath)) {
    log.warn(
      `Bundle file not found at ${bundlePath}. Please run 'css:concat' first or use the '--src' flag to minify directly from source files.`,
    );
    return Promise.resolve();
  }

  return gulp
    .src(inputPath, { allowEmpty: true })
    .pipe(cleanCSS({ compatibility: "ie8", level: 2 }))
    .pipe(gulp.dest(paths.css.dist))
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
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--src": "Minify directly from the source files instead of temp.",
};

gulp.task(cssMinify.displayName, cssMinify);

module.exports = { cssMinify };
