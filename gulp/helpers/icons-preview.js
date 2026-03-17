// ← helper to compile icons preview HTML from glyphs.

const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const { log } = require("../utils/log");
const { fileExists } = require("../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const previewTemplatePath = path.resolve(
  __dirname,
  "../templates/icons-preview.hbs",
);

function iconsCompilePreview(glyphs = []) {
  if (!fileExists(previewTemplatePath)) {
    log.error(`Template Preview not found: ${previewTemplatePath}`);
    return "";
  }

  if (!Array.isArray(glyphs)) {
    log.warn("⚠️ compilePreviewTask called without valid glyphs array.");
    return "";
  }

  const previewRaw = fs.readFileSync(previewTemplatePath, "utf8");
  const previewCompiled = handlebars.compile(previewRaw);
  return previewCompiled({
    fontName: ctx.config.fontName,
    cssFileName: ctx.config.fontName.toLocaleLowerCase(),
    cssClass: ctx.config.cssClass,
    glyphs: glyphs.map((g) => ({
      name: g.name,
    })),
  });
}

module.exports = { iconsCompilePreview };
