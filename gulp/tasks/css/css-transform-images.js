// ← task to transform images in CSS (e.g., converting to WebP).

const gulp = require("gulp");
const replace = require("gulp-replace");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.css.glob;
const srcDir = ctx.paths.css.dir;

const genDir = ctx.paths.css.temp.artifacts.gen.dir;
const genGlob = ctx.paths.css.temp.artifacts.gen.glob;

const inputPath = ctx.isDebug ? srcGlob : genGlob;

const baseDir = ctx.isDebug ? srcDir : genDir;
const label = ctx.isDebug ? "source files" : "temp files";

const outputDir = ctx.isDebug ? ctx.paths.css.dist : genDir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start transform images in the CSS from ${label}...`);
  log.verbose(`→ Source glob: ${inputPath}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "css:transform:images:log:start";

function logEnd(cb) {
  log.success(
    `Finished transform images in the CSS! ${timer.end()} → ${outputDir}`,
  );
  cb();
}
logEnd.displayName = "css:transform:images:log:end";

function cssTransformImagesTask() {
  if (!ctx.isDebug && !fileExists(genDir)) {
    log.warn(
      `Bundle file not found at ${genDir}. Please run 'css:concat' first or use the '--debug' flag to transform images directly from source files.`,
    );
    return Promise.reject();
  }

  return (
    gulp
      .src(inputPath, { allowEmpty: true, base: baseDir })

      // 1) jpg/png → webp
      .pipe(
        replace(
          /url\(\s*(['"]?)([^'")]+?)\.(jpe?g|png)(\?[^'")]+)?(#[^'")]+)?\1\s*\)/gi,
          "url($1$2.webp$4$5$1)",
        ),
      )

      // 2) @img <jsonConfig> → pasta
      // Group 1:/* @img {"width":834,"quality":65,"format":"webp"} */
      // Group 2: optional quote (single or double) around the URL
      // Group 3: optional path before the filename (e.g., ../../assets/img/)
      // Group 4: filename with .webp extension (e.g., searcher.webp)
      // Group 5: optional query string (e.g., ?v=123)
      // Group 6: optional fragment (e.g., #section)
      /*
        jsonConfig:  $1
        quote:    $2
        pathBase: $3
        fileName: $4
        query:    $5
        hash:     $6
      */
      .pipe(
        replace(
          /\/\*\s*@img\s+(\{[^*]+\})\s*\*\/\s*url\(\s*(['"]?)([^'")]*\/)?([^'")]+\.webp)(\?[^'")]+)?(#[^'")]+)?\2\s*\)/gi,
          (
            match,
            jsonConfig,
            quote,
            pathBase = "",
            fileName,
            query = "",
            hash = "",
          ) => {
            let config;

            try {
              config = JSON.parse(jsonConfig);
            } catch (err) {
              log.error(
                `Invalid JSON in @img comment ${jsonConfig}: ${err.message}`,
              );
              return match; // Return original if JSON is invalid
            }

            const width = config.width;

            if (!width) return match;

            const newFile = fileName.replace(/\.webp$/, `-${width}.webp`);

            return `url(${quote}${pathBase}${newFile}${query}${hash}${quote})`;
          },
        ),
      )

      // 3) remove comentário
      .pipe(replace(/\/\*\s*@img\s+[^\s*]+\s*\*\//gi, ""))

      .pipe(gulp.dest(outputDir))
  );
}
cssTransformImagesTask.displayName = "css:transform:images:run";

const cssTransformImages = gulp.series(
  logStart,
  cssTransformImagesTask,
  logEnd,
);

cssTransformImages.displayName = "css:transform:images";
cssTransformImages.description =
  "Transform images in CSS (e.g., convert jpg/png to webp and update paths) and write output/save to dist directory/folder.";
cssTransformImages.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Run task in isolation using source files instead of temp bundle.",
};

gulp.task(cssTransformImages.displayName, cssTransformImages);

module.exports = { cssTransformImages };
