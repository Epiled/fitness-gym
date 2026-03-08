// ← task to init dev/prod server (BrowserSync).

const gulp = require("gulp");
const browserSync = require("browser-sync").create();

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const baseDir = ctx.isDev ? ctx.paths.src : ctx.paths.dist;

const watchOpts = {
  ignoreInitial: true,
  usePolling: true,
  interval: 300,
};

const staticWatch = [
  `${ctx.paths.src}/**/*`,
  `!${ctx.paths.src}/html/**/*`,
  `!${ctx.paths.src}/css/**/*`,
  `!${ctx.paths.src}/js/**/*`,
  `!${ctx.paths.src}/assets/svg/icons-ui/**/*`,
];

function reload(done) {
  browserSync.reload();
  done();
}

function watchDev() {
  // HTML: reload
  gulp.watch(ctx.paths.html.glob, watchOpts, reload);

  // CSS: stream (sem reload)
  gulp.watch(ctx.paths.css.glob, watchOpts, function cssStream() {
    return gulp.src(ctx.paths.css.glob).pipe(browserSync.stream());
  });

  // JS: reload
  gulp.watch(ctx.paths.js.glob, watchOpts, reload);

  // Other files: reload
  gulp.watch(staticWatch, watchOpts, reload);
}

function watchProd() {
  gulp.watch(
    ctx.paths.html.glob,
    gulp.series("prepare:html", "html:build", "finalize:html", reload),
  );

  gulp.watch(
    ctx.paths.css.glob,
    gulp.series("prepare:css", "css:build", "finalize:css", reload),
  );

  gulp.watch(
    ctx.paths.js.glob,
    gulp.series("prepare:js", "js:build", "finalize:js", reload),
  );

  gulp.watch(ctx.paths.icons.glob, gulp.series("icons:build", reload));

  gulp.watch(staticWatch, gulp.series("static:files", reload));
}

// Static server
function server() {
  browserSync.init({
    server: { baseDir },
    port: 3000,
    open: true, // auto open browser
    notify: false, // remove popup "BrowserSync Connected"
    watchOptions: watchOpts,
  });

  if (ctx.isDev) {
    watchDev();
  } else {
    watchProd();
  }
}

function maybeBuild(done) {
  if (ctx.isDev) return done();
  return gulp.series("build")(done);
}

// Serve with build step when running in non-dev mode
const serve = gulp.series(maybeBuild, server);
serve.displayName = "serve";
serve.description =
  "Build (when not in --dev) and start the BrowserSync server.";
serve.flags = {
  "--dev": "Serve src directory (development mode).",
};

gulp.task(serve.displayName, serve);

module.exports = { serve };
