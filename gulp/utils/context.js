// ← utils to center build context.

const minimist = require("minimist");
const paths = require("../paths");
const config = require("../config");

function getBuildContext(argv = process.argv.slice(2)) {
  const args = minimist(argv, {
    boolean: ["dev", "debug", "sass", "verbose", "silence"],
    default: {
      dev: false,
      debug: false,
      sass: false,
      verbose: false,
      silence: false,
    },
  });

  const ctx = {
    args,
    config,
    paths,
    isDev: args.dev,
    isDebug: args.debug,
    isSASS: args.sass,
    isVerbose: args.verbose && !args.silence,
    isSilence: args.silence,

    buildTimestamp: Math.round(Date.now() / 1000),
  };

  return ctx;
}

module.exports = { getBuildContext };
