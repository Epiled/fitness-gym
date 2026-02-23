// ← task to inject JS critical inline

const gulp = require("gulp");
const cheerio = require("gulp-cheerio");
const path = require("path");
const fs = require("fs");

const { log } = require("../../utils/log");

const { getBuildContext } = require("../../utils/context");
const ctx = getBuildContext();

const srcGlob = ctx.paths.html.glob;
const srcDir = ctx.paths.html.dir;

const tempDir = ctx.paths.js.temp.artifacts.gen.dir;
const tempGlob = ctx.paths.html.temp.artifacts.gen.glob;

const inputGlob = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.isDebug
  ? ctx.paths.dist
  : ctx.paths.html.temp.artifacts.gen.dir;

let timer;

function htmlInjectCriticalJsTask() {
  return gulp
    .src(inputGlob, { allowEmpty: true, base: baseDir })
    .pipe(
      cheerio(
        ($) => {
          const inlinePath = path.resolve(tempDir, "inline.js");
          const inlineCode = fs.readFileSync(inlinePath, "utf8").trim();

          const scripTag = `<script type="module">${inlineCode}</script>`;

          $("*")
            .contents()
            .each(function () {
              if (this.type !== "comment") return;

              const data = (this.data ?? "").trim();
              if (data !== "build:js:inline") return;

              // percorre nós irmãos até achar o build:end
              let node = this.next;
              let endNode = null;

              while (node) {
                if (
                  node.type === "comment" &&
                  (node.data ?? "").trim() === "build:end"
                ) {
                  endNode = node;
                  break;
                }
                node = node.next;
              }

              // Se não achou o build:end, não mexe (evita quebrar HTML)
              if (!endNode) return;

              // remove tudo ENTRE start e end
              node = this.next;
              while (node && node !== endNode) {
                const next = node.next;
                $(node).remove();
                node = next;
              }

              // substitui o comentário start pelo script inline
              // e remove o comentário end também (opcional, mas geralmente você quer sumir)
              $(this).replaceWith(scripTag);
              $(endNode).remove();
            });
        },
        { decodeEntities: true },
      ),
    )
    .pipe(gulp.dest(outputDir));
}
htmlInjectCriticalJsTask.displayName = "html:inject:critical:js:run";

const htmlInjectCriticalJs = gulp.series(htmlInjectCriticalJsTask);

htmlInjectCriticalJs.displayName = "html:inject:critical:js";

gulp.task(htmlInjectCriticalJs.displayName, htmlInjectCriticalJs);

module.exports = { htmlInjectCriticalJs };
