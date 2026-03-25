// ← utils this file is used to parse the HTML and extract the src and sizes attributes from elements that have the data-gulp-cheerio attribute. The results are returned as an array of objects, each containing the src and sizes values.

const cheerio = require("cheerio");

function parseResponsiveFromHtml(content) {
  const $ = cheerio.load(content);

  const results = [];
  const seen = new Set();

  $("[data-gulp-cheerio]").each((_, el) => {
    const src = el.attribs?.src;
    const data = el.attribs?.["data-sizes"];

    if (!src || !data) return;
    if (seen.has(src)) return;

    const dataConfig = JSON.parse(data);

    const parseConfig = dataConfig
      .map((data) => {
        const { width: w, height: h, quality: q, extract: e } = data;

        const newObj = {
          width: w || null,
          height: h || null,
          quality: q || 75,
        };

        return newObj;
      })
      .filter(Boolean);

    if (!parseConfig.length) return;

    seen.add(src);

    results.push({ src, sizes: parseConfig });
  });

  return results;
}

module.exports = { parseResponsiveFromHtml };
