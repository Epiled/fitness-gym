// ← task to generate script hash sha-256

const gulp = require("gulp");
const cheerio = require("cheerio");
const crypto = require("crypto");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start generate script hash sha-256...");
  cb();
}
logStart.displayName = "hash:generate:script:log:start";

function logEnd(cb) {
  log.success(`Finished generate script hash sha-256! ${timer.end()}`);
  cb();
}
logEnd.displayName = "hash:generate:script:log:end";

async function hashGenerateScriptTask() {
  // 1. Path to the final HTML file after the build
  const htmlPath = "dist/index.html";
  const jsonPath = "temp/.gen/scriptsHash.json";

  if (!fs.existsSync(htmlPath)) {
    log.error(
      "Error: File dist/index.html not found. Please run the build first!",
    );
    return Promise.reject();
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  const $ = cheerio.load(html);
  let hashes = [];

  // 2. Locate inline scripts
  $("script").each((i, el) => {
    const scriptContent = $(el).html();

    // Only generate hash if there is content inside the tag (inline) and it's not an external link
    if (scriptContent && !$(el).attr("src")) {
      const hash = crypto
        .createHash("sha256")
        .update(scriptContent)
        .digest("base64");

      hashes.push(`'sha256-${hash}'`);
    }
  });

  // 3. Display the result formatted for vercel.json
  if (hashes.length > 0) {
    log.info("\n====================================================");
    log.info("🔒 HASHES Generated for CSP (script-src):");
    log.info("====================================================");
    log.info(hashes.join(" "));
    log.info("====================================================\n");
  } else {
    log.info("No inline scripts found to generate hashes.");
  }

  // 4. Save hashes in a JSON file
  fs.writeFileSync(jsonPath, JSON.stringify(hashes, null, 2));
}
hashGenerateScriptTask.displayName = "hash:generate:script:run";

const hashGenerateScript = gulp.series(
  logStart,
  hashGenerateScriptTask,
  logEnd,
);

hashGenerateScript.displayName = "hash:generate:script";
hashGenerateScript.description = "Generate SHA-256 hashes for inline scripts";
hashGenerateScript.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(hashGenerateScript.displayName, hashGenerateScript);

module.exports = { hashGenerateScript };
