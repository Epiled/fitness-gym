// ← task to optimize SVGs.

const gulp = require("gulp");
const svgo = require("gulp-svgo");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.isDebug ? ctx.paths.icons.dist : ctx.paths.icons.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start optimizing SVGs!`);
  log.verbose(`→ Source: ${ctx.paths.icons.src}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "icons:start";

function logEnd(cb) {
  log.success(`Finished optimizing SVGs! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "icons:end";

function iconsOptimizeTask() {
  return gulp
    .src(ctx.paths.icons.src, { allowEmpty: true })
    .pipe(
      svgo({
        plugins: [
          { name: "removeDimensions", active: true },
          { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
        ],
      }),
    )
    .pipe(gulp.dest(outputDir));
}
iconsOptimizeTask.displayName = "icons:optimize:run";

const iconsOptimize = gulp.series(logStart, iconsOptimizeTask, logEnd);

iconsOptimize.displayName = "icons:optimize";
iconsOptimize.description = "Optimize SVG icons before iconfont generation.";
iconsOptimize.flags = {
  "--debug": "Write outputs to the temp directory instead of dist.",
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(iconsOptimize.displayName, iconsOptimize);

module.exports = { iconsOptimize };
