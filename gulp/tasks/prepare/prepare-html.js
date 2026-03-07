// ← task to prepare HTML files for production build.

const gulp = require("gulp");

const { startTimer } = require("../../utils/timer");
const { log } = require("../../utils/log");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.html.src;
const srcGlob = ctx.paths.html.glob;

const outputDir = ctx.paths.html.temp.staging;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start preparing HTML files...");
  log.verbose(`→ Source dir: ${srcDir}`);
  log.verbose(`→ Source glob: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "prepare:html:log:start";

function logEnd(cb) {
  log.success(`Finished preparing HTML files! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "prepare:html:log:end";

function prepareHtmlTask() {
  return gulp.src(srcGlob, { allowEmpty: true }).pipe(gulp.dest(outputDir));
}
prepareHtmlTask.displayName = "prepare:html:run";

const prepareHtml = gulp.series(logStart, prepareHtmlTask, logEnd);

prepareHtml.displayName = "prepare:html";
prepareHtml.description =
  "Prepare HTML files for production build by copying them to a temporary directory.";
prepareHtml.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(prepareHtml.displayName, prepareHtml);

module.exports = { prepareHtml };
