// ← task to build the project.

const gulp = require("gulp");

const { cleanDefault } = require("./clean/clean");
const { staticFiles } = require("./static-files");
const { manifestCSSTask } = require("./manifest/manifest-css");
const { cssBuild } = require("./css/css-build");
const { htmlBuild } = require("./html/html-build");
const { jsBuild } = require("./js/js-main");
const { resizeBuild } = require("./resize/resize-build");
const { jsCriticalInline } = require("./js/js-critical-inline");

const build = gulp.series(
  cleanDefault,
  staticFiles,
  manifestCSSTask,
  cssBuild,
  jsCriticalInline,
  jsBuild,
  htmlBuild,
  resizeBuild,
);

build.displayName = "build";
build.description = "Build the project.";

gulp.task(build.displayName, build);

module.exports = { build };
