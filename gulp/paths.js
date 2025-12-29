// ← central paths used by all tasks.

const config = require("./config");

const paths = {
  src: "src",
  dist: "dist",
  temp: "temp",
  icons: {
    src: "src/assets/svg/icons-ui/*.svg",
    dev: `src/assets/fonts/${config.folderName}`,
    temp: "temp/icons/icons-ui",
    dist: "dist/fonts",
    scss: "dist/scss",
  },
  images: {
    src: "src/assets/img/*.{jpg,jpeg,png}",
    mobile: "dist/assets/img/mobile",
    tablet: "dist/assets/img/tablet",
    desktop: "dist/assets/img/desktop",
  },
  html: {
    glob: "src/**/*.html",
    dir: "src/",
    temp: "temp/html",
    dist: "dist/html",
  },
  css: {
    glob: "src/css/**/*.css",
    dir: "src/css",
    temp: "temp/css",
    dist: "dist/css",
  },
};

module.exports = paths;
