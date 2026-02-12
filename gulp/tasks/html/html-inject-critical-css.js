// ← task to inject CSS critical inline

const gulp = require("gulp");
const replace = require("gulp-replace");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const tempDir = ctx.paths.css.temp;
const tempDirHTML = ctx.paths.html.temp;

const tempGlob = `${tempDirHTML}/**/*.html`;

const outputDir = ctx.isDebug ? ctx.paths.dist : ctx.paths.html.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start insert critical CSS inline from source files...");
  cb();
}
logStart.displayName = "html:inject:critical:css:log:start";

function logEnd(cb) {
  log.success(
    `Finished insert critical CSS inline! ${timer.end()} → ${outputDir}`,
  );
  cb();
}
logEnd.displayName = "html:inject:critical:css:log:end";

function htmlInjectCriticalCSSTask() {
  const criticalFile = fs
    .readFileSync(`${tempDir}/critical.css`, "utf8")
    .trim();
  log.info(criticalFile);

  return gulp
    .src(tempGlob, { allowEmpty: true })
    .pipe(
      replace(
        /<!-- build:css:critical -->([\s\S]*?)<!-- end:build -->/g,
        function handleReplace() {
          return criticalFile ? `<style>${criticalFile}</style>` : "";
        },
      ),
    )
    .pipe(gulp.dest(outputDir));
}
htmlInjectCriticalCSSTask.displayName = "html:inject:critical:css:run";

const htmlInjectCriticalCSS = gulp.series(
  logStart,
  htmlInjectCriticalCSSTask,
  logEnd,
);

htmlInjectCriticalCSS.displayName = "html:inject:critical:css";

gulp.task(htmlInjectCriticalCSS.displayName, htmlInjectCriticalCSS);

module.exports = { htmlInjectCriticalCSS };
