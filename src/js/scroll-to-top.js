(() => {
  let button = document.querySelector('[data-js="scroll-top"]');

  if (!button) return;

  const REVEAL_AT_PX = 20;

  let ticking = false;

  function updateVisibility() {
    const y = window.screenY || document.documentElement.scrollTop || 0;

    button.dataset.state = y > REVEAL_AT_PX ? "visible" : "hidden";
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
})();
