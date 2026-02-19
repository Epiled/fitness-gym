// ← task to clear temp HTML directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.html.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning temp HTML directory...");
  log.verbose(`→ Cleaning: ${tempDir}`);
  cb();
}
logStart.displayName = "clean:temp:html:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning temp HTML directory! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:temp:html:log:end";

function cleanTempHtmlTask() {
  if (!tempDir || tempDir === "." || tempDir === "/" || tempDir.length < 3) {
    log.error(`Refusing to clean suspicious path: "${tempDir}"`);
    return Promise.resolve();
  }

  return gulp.src(tempDir, { read: false, allowEmpty: true }).pipe(clean());
}
cleanTempHtmlTask.displayName = "clean:temp:html:run";

const cleanTempHtml = gulp.series(logStart, cleanTempHtmlTask, logEnd);

cleanTempHtml.displayName = "clean:temp:html";
cleanTempHtml.description = "Clean (delete) temp HTML directory.";
cleanTempHtml.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanTempHtml.displayName, cleanTempHtml);

module.exports = { cleanTempHtml };
