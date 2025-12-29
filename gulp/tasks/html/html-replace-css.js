// ← tasks to replace links CSS.

const gulp = require("gulp");
const replace = require("gulp-replace");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const outputDir = ctx.isDebug ? ctx.paths.dist : ctx.paths.html.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start replace links CSS from source files...");
  log.verbose(`→ Source glob: ${srcGlob}`);
  log.verbose(`→ Source dir: ${srcDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:replace:css:log:start";

function logEnd(cb) {
  log.success(`Finished replace CSS links! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "html:replace:css:log:end";

function htmlReplaceCSSTask() {
  return gulp
    .src(srcGlob, { allowEmpty: true, base: srcDir })
    .pipe(
      replace(
        /<!-- build -->([\s\S]*?)<!-- endBuild -->/g,
        '<link rel="stylesheet" href="./css/bundle.css" />',
      ),
    )
    .pipe(gulp.dest(outputDir));
}
htmlReplaceCSSTask.displayName = "html:replace:css:run";

const htmlReplaceCSS = gulp.series(logStart, htmlReplaceCSSTask, logEnd);

htmlReplaceCSS.displayName = "html:replace:css";
htmlReplaceCSS.description =
  "Replace build markers in HTML with a single bundled CSS link.";
htmlReplaceCSS.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Outputs replaced HTML files directly to the distribution directory instead of a temporary location.",
};

gulp.task(htmlReplaceCSS.displayName, htmlReplaceCSS);

module.exports = { htmlReplaceCSS };
