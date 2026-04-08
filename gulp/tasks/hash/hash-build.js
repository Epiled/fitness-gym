// ← task to generate hash sha-256 from style and script inline.

const gulp = require("gulp");

const { hashGenerateStyle } = require("./hash-generate-style");
const { hashGenerateScript } = require("./hash-generate-script");
const { hashInsertStyle } = require("./hash-insert-style");
const { hashInsertScript } = require("./hash-insert-script");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start hash build...");
  cb();
}
logStart.displayName = "hash:build:log:start";

function logEnd(cb) {
  log.success(`Finished hash build! ${timer.end()}`);
  cb();
}
logEnd.displayName = "hash:build:log:end";

const hashBuild = gulp.series(
  logStart,
  hashGenerateStyle,
  hashGenerateScript,
  hashInsertStyle,
  hashInsertScript,
  logEnd,
);

hashBuild.displayName = "hash:build";
hashBuild.description =
  "Build hash (generate hash sha-256 from style and script inline) and write output/save to dist directory/folder.";
hashBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(hashBuild.displayName, hashBuild);

module.exports = { hashBuild };
