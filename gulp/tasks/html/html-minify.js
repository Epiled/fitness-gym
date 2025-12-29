// ← task to minify HTML.

const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const tempDir = ctx.paths.html.temp;
const tempGlob = `${tempDir}/**/*.html`;

const inputPath = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;
const label = ctx.isDebug ? "source files" : "transformed files";

const outputDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start HTML minification from ${label}...`);
  log.verbose(`→ Source glob: ${inputPath}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:minify:log:start";

function logEnd(cb) {
  log.success(`Finished HTML minification! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "html:minify:log:end";

function minifyTask() {
  if (!ctx.isDebug && !fileExists(tempDir)) {
    log.warn(
      `Transformed HTML files not found at ${tempDir}. Please run 'html:replace:css' or 'html:transform:images' or use the 'debug' flag to minify directly from source files.`,
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
        removeEmptyAttributes: false,
        minifyCSS: true,
        minifyJS: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      }),
    )
    .pipe(gulp.dest(outputDir));
}
minifyTask.displayName = "html:minify:run";

const htmlMinify = gulp.series(logStart, minifyTask, logEnd);

htmlMinify.displayName = "html:minify";
htmlMinify.description =
  "Minify HTML files and output to the distribution directory.";
htmlMinify.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Outputs minified HTML files directly to the distribution directory instead of a temporary location.",
};

gulp.task(htmlMinify.displayName, htmlMinify);

module.exports = { htmlMinify };
