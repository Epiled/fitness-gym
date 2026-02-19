// ← task to build HTML.

const gulp = require("gulp");

const { htmlReplaceCSS } = require("./html-replace-css");
const { htmlTransformImages } = require("./html-transform-images");
const { htmlInjectCriticalCSS } = require("./html-inject-critical-css");
const { htmlInjectCriticalJS } = require("./html-inject-critical-js");
const { htmlMinify } = require("./html-minify");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.paths.html.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start HTML build...");
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Pipeline: htmlReplaceCSS → htmlTransformImages → htmlMinify");
  cb();
}
logStart.displayName = "html:build:log:start";

function logEnd(cb) {
  log.success(`Finished HTML build! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "html:build:log:end";

const htmlBuild = gulp.series(
  logStart,
  htmlTransformImages,
  htmlReplaceCSS,
  htmlInjectCriticalCSS,
  htmlInjectCriticalJS,
  htmlMinify,
  logEnd,
);

htmlBuild.displayName = "html:build";
htmlBuild.description =
  "Build HTML files by replacing CSS links and transforming images, then output to the dist directory.";
htmlBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(htmlBuild.displayName, htmlBuild);

module.exports = { htmlBuild };
