// ← task to minify HTML.

const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const baseDir = ctx.isDebug ? ctx.paths.src : ctx.paths.html.temp;
const label = ctx.isDebug ? "source files" : "transformed files";
const tempHtmlGlob = path.join(ctx.paths.html.temp, "**/*.html");
const inputPath = ctx.isDebug ? ctx.paths.html.src : tempHtmlGlob;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start HTML minification from ${label}...`);
  log.verbose(`→ Source: ${inputPath}`);
  log.verbose(`→ Output directory: ${ctx.paths.html.dist}`);
  cb();
}
logStart.displayName = "html:minify:log:start";

function logEnd(cb) {
  log.success(
    `Finished HTML minification! → ${timer.end()} → ${ctx.paths.html.dist}`,
  );
  cb();
}
logEnd.displayName = "html:minify:log:end";

function minifyTask() {
  if (!ctx.isDebug && !fileExists(path.join(ctx.paths.html.temp))) {
    log.warn(
      `Transformed HTML files not found at ${ctx.paths.html.temp}. Please run 'html:replace:css' or 'html:transform:images' first, or use the '--debug' flag to minify directly from source files.`,
    );
    return Promise.resolve();
  }
  return gulp
    .src(inputPath, { allowEmpty: true, base: baseDir })
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      }),
    )
    .pipe(gulp.dest(ctx.paths.html.dist, { relative: false }))
    .on("error", (err) => {
      log.error(`HTML minification failed: ${err.message}`);
      throw err;
    });
}
minifyTask.displayName = "html:minify:run";

const htmlMinify = gulp.series(logStart, minifyTask, logEnd);

htmlMinify.displayName = "html:minify";
htmlMinify.description =
  "Minifies HTML files from source or transformed files to the distribution directory.";
htmlMinify.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Minify HTML directly from source files instead of transformed files.",
};

gulp.task(htmlMinify.displayName, htmlMinify);

module.exports = {
  htmlMinify,
};
