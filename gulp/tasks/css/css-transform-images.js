// ← task to transform images in CSS (e.g., converting to WebP).

const gulp = require("gulp");
const replace = require("gulp-replace");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.css.glob;
const srcDir = ctx.paths.css.dir;

const tempDir = ctx.paths.css.temp;
const tempGlob = `${tempDir}/**/*.css`;

const inputPath = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;
const label = ctx.isDebug ? "source files" : "temp files";

const outputDir = ctx.isDebug ? ctx.paths.css.dist : ctx.paths.css.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start transform images in the CSS from ${label}...`);
  log.verbose(`→ Source glob: ${inputPath}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "css:transform:images:log:start";

function logEnd(cb) {
  log.success(
    `Finished transform images in the CSS! ${timer.end()} → ${outputDir}`,
  );
  cb();
}
logEnd.displayName = "css:transform:images:log:end";

function transformImagesTask() {
  return (
    gulp
      .src(inputPath, { allowEmpty: true, base: baseDir })

      // 1) jpg/png → webp
      .pipe(
        replace(
          /url\(\s*(['"]?)([^'")]+?)\.(jpe?g|png)(\?[^'")]+)?(#[^'")]+)?\1\s*\)/gi,
          "url($1$2.webp$4$5$1)",
        ),
      )

      // 2) @img <variant> → pasta
      .pipe(
        replace(
          /\/\*\s*@img\s+([^\s*]+)\s*\*\/\s*url\(\s*(['"]?)([^'")]*\/)?([^'")]+\.webp)(\?[^'")]+)?(#[^'")]+)?\2\s*\)/gi,
          "url($2$3$1/$4$5$6$2)",
        ),
      )

      // 3) remove comentário
      .pipe(replace(/\/\*\s*@img\s+[^\s*]+\s*\*\//gi, ""))

      .pipe(gulp.dest(outputDir))
  );
}

const cssTransformImages = gulp.series(logStart, transformImagesTask, logEnd);

cssTransformImages.displayName = "css:transform:images";

gulp.task(cssTransformImages.displayName, cssTransformImages);

module.exports = { cssTransformImages };
