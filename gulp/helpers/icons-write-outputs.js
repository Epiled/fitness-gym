// ← helper to write icon stylesheet and preview outputs.

const path = require("path");
const fs = require("fs");

const { ensureDir } = require("../utils/ensureDir");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const fontFileName = ctx.config.fontName.toLowerCase();

const targetPath = ctx.isSASS
  ? path.join(ctx.paths.sass.dist, `_${fontFileName}.scss`)
  : path.join(ctx.paths.css.dist, `${fontFileName}.css`);

const previewPath = path.join(ctx.paths.dist, "icons-preview.html");

function iconsWriteOutputs(css, preview) {
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, css);
  fs.writeFileSync(previewPath, preview);
}

module.exports = { iconsWriteOutputs };
