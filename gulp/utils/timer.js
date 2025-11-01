// ← utils to create timer at end log.

function startTimer() {
  const start = Date.now();
  return {
    end(label = "") {
      const diff = ((Date.now() - start) / 1000).toFixed(2);
      return `${label ? label : ""}(${diff}s)`;
    },
  };
}

module.exports = { startTimer };
