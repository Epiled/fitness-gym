// ← utils this file is used to parse the HTML and extract the src and sizes attributes from elements that have the data-gulp-cheerio attribute. The results are returned as an array of objects, each containing the src and sizes values.

const cheerio = require("cheerio");

function parseResponsiveFromHtml(content) {
  const $ = cheerio.load(content);

  const results = [];
  const seen = new Set();

  $("[data-gulp-cheerio]").each((_, el) => {
    const src = el.attribs?.src;
    const rawConfig = el.attribs?.["data-sizes"];

    if (!src || !rawConfig) return;
    if (seen.has(src)) return;

    const parseConfig = rawConfig
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((size) => {
        const [w, h, q] = size.split("x").map(Number);

        if (!w) return null;

        return { width: w, height: h || null, quality: q || 75 };
      })
      .filter(Boolean);

    if (!parseConfig.length) return;

    seen.add(src);

    results.push({ src, sizes: parseConfig });
  });

  return results;
}

module.exports = { parseResponsiveFromHtml };
