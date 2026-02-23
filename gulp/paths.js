// ← central paths used by all tasks.

const config = require("./config");

const paths = {
  src: "src",
  dist: "dist",
  temp: "temp",
  icons: {
    glob: "src/assets/svg/icons-ui/*.svg",
    dir: "src/assets/svg/icons-ui",
    temp: "temp/icons/icons-ui",
    dist: `dist/fonts/${config.folderName}`,
    distUI: "dist/assets/svg/icons-ui",
    syncDir: `src/assets/fonts/${config.folderName}`,
  },
  images: {
    glob: "src/assets/img/*.{jpg,jpeg,png}",
    dir: "src/assets/img",
    dist: {
      dir: "dist/assets/img",
      mobile: "dist/assets/img/mobile",
      tablet: "dist/assets/img/tablet",
      desktop: "dist/assets/img/desktop",
    },
  },
  html: {
    glob: "src/**/*.html",
    dir: "src",
    temp: {
      glob: "temp/html/**/*.html",
      staging: "temp/html",
      artifacts: {
        gen: { dir: "temp/.gen/html", glob: "temp/.gen/html/**/*.html" },
      },
    },
    dist: "dist/html",
  },
  css: {
    glob: "src/css/**/*.css",
    dir: "src/css",
    temp: {
      glob: "temp/css/**/*.css",
      staging: "temp/css",
      artifacts: {
        gen: { dir: "temp/.gen/css", glob: "temp/.gen/css/**/*.css" },
      },
    },
    dist: "dist/css",
  },
  js: {
    glob: "src/js/**/*.js",
    dir: "src/js",
    temp: {
      glob: "temp/js/**/*.js",
      staging: "temp/js",
      artifacts: {
        gen: { dir: "temp/.gen/js", glob: "temp/.gen/js/**/*.js" },
      },
    },
    dist: "dist/js",
  },
  sass: {
    glob: "src/sass/**/*.sass",
    dir: "src/sass",
    temp: "temp/sass",
    dist: "dist/sass",
  },
};

module.exports = paths;
