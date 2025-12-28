// ← task to clear temp HTML directory.

const gulp = require("gulp");
const clean = require("gulp-clean");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning temp HTML directory...");
  log.verbose(`→ Cleaning: ${ctx.paths.temp.html}`);
  cb();
}
logStart.displayName = "clean:temp:html:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning temp HTML directory! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:temp:html:log:end";

function cleanTempHTMLTask() {
  return gulp
    .src(ctx.paths.temp.html, { read: false, allowEmpty: true })
    .pipe(clean())
    .on("error", (err) => {
      log.error(`Cleaning temp HTML directory failed: ${err.message}`);
      throw err;
    });
}
cleanTempHTMLTask.displayName = "clean:temp:html:run";

const cleanTempHTML = gulp.series(logStart, cleanTempHTMLTask, logEnd);

cleanTempHTML.displayName = "clean:temp:html";
cleanTempHTML.description = "Clean (delete) temp HTML directory.";
cleanTempHTML.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanTempHTML.displayName, cleanTempHTML);

module.exports = { cleanTempHTML };
