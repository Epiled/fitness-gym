// ← tasks to concat CSS.

const gulp = require("gulp");
const concat = require("gulp-concat");
const fs = require("fs");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.css.glob;

const baseDir = ctx.isDebug ? ctx.paths.src : ctx.paths.temp;
const label = ctx.isDebug ? "source files" : "manifest file";

const outputDir = ctx.isDebug
  ? ctx.paths.css.dist
  : ctx.paths.css.temp.artifacts.gen.dir;

const manifestPath = "temp/asset-manifest.json";

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start CSS concatenation from ${label}...`);

  if (ctx.isDebug) {
    log.verbose(`→ Source glob: ${srcGlob}`);
  } else {
    log.verbose(`→ Manifest path: ${manifestPath}`);
  }

  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
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
  /**
   * Convert a public asset path to a filesystem path based on baseDir.
   * Removes leading "./" or "/" before joining.
   */
  const cleaned = assetPath.trim().replace(/^\.\//, "").replace(/^\//, "");
  return path.join(baseDir, cleaned);
}

function cssConcatTask() {
  log.warn(`[css:concat] start | isDebug=${ctx.isDebug}`);

  if (ctx.isDebug) {
    log.warn("[css:concat] debug mode: using fallback sources");
    return gulp
      .src(srcGlob, { allowEmpty: false })
      .pipe(concat("concat.css"))
      .pipe(gulp.dest(outputDir));
  }

  if (!fs.existsSync(manifestPath)) {
    const msg = `Manifest not found at ${manifestPath}.`;
    log.error(msg);
    return Promise.reject(new Error(msg));
  }

  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    log.error(
      `Failed to read/parse manifest at ${manifestPath}: ${err.message}`,
    );
    return Promise.reject(err);
  }

  if (!manifest.css || typeof manifest.css !== "object") {
    const msg = `Invalid manifest.css at ${manifestPath}. Expected an object.`;
    log.error(msg);
    return Promise.reject(new Error(msg));
  }

  log.warn("[css:concat] using manifest groups");

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
cssConcatTask.displayName = "css:concat:run";

const cssConcat = gulp.series(logStart, cssConcatTask, logEnd);

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
