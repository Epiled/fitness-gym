// ← utils to validate CSS manifest files and ensure all required assets are present.

const path = require("path");
const fs = require("fs");

const { getBuildContext } = require("./context");
const ctx = getBuildContext();

function validateCssManifest(manifest) {
  const required = ["critical", "app"];

  for (const key of required) {
    if (!manifest[key]) {
      throw new Error(`Missing CSS build block: ${key}`);
    }

    if (manifest[key].length === 0) {
      throw new Error(`CSS build block '${key}' is empty`);
    }
  }

  const baseDir = ctx.isDebug ? path.resolve("src") : path.resolve("temp");

  for (const [bundle, files] of Object.entries(manifest)) {
    for (const file of files) {
      const resolvedPath = path.join(baseDir, file);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(
          `CSS file not found (${bundle}): ${file} → resolved as ${resolvedPath}`,
        );
      }
    }
  }
}

module.exports = { validateCssManifest };
