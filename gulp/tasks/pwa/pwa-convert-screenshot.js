// ← tasks to convert screenshots to webp format.

const gulp = require("gulp");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.pwa.screenshots.glob;
const srcDir = ctx.paths.pwa.screenshots.dir;

const outputDir = ctx.paths.pwa.screenshots.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start convert screenshots to webp...");
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "pwa:convert:screenshot:log:start";

function logEnd(cb) {
  log.success(
    `Finished convert screenshots to webp! ${timer.end()} → ${outputDir}`,
  );
  cb();
}
logEnd.displayName = "pwa:convert:screenshot:log:end";

async function pwaConvertScreenshotTask() {
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

  fs.mkdirSync(outputDir, { recursive: true });

  const tasks = images.map((image) => {
    const filePath = path.join(srcDir, image);
    const fileName = path.parse(filePath).name;

    const outputFile = path.join(outputDir + `/${fileName}.webp`);

    return sharp(filePath)
      .webp({
        quality: 75,
        effort: 6,
      })
      .toFile(outputFile);
  });

  return Promise.all(tasks);
}
pwaConvertScreenshotTask.displayName = "pwa:convert:screenshot:run";

const pwaConvertScreenshot = gulp.series(
  logStart,
  pwaConvertScreenshotTask,
  logEnd,
);

pwaConvertScreenshot.displayName = "pwa:convert:screenshot";
pwaConvertScreenshot.description =
  "Converts screenshots to webp format for better performance.";
pwaConvertScreenshot.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(pwaConvertScreenshot.displayName, pwaConvertScreenshot);

module.exports = { pwaConvertScreenshot };
