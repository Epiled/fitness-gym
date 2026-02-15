const path = require("path");

function parseCSSBuildBlocks(html, opts) {
  const { htmlDir, cssSrcBaseDir } = opts;

  const blocks = {};

  const blockRegex =
    /<!-- build:css:([a-z0-9_-]+) -->([\s\S]*?)<!-- end:build -->/g;

  let match;

  while ((match = blockRegex.exec(html))) {
    const bundleName = match[1]; // critical | app
    const blockContent = match[2];

    console.log(bundleName);

    const hrefRegex = /href\s*=\s*"([^"]+)"/gi;
    const files = [];

    let hrefMatch;

    while ((hrefMatch = hrefRegex.exec(blockContent))) {
      const href = hrefMatch[1];

      // normaliza "./css/x.css" -> "css/x.css" | "/css/x.css" -> "css/x.css"
      const cleaned = href.trim().replace(/^\.\//, "").replace(/^\//, "");

      // Se você mantém href como "./css/..." (URL pública),
      // removemos o prefixo "css/" e resolvemos no diretório real do source.
      const withoutPublicPrefix = cleaned.replace(/^css\//i, "");

      // ✅ caminho real no FS (source)
      const fullPath = path.resolve(cssSrcBaseDir, withoutPublicPrefix);

      files.push(fullPath);
    }

    blocks[bundleName] = files;
  }

  return blocks;
}

module.exports = { parseCSSBuildBlocks };
