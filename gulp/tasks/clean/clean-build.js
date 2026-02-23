// ← task to build clean dist and temp directories.

const gulp = require("gulp");

const { cleanDist } = require("./clean-dist");
const { cleanTempHtml } = require("./clean-temp-html");
const { cleanTempCss } = require("./clean-temp-css");
const { cleanTempJs } = require("./clean-temp-js");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start cleaning build directories...");
  cb();
}
logStart.displayName = "clean:log:start";

function logEnd(cb) {
  log.success(`Finished cleaning build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "clean:log:end";

const cleanBuild = gulp.series(
  logStart,
  cleanDist,
  cleanTempHtml,
  cleanTempCss,
  cleanTempJs,
  logEnd,
);

cleanBuild.displayName = "clean:build";
cleanBuild.description = "Clean (delete) build directories (dist and temp).";
cleanBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(cleanBuild.displayName, cleanBuild);

module.exports = { cleanBuild };
