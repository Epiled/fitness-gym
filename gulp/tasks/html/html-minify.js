// ← task to minify HTML.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcDir = ctx.paths.html.dir;

const genDir = ctx.paths.html.temp.artifacts.gen.dir;

const baseDir = ctx.isDebug ? srcDir : genDir;

const label = ctx.isDebug ? "source files" : "transformed files";

const outputDir = ctx.isDebug
  ? ctx.paths.dist
  : ctx.paths.html.temp.artifacts.gen.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start HTML minification from ${label}...`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:minify:log:start";

function logEnd(cb) {
  log.success(`Finished HTML minification! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "html:minify:log:end";

async function minifyTask() {
  const fs = (await import("fs/promises")).default;
  const path = (await import("path")).default;
  const { minify } = await import("html-minifier-terser");

  const files = await fs.readdir(baseDir, { recursive: true });

  if (!ctx.isDebug && !fileExists(genDir)) {
    log.warn(
      `Temporary directory "${genDir}" does not exist. Please run the "prepare:html" and "html:transform:images" task first to generate the necessary files before minifying HTML.`,
    );
    return Promise.reject();
  }

  await Promise.all(
    files
      .filter((file) => file.endsWith(".html"))
      .map(async (file) => {
        const filePath = path.join(baseDir, file);
        const content = await fs.readFile(filePath, "utf-8");

        const minified = await minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: false,
          minifyCSS: true,
          minifyJS: true,
          useShortDoctype: true,
        });

        const outputPath = path.join(
          outputDir,
          path.relative(baseDir, filePath),
        );
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, minified);
      }),
  );
}
minifyTask.displayName = "html:minify:run";

const htmlMinify = gulp.series(logStart, minifyTask, logEnd);

htmlMinify.displayName = "html:minify";
htmlMinify.description =
  "Minify HTML files and output to the distribution directory.";
htmlMinify.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Outputs minified HTML files directly to the distribution directory instead of a temporary location.",
};

gulp.task(htmlMinify.displayName, htmlMinify);

module.exports = { htmlMinify };
