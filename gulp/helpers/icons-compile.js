// ← helper to compile icon stylesheet (CSS/SCSS) from glyphs.

const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const { log } = require("../utils/log");
const { fileExists } = require("../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const iconsTemplatePath = ctx.isSASS
  ? path.resolve(__dirname, "../../templates/icons.scss.hbs")
  : path.resolve(__dirname, "../../templates/icons.css.hbs");

function iconsCompileCSS(glyphs = []) {
  if (!fileExists(iconsTemplatePath)) {
    log.error(`Template CSS not found: ${iconsTemplatePath}`);
    return "";
  }

  if (!Array.isArray(glyphs)) {
    log.warn(
      "⚠️ iconsCompileCSSTask called without valid glyphs array. This task should never run in isolation — it must be triggered by iconsBuild.",
    );
    return "";
  }

  const cssRaw = fs.readFileSync(iconsTemplatePath, "utf8");
  const cssCompiled = handlebars.compile(cssRaw);

  const output = cssCompiled({
    fontName: ctx.config.fontName,
    folderName: ctx.config.folderName,
    fontPath: ctx.config.fontPath,
    cssClass: ctx.config.cssClass,
    glyphs: glyphs.map((g) => ({
      name: g.name.replace(/^icon-/, ""),
      code: "\\" + g.unicode[0].charCodeAt(0).toString(16),
    })),
  });

  return output;
}

module.exports = { iconsCompileCSS };
