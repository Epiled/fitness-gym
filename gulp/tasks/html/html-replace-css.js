// ← tasks to replace links CSS.

const gulp = require("gulp");
const replace = require("gulp-replace");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const tempGlob = ctx.paths.html.temp.artifacts.gen.glob;
const tempDir = ctx.paths.html.temp.artifacts.gen.dir;

const inputGlob = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.isDebug ? ctx.paths.dist : tempDir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start replace links CSS from source files...");
  log.verbose(`→ Source glob: ${inputGlob}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:replace:css:log:start";

function logEnd(cb) {
  log.success(`Finished replace CSS links! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "html:replace:css:log:end";

function htmlReplaceCssTask() {
  return gulp
    .src(inputGlob, { allowEmpty: true, base: baseDir })
    .pipe(
      replace(
        /<!--\s*build:css:([a-z0-9_-]+)\s*-->([\s\S]*?)<!--\s*end:build\s*-->/g,
        function handleReplace(match) {
          const fileName = match.match(/build:css:([a-z0-9_-]+)/)[1];

          if (fileName === "critical") {
            return `<!-- build:css:critical --> 
                <link rel="stylesheet" href="./css/${fileName}.css" />
              <!-- end:build -->
              `;
          } else {
            return [
              `<link rel='stylesheet' href='./css/${fileName}.css' media='print' onload='this.media="all"'>`,
              `<noscript><link rel="stylesheet" href="./css/${fileName}.css"></link></noscript>`,
            ].join("\n");
          }
        },
      ),
    )
    .pipe(gulp.dest(outputDir));
}
htmlReplaceCssTask.displayName = "html:replace:css:run";

const htmlReplaceCss = gulp.series(logStart, htmlReplaceCssTask, logEnd);

htmlReplaceCss.displayName = "html:replace:css";
htmlReplaceCss.description =
  "Replace build markers in HTML with a single bundled CSS link.";
htmlReplaceCss.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Outputs replaced HTML files directly to the distribution directory instead of a temporary location.",
};

gulp.task(htmlReplaceCss.displayName, htmlReplaceCss);

module.exports = { htmlReplaceCss };
