// ← task to transform images in HTML (responsive replacements).

const gulp = require("gulp");
const cheerio = require("gulp-cheerio");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const baseDir = ctx.isDebug
  ? ctx.paths.html.src
  : `${ctx.paths.html.temp}/**/*.html`;
const outputDir = ctx.isDebug ? ctx.paths.html.dist : ctx.paths.html.temp;

let timer;

const parseSizes = (str = "") => {
  return str
    .split(",")
    .filter(Boolean)
    .reduce((acc, item) => {
      const [key, value] = item.split(":");
      if (!key || !value) return acc;
      const [w, h, bp] = (value || "").split("x").map(Number);
      acc[key] = { width: w || 0, height: h || 0, breakPoint: bp || null };
      return acc;
    }, {});
};

function logStart(cb) {
  timer = startTimer();
  log.info("Start transform images in the HTML...");
  log.verbose(`→ Source: ${baseDir}`);
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
  return gulp
    .src(baseDir)
    .pipe(
      cheerio(($) => {
        $("[data-gulp-cheerio]").each((_, el) => {
          if (!el || !el.attribs) return;
          const $img = $(el);
          const attrs = { ...el.attribs };

          const sizes = parseSizes(el.attribs["data-sizes"]);
          const sizesKeys = Object.keys(sizes);

          const srcBase = attrs.src;
          if (!srcBase) return;

          let imgAttrs = Object.entries(attrs)
            .filter(([k]) => k !== "data-gulp-cheerio" && k !== "data-sizes")
            .map(([k, v]) => ` ${k}="${v}"`)
            .join("");

          const imgs = sizesKeys.reduceRight((acc, key, index) => {
            if (!sizes[key]) {
              return acc;
            }

            const { width: w, height: h, breakPoint: br } = sizes[key];
            const fixedSrc = srcBase.replace(/\/img\b/, `/img/${key}`);

            if (index === 0) {
              // remove old src and inject the new
              const cleanedAttrs = imgAttrs.replace(/\s*src\s*=\s*"[^"]*"/, "");

              acc += `
                 <source
                  media="(min-width: ${br ?? w}px)"
                  width="${w}"
                  height="${h}"
                  src="${fixedSrc}"
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
                  src="${fixedSrc}"
                />`;
            }

            return acc.trim();
          }, "");

          $img.replaceWith(imgs);
        });
      }),
    )
    .pipe(gulp.dest(outputDir))
    .on("error", (err) => {
      log.error(`Transform images failed: ${err.message}`);
      throw err;
    });
}
htmlTransformImagesTask.displayName = "html:transform:images:run";

const htmlTransformImages = gulp.series(
  logStart,
  htmlTransformImagesTask,
  logEnd,
);

htmlTransformImages.displayName = "html:transform:images";
htmlTransformImages.description =
  "Transform marked images in the HTML to responsive <picture> structure and save to dist.";
htmlTransformImages.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug":
    "Outputs transformed HTML files directly to the distribution directory instead of a temporary location.",
};

gulp.task(htmlTransformImages.displayName, htmlTransformImages);

module.exports = { htmlTransformImages };
