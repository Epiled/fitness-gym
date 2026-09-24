// Register Service Worker

if ("serviceWorker" in navigator) {
  const trustedTypesPolicy = window.trustedTypes?.createPolicy("fitness-gym", {
    createScriptURL: (url) => {
      const scriptUrl = new URL(url, window.location.origin);

      if (
        scriptUrl.origin !== window.location.origin ||
        scriptUrl.pathname !== "/sw.js"
      ) {
        throw new TypeError(`Script URL não permitida: ${scriptUrl.href}`);
      }

      return scriptUrl.href;
    },
  });

  const serviceWorkerUrl = trustedTypesPolicy
    ? trustedTypesPolicy.createScriptURL("/sw.js")
    : "/sw.js";

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(serviceWorkerUrl)
      .then((registration) => {
        console.log(
          "[PWA] Service Worker registrado com sucesso:",
          registration.scope,
        );

        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "SW_UPDATED") {
            const toast = document.querySelector("[data-js='toast-pwa']");
            const btn = document.querySelector("[data-js='toast-pwa-button']");

            if (toast && btn) {
              toast.dataset.state = "visible";

              btn.addEventListener("click", () => {
                window.location.reload();
              });
            }
          }
        });
      })
      .catch((error) => {
        console.error("[PWA] Falha ao registrar o Service Worker:", error);
      });
  });
}
