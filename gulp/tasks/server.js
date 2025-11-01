// gulp/tasks/server.js
const gulp = require("gulp");
const browserSync = require("browser-sync").create();

const paths = require("../paths");

// Static server
function serve() {
  browserSync.init({
    server: {
      baseDir: "src",
    },
    port: 3000,
    open: true, // auto open browser
    notify: false, // remove popup "BrowserSync Connected"
  });

  gulp
    .watch(paths.css.src, gulp.series("css:build"))
    .on("change", browserSync.reload);
  gulp
    .watch(paths.html.src, gulp.series("html:build"))
    .on("change", browserSync.reload);
  gulp
    .watch(paths.icons.src, gulp.series("icons:font"))
    .on("change", browserSync.reload);
}

serve.displayName = "serve";
serve.description = " Create a server";
serve.flags = {
  "--silent": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(serve.displayName, serve);

module.exports = { serve };
