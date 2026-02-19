// ← task to prepare CSS files for production build.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.css.src;

const outputDir = ctx.paths.css.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start preparing CSS files...");
  log.verbose(`→ Source dir: ${srcDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "prepare:css:log:start";

function logEnd(cb) {
  log.success(`Finished preparing CSS files! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "prepare:css:log:end";

function prepareCssTask() {
  return gulp.src(srcDir, { allowEmpty: true }).pipe(gulp.dest(outputDir));
}
prepareCssTask.displayName = "prepare:css:run";

const prepareCss = gulp.series(logStart, prepareCssTask, logEnd);

prepareCss.displayName = "prepare:css";
prepareCss.description =
  "Prepare CSS files for production build by copying them to a temporary directory.";
prepareCss.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(prepareCss.displayName, prepareCss);

module.exports = { prepareCss };
