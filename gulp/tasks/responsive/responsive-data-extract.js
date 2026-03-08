const gulp = require("gulp");
const fs = require("fs");
const through = require("through2");

const { log } = require("../../utils/log");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const {
  parseResponsiveFromHtml,
} = require("../../utils/parseResponsiveFromHtml");
const {
  parseResponsiveFromCss,
} = require("../../utils/parseResponsiveFromCss");

const srcGlobHtml = ctx.paths.html.glob;
const srcGlobCss = ctx.paths.css.glob;

function extractResponsiveTask() {
  const collected = [];

  return gulp
    .src([srcGlobHtml, srcGlobCss])
    .pipe(
      through.obj((file, _, cb) => {
        const ext = file.extname;
        const content = file.contents.toString();

        if (ext === ".html") {
          const parsed = parseResponsiveFromHtml(content);
          collected.push(...parsed);
        }

        if (ext === ".css") {
          const parsed = parseResponsiveFromCss(content);
          collected.push(...parsed);
        }

        cb(null, file);
      }),
    )
    .on("end", () => {
      log.info("Finished extracting responsive data from HTML!");
      log.info(collected[0]);

      fs.writeFileSync(
        "temp/.gen/responsiveData.json",
        JSON.stringify(collected, null, 2),
      );
    });
}

extractResponsiveTask.displayName = "resize:extract:responsive:run";

const extractResponsive = gulp.series(extractResponsiveTask);

gulp.task(extractResponsiveTask.displayName, extractResponsiveTask);

module.exports = { extractResponsive };
