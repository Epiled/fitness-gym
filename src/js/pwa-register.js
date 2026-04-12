// Registro do Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
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
