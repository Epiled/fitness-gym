// ← task to build the project.

const gulp = require("gulp");

const { cleanDefault } = require("./clean/clean");
const { staticFiles } = require("./static-files");
const { cssBuild } = require("./css/css-build");
const { htmlBuild } = require("./html/html-build");
const { resizeBuild } = require("./resize/resize-build");

const build = gulp.series(
  cleanDefault,
  staticFiles,
  cssBuild,
  htmlBuild,
  resizeBuild,
);

build.displayName = "build";
build.description = "Build the project.";

gulp.task(build.displayName, build);

module.exports = { build };
