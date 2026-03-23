// ← tasks to transform images size to tablet size.

const gulp = require("gulp");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.images.glob;
const srcDir = ctx.paths.images.dir;

const outputDir = ctx.paths.images.dist.tablet;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start resize to tablet size...");
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.verbose("→ Format: 840x560 (webp)");
  cb();
}
logStart.displayName = "resize:tablet:log:start";

function logEnd(cb) {
  log.success(`Finished resize to tablet size! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "resize:tablet:log:end";

async function resizeTabletTask() {
  if (!fileExists(srcDir)) {
    log.warn(`Source directory not found: ${srcDir}`);
    return Promise.resolve();
  }

  const files = fs.readdirSync(srcDir);

  if (files.length <= 0) {
    throw new Error(`Not found files inside directory: ${srcDir}`);
  }

  const images = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

  if (images.length === 0) {
    log.warn("No valid image files found.");
    return Promise.resolve();
  }

  const size = { width: 800, quality: 75, effort: 6 };

  fs.mkdirSync(outputDir, { recursive: true });

  const tasks = images.map((image) => {
    const filePath = path.join(srcDir, image);
    const fileName = path.parse(filePath).name;

    const outputFile = path.join(outputDir, `${fileName}-${size.width}.webp`);

    return sharp(filePath)
      .resize(size.width)
      .webp({
        quality: size.quality,
        effort: size.effort,
      })
      .toFile(outputFile);
  });

  return Promise.all(tasks);
}
resizeTabletTask.displayName = "resize:tablet:run";

const resizeTablet = gulp.series(logStart, resizeTabletTask, logEnd);

resizeTablet.displayName = "resize:tablet";
resizeTablet.description = "Resize source images to 840x560 for tablet output.";
resizeTablet.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(resizeTablet.displayName, resizeTablet);

module.exports = { resizeTablet };
