// ← centraliza os caminhos usados em todas as tasks

const paths = {
  src: "src",
  dist: "dist",
  icons: {
    src: "src/assets/svg/dist/icons/*.svg",
    temp: "temp/icons",
    dist: "dist/fonts",
    scss: "dist/scss",
  },
  images: {
    src: "src/assets/img/original/*.{jpg,jpeg,png}",
    mobile: "dist/assets/img/mobile/",
    tablet: "dist/assets/img/tablet/",
    desktop: "dist/assets/img/desktop/",
  },
  html: {
    src: "src/**/*.html",
    dist: "dist",
  },
  css: {
    src: "src/css/**/*.css",
    temp: "temp/css",
    dist: "dist/css",
  },
};

module.exports = paths;
