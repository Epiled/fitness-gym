// ← task to finalize HTML output.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const tempDir = ctx.paths.html.temp.artifacts.gen.dir;
const tempGlob = ctx.paths.html.temp.artifacts.gen.glob;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start HTML finalization...");
  cb();
}
logStart.displayName = "finalize:html:log:start";

function logEnd(cb) {
  log.success(`Finished HTML finalization! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "finalize:html:log:end";

const finalizeHtmlTask = function () {
  return gulp
    .src(tempGlob, { allowEmpty: true, base: baseDir })
    .pipe(gulp.dest(outputDir));
};
finalizeHtmlTask.displayName = "finalize:html:run";

const finalizeHtml = gulp.series(logStart, finalizeHtmlTask, logEnd);

finalizeHtml.displayName = "finalize:html";
finalizeHtml.description = "";
finalizeHtml.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
};

gulp.task(finalizeHtml.displayName, finalizeHtml);

module.exports = { finalizeHtml };
