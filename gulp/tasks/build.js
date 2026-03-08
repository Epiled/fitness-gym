// ← task to build the project.

const gulp = require("gulp");

const { cleanBuild } = require("./clean/clean-build");
const { prepareBuild } = require("./prepare/prepare-build");
const { staticFiles } = require("./static-files");
const { manifestCss } = require("./manifest/manifest-css");
const {
  responsiveDataExtract,
} = require("./responsive/responsive-data-extract");
const { jsBuild } = require("./js/js-build");
const { cssBuild } = require("./css/css-build");
const { htmlBuild } = require("./html/html-build");
const { resizeBuild } = require("./resize/resize-build");
const { finalizeBuild } = require("./finalize/finalize-build");

const build = gulp.series(
  cleanBuild,
  prepareBuild,
  staticFiles,
  manifestCss,
  responsiveDataExtract,
  cssBuild,
  jsBuild,
  htmlBuild,
  resizeBuild,
  finalizeBuild,
);

build.displayName = "build";
build.description = "Build the project.";

gulp.task(build.displayName, build);

module.exports = { build };
