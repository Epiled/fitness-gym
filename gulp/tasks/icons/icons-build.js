// ← tasks to generate webfont from SVGs

const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const through = require("through2");
const handlebars = require("handlebars");
const iconfont = require("gulp-iconfont");

const { iconsOptimize } = require("./icons-optimize");

const paths = require("../../paths");
const config = require("../../config");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const args = process.argv.slice(2);
const isSASS = args.includes("--sass");

const baseIconTemplatePath = path.resolve(
  __dirname,
  "../templates/base-icons.hbs",
);
handlebars.registerPartial(
  "base-icons",
  fs.readFileSync(baseIconTemplatePath, "utf8"),
);

const iconsTemplatePath = isSASS
  ? path.resolve(__dirname, "../templates/icons.scss.hbs")
  : path.resolve(__dirname, "../templates/icons.css.hbs");

// 🔧 Corrigido: garante que o CSS vá para dist/css/
const targetPath = isSASS
  ? path.join(paths.icons.scss, `_${config.fontName}.scss`)
  : path.join(paths.css.dist, `${config.fontName}.css`);

const previewPath = path.join(paths.dist, "icons-preview.html");
const previewTemplatePath = path.resolve(
  __dirname,
  "../templates/icons-preview.hbs",
);

let timer;
let glyphCount = 0;

function logStart(cb) {
  timer = startTimer();
  log.info(`Generating webfont: ${config.fontName}`);
  log.verbose(`→ Source: ${paths.icons.src}`);
  log.verbose(`→ Target: ${targetPath}`);
  log.verbose(`→ Output directory: ${paths.icons.dist}`);
  cb();
}
logStart.displayName = "icons:start";

function logEnd(cb) {
  log.success(
    `Finished generating webfont: ${config.fontName} (${timer.end()}) → ${paths.icons.dist}`,
  );
  log.info(`→ Total icons generate: ${glyphCount}`);
  log.info(`→ Preview generate: ${previewPath}`);
  cb();
}
logEnd.displayName = "icons:end";

function compileCSSTemplate(glyphs) {
  if (!fileExists(iconsTemplatePath)) {
    log.error(`Template de CSS não encontrado: ${iconsTemplatePath}`);
    return Promise.resolve();
  }

  const cssRaw = fs.readFileSync(iconsTemplatePath, "utf8");
  const cssCompiled = handlebars.compile(cssRaw);
  return cssCompiled({
    fontName: config.fontName,
    fontPath: "../fonts/",
    cssClass: "icon",
    glyphs: glyphs.map((g) => ({
      name: g.name,
      code: "\\" + g.unicode[0].charCodeAt(0).toString(16),
    })),
  });
}

// --- generate preview ---
function compilePreviewTemplate(glyphs) {
  if (!fileExists(previewTemplatePath)) {
    log.error(`Template de Preview não encontrado: ${previewTemplatePath}`);
    return Promise.resolve();
  }

  const previewRaw = fs.readFileSync(previewTemplatePath, "utf8");
  const previewCompiled = handlebars.compile(previewRaw);
  return previewCompiled({
    fontName: config.fontName,
    glyphs: glyphs.map((g) => ({
      name: g.name,
    })),
  });
}

function writeOutputs(css, preview) {
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, css);
  fs.writeFileSync(previewPath, preview);
}

function iconsFontTask() {
  log.info("Checking SVGs...");
  const totalSVGs = [];

  const srcDir = path.dirname(paths.icons.src.replace(/\\/g, "/"));

  if (!fileExists(srcDir)) {
    log.error(`Icons source not found: ${srcDir}`);
    return Promise.resolve();
  }

  const iconFiles = fs.readdirSync(srcDir);
  const svgCount = iconFiles.filter((f) => f.endsWith(".svg")).length;

  if (svgCount === 0) {
    log.warn(`SVGs Not found: ${paths.icons.src}`);
    return Promise.resolve();
  }

  return gulp
    .src(paths.icons.src)
    .pipe(
      through.obj(function (file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        totalSVGs.push(path.basename(file.path));
        cb(null, file);
      }),
    )
    .on("end", () => {
      log.info(`Foram encontrados ${totalSVGs.length} SVGs.`);
    })
    .pipe(
      iconfont({
        fontName: config.fontName,
        formats: ["ttf", "woff", "woff2", "svg"],
        normalize: true,
        fontHeight: 1000,
        prependUnicode: true,
        timestamp: config.runTimestamp || Math.round(Date.now() / 1000),
      }).on("glyphs", function (glyphs) {
        const css = compileCSSTemplate();
        const preview = compilePreviewTemplate();

        writeOutputs(css, preview);

        log.verbose(`→ Glyphs: ${glyphs.map((g) => g.name).join(", ")}`);

        glyphCount = glyphs.length;
      }),
    )
    .pipe(gulp.dest(paths.icons.dist));
}
iconsFontTask.displayName = "icons:font:run";

const iconsFont = gulp.series(logStart, iconsOptimize, iconsFontTask, logEnd);

iconsFont.displayName = "icons:font";
iconsFont.description = "Generate icon font file.";
iconsFont.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(iconsFont.displayName, iconsFont);

module.exports = { iconsFont };
