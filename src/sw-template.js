const CACHE_NAME = "fitness-gym-dynamic-v1";

// o Gulp vai substituir a string abaixo pelo array gigante com os Hashes!
const ASSETS_TO_CACHE = "[INJECT_ASSETS]";

self.addEventListener("install", (event) => {
  console.log("[SW] Instalando e fazendo o Pre-Cache com Revisões...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Ativado! Limpando caches velhos...");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      );
    }),
  );
  self.clients.claim();
});

// 3. EVENTO FETCH (Intercepta as requisições de rede)
self.addEventListener("fetch", (event) => {
  // Nós "sequestramos" a resposta que o navegador daria por padrão
  event.respondWith(
    (async () => {
      // 1. Pegamos a URL completa que o navegador (ouo manifesto base64) está pedindo
      const requestUrl = new URL(event.request.url);

      // 2. Extraímos APENAS o caminho (ex: "/assets/pwa/icons/logo-192.png")
      // Isso ignora se a requisição veio da Vercel, do Localhost ou do Base64!
      const pathOnly = requestUrl.pathname;

      // 3. Procuramos o arquivo de cache e ignoramos o "?v=hash" gerado pelo Gulp
      const cachedResponse = await caches.match(pathOnly, {
        ignoreSearch: true,
      });

      // Se o arquivo foi encontrado no cache, devolvemos ele imediatamente!
      if (cachedResponse) {
        // console.log('[SW] Achou no cache via Path:', pathOnly);
        return cachedResponse;
      }

      // Se NÂO encontrou no cache (ex: uma página nova ou arquivo externo),
      // deixamos a requisição seguir normalmente para a internet.
      try {
        console.log("[SW] Buscando na rede:", event.request.url);
        return fetch(event.request);
      } catch (error) {
        console.error("[SW] Falha na rede para:", requestUrl.href);
        // Opcional: Se for uma navegação para uma página, retornar uma página offline padrão
        throw error;
      }
    })(),
  );
});
