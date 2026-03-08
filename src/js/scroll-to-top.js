let button = document.querySelector('[data-js="scroll-top"]');

if (!button) return;

const REVEAL_AT_PX = 20;

let ticking = false;
let lastState = null;

function updateVisibility() {
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  const nextState = y > REVEAL_AT_PX ? "visible" : "hidden";

  if (nextState !== lastState) {
    button.dataset.state = nextState;
    lastState = nextState;
  }

  ticking = false;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateVisibility);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

updateVisibility();

window.addEventListener("scroll", onScroll, { passive: true });
button.addEventListener("click", scrollToTop);
