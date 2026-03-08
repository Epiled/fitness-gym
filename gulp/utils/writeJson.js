// ← utils to write JSON data to a file.

const fs = require("fs");
const path = require("path");

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { writeJson };
