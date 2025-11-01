const gulp = require("gulp");
const { log } = require("../utils/log");
const { startTimer } = require("../utils/timer");

function taskName() {
  const timer = startTimer();
  log.info("Descrição curta do início...");

  return gulp
    .src("src/**/*.ext")
    .pipe(plugin(options))
    .pipe(gulp.dest("dist"))
    .on("end", () => log.success(`Concluído ${timer.end()}`))
    .on("error", (err) => log.error(err.message));
}

taskName.description = "Descrição humana da task.";
taskName.flags = {
  "--silent": "Oculta logs informativos.",
  "--verbose": "Mostra logs detalhados.",
};

gulp.task("dominio:acao", taskName);
