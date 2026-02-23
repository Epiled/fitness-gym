const gulp = require("gulp");
const path = require("path");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const { parseCSSBuildBlocks } = require("../../utils/parseCSSBuildBlocks");
const { validateCSSManifest } = require("../../utils/validateCSSManifest");

const outputDir = ctx.paths.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start CSS manifest generation...");
  cb();
}

function logEnd(cb) {
  log.success(
    `Finished CSS manifest generation! ${timer.end()} → ${outputDir}`,
  );
  cb();
}

function manifestCssTask(cb) {
  const htmlPath = path.resolve("src/index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  const manifest = parseCSSBuildBlocks(html);

  validateCSSManifest(manifest);

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outPath = path.resolve(outputDir, "asset-manifest.json");
  fs.writeFileSync(outPath, JSON.stringify({ css: manifest }, null, 2), "utf8");

  cb();
}
manifestCssTask.displayName = "manifest:css:run";

const manifestCss = gulp.series(logStart, manifestCssTask, logEnd);

manifestCss.displayName = "manifest:css";
manifestCss.description =
  "Generates a manifest of CSS assets based on the HTML build blocks.";
manifestCss.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(manifestCss.displayName, manifestCss);

module.exports = { manifestCss };
