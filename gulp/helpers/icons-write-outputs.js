// ← helper to write icon stylesheet and preview outputs.

const path = require("path");
const fs = require("fs");

const { ensureDir } = require("../utils/ensureDir");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

let targetPath = "";

targetPath = ctx.isSASS
  ? path.join(ctx.paths.sass.dist, `_${ctx.config.fontName}.scss`)
  : path.join(ctx.paths.css.dist, `${ctx.config.fontName}.css`);

const previewPath = path.join(ctx.paths.dist, "icons-preview.html");

function iconsWriteOutputs(css, preview) {
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, css);
  fs.writeFileSync(previewPath, preview);
}

module.exports = { iconsWriteOutputs };
