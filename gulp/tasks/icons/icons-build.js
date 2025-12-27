// ← tasks to generate webfont from SVGs.

const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const iconfont = require("gulp-iconfont");

const { iconsOptimize } = require("./icons-optimize");
const { iconsCompilePreview } = require("./icons-preview");

const { iconsWriteOutputs } = require("../../helpers/icons-write-outputs");
const { iconsCompileCSS } = require("../../helpers/icons-compile");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const baseIconTemplatePath = path.resolve(
  __dirname,
  "../../templates/base-icons.hbs",
);
handlebars.registerPartial(
  "base-icons",
  fs.readFileSync(baseIconTemplatePath, "utf8"),
);

const targetPath = ctx.isSASS
  ? path.join(ctx.paths.icons.scss, `_${ctx.config.fontName}.scss`)
  : path.join(ctx.paths.css.dist, `${ctx.config.fontName}.css`);

const outputDir = ctx.isDebug ? ctx.paths.icons.dev : ctx.paths.icons.dist;

let timer;
let glyphCount = 0;

function logStart(cb) {
  timer = startTimer();
  log.info(`Generating webfont: ${ctx.config.fontName}`);
  log.verbose(`→ Source: ${ctx.paths.icons.src}`);
  log.verbose(`→ Target: ${targetPath}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  log.info("→ Pipeline: iconsOptimize → iconsFontTask");
  cb();
}
logStart.displayName = "icons:log:start";

function logEnd(cb) {
  log.success(
    `Finished generating webfont: ${ctx.config.fontName} (${timer.end()}) → ${outputDir}`,
  );
  log.info(`→ Total icons generated: ${glyphCount}`);
  cb();
}
logEnd.displayName = "icons:log:end";

function iconsFontTask() {
  log.info("Checking SVGs...");

  const srcDir = path.dirname(ctx.paths.icons.src);

  if (!fileExists(srcDir)) {
    log.error(`Icons source not found: ${srcDir}`);
    return Promise.resolve();
  }

  const iconFiles = fs.readdirSync(srcDir);
  const svgCount = iconFiles.filter((f) => f.endsWith(".svg")).length;

  if (svgCount === 0) {
    log.warn(`SVGs Not found: ${ctx.paths.icons.src}`);
    return Promise.resolve();
  }

  return gulp
    .src(ctx.paths.icons.src)
    .pipe(
      iconfont({
        fontName: ctx.config.fontName,
        formats: ["ttf", "woff", "woff2", "svg"],
        normalize: true,
        fontHeight: 1000,
        prependUnicode: false,
        timestamp: ctx.buildTimestamp,
      }).on("glyphs", function (glyphs) {
        const css = iconsCompileCSS(glyphs);
        const preview = iconsCompilePreview(glyphs);

        iconsWriteOutputs(css, preview);

        log.verbose(`→ Glyphs: ${glyphs.map((g) => g.name).join(", ")}`);

        glyphCount = glyphs.length;
      }),
    )
    .pipe(gulp.dest(outputDir));
}
iconsFontTask.displayName = "icons:font:run";

const iconsBuild = gulp.series(logStart, iconsOptimize, iconsFontTask, logEnd);

iconsBuild.displayName = "icons:build";
iconsBuild.description = "Generate icon font file.";
iconsBuild.flags = {
  "--debug": "Write outputs to the dev directory instead of dist.",
  "--sass": "Generate SASS stylesheet instead of CSS.",
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(iconsBuild.displayName, iconsBuild);

module.exports = { iconsBuild };
