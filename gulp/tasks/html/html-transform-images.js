// ← task to transform images in HTML (responsive replacements).

const gulp = require("gulp");
const cheerio = require("gulp-cheerio");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");
const { fileExists } = require("../../utils/fileExists");
const { toWebp } = require("../../utils/toWebp");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const tempDir = ctx.paths.html.temp;
const tempGlob = `${tempDir}/**/*.html`;

const inputGlob = ctx.isDebug ? srcGlob : tempGlob;
const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.isDebug ? ctx.paths.dist : tempDir;

let timer;

const parseSizes = (str = "") => {
  return str
    .split(",")
    .filter(Boolean)
    .reduce((acc, item) => {
      const [keyRaw, valueRaw] = item.split(":");
      const key = (keyRaw || "").trim();
      const value = (valueRaw || "").trim();

      if (!key || !value) return acc;

      const [w, h, bp] = (value || "").split("x").map(Number);
      acc[key] = { width: w || 0, height: h || 0, breakPoint: bp || null };

      return acc;
    }, {});
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
      `Transformed HTML files not found at ${tempDir}. Please run 'html:replace:css' or use the 'debug' flag to transform directly from source files.`,
    );
    return Promise.resolve();
  }

  return gulp
    .src(inputGlob, { allowEmpty: true, base: baseDir })
    .pipe(
      cheerio(($) => {
        $("[data-gulp-cheerio]").each((_, el) => {
          if (!el || !el.attribs) return;
          const $img = $(el);
          const attrs = { ...el.attribs };

          const sizes = parseSizes(el.attribs["data-sizes"]);
          const sizesKeys = Object.keys(sizes);

          const srcBase = attrs.src.replace();
          if (!srcBase) return;

          const srcWebp = toWebp(srcBase);

          let imgAttrs = Object.entries(attrs)
            .filter(([k]) => k !== "data-gulp-cheerio" && k !== "data-sizes")
            .map(([k, v]) => ` ${k}="${v}"`)
            .join("");

          const imgs = sizesKeys.reduceRight((acc, key, index) => {
            if (!sizes[key]) {
              return acc;
            }

            const { width: w, height: h, breakPoint: br } = sizes[key];
            const fixedSrc = toWebp(srcWebp.replace(/\/img\b/, `/img/${key}`));

            if (index === 0) {
              // remove old src and inject the new
              const cleanedAttrs = imgAttrs.replace(/\s*src\s*=\s*"[^"]*"/, "");

              acc += `
                 <source
                  media="(min-width: ${br ?? w}px)"
                  width="${w}"
                  height="${h}"
                  srcset="${fixedSrc}"
                />
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
