// ← task to optimize SVGs.

const gulp = require("gulp");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.icons.glob;
const srcDir = ctx.paths.icons.dir;

const outputDir = ctx.isDebug ? ctx.paths.icons.distUI : ctx.paths.icons.temp;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info(`Start optimizing SVGs!`);
  log.verbose(`→ Source: ${srcGlob}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "icons:optimize:start";

function logEnd(cb) {
  log.success(`Finished optimizing SVGs! ${timer.end()} → ${outputDir}`);
  cb();
}
logEnd.displayName = "icons:optimize:end";

async function iconsOptimizeTask() {
  const fs = (await import("fs/promises")).default;
  const path = (await import("path")).default;
  const { optimize } = await import("svgo");

  const files = await fs.readdir(srcDir, { recursive: true });

  await Promise.all(
    files
      .filter((file) => file.endsWith(".svg"))
      .map(async (file) => {
        const filePath = path.join(srcDir, file);
        const content = await fs.readFile(filePath, "utf-8");

        const result = optimize(content, {
          path: filePath,
          multipass: true,
        });

        const outputPath = path.join(
          outputDir,
          path.relative(srcDir, filePath),
        );
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, result.data);
      }),
  );

  // return gulp
  //   .src(srcGlob, { allowEmpty: true })
  //   .pipe(
  //     svgo({
  //       plugins: [
  //         { name: "removeDimensions", active: true },
  //         { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
  //       ],
  //     }),
  //   )
  //   .pipe(gulp.dest(outputDir));
}
iconsOptimizeTask.displayName = "icons:optimize:run";

const iconsOptimize = gulp.series(logStart, iconsOptimizeTask, logEnd);

iconsOptimize.displayName = "icons:optimize";
iconsOptimize.description = "Optimize SVG icons before iconfont generation.";
iconsOptimize.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Write outputs to the dist directory instead of temp.",
};

gulp.task(iconsOptimize.displayName, iconsOptimize);

module.exports = { iconsOptimize };
