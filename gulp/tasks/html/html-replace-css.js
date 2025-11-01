// ← tasks to replace links CSS.

const gulp = require("gulp");
const replace = require("gulp-replace");

const paths = require("../../paths");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start replace links CSS`);
  log.verbose(`→ Source: ${paths.html.src}`);
  log.verbose(`→ Output directory: ${paths.html.dist}`);
  cb();
}
logStart.displayName = "html:replace:css:start";

function logEnd(cb) {
  log.success(
    `Finished replace CSS links! ${timer.end()} → ${paths.html.dist}`,
  );
  cb();
}
logEnd.displayName = "html:replace:css:end";

function htmlReplaceCSSTask() {
  return gulp
    .src(paths.html.src)
    .pipe(
      replace(
        /<!-- build -->([\s\S]*?)<!-- endBuild -->/g,
        '<link rel="stylesheet" href="./css/bundle.css" />',
      ),
    )
    .pipe(gulp.dest(paths.html.dist))
    .on("error", (err) => {
      log.error(`Replace CSS links failed: ${err.message}`);
      throw err;
    });
}
htmlReplaceCSSTask.displayName = "html:replace:css:run";

const htmlReplaceCSS = gulp.series(logStart, htmlReplaceCSSTask, logEnd);

htmlReplaceCSS.displayName = "html:replace:css";
htmlReplaceCSS.description =
  "Replace build markers in HTML with a single bundled CSS link.";
htmlReplaceCSS.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(htmlReplaceCSS.displayName, htmlReplaceCSS);

module.exports = { htmlReplaceCSS };
