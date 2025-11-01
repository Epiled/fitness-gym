// ← task to build HTML.

const gulp = require("gulp");

const paths = require("../../paths");

const { htmlReplaceCss } = require("./html-replace-css");
const { htmlTransformImages } = require("./html-transform-images");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start HTML build`);
  log.info(`→ Output directory: ${paths.html.dist}`);
  log.info(`→ Pipeline: htmlReplaceCss → htmlTransformImages`);
  cb();
}
logStart.displayName = "html:build:log:start";

function logEnd(cb) {
  log.success(`Finished HTML build! ${timer.end()} → ${paths.html.dist}`);
  cb();
}
logEnd.displayName = "html:build:log:end";

const htmlBuild = gulp.series(
  logStart,
  htmlReplaceCss,
  htmlTransformImages,
  logEnd,
);

htmlBuild.displayName = "html:build";
htmlBuild.description =
  "Build HTML files by replacing CSS links and transforming images, then output to the dist directory.";
htmlBuild.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(htmlBuild.displayName, htmlBuild);

module.exports = { htmlBuild };
