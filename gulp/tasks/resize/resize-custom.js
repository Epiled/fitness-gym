// ← tasks to transform images size to custom size.

const gulp = require("gulp");
const sharpResponsive = require("gulp-sharp-responsive");
const path = require("path");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const jsonPath = "temp/.gen/responsiveData.json";

const srcDir = ctx.paths.images.dir;

const outputDir = ctx.paths.images.dist.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize to custom size...");
  log.verbose(`→ Source: ${srcDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Format: 800x600 (webp)");
  cb();
}
logStart.displayName = "resize:custom:log:start";

function logEnd(cb) {
  log.success(`Finished resize to custom size! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "resize:custom:log:end";

function resizeCustomTask() {
  if (!fileExists(srcDir)) {
    log.warn(`Source directory not found: ${srcDir}`);
    return Promise.resolve();
  }

  if (!fileExists(jsonPath)) {
    log.warn("responsiveData.json not found.");
    return Promise.resolve();
  }

  const data = JSON.parse(fs.readFileSync(jsonPath));

  if (!Array.isArray(data) || !data.length) {
    log.warn("No responsive images found.");
    return Promise.resolve();
  }

  const streams = data.map((image) => {
    const formats = image.sizes.map((size) => ({
      width: size.width,
      format: "webp",
      rename: {
        suffix: `-${size.width}`,
      },
      webpOptions: {
        quality: size.quality,
        effort: 6,
      },
    }));

    const filePath = path.join(srcDir, path.basename(image.src));

    return gulp
      .src(filePath, { allowEmpty: true, base: srcDir })
      .pipe(sharpResponsive({ formats }))
      .pipe(gulp.dest(outputDir));
  });

  return Promise.all(streams);
}
resizeCustomTask.displayName = "resize:custom:run";

const resizeCustom = gulp.series(logStart, resizeCustomTask, logEnd);

resizeCustom.displayName = "resize:custom";
resizeCustom.description =
  "Resize images to custom size (800x600) in WebP format.";
resizeCustom.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(resizeCustom.displayName, resizeCustom);

module.exports = { resizeCustom };
