// ← utils this file is used to parse the CSS and extract the src and sizes attributes. The results are returned as an array of objects, each containing the src and sizes values.

const { log } = require("./log");

function parseResponsiveFromCss(content) {
  const regex = /\/\*\s*@img\s*(\{[^*]+\})\s*\*\/\s*url\(([^)]+)\)/g;

  const results = [];
  const seen = new Set();

  let match;

  while ((match = regex.exec(content)) !== null) {
    try {
      const config = JSON.parse(match[1]);
      const src = match[2].replace(/['"]/g, "").trim();

      if (seen.has(src)) {
        results.find((item) => item.src === src).sizes.push(config);
      } else {
        seen.add(src);
        results.push({ src, sizes: [config] });
      }
    } catch (error) {
      log.error(`Invalid JSON in @img comment: ${error.message}`);
    }
  }

  return results;
}

module.exports = { parseResponsiveFromCss };
