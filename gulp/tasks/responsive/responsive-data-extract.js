// ← task to generate JSON from HTML and CSS for responsive image sizes, breakpoints, etc.

const gulp = require("gulp");
const fs = require("fs");
const through = require("through2");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const {
  parseResponsiveFromHtml,
} = require("../../utils/parseResponsiveFromHtml");
const {
  parseResponsiveFromCss,
} = require("../../utils/parseResponsiveFromCss");

const { getBuildContext } = require("../../utils/context");
const { writeJson } = require("../../utils/writeJson");
const ctx = getBuildContext();

const srcGlobHtml = ctx.paths.html.temp.glob;
const srcGlobCss = ctx.paths.css.temp.glob;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start extracting responsive data from HTML and CSS...");
  log.verbose(`→ Source HTML glob: ${srcGlobHtml}`);
  log.verbose(`→ Source CSS glob: ${srcGlobCss}`);
  cb();
}
logStart.displayName = "responsive:data:extract:log:start";

function logEnd(cb) {
  log.success(
    `Finished extracting responsive data from HTML and CSS! ${timer.end()}`,
  );
  cb();
}
logEnd.displayName = "responsive:data:extract:log:end";

function responsiveDataExtractTask() {
  const collected = [];

  return gulp
    .src([srcGlobHtml, srcGlobCss])
    .pipe(
      through.obj((file, _, cb) => {
        const ext = file.extname;
        const content = file.contents.toString();

        if (ext === ".html") {
          const parsed = parseResponsiveFromHtml(content);
          collected.push(...parsed);
        }

        if (ext === ".css") {
          const parsed = parseResponsiveFromCss(content);
          collected.push(...parsed);
        }

        cb(null, file);
      }),
    )
    .on("end", () => {
      log.info("Finished extracting responsive data from HTML and CSS!");
      log.info(collected[0]);

      writeJson("temp/.gen/responsiveData.json", collected);
    });
}

responsiveDataExtractTask.displayName = "responsive:data:extract:run";

const responsiveDataExtract = gulp.series(
  logStart,
  responsiveDataExtractTask,
  logEnd,
);

responsiveDataExtract.displayName = "responsive:data:extract";
responsiveDataExtract.description =
  "Extract responsive image data from HTML and CSS, then output to temp/.gen/responsiveData.json.";
responsiveDataExtract.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(responsiveDataExtract.displayName, responsiveDataExtract);

module.exports = { responsiveDataExtract };
