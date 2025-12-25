// ← utils to check if exist file

const fs = require("fs");

function fileExists(p) {
  return fs.existsSync(p);
}

module.exports = { fileExists };
