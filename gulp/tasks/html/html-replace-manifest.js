// ← task to generate manifest web base64.

const gulp = require("gulp");
const fs = require("fs");
const replace = require("gulp-replace");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const genGlob = ctx.paths.html.temp.artifacts.gen.glob;
const genDir = ctx.paths.html.temp.artifacts.gen.dir;

const inputGlob = ctx.isDebug ? srcGlob : genGlob;

const baseDir = ctx.isDebug ? srcDir : genDir;

const isPwaDevelopment = ctx.pwaDevDist;

const outputDir = ctx.isDebug
  ? ctx.paths.dist
  : ctx.paths.html.temp.artifacts.gen.dir;

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start replace manifest in HTML by manifest base64...");
  log.verbose(`→ Source glob: ${inputGlob}`);
  log.verbose(`→ Source dir: ${baseDir}`);
  log.verbose(`→ Output directory: ${outputDir}`);
  cb();
}
logStart.displayName = "html:replace:manifest";

function logEnd(cb) {
  log.success(`
    Finished replace manifest in HTML! ${timer.end()} → ${outputDir}`);
  cb();
}

function htmlReplaceManifestTask() {
  // 1. Lemos o conteúdo do seu manifesto (ajuste o caminho se necessário)
  const manifestPath = "./src/manifest.webmanifest";
  let manifestContent = fs.readFileSync(manifestPath, "utf8");

  // 2. Substituímos todos os "/assets" pela URL completa da sua Vercel
  // O problema está ness passo
  const domain = isPwaDevelopment
    ? "http://localhost:3000"
    : "https://fitness-gym-pearl.vercel.app";
  manifestContent = manifestContent.replace(/\/assets/g, `${domain}/assets`);

  // 3. Convert png to webp
  let manifestParse = JSON.parse(manifestContent);

  manifestParse.screenshots.forEach((screenshot) => {
    Object.keys(screenshot).forEach((key) => {
      if (typeof screenshot[key] === "string") {
        screenshot[key] = screenshot[key].replace(/png/g, "webp");
      }
    });
  });
  manifestParse = JSON.stringify(manifestParse);

  console.log("Manifest content after processing:", manifestParse);

  // 4. Convertemos o texto do JSON para o formato Base64
  const base64Manifest = Buffer.from(manifestParse, "utf-8").toString("base64");

  // 5. Montamos a URL de dados (Data URI) que o navegador entende
  const dataUri = `data:application/manifest+json;base64,${base64Manifest}`;

  // 6. Pegamos o HTML, injetamos o Base64 e jogamos na pasta dist
  return gulp
    .src(inputGlob)
    .pipe(
      replace(
        /<!-- build:manifest -->([\s\S]*?)<!-- end:build -->/g,
        `<link rel="manifest" href="${dataUri}" />`,
      ),
    )
    .pipe(gulp.dest(outputDir));
}

const htmlReplaceManifest = gulp.series(
  logStart,
  htmlReplaceManifestTask,
  logEnd,
);

htmlReplaceManifest.displayName = "html:replace:manifest";
htmlReplaceManifest.description =
  "Compile manifest data, convert png to webp and convert file to base 64";
htmlReplaceManifest.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
  "--debug": "Build directly from the source files instead of temp.",
  "--dev": "Sets development mode, affecting how assets are processed.",
};

gulp.task(htmlReplaceManifest.displayName, htmlReplaceManifest);

module.exports = { htmlReplaceManifest };
