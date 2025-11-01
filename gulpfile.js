// ← arquivo principal (carrega as tasks)

const gulp = require("gulp");

const requireDir = require("require-dir");

// Carrega todas as tasks da pasta gulp/tasks
requireDir("./gulp/tasks", { recurse: true });

gulp.task("copy", () => {
  return gulp.src("src/**/*").pipe(gulp.dest("dist"));
});

gulp.task("static-files", async function () {
  return gulp
    .src(["src/**/*.html", "src/**/*", "!src/css/**/*"])
    .pipe(gulp.dest("dist"));
});

// gulp.task(
//   "build",
//   gulp.series("clean", "static-files", "css:build", "html:replace:css"),
// );

// // Task padrão (executada ao rodar apenas "gulp")
// gulp.task("default", gulp.series("build"));
