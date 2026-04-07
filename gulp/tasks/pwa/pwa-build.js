// ← task to build Progressive Web App / PWA

const gulp = require("gulp");

const { pwaGenerateSw } = require("./pwa-generate-sw");
const { pwaConvertScreenshot } = require("./pwa-convert-screenshot");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start PWA build...");
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "pwa:build:log:start";

function logEnd(cb) {
  log.success(`Finished PWA build! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "pwa:build:log:end";

const pwaBuild = gulp.series(
  logStart,
  pwaConvertScreenshot,
  pwaGenerateSw,
  logEnd,
);

pwaBuild.displayName = "pwa:build";
pwaBuild.description =
  "Build PWA / Progressive Web App by generating service worker and converting screenshots, then output to the dist directory.";
pwaBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(pwaBuild.displayName, pwaBuild);

module.exports = { pwaBuild };
