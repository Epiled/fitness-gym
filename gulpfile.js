// ← main entry file (loads tasks and defines top-level commands).

const gulp = require("gulp");

const requireDir = require("require-dir");

// Load all tasks from gulp/tasks folder
requireDir("./gulp/tasks", { recurse: true });

gulp.task(
  "build",
  gulp.series("clean", "static:files", "css:build", "html:build"),
);

// Default task (runs when executing just "gulp")
gulp.task("default", gulp.series("serve"));
