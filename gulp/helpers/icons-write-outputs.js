// ← helper to write icon stylesheet and preview outputs.

const path = require("path");
const fs = require("fs");

const { ensureDir } = require("../utils/ensureDir");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const outputDir = ctx.isDev ? ctx.paths.src : ctx.paths.icons.dist;

let targetPath = "";

if (ctx.isDev) {
  targetPath = ctx.isSASS
    ? path.join(ctx.paths.icons.scss, `_${ctx.config.fontName}.scss`)
    : path.join(ctx.paths.css.dev, `${ctx.config.fontName}.css`);
} else {
  targetPath = ctx.isSASS
    ? path.join(ctx.paths.icons.scss, `_${ctx.config.fontName}.scss`)
    : path.join(ctx.paths.css.dist, `${ctx.config.fontName}.css`);
}

const previewPath = path.join(outputDir, "icons-preview.html");

function iconsWriteOutputs(css, preview) {
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, css);
  fs.writeFileSync(previewPath, preview);
}

module.exports = { iconsWriteOutputs };
