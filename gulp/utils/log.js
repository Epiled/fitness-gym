// ← utils to log messages with colors.

/**
 * Log formatting with colors, timestamps, and types.
 * @param {'info' | 'success' | 'warn' | 'error'} type - The type of log message.
 * @param {string} message - The log message.
 */

let isSilence = process.argv.includes("--silence");
let isVerbose = process.argv.includes("--verbose");

async function log(type = "info", message = "") {
  const chalk = (await import("chalk")).default;
  if (isSilence && type === "info") return;

  const time = chalk.gray(`[${new Date().toLocaleTimeString("pt-BR")}]`);

  const colors = {
    info: chalk.cyan,
    success: chalk.green,
    warn: chalk.yellow,
    error: chalk.red,
  };

  const colorFn = colors[type] || chalk.white;

  console.log(`${time} ${colorFn(`[${type.toUpperCase()}]`)} ${message}`);
}

// Convenient Shortcut
log.setSilence = (val = true) => {
  isSilence = val;
};
log.setVerbose = (val = true) => {
  isVerbose = val;
};
log.verbose = (msg) => isVerbose && log("info", msg);
log.info = (msg) => log("info", msg);
log.success = (msg) => log("success", msg);
log.warn = (msg) => log("warn", msg);
log.error = (msg) => log("error", msg);

module.exports = { log };
