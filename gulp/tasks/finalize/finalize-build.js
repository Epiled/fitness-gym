// ← task to finalize build output.

const gulp = require("gulp");

const { finalizeHtml } = require("./finalize-html");
const { finalizeCss } = require("./finalize-css");
const { finalizeJs } = require("./finalize-js");

const { log } = require("../../utils/log");

const { startTimer } = require("../../utils/timer");
const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start build finalization...");
  cb();
}
logStart.displayName = "finalize:build:log:start";

function logEnd(cb) {
  log.success(`Finished build finalization! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "finalize:build:log:end";

const finalizeBuild = gulp.series(
  logStart,
  finalizeHtml,
  finalizeCss,
  finalizeJs,
  logEnd,
);

finalizeBuild.displayName = "finalize:build";
finalizeBuild.description = "";
finalizeBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
};

gulp.task(finalizeBuild.displayName, finalizeBuild);

module.exports = { finalizeBuild };
