// ← task to transform images in HTML (responsive replacements).

const gulp = require("gulp");
const cheerio = require("cheerio");
const through = require("through2");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");
const { toWebp } = require("../../utils/toWebp");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const tempGlob = ctx.paths.html.temp.glob;
const tempDir = ctx.paths.html.temp.staging;

const inputGlob = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.isDebug
  ? ctx.paths.dist
  : ctx.paths.html.temp.artifacts.gen.dir;

let timer;

const parseSizes = (list) => {
  const parseConfig = list
    .map((data) => {
      const { width: w, height: h, quality: q, extract: e } = data;

      const newObj = {
        width: w || null,
        height: h || null,
        quality: q || 75,
      };

      return newObj;
    })
    .filter(Boolean);

  if (!parseConfig.length) return;

  return parseConfig;
};

function logStart(cb) {
  timer = startTimer();
  log.info("Start transform images in the HTML...");
  log.verbose(`→ Source glob: ${inputGlob}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:transform:images:log:start";

function logEnd(cb) {
  log.success(
    `Finished transforming images in HTML! ${timer.end()} → ${outputDir}`,
  );
  cb();
}
logEnd.displayName = "html:transform:images:log:end";

function htmlTransformImagesTask() {
  if (!ctx.isDebug && !fileExists(tempDir)) {
    log.warn(
      `Temporary directory "${tempDir}" does not exist. Please run the "prepare:html" task first to generate the necessary files before transforming images or use the "debug" flag to transform directly from source files.`,
    );
    return Promise.reject();
  }

  return gulp
    .src(inputGlob, { allowEmpty: true, base: baseDir })
    .pipe(
      through.obj((file, _, cb) => {
        if (file.isNull()) return cb(null, file);

        const $ = cheerio.load(file.contents.toString(), {
          decodeEntities: false,
        });

        $("[data-gulp-cheerio]").each((_, el) => {
          if (!el || !el.attribs) return;
          const $img = $(el);
          const attrs = { ...el.attribs };

          const data = el.attribs["data-sizes"];

          const dataConfig = JSON.parse(data);

          const parsedConfig = parseSizes(dataConfig);

          const srcBase = attrs.src.replace();
          if (!srcBase) return;

          const srcWebp = toWebp(srcBase);

          let imgAttrs = Object.entries(attrs)
            .filter(([k]) => k !== "data-gulp-cheerio" && k !== "data-sizes")
            .map(([k, v]) => ` ${k}="${v}"`)
            .join("");

          const imgs = parsedConfig.reduceRight((acc, size, index) => {
            const { width: w, height: h, breakPoint: br } = size;
            const fixedSrc = toWebp(srcWebp.replace(/\.webp$/, `-${w}.webp`));

            if (index === 0) {
              // remove old src and inject the new
              const cleanedAttrs = imgAttrs.replace(/\s*src\s*=\s*"[^"]*"/, "");

              acc += `
                <img                  
                  ${cleanedAttrs}
                  src="${fixedSrc}"
                  width="${w}" 
                  height="${h}" 
                />`;
            } else {
              acc += `
                <source
                  media="(min-width: ${br ?? w}px)"
                  width="${w}"
                  height="${h}"
                  srcset="${fixedSrc}"
                />`;
            }

            return acc.trim();
          }, "");

          const nodes = $.parseHTML(imgs);
          $img.replaceWith(nodes);
        });

        file.contents = Buffer.from($.html());
        cb(null, file);
      }),
    )
    .pipe(gulp.dest(outputDir));
}
htmlTransformImagesTask.displayName = "html:transform:images:run";

const htmlTransformImages = gulp.series(
  logStart,
  htmlTransformImagesTask,
  logEnd,
);

htmlTransformImages.displayName = "html:transform:images";
htmlTransformImages.description =
  "Transform marked images in HTML to responsive <source>/<img> markup and save output.";
htmlTransformImages.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Outputs transformed HTML files directly to the distribution directory instead of a temporary location.",
};

gulp.task(htmlTransformImages.displayName, htmlTransformImages);

module.exports = { htmlTransformImages };
