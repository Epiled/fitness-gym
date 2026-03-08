const items = document.querySelectorAll('[data-js="flip"][data-auto-flip]');

// Initial state
items.forEach((el) => (el.dataset.face ??= "front"));

const STAGGER_MS = 120;

const options = {
  root: null,
  rootMargin: "0px 0px -20% 0px",
  threshold: 0,
};

let observer;

const callback = (entries) => {
  entries.forEach((entry, i) => {
    const elem = entry.target;

    if (!entry.isIntersecting) return;

    setTimeout(() => {
      elem.dataset.face = "back";
      observer.unobserve(entry.target);
    }, i * STAGGER_MS);
  });
};

function createObserver() {
  observer = new IntersectionObserver(callback, options);

  items.forEach((el) => {
    if (el.dataset.face !== "back") observer.observe(el);
  });
}

createObserver();
