// ← check if exist file
function fileExists(p) {
  fs.existsSync(p);
}

module.exports = { fileExists };
