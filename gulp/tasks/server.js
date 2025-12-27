// ← task to init dev/prod server (BrowserSync).

const gulp = require("gulp");
const browserSync = require("browser-sync").create();

const { getBuildContext } = require("../utils/context");
const ctx = getBuildContext();

const baseDir = ctx.isDev ? ctx.paths.src : ctx.paths.dist;

// Static server
function server() {
  browserSync.init({
    server: { baseDir },
    port: 3000,
    open: true, // auto open browser
    notify: false, // remove popup "BrowserSync Connected"
  });

  function reload(done) {
    browserSync.reload();
    done();
  }

  gulp.watch(ctx.paths.html.src, gulp.series("html:build", reload));

  gulp.watch(ctx.paths.css.src, gulp.series("css:build", reload));

  gulp.watch(ctx.paths.icons.src, gulp.series("icons:build", reload));

  if (!ctx.isDev) {
    gulp.watch(
      [
        `${ctx.paths.src}/**/*`,
        `!${ctx.paths.src}/css/**/*`,
        `!${ctx.paths.src}/html/**/*`,
        `!${ctx.paths.src}/assets/svg/icons-ui/**/*`,
      ],
      gulp.series("static:files", reload),
    );
  }
}

server.displayName = "server";
server.description = "Create a server";
server.flags = {
  "--dev": "Serve src directory (development mode).",
};

// Serve with build step when running in non-dev mode
const serve = gulp.series(ctx.isDev ? (cb) => cb() : "build", server);
serve.displayName = "serve";
serve.description =
  "Build (when not in --dev) and start the BrowserSync server.";
serve.flags = server.flags;

gulp.task(server.displayName, server);
gulp.task(serve.displayName, serve);

module.exports = { server, serve };
