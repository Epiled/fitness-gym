// ← task to build HTML.

const gulp = require("gulp");

const { htmlTransformImages } = require("./html-transform-images");
const { htmlReplaceCss } = require("./html-replace-css");
const { htmlInjectCriticalCss } = require("./html-inject-critical-css");
const { htmlInjectCriticalJs } = require("./html-inject-critical-js");
const { htmlMinify } = require("./html-minify");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.isDebug
  ? ctx.paths.dist
  : ctx.paths.html.temp.artifacts.gen.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start HTML build...");
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose(
    "→ Pipeline: htmlTransformImages → htmlReplaceCSS → htmlInjectCriticalCss → htmlInjectCriticalJs → htmlMinify",
  );
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
  htmlReplaceCss,
  htmlInjectCriticalCss,
  htmlInjectCriticalJs,
  htmlMinify,
  logEnd,
);

htmlBuild.displayName = "html:build";
htmlBuild.description =
  "Build HTML files by replacing CSS links and transforming images, then output to the dist directory.";
htmlBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
};

gulp.task(htmlBuild.displayName, htmlBuild);

module.exports = { htmlBuild };
