const toggle = document.querySelector('[data-js="menu-toggle"]');
const nav = document.querySelector('[data-js="menu-nav"]');

const mqDesktop = window.matchMedia("(min-width: 1440px)");

nav.dataset.state ??= "hidden";

function syncByViewport() {
  if (mqDesktop.matches) {
    nav.dataset.state = "visible";
    nav.setAttribute("aria-hidden", "false");
    nav.removeAttribute("inert");

    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menu de navegação (sempre visível)");
  } else {
    if (nav.dataset.state === "visible") openMenu();
    else closeMenu();
  }
}

toggle.addEventListener("click", () => {
  const isOpen = nav.dataset.state === "visible";
  isOpen ? closeMenu() : openMenu();
});

document.addEventListener("click", (event) => {
  if (event.button !== 0 || mqDesktop.matches) return;

  if (
    nav.dataset.state !== "visible" ||
    nav.contains(event.target) ||
    toggle.contains(event.target)
  )
    return;

  closeMenu();
});

if (mqDesktop.addEventListener) {
  mqDesktop.addEventListener("change", syncByViewport);
}

document.addEventListener("keydown", (event) => {
  if (mqDesktop.matches) return;

  if (event.key === "Escape" && nav.dataset.state === "visible") {
    closeMenu();
    toggle.focus();
  }
});

function openMenu() {
  nav.dataset.state = "visible";
  nav.setAttribute("aria-hidden", "false");
  nav.removeAttribute("inert");

  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Fechar menu de navegação");
}

function closeMenu() {
  nav.dataset.state = "hidden";
  nav.setAttribute("aria-hidden", "true");
  nav.setAttribute("inert", "");

  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menu de navegação");
}
