// ← task to insert hash sha-256 from style to vercel.json

const gulp = require("gulp");
const fs = require("fs");

const { log } = require("../../utils/log");
const { startTimer } = require("../../utils/timer");

let timer;

function logStart(cb) {
  timer = startTimer();
  log.info("Start insert style hash in the vercel.json...");
  cb();
}
logStart.displayName = "hash:insert:style:log:start";

function logEnd(cb) {
  log.success(`Finished insert style hash! ${timer.end()}`);
  cb();
}
logEnd.displayName = "hash:insert:style:log:end";

async function hashInsertStyleTask() {
  const vercelPath = "vercel.json";
  const jsonHashPath = "temp/.gen/stylesHash.json";

  if (!fs.existsSync(vercelPath)) {
    log.error("Error: File vercel.json not found");
    return Promise.reject();
  }

  if (!fs.existsSync(jsonHashPath)) {
    log.error("Error: File stylesHash.json not found");
    return Promise.reject();
  }

  const vercel = fs.readFileSync(vercelPath, "utf-8");
  let vercelJson = JSON.parse(vercel);

  const hash = fs.readFileSync(jsonHashPath, "utf-8");
  const hashJson = JSON.parse(hash);

  const headers = vercelJson.headers?.[0]?.headers;

  if (!headers) {
    log.error("Error: Invalid headers structure in vercel.json");
    return Promise.reject();
  }

  const headerRow = headers.find((item) => {
    return item.key === "Content-Security-Policy";
  });

  const hashConcat = `style-src 'self' 'unsafe-inline' ${hashJson.join(" ")};`;

  if (headerRow) {
    const cspValue = headerRow.value.replace(/style-src [^;]*;/, hashConcat);

    headerRow.value = cspValue;

    fs.writeFileSync(vercelPath, JSON.stringify(vercelJson, null, 2));
    log.info("✅ vercel.json updated with the new hashes!");
  } else {
    log.error("Error: Headers structure not found in vercel.json");
  }
}
hashInsertStyleTask.displayName = "hash:insert:style:run";

const hashInsertStyle = gulp.series(logStart, hashInsertStyleTask, logEnd);

hashInsertStyle.displayName = "hash:insert:style";
hashInsertStyle.description =
  "Insert SHA-256 hashes for inline styles into vercel.json";
hashInsertStyle.flags = {
  "--silence": "Hides informational logs, showing only warnings and errors.",
  "--verbose": "Shows detailed logs for debugging purposes.",
};

gulp.task(hashInsertStyle.displayName, hashInsertStyle);

module.exports = { hashInsertStyle };
