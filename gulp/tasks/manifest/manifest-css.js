const gulp = require("gulp");
const fs = require("fs");
const path = require("path");

const { parseCSSBuildBlocks } = require("../../utils/parseCSSBuildBlocks");
const { validateCSSManifest } = require("../../utils/validateCSSManifest");

function manifestCSSTask(cb) {
  const htmlPath = path.resolve("src/index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  const htmlDir = path.dirname(htmlPath);

  const cssSrcBaseDir = path.resolve("src/css");

  const manifest = parseCSSBuildBlocks(html, {
    htmlDir,
    cssSrcBaseDir,
  });

  validateCSSManifest(manifest);

  const outDir = path.resolve("temp");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.resolve(outDir, "asset-manifest.json");
  fs.writeFileSync(outPath, JSON.stringify({ css: manifest }, null, 2), "utf8");

  cb();
}

gulp.task("manifest:css", manifestCSSTask);

module.exports = { manifestCSSTask };
