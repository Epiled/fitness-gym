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

const tempDir = ctx.paths.html.temp;
const tempGlob = `${tempDir}/**/*.html`;

const inputPath = ctx.isDebug ? srcGlob : tempGlob;

const baseDir = ctx.isDebug ? srcDir : tempDir;

const outputDir = ctx.isDebug ? ctx.paths.html.dist : tempDir;

function htmlInjectCriticalJSTask() {
  return gulp
    .src(inputPath, { allowEmpty: true, base: baseDir })
    .pipe(
      cheerio(
        ($) => {
          const inlinePath = path.join(ctx.paths.js.temp, "inline.js");
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
htmlInjectCriticalJSTask.displayName = "html:inject:critical:js:run";

const htmlInjectCriticalJS = gulp.series(htmlInjectCriticalJSTask);
htmlInjectCriticalJS.displayName = "html:inject:critical:js";

gulp.task(htmlInjectCriticalJS.displayName, htmlInjectCriticalJS);

module.exports = { htmlInjectCriticalJS };
