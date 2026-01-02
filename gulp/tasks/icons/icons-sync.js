// ← task to sync font and stylesheet of custom fonts.

const gulp = require("gulp");
const path = require("path");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcFontGlob = path.join(
  ctx.paths.icons.dist,
  "*.{eot,svg,ttf,woff,woff2}",
);
const srcCSSGlob = path.join(ctx.paths.css.dist, `${ctx.config.fontName}*.css`);
const srcHTMLPreviewGlob = path.join(ctx.paths.dist, "icons-preview.html");

const outputRoot = ctx.paths.src;
const outputFonts = ctx.paths.icons.syncDir; // src/assets/fonts/<folderName>
const outputCss = ctx.paths.css.dir; // src/css
const outputPreview = outputRoot; // src/

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start sync icon font assets to source...");
  log.verbose(`→ Source fonts: ${srcFontGlob}`);
  log.verbose(`→ Source CSS: ${srcCSSGlob}`);
  log.verbose(`→ Source preview: ${srcHTMLPreviewGlob}`);
  log.verbose(`→ Output fonts: ${outputFonts}`);
  log.verbose(`→ Output CSS: ${outputCss}`);
  log.verbose(`→ Output preview: ${outputPreview}`);
  cb();
}
logStart.displayName = "icons:sync:log:start";

function logEnd(cb) {
  log.success(`Finished sync! ${timer.end()}`);
  cb();
}
logEnd.displayName = "icons:sync:log:end";

function syncFonts() {
  return gulp
    .src(srcFontGlob, { allowEmpty: true, base: ctx.paths.icons.dist })
    .pipe(gulp.dest(outputFonts));
}
syncFonts.displayName = "icons:sync:fonts";

function syncCss() {
  return gulp
    .src(srcCSSGlob, { allowEmpty: true, base: ctx.paths.css.dist })
    .pipe(gulp.dest(outputCss));
}
syncCss.displayName = "icons:sync:css";

function syncPreview() {
  return gulp
    .src(srcHTMLPreviewGlob, { allowEmpty: true, base: ctx.paths.dist })
    .pipe(gulp.dest(outputPreview));
}
syncPreview.displayName = "icons:sync:preview";

const iconsSync = gulp.series(
  logStart,
  gulp.parallel(syncFonts, syncCss, syncPreview),
  logEnd,
);

iconsSync.displayName = "icons:sync";
iconsSync.description =
  "Sync icon font files, generated CSS, and preview HTML into source folders.";
iconsSync.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(iconsSync.displayName, iconsSync);

module.exports = { iconsSync };
