// ← task to copy static files to dist directory.

const gulp = require("gulp");
const path = require("path");
const fs = require("fs/promises");

const { log } = require("../utils/log");
const { startTimer } = require("../utils/timer");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.src;

const outputDir = ctx.paths.dist;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start copy static files...");
  log.verbose(`→ Source: ${srcDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "static:files:log:start";

function logEnd(cb) {
  log.success(`Finished copying static files! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "static:files:log:end";

function staticFilesTask() {
  return gulp
    .src(
      [
        `${srcDir}/**/*`,

        // handled by html tasks
        `!${srcDir}/**/*.html`,

        // handled by html tasks
        `!${srcDir}/html/**/*`,
        `!${srcDir}/html/**`,

        // handled by css tasks
        `!${srcDir}/css/**/*`,
        `!${srcDir}/css/**`,

        // handled by js tasks
        `!${srcDir}/js/**/*`,
        `!${srcDir}/js/**`,

        // handled by font tasks
        `!${srcDir}/assets/fonts/**/*`,
        `!${srcDir}/assets/fonts/**`,

        // handled by icons pipeline (source SVGs)
        `!${srcDir}/assets/svg/icons-ui/**`,

        // handled by images pipeline
        `!${srcDir}/assets/img/**`,
      ],
      { base: srcDir, allowEmpty: true },
    )
    .pipe(gulp.dest(outputDir));
}

async function copyFontsSafe() {
  const srcDir = "src/assets/fonts";
  const outputDir = "dist/assets/fonts";

  // Lendo recursivamente
  const entries = await fs.readdir(srcDir, {
    withFileTypes: true,
    recursive: true,
  });

  for (const entry of entries) {
    if (entry.isDirectory()) continue;

    if (!entry.name.match(/\.(svg|woff2|woff|ttf|eot)$/i)) continue;

    // entry.parentPath + entry.name = caminho completo do arquivo original
    const fullSrcPath = path.join(entry.parentPath, entry.name);

    // path.relative(srcDir, fullSrcPath) extrai apenas o que está DEPOIS de src/assets/fonts
    // Ex: se o arquivo está em src/assets/fonts/inter/font.woff2, o relative será "inter/font.woff2"
    const relativePath = path.relative(srcDir, fullSrcPath);

    const dest = path.join(outputDir, relativePath);

    // Cria as subpastas no destino se não existirem
    await fs.mkdir(path.dirname(dest), { recursive: true });

    // Copia o arquivo mantendo a integridade binária
    await fs.copyFile(fullSrcPath, dest);
  }
}

const staticFiles = gulp.series(
  logStart,
  staticFilesTask,
  copyFontsSafe,
  logEnd,
);

staticFiles.displayName = "static:files";
staticFiles.description = "Copy static files to the dist directory.";
staticFiles.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(staticFiles.displayName, staticFiles);

module.exports = { staticFiles };
