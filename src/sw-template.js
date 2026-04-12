const CACHE_NAME = "fitness-gym-dynamic-v2";

// o Gulp vai substituir a string abaixo pelo array gigante com os Hashes!
const ASSETS_TO_CACHE = "[INJECT_ASSETS]";

self.addEventListener("install", (event) => {
  console.log("[SW] Instalando e fazendo o Pre-Cache com Revisões...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Pegamos todos os arquivos que já estão no cache atual
      const existingRequests = await cache.keys();

      // 2. Criamos um conjunto de caminhos "limpos" (sem o ?v=) que vamos baixar agora
      const newPaths = ASSETS_TO_CACHE.map(
        (url) => new URL(url, self.location.origin).pathname,
      );

      // 3. Deletamos do cache apenas os arquivos antigos que batem com os novos caminhos
      for (const request of existingRequests) {
        const existingPath = new URL(request.url).pathname;

        // 1. Criamos a URL absoluta do que o Gulp nos mandou para comparar "maçã com maçã"
        const isFileInNewList = ASSETS_TO_CACHE.some(
          (assetUrl) =>
            new URL(assetUrl, self.location.origin).href === request.url,
        );

        // 2. Agora a lógica fica blindada:
        if (newPaths.includes(existingPath) && !isFileInNewList) {
          console.log(`[SW] Removendo arquivo obsoleto: ${request.url}`);
          await cache.delete(request);
        }
      }

      // 4. Agora baixamos os novos (isso economiza banda, baixando só o que mudou)
      console.log("[SW] Cacheando novos assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Ativado! Limpando caches velhos...");
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      );

      await self.clients.claim();

      const allClients = await self.clients.matchAll();
      allClients.forEach((client) =>
        client.postMessage({ type: "SW_UPDATED" }),
      );
    })(),
  );
});

// 3. EVENTO FETCH (Intercepta as requisições de rede)
self.addEventListener("fetch", (event) => {
  // Nós "sequestramos" a resposta que o navegador daria por padrão
  event.respondWith(
    (async () => {
      // 1. Pega a URL completa que o navegador (ou o manifesto base64) está pedindo
      const requestUrl = new URL(event.request.url);

      const isOwnDomain =
        requestUrl.origin === self.location.origin ||
        requestUrl.host === "fitness-gym-pearl.vercel.app" || // Garante o domínio da Vercel
        requestUrl.origin === "http://localhost:3000";

      const isBase64Manifest = event.request.url.startsWith(
        "data:application/manifest+json;base64",
      );

      // 2. Extraí APENAS o caminho (ex: "/assets/pwa/icons/logo-192.png")
      // Isso ignora se a requisição veio da Vercel, do Localhost ou do Base64!
      const pathOnly = requestUrl.pathname;

      if (isOwnDomain || isBase64Manifest) {
        // 3. Procura o arquivo de cache e ignoramos o "?v=hash" gerado pelo Gulp
        const cachedResponse = await caches.match(pathOnly, {
          ignoreSearch: true,
        });

        // Se o arquivo foi encontrado no cache, devolvemos ele imediatamente!
        if (cachedResponse) {
          // console.log('[SW] Achou no cache via Path:', pathOnly);
          return cachedResponse;
        }

        // Se NÂO encontrou no cache (ex: uma página nova ou arquivo externo),
        // deixa a requisição seguir normalmente para a internet.
        try {
          console.log("[SW] Buscando na rede:", event.request.url);
          return fetch(event.request);
        } catch (error) {
          console.error("[SW] Falha na rede para:", requestUrl.href);
          // Opcional: Se for uma navegação para uma página, retornar uma página offline padrão
          throw error;
        }
      }
    })(),
  );
});
