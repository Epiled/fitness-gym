// ← tasks to generate webfont from SVGs.

const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const { buildIcons } = require("@epiled/icon-font-builder");
const { iconsOptimize } = require("./icons-optimize");

const { iconsCompilePreview } = require("../../helpers/icons-preview");
const { iconsWriteOutputs } = require("../../helpers/icons-write-outputs");
const { iconsCompileCss } = require("../../helpers/icons-compile");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.icons.glob;
const srcDir = ctx.paths.icons.dir;

const fontName = ctx.config.fontName;
const fontFileName = fontName.toLowerCase();

const baseIconTemplatePath = path.resolve(
  __dirname,
  "../../templates/base-icons.hbs",
);

if (!fileExists(baseIconTemplatePath)) {
  log.error(`Base icons template not found: ${baseIconTemplatePath}`);
} else {
  handlebars.registerPartial(
    "base-icons",
    fs.readFileSync(baseIconTemplatePath, "utf8"),
  );
}

const targetPath = ctx.isSASS
  ? path.join(ctx.paths.sass.dist, `_${fontFileName}.scss`)
  : path.join(ctx.paths.css.dist, `${fontFileName}.css`);

const outputDir = ctx.paths.icons.dist;

let timer;
let glyphCount = 0;

function logStart(cb) {
  timer = startTimer();
  log.info(`Generating webfont: ${fontName}`);
  log.verbose(`→ Source glob: ${srcGlob}`);
  log.verbose(`→ Source dir: ${srcDir}`);
  log.verbose(`→ Target: ${targetPath}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.info("→ Pipeline: iconsOptimize → iconsFontTask");
  cb();
}
logStart.displayName = "icons:log:start";

function logEnd(cb) {
  log.success(
    `Finished generating webfont: ${fontName} ${timer.end()} → ${outputDir}`,
  );
  log.info(`→ Total icons generated: ${glyphCount}`);
  cb();
}
logEnd.displayName = "icons:log:end";

async function iconsFontTask() {
  log.info("Checking SVGs...");

  if (!fileExists(srcDir)) {
    log.error(`Icons source not found: ${srcDir}`);
    return Promise.resolve();
  }

  const iconFiles = fs.readdirSync(srcDir);
  const svgCount = iconFiles.filter((f) => f.endsWith(".svg")).length;

  if (svgCount === 0) {
    log.warn(`SVGs Not found: ${srcDir}`);
    return Promise.resolve();
  }

  const glyphs = await buildIcons({
    iconsName: fontName,
    inputDir: srcDir,
    stripPrefix: "icon-",
    templates: {
      styles: {
        generation: false,
      },
      preview: {
        generation: false,
      },
    },
  });

  console.log(glyphs);

  const css = iconsCompileCss(glyphs);
  const preview = iconsCompilePreview(glyphs);

  iconsWriteOutputs(css, preview);

  log.verbose(`→ Glyphs: ${glyphs.map((g) => g.name).join(", ")}`);

  return glyphs;
}
iconsFontTask.displayName = "icons:font:run";

const iconsBuild = gulp.series(logStart, iconsOptimize, iconsFontTask, logEnd);

iconsBuild.displayName = "icons:build";
iconsBuild.description = "Generate icon font file.";
iconsBuild.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--sass": "Generate SASS stylesheet instead of CSS.",
};

gulp.task(iconsBuild.displayName, iconsBuild);

module.exports = { iconsBuild };
