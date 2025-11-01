// ← task to build CSS.

const gulp = require("gulp");

const { cssConcat } = require("./css-concat");
const { cssMinify } = require("./css-minify");

const paths = require("../../paths");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start CSS build");
  log.verbose(`→ Output directory: ${paths.css.dist}`);
  log.verbose("→ Pipeline: concat → minify");
  cb();
}
logStart.displayName = "css:log:start";

function logEnd(cb) {
  log.success(`Finished CSS build! ${timer.end()} → ${paths.css.dist}`);
  cb();
}
logEnd.displayName = "css:log:end";

const cssBuild = gulp.series(logStart, cssConcat, cssMinify, logEnd);

cssBuild.displayName = "css:build";
cssBuild.description =
  "Build CSS (concat + minify) and write output/save to dist directory/folder.";
cssBuild.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--src": "Build directly from the source files instead of temp.",
};

gulp.task(cssBuild.displayName, cssBuild);

module.exports = { cssBuild };
