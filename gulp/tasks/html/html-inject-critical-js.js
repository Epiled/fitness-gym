// ← task to inject JS critical inline.

const gulp = require("gulp");
const cheerio = require("gulp-cheerio");
const path = require("path");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const genGlob = ctx.paths.html.temp.artifacts.gen.glob;
const genDir = ctx.paths.js.temp.artifacts.gen.dir;

const outputDir = ctx.paths.html.temp.artifacts.gen.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start insert critical JS inline from source files...");
  log.verbose(`→ Source glob: ${genGlob}`);
  log.verbose(`→ Source dir: ${genDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:inject:critical:js:log:start";

function logEnd(cb) {
  log.success(
    `Finished insert critical JS inline! ${timer.end()} → ${outputDir}`,
  );
  cb();
}
logEnd.displayName = "html:inject:critical:js:log:end";

function htmlInjectCriticalJsTask() {
  if (!ctx.isDebug && !fileExists(genDir)) {
    log.warn(
      `Temporary directory "${genDir}" does not exist. Please run the "prepare:html", "html:transform:images" and "js:build" task first to generate the necessary files before transforming images.`,
    );
    return Promise.reject();
  }

  return gulp
    .src(genGlob, { allowEmpty: true })
    .pipe(
      cheerio(
        ($) => {
          const inlinePath = path.resolve(genDir, "inline.js");
          const inlineCode = fs.readFileSync(inlinePath, "utf8").trim();

          const scripTag = `<script type="module">${inlineCode}</script>`;

          $("*")
            .contents()
            .each(function () {
              if (this.type !== "comment") return;

              const data = (this.data ?? "").trim();
              if (data !== "build:js:inline") return;

              // Search in siblings until find build:end
              let node = this.next;
              let endNode = null;

              while (node) {
                if (
                  node.type === "comment" &&
                  (node.data ?? "").trim() === "build:end"
                ) {
                  endNode = node;
                  break;
                }
                node = node.next;
              }

              // If build:end was not found, do not modify (avoid breaking HTML)
              if (!endNode) return;

              // Remove everything BETWEEN start and end
              node = this.next;
              while (node && node !== endNode) {
                const next = node.next;
                $(node).remove();
                node = next;
              }

              // Replace the start comment with the inline script
              // and remove the end comment as well (optional, but usually you want it gone)
              $(this).replaceWith(scripTag);
              $(endNode).remove();
            });
        },
        { decodeEntities: true },
      ),
    )
    .pipe(gulp.dest(outputDir));
}
htmlInjectCriticalJsTask.displayName = "html:inject:critical:js:run";

const htmlInjectCriticalJs = gulp.series(
  logStart,
  htmlInjectCriticalJsTask,
  logEnd,
);

htmlInjectCriticalJs.displayName = "html:inject:critical:js";
htmlInjectCriticalJs.description =
  "Inject critical JS inline by replacing build markers in HTML with the content of the generated inline.js file.";
htmlInjectCriticalJs.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(htmlInjectCriticalJs.displayName, htmlInjectCriticalJs);

module.exports = { htmlInjectCriticalJs };
