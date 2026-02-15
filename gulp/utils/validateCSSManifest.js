const fs = require("fs");

function validateCSSManifest(manifest) {
  const required = ["critical", "app"];

  for (const key of required) {
    if (!manifest[key]) {
      throw new Error(`Missing CSS build block: ${key}`);
    }

    if (manifest[key].length === 0) {
      throw new Error(`CSS build block '${key}' is empty`);
    }
  }

  for (const [bundle, files] of Object.entries(manifest)) {
    for (const file of files) {
      if (!fs.existsSync(file)) {
        throw new Error(`CSS file not found (${bundle}): ${file}`);
      }
    }
  }
}

module.exports = { validateCSSManifest };
