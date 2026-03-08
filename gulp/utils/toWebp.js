// ← utils to normalize image URLs to WebP format.

function toWebp(url = "") {
  // Split URL from query/hash without losing them
  const m = url.match(/^([^?#]+)([?#].*)?$/);
  const base = m ? m[1] : url;
  const tail = m && m[2] ? m[2] : "";

  // Replace common image extensions with .webp (case-insensitive)
  const nextBase = base.replace(/\.(jpe?g|png)$/i, ".webp");

  return nextBase + tail;
}

module.exports = { toWebp };
