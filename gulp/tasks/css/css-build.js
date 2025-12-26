// ← task to build CSS.

const gulp = require("gulp");

const { cssConcat } = require("./css-concat");
const { cssMinify } = require("./css-minify");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start CSS build...");
  log.verbose(`→ Output directory: ${ctx.paths.css.dist}`);
  log.verbose("→ Pipeline: concat → minify");
  cb();
}
logStart.displayName = "css:build:log:start";

function logEnd(cb) {
  log.success(`Finished CSS build! ${timer.end()} → ${ctx.paths.css.dist}`);
  cb();
}
logEnd.displayName = "css:log:end";

const cssBuild = gulp.series(logStart, cssConcat, cssMinify, logEnd);

cssBuild.displayName = "css:build";
cssBuild.description =
  "Build CSS (concat + minify) and write output/save to dist directory/folder.";
cssBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
};

gulp.task(cssBuild.displayName, cssBuild);

module.exports = { cssBuild };
