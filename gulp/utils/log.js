// ← utils to log messages with colors.

const chalk = require("chalk");

/**
 * Log formatting with colors, timestamps, and types.
 * @param {'info' | 'success' | 'warn' | 'error'} type - The type of log message.
 * @param {string} message - The log message.
 */

let isSilent = process.argv.includes("--silent");
let isVerbose = process.argv.includes("--verbose");

function log(type = "info", message = "") {
  if (isSilent && type === "info") return;

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
log.setSilent = (val = true) => {
  isSilent = val;
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
