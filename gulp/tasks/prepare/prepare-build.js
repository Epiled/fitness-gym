// ← task to prepare build directories.

const gulp = require("gulp");

const { prepareHtml } = require("./prepare-html");
const { prepareCss } = require("./prepare-css");
const { prepareJs } = require("./prepare-js");
// const { prepareResize } = require("./prepare-resize");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start preparing build directories...");
  cb();
}
logStart.displayName = "prepare:build:log:start";

function logEnd(cb) {
  log.success(`Finished preparing build directories! ${timer.end()}`);
  cb();
}
logEnd.displayName = "prepare:build:log:end";

const prepareBuild = gulp.series(
  logStart,
  prepareHtml,
  prepareCss,
  prepareJs,
  logEnd,
);

prepareBuild.displayName = "prepare:build";
prepareBuild.description =
  "Prepare build directories for the production build.";
prepareBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(prepareBuild.displayName, prepareBuild);

module.exports = { prepareBuild };
