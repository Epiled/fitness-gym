// ← task to inject CSS critical inline.

const gulp = require("gulp");
const replace = require("gulp-replace");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const genDir = ctx.paths.css.temp.artifacts.gen.dir;
const genGlob = ctx.paths.html.temp.artifacts.gen.glob;

const outputDir = ctx.isDebug
  ? ctx.paths.dist
  : ctx.paths.html.temp.artifacts.gen.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start insert critical CSS inline from source files...");
  log.verbose(`→ Source glob: ${genGlob}`);
  log.verbose(`→ Source dir: ${genDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
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

function htmlInjectCriticalCssTask() {
  if (!ctx.isDebug && !fileExists(genDir)) {
    log.warn(
      `Temporary directory "${genDir}" does not exist. Please run the "prepare:css", "manifest:css" and "css:concat" task first to generate the necessary files before transforming images.`,
    );
    return Promise.reject();
  }

  const criticalFile = fs.readFileSync(`${genDir}/critical.css`, "utf8").trim();

  return gulp
    .src(genGlob, { allowEmpty: true })
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
htmlInjectCriticalCssTask.displayName = "html:inject:critical:css:run";

const htmlInjectCriticalCss = gulp.series(
  logStart,
  htmlInjectCriticalCssTask,
  logEnd,
);

htmlInjectCriticalCss.displayName = "html:inject:critical:css";
htmlInjectCriticalCss.description =
  "Inject critical CSS inline into HTML files. It reads the generated critical CSS from the temporary directory and replaces the corresponding build block in the HTML with a <style> tag containing the critical CSS. This ensures that critical styles are loaded immediately for better performance.";
htmlInjectCriticalCss.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(htmlInjectCriticalCss.displayName, htmlInjectCriticalCss);

module.exports = { htmlInjectCriticalCss };
