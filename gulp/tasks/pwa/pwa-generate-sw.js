// ← task to generate Service Worker / sw

const gulp = require("gulp");
const fsp = require("fs/promises");
const path = require("path");
const crypto = require("crypto"); // O motor que gera o Hash

async function pwaGenerateSwTask() {
  // 1. Procura  todos os arquivos estáticos na pasta dist
  const files = await fsp.readdir("dist", {
    withFileTypes: true,
    recursive: true,
  });

  const assetsToCache = [];

  // 2. Filtra apenas os arquivos e geramos o Hash
  for (const file of files) {
    // Ignora pastas, queremos apenas os arquivos físicos
    if (file.isFile()) {
      // Pega o caminho completo (funciona no Windows e no Mac/Linux)
      // Nota: Em Node 20+, usa file.path. Em Node 21+, adicionaram parentPath.
      const filePath = file.parentPath || file.path;
      const fullPath = path.join(filePath, file.name).replace(/\\/g, "/"); // Normaliza para barras (Windows vs Unix)

      // 1. Ignorar o próprio Service Worker e o Manifesto (eles não devem ter hash no nome/URL)
      if (file.name === "sw.js" || file.name === "manifest.json") continue;

      // 2. Filtro de fontes: Ignorar formatos redundantes (opcional, mas recomendado)
      // Mantem .woff2 e .ttf (que você usa), ignoramos .svg de fonte e .woff
      if (
        fullPath.includes("/fonts/") &&
        (file.name.endsWith(".svg") || file.name.endsWith(".woff"))
      ) {
        continue;
      }

      // Lé o conteúdo do arquivo
      const fileBuffer = await fsp.readFile(fullPath);

      // Gera o Hash MD5 baseado no conteúdo (Essa é a mágica da revisão!)
      const hashSum = crypto.createHash("md5");
      hashSum.update(fileBuffer);
      const revision = hashSum.digest("hex").substring(0, 8); // Pega só os 8 primeiros caracteres

      // Remove a palavra 'dist' do caminho paa ficar uma URL limpa (ex: /css/style.css)
      const urlPath = fullPath.replace(/^dist\//, "");

      // 3. CORREÇÃO: Gerar a URL com a revisão correta
      const fileWithHash = `'/${urlPath}?v=${revision}'`;

      // Garante que a raiz do site ('/index.html') seja armazenada também como '/'
      if (urlPath === "index.html") {
        assetsToCache.push(`'/?v=${revision}'`);
      }

      // Adiciona ao array no formato: /caminho/do/arquivo?v=abcd1234
      assetsToCache.push(fileWithHash);
    }
  }

  // 3. Transforma o array em uma string para injetar no arquivo
  const cacheString = `[\n ${assetsToCache.join(",\n ")}\n]`;

  // 4. Pega o nosso sw-template, injeta o array e salva como sw.js
  let templateContent = await fsp.readFile("src/sw-template.js", "utf-8");
  templateContent = templateContent.replace('"[INJECT_ASSETS]"', cacheString);

  await fsp.writeFile("dist/sw.js", templateContent);

  console.log("[SW] Service Worker gerado com Hashes nativos!");
}

const pwaGenerateSw = gulp.series(pwaGenerateSwTask);

pwaGenerateSw.displayName = "pwa:generate:sw";
pwaGenerateSw.description =
  "Generate Service Worker (sw.js) with static files from the dist folder, including a revision hash for each file.";
pwaGenerateSw.flags = {
  "--s": "",
};

gulp.task(pwaGenerateSw.displayName, pwaGenerateSw);

module.exports = { pwaGenerateSw };
