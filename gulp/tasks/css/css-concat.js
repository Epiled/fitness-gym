// ← tasks to concat CSS.

const gulp = require("gulp");
const concat = require("gulp-concat");
const fs = require("fs");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const baseDir = ctx.isDebug ? ctx.paths.src : ctx.paths.temp;

const outputDir = ctx.isDebug
  ? ctx.paths.css.dist
  : ctx.paths.css.temp.artifacts.gen.dir;

const manifestPath = "temp/asset-manifest.json";

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start CSS concatenation from source files...");
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose(`→ Manifest path: ${manifestPath}`);
  cb();
}
logStart.displayName = "css:concat:log:start";

function logEnd(cb) {
  log.success(`Finished CSS concatenation! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "css:concat:log:end";

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    stream.on("end", resolve);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

function toFsPath(assetPath) {
  // garante "css/x.css"
  const cleaned = assetPath.trim().replace(/^\.\//, "").replace(/^\//, "");
  return path.join(baseDir, cleaned);
}

function concatTask() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const cssGroups = manifest.css;

  const streams = Object.entries(cssGroups).map(([key, files]) => {
    const resolvedFiles = files.map(toFsPath);

    return gulp
      .src(resolvedFiles, { allowEmpty: false })
      .pipe(concat(`${key}.css`))
      .pipe(gulp.dest(outputDir));
  });

  return Promise.all(streams.map(streamToPromise));
}
concatTask.displayName = "css:concat:run";

const cssConcat = gulp.series(logStart, concatTask, logEnd);

cssConcat.displayName = "css:concat";
cssConcat.description =
  "Concatenate CSS files and saves output to dist or temp directory.";
cssConcat.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Concatenate directly into dist instead of temp.",
};

gulp.task(cssConcat.displayName, cssConcat);

module.exports = { cssConcat };
