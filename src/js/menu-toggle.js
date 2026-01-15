const toggle = document.querySelector('[data-js="menu-toggle"]');
const nav = document.querySelector('[data-js="menu-nav"]');

nav.dataset.state ??= "hidden";

// sync initial ARIA state
if (nav.dataset.state === "visible") {
  openMenu();
} else {
  closeMenu();
}

toggle.addEventListener("click", () => {
  const isOpen = nav.dataset.state === "visible";
  isOpen ? closeMenu() : openMenu();
});

document.addEventListener("click", (event) => {
  if (event.button !== 0) return;

  if (
    nav.dataset.state !== "visible" ||
    nav.contains(event.target) ||
    toggle.contains(event.target)
  ) {
    return;
  }

  closeMenu();
});

document.addEventListener("keydown", (event) => {
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
