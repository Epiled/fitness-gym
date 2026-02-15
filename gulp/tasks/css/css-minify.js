// ← tasks to minify CSS.

const gulp = require("gulp");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.css.glob;
const srcDir = ctx.paths.css.dir;

const tempDir = ctx.paths.css.temp;
const tempGlob = `${tempDir}/**/*.css`;

const inputPath = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;
const label = ctx.isDebug ? "source files" : "temp files";

const outputDir = ctx.paths.css.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start CSS minification from ${label}...`);
  log.verbose(`→ Source glob: ${inputPath}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "css:minify:log:start";

function logEnd(cb) {
  log.success(`Finished CSS minification! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "css:minify:log:end";

function minifyTask() {
  if (!ctx.isDebug && !fileExists(tempDir)) {
    log.warn(
      `Bundle file not found at ${tempDir}. Please run 'css:concat' first or use the '--debug' flag to minify directly from source files.`,
    );
    return Promise.resolve();
  }

  return gulp
    .src(inputPath, { allowEmpty: true, base: baseDir })
    .pipe(
      postcss([
        cssnano({
          preset: "default",
        }),
      ]),
    )
    .pipe(gulp.dest(outputDir));
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
