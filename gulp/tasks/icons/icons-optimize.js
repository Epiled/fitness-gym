// ← task

const gulp = require("gulp");
const svgo = require("gulp-svgo");

const paths = require("../../paths");
const config = require("../../config");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Generating webfont: ${config.fontName}`);
  log.verbose(`→ Source: ${paths.icons.src}`);
  log.verbose(`→ Target: ${targetPath}`);
  log.verbose(`→ Output directory: ${paths.icons.dist}`);
  cb();
}
logStart.displayName = "icons:start";

function logEnd(cb) {
  log.success(
    `Finished generating webfont: ${config.fontName} (${timer.end()}) → ${paths.icons.dist}`,
  );
  log.info(`→ Total icons generate: ${glyphCount}`);
  log.info(`→ Preview generate: ${previewPath}`);
  cb();
}
logEnd.displayName = "icons:end";

function iconsOptimizeTask() {
  return gulp
    .src(paths.icons.src)
    .pipe(
      svgo({
        plugins: [
          { name: "removeDimensions", active: true },
          { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
        ],
      }),
    )
    .pipe(gulp.dest(paths.icons.temp));
}
iconsOptimizeTask.displayName = "icons-optimize:run";

const iconsOptimize = gulp.series(logStart, iconsOptimizeTask, logEnd);

iconsOptimize.displayName = "icons:font";
iconsOptimize.description = "Generate icon font file.";
iconsOptimize.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

module.exports = { iconsOptimize };
