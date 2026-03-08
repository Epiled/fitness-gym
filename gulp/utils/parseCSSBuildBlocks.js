// ← utils to parse HTML build blocks for CSS files and extract bundle information.

const path = require("path");

function parseCssBuildBlocks(html) {
  const blocks = {};

  const blockRegex =
    /<!-- build:css:([a-z0-9_-]+) -->([\s\S]*?)<!-- end:build -->/g;

  let match;

  while ((match = blockRegex.exec(html))) {
    const bundleName = match[1]; // critical | app
    const blockContent = match[2];

    const hrefRegex = /href\s*=\s*"([^"]+)"/gi;
    const files = [];

    let hrefMatch;

    while ((hrefMatch = hrefRegex.exec(blockContent))) {
      const href = hrefMatch[1];

      // normaliza "./css/x.css" -> "css/x.css" | "/css/x.css" -> "css/x.css"
      const cleaned = href.trim().replace(/^\.\//, "").replace(/^\//, "");

      // normaliza separador
      const normalized = cleaned.split(path.sep).join("/");
      files.push(normalized);
    }

    blocks[bundleName] = files;
  }

  return blocks;
}

module.exports = { parseCssBuildBlocks };
